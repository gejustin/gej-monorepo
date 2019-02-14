import { Module } from '@nestjs/common';

import { NgxSsrModule } from '@gej/ngx-ssr';

import { AppService } from './app.service';

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('/Users/gary.justin/Projects/justin-monorepo/dist/apps/danamarinodesign/server/main.js');

@Module({
    imports: [
        NgxSsrModule.forRoot({
            publicDirPath: '/Users/gary.justin/Projects/justin-monorepo/dist/apps/danamarinodesign/browser',
            moduleFactory: AppServerModuleNgFactory,
            lazyModuleMap: LAZY_MODULE_MAP,
            extraProviders: [],
        }),
    ],
    providers: [AppService],
})
export class AppModule { }
