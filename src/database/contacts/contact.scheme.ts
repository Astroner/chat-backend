import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Contact {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    publicKey: string;

    @Prop({ required: true })
    publicSign: string;
}

export const ContactScheme = SchemaFactory.createForClass(Contact);
