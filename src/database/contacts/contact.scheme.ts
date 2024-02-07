import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Contact {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    publicKey: string;

    @Prop({ required: true })
    publicSign: string;
}

export type ContactDocument = HydratedDocument<Contact>;

export const ContactScheme = SchemaFactory.createForClass(Contact);
