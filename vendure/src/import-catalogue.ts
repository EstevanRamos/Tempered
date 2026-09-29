import {
    AssetImporter,
    bootstrap,
    ChannelService,
    CollectionService,
    DefaultLogger,
    InitialData,
    JobQueueService,
    LanguageCode,
    LogLevel,
    ProductService,
    PromotionService,
    RequestContext,
    RequestContextService,
    runMigrations,
    SearchService,
    TransactionalConnection,
    User,
} from '@vendure/core';
import { importProductsFromCsv, populateCollections, populateInitialData } from '@vendure/core/cli';
import { INestApplication } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import { config } from './vendure-config';

// Loads the Tempered catalogue from vendure/catalogue into the Engine:
//
//   initial-data.json  zones and countries, taxes, shipping and payment methods, and the Shop
//                      (one Collection per Category, filled from the product's Category Tag) and
//                      Drops trees
//   products.csv       the products, their size variants, prices, stock and Category Tags, in
//                      Vendure's product-import format
//
// The payment method must stay named "Standard Payment": its code, `standard-payment`, is the one
// @misiki/vendure-connector pays with. It is Vendure's dummy handler until Stripe replaces it.
//
// Images come from design/assets/Imagery. Afterwards it adds what the import format can't
// express: the hand-picked War Collection under Drops, and the TEMPERED10 promotion.
//
//   npm run catalogue:import   into an empty database (the start script does this on first run)
//   npm run catalogue:reload   wipe the database, including orders and customers, and import again

const ROOT = path.join(__dirname, '..');
const CATALOGUE = path.join(ROOT, 'catalogue');
const IMAGERY = path.join(ROOT, '../design/assets/Imagery');

/** Hand-picked Collections, under the Drops parent: products chosen one by one, not by Tag. */
const HAND_PICKED_COLLECTIONS = [{ name: 'War', slug: 'war', parent: 'drops', asset: 'tile-war.webp', products: ['war-edition-tee'] }];

const PROMOTIONS = [{ name: 'Tempered 10% off', couponCode: 'TEMPERED10', percentOff: 10 }];

async function main() {
    const reset = process.argv.includes('--reset');
    if (reset) await wipeDatabase();
    await runMigrations(config);

    const app = await bootstrap({
        ...config,
        apiOptions: { ...config.apiOptions, port: 0 },
        logger: new DefaultLogger({ level: LogLevel.Warn }),
        importExportOptions: { importAssetsDir: IMAGERY },
    });
    await app.get(JobQueueService).start();

    const initialData: InitialData = JSON.parse(fs.readFileSync(path.join(CATALOGUE, 'initial-data.json'), 'utf8'));
    await populateInitialData(app, initialData);
    const ctx = await adminContext(app);

    // Tempered's prices are what the shopper pays, tax included. Set this before importing, so
    // the CSV's prices are read as tax-inclusive.
    const channelService = app.get(ChannelService);
    const channel = await channelService.getDefaultChannel(ctx);
    await channelService.update(ctx, { id: channel.id, pricesIncludeTax: true });

    const result = await importProductsFromCsv(app, path.join(CATALOGUE, 'products.csv'), LanguageCode.en);
    if (result.errors?.length) throw new Error(`Product import failed:\n${result.errors.join('\n')}`);
    await populateCollections(app, initialData);

    await createHandPickedCollections(app, ctx);
    await createPromotions(app, ctx);
    await app.get(SearchService).reindex(ctx);
    await waitForJobs(app);
    await app.close();
    console.log(`Imported ${result.imported} products into Vendure.`);
}

async function wipeDatabase() {
    const client = new Client({ connectionString: (config.dbConnectionOptions as { url: string }).url });
    await client.connect();
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    await client.end();
    fs.rmSync(path.join(ROOT, 'static/assets'), { recursive: true, force: true });
}

async function adminContext(app: INestApplication): Promise<RequestContext> {
    const superadmin = await app
        .get(TransactionalConnection)
        .rawConnection.getRepository(User)
        .findOne({
            where: { identifier: config.authOptions.superadminCredentials?.identifier },
            // The roles' channels are what give the context its channel permissions.
            relations: { roles: { channels: true } },
        });
    return app.get(RequestContextService).create({ apiType: 'admin', user: superadmin ?? undefined });
}

async function createHandPickedCollections(app: INestApplication, ctx: RequestContext) {
    const collections = app.get(CollectionService);
    for (const collection of HAND_PICKED_COLLECTIONS) {
        const parent = await collections.findOneBySlug(ctx, collection.parent);
        if (!parent) throw new Error(`Collection "${collection.parent}" is missing from initial-data.json`);
        const productIds = await Promise.all(
            collection.products.map(async slug => {
                const product = await app.get(ProductService).findOneBySlug(ctx, slug);
                if (!product) throw new Error(`${collection.name} lists "${slug}", which products.csv doesn't have`);
                return product.id;
            }),
        );
        const { assets } = await app.get(AssetImporter).getAssets([collection.asset], ctx);
        await collections.create(ctx, {
            translations: [{ languageCode: LanguageCode.en, name: collection.name, slug: collection.slug, description: '' }],
            parentId: parent.id,
            inheritFilters: false,
            featuredAssetId: assets[0]?.id,
            assetIds: assets.map(a => a.id),
            filters: [
                {
                    code: 'product-id-filter',
                    arguments: [
                        { name: 'productIds', value: JSON.stringify(productIds) },
                        { name: 'combineWithAnd', value: 'true' },
                    ],
                },
            ],
        });
    }
}

async function createPromotions(app: INestApplication, ctx: RequestContext) {
    for (const promotion of PROMOTIONS) {
        const result = await app.get(PromotionService).createPromotion(ctx, {
            enabled: true,
            couponCode: promotion.couponCode,
            conditions: [],
            actions: [
                {
                    code: 'order_percentage_discount',
                    arguments: [{ name: 'discount', value: String(promotion.percentOff) }],
                },
            ],
            translations: [{ languageCode: LanguageCode.en, name: promotion.name }],
        });
        if ('errorCode' in result) throw new Error(`Promotion ${promotion.couponCode}: ${result.message}`);
    }
}

/** Collection filters and the search index are built by queued jobs; let them finish. */
async function waitForJobs(app: INestApplication) {
    const db = app.get(TransactionalConnection).rawConnection;
    for (let i = 0; i < 120; i++) {
        const [{ count }] = await db.query(`SELECT count(*)::int AS count FROM job_record WHERE state IN ('PENDING', 'RUNNING', 'RETRYING')`);
        if (count === 0) return;
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    throw new Error('Timed out waiting for Vendure jobs (collection filters, search index) to finish');
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
