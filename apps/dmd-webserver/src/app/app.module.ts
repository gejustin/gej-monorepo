import { Module } from '@nestjs/common';

import { NgxSsrModule } from '@gej/ngx-ssr';

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`/usr/src/dist/apps/dmd-com/server/main.js`);

/*
 * There's no reason to restart the server when the client files change in dev.
 * We just need to clear the node module cache so the webpack server file is required again.
 * Think of it as a hack hot module replacement.
 */
if (process.env.NODE_ENV === 'development') {
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(`/usr/src/dist/apps/dmd-com/server/**/*`);

    watcher.on('change', () => {
        Object.keys(require.cache).forEach(id => {
            if (/\/server\/main\.js/.test(id)) {
                delete require.cache[id];
                console.log(`Require cache cleared for ${id}`);
            }
        });
    });

    process.once('SIGTERM', function() {
        watcher.close();
        process.kill(process.pid, 'SIGTERM');
    });
}

@Module({
    imports: [
        NgxSsrModule.forRoot({
            publicDirPath: `/usr/src/dist/apps/dmd-com/browser`,
            moduleFactory: AppServerModuleNgFactory,
            lazyModuleMap: LAZY_MODULE_MAP,
            extraProviders: [],
        }),
    ],
})
export class AppModule {}
