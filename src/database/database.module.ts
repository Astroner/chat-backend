import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Contact, ContactScheme } from './contacts/contact.scheme';

import { env } from 'src/env';
import { ContactsService } from './contacts/contacts.service';
import { ContactsController } from './contacts/contacts.controller';
import { Message, MessageScheme } from './messages/message.scheme';
import { MessagesService } from './messages/messages.service';
import { MessagesController } from './messages/messages.controller';

@Module({
    imports: [
        MongooseModule.forRoot(env.MONGO_ADDRESS),
        MongooseModule.forFeature([
            { name: Contact.name, schema: ContactScheme },
        ]),
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageScheme },
        ]),
    ],
    providers: [ContactsService, MessagesService],
    controllers: [ContactsController, MessagesController],
    exports: [MessagesService]
})
export class DatabaseModule {}
