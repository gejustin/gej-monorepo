import { Controller, Get, Req, Res, Inject } from '@nestjs/common';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import { UNIVERSAL_CONFIG } from './tokens';
import { UniversalConfig } from './universal-config.interface';

export function createNgxSsrController(path) {
    @Controller(path)
    class NgxSsrController {
        constructor(
            @Inject(UNIVERSAL_CONFIG) private config: UniversalConfig,
        ) {}

        @Get()
        public renderAngular(@Req() req, @Res() res) {
            const {
                moduleFactory,
                lazyModuleMap,
                extraProviders = [],
            } = this.config;

            res.render(`${this.config.publicDirPath}/index`, {
                req,
                res,
                bootstrap: moduleFactory,
                providers: [provideModuleMap(lazyModuleMap), ...extraProviders],
            });
        }
    }

    return NgxSsrController;
}
