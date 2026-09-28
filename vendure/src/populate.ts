import { bootstrap, DefaultLogger, JobQueueService, LogLevel, runMigrations } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import path from 'path';
import { config } from './vendure-config';

// Loads a catalogue into an empty database: zones, taxes, shipping and payment methods,
// collections, then products from a Vendure product-import CSV. Run once on first start (the
// start script does this when the database has no products).
const CREATE_ASSETS = path.join(path.dirname(require.resolve('@vendure/create/package.json')), 'assets');

async function main() {
    await runMigrations(config);
    const app = await populate(
        async () => {
            const app = await bootstrap({
                ...config,
                apiOptions: { ...config.apiOptions, port: 0 },
                logger: new DefaultLogger({ level: LogLevel.Warn }),
                importExportOptions: { importAssetsDir: path.join(CREATE_ASSETS, 'images') },
            });
            await app.get(JobQueueService).start();
            return app;
        },
        path.join(CREATE_ASSETS, 'initial-data.json'),
        path.join(CREATE_ASSETS, 'products.csv'),
    );
    // Let the job queue finish indexing the new products before closing.
    await new Promise(resolve => setTimeout(resolve, 10_000));
    await app.close();
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
