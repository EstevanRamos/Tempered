import {
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    dummyPaymentHandler,
    VendureConfig,
} from '@vendure/core';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';

// Vendure reports anonymous usage unless told not to. Tempered opts out wherever this config
// loads (server, migrations, populate), not just where the start script remembers to.
process.env.VENDURE_DISABLE_TELEMETRY ??= 'true';

const IS_DEV = process.env.APP_ENV !== 'production';
const ROOT = path.join(__dirname, '..');

// The Storefront is the only browser client of the Shop API, and its account links (email
// verification, password reset) land on its own routes.
const STOREFRONT_URL = (process.env.STOREFRONT_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '');

/** The Storefront's origin, plus its localhost/127.0.0.1 twin in dev so either address works. */
function storefrontOrigins(): string[] {
    const origin = new URL(STOREFRONT_URL).origin;
    if (!IS_DEV) return [origin];
    const twin = origin.includes('127.0.0.1')
        ? origin.replace('127.0.0.1', 'localhost')
        : origin.replace('localhost', '127.0.0.1');
    return [...new Set([origin, twin])];
}

export const config: VendureConfig = {
    apiOptions: {
        port: +(process.env.PORT ?? 3001),
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
        // The Storefront calls the Shop API from the browser with the session cookie, so its
        // origin is reflected and credentials are allowed. Other origins get no CORS headers.
        cors: { origin: storefrontOrigins(), credentials: true },
        // Sessions ride on a cookie, so refuse the simple cross-site requests a form could forge.
        csrfPrevention: true,
        ...(IS_DEV ? { adminApiDebug: true, shopApiDebug: true } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        // Tempered sends no verification email at launch: signing up logs the shopper straight in.
        requireVerification: false,
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME ?? 'superadmin',
            password: process.env.SUPERADMIN_PASSWORD ?? 'superadmin',
        },
        cookieOptions: { secret: process.env.COOKIE_SECRET ?? 'tempered-dev-cookie-secret' },
    },
    dbConnectionOptions: {
        type: 'postgres',
        url: process.env.DATABASE_URL ?? 'postgres://vendure:vendure@127.0.0.1:5432/vendure',
        // The schema changes only through committed migrations (src/migrations), never auto-sync.
        synchronize: false,
        migrations: [path.join(__dirname, 'migrations/*.+(js|ts)')],
        logging: false,
    },
    paymentOptions: {
        // Vendure's dummy handler until production hosting adds Stripe.
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    customFields: {},
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(ROOT, 'static/assets'),
            assetUrlPrefix: process.env.ASSET_URL_PREFIX,
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(ROOT, 'static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(
                path.join(path.dirname(require.resolve('@vendure/email-plugin/package.json')), 'templates'),
            ),
            globalTemplateVars: {
                fromAddress: '"Tempered" <noreply@tempered.example>',
                verifyEmailAddressUrl: `${STOREFRONT_URL}/auth/verify`,
                passwordResetUrl: `${STOREFRONT_URL}/auth/reset-password`,
                // The Storefront has no page for confirming an email change; the profile is closest.
                changeEmailAddressUrl: `${STOREFRONT_URL}/my/profile`,
            },
        }),
        DashboardPlugin.init({ route: 'dashboard', appDir: path.join(ROOT, 'dist/dashboard') }),
    ],
};
