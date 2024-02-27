import { Body, Controller, Delete, Post } from '@nestjs/common';
import { PushSubscriptionsService } from './push-subscriptions.service';
import {
    CreatePushSubscriptionDTO,
    DeleteSubscriptionDTO,
} from './push-subscriptions.dto';

@Controller('subscription')
export class PushSubscriptionsController {
    constructor(private subs: PushSubscriptionsService) {}

    @Post()
    async addSub(@Body() dto: CreatePushSubscriptionDTO) {
        const id = await this.subs.addSubscription(dto);

        return {
            id,
        };
    }

    @Delete()
    async deleteSub(@Body() body: DeleteSubscriptionDTO) {
        await this.subs.deleteSub(body.id);
    }
}
