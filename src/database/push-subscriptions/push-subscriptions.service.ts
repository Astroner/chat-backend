import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PushSubscription } from './push-subscription.scheme';
import { CreatePushSubscriptionDTO } from './push-subscriptions.dto';

@Injectable()
export class PushSubscriptionsService implements OnModuleInit {
    private cache = new Map<string, PushSubscription>();

    constructor(
        @InjectModel(PushSubscription.name)
        private subscriptions: Model<PushSubscription>,
    ) {}

    async onModuleInit() {
        const items = await this.subscriptions.find();

        for (const item of items) {
            this.cache.set(item.id, {
                auth: item.auth,
                endpoint: item.endpoint,
                key: item.key,
            });
        }
    }

    async addSubscription(createDto: CreatePushSubscriptionDTO) {
        for (const item of this.cache.values()) {
            if (
                item.endpoint === createDto.endpoint &&
                item.auth === createDto.auth &&
                item.key === createDto.key
            )
                return;
        }

        const saved = await this.subscriptions.create(createDto);

        this.cache.set(saved.id, {
            auth: saved.auth,
            endpoint: saved.endpoint,
            key: saved.key,
        });

        return saved.id;
    }

    async deleteSub(id: string) {
        await this.subscriptions.findByIdAndDelete(id);
        this.cache.delete(id);
    }

    *getAll() {
        for (const [id, sub] of this.cache.entries()) {
            yield { id, sub };
        }
    }
}
