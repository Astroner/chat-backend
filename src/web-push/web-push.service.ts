import { Injectable } from '@nestjs/common';
import { PushSubscriptionsService } from 'src/database/push-subscriptions/push-subscriptions.service';

import { sendNotification } from "web-push";

@Injectable()
export class WebPushService {

    constructor(
        private subs: PushSubscriptionsService
    ) {}

    async sendNotification(endpoint: string, key: string, auth: string, data: Buffer) {
        await sendNotification({
            endpoint,
            keys: {
                auth,
                p256dh: key
            }
        }, data)
    }

    async broadcast(data: Buffer) {
        const stringMessage = data.toString("base64");
        await Promise
            .all(
                Array
                    .from(this.subs.getAll())
                    .map(async ({ id, sub }) => {
                        try {
                            await sendNotification(
                                {
                                    endpoint: sub.endpoint,
                                    keys: {
                                        auth: sub.auth,
                                        p256dh: sub.key
                                    }
                                }, 
                                stringMessage,
                            )
                        } catch { 
                            await this.subs.deleteSub(id);
                        }
                    })
            )
    }
}
