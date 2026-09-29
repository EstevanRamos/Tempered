import { bootstrap, JobQueueService, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

// One process serves the APIs and runs the job queue (search indexing, emails). That is plenty
// for Tempered's catalogue; a separate worker (src/index-worker.ts) is there when it isn't.
runMigrations(config)
    .then(() => bootstrap(config))
    .then(app => app.get(JobQueueService).start())
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
