import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Message {
    @Prop({ type: Number, required: true })
    timestamp: number;

    @Prop({ type: Buffer, required: true })
    data: Buffer;
}

export const MessageScheme = SchemaFactory.createForClass(Message);
