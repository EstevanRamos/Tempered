import { generateMigration, runMigrations } from '@vendure/core';
import path from 'path';
import { config } from './vendure-config';

// `npm run migration:generate -- <name>` diffs the entities against the database and writes a
// migration into src/migrations; commit it. `npm run migration:run` applies pending ones (the
// server also does this on start).
const [command, name] = process.argv.slice(2);

const run =
    command === 'generate'
        ? generateMigration(config, { name: name ?? 'migration', outputDir: path.join(__dirname, 'migrations') })
        : runMigrations(config);

run.then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
