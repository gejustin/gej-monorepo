import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';

import { ApplicationReferenceHost } from '@nestjs/core';
import { Module, Inject, DynamicModule } from '@nestjs/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { enableProdMode } from '@angular/core';

import { UNIVERSAL_CONFIG } from './tokens';
import { UniversalConfig } from './universal-config.interface';
import { createNgxSsrController } from './ngx-ssr.controller';

@Module({})
export class NgxSsrModule {
    constructor(
        @Inject(UNIVERSAL_CONFIG) { publicDirPath }: UniversalConfig,
        { applicationRef }: ApplicationReferenceHost,
    ) {
        const app: express.Express = applicationRef;

        if (process.env.NODE_ENV === 'production') {
            enableProdMode();
        }

        app.use(
            express.static(publicDirPath, {
                index: false,
            }),
        );

        app.engine('html', ngExpressEngine({} as any));

        app.set('view engine', 'html');
        app.set('views', publicDirPath);
    }

    static forRoot(universalConfig: UniversalConfig): DynamicModule {
        return {
            module: NgxSsrModule,
            providers: [
                {
                    provide: UNIVERSAL_CONFIG,
                    useValue: universalConfig,
                },
            ],
            controllers: [
                createNgxSsrController('*'),
            ],
        };
    }
}
