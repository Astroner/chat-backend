import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';

import * as webPush from "web-push";

import { VapidInfo } from './web-push.types';
import { WebPushService } from './web-push.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [WebPushService],
    exports: [WebPushService]
})
export class WebPushModule implements OnModuleInit {
    static forVAPID(details: VapidInfo): DynamicModule {
        return {
            module: WebPushModule,
            providers: [
                {
                    provide: 'VAPID_DETAILS',
                    useValue: details
                }
            ]
        }
    }

    constructor(
        @Inject('VAPID_DETAILS') private details: VapidInfo
    ) {}

    onModuleInit() {
        webPush.setVapidDetails(
            this.details.subject,
            this.details.publicKey,
            this.details.privateKey
        )
    }
}
