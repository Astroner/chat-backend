import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class PushSubscription {
    @Prop({ type: String, required: true })
    endpoint: string;

    @Prop({ type: String, required: true })
    key: string;

    @Prop({ type: String, required: true })
    auth: string;
}

export const PushSubscriptionSchema = SchemaFactory.createForClass(PushSubscription)