import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Contact, ContactScheme } from './contacts/contact.scheme';

import { env } from 'src/env';
import { ContactsService } from './contacts/contacts.service';
import { ContactsController } from './contacts/contacts.controller';

@Module({
    imports: [
        MongooseModule.forRoot(env.MONGO_ADDRESS),
        MongooseModule.forFeature([
            { name: Contact.name, schema: ContactScheme },
        ]),
    ],
    providers: [ContactsService],
    controllers: [ContactsController],
})
export class DatabaseModule {}
