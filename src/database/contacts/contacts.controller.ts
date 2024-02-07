import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import {
    CreateContactDTO,
    DeleteContactDTO,
    UpdateContactDTO,
} from './contacts.dto';

@Controller('contacts')
export class ContactsController {
    constructor(private contact: ContactsService) {}

    @Post('create')
    async createContact(@Body() body: CreateContactDTO): Promise<void> {
        await this.contact.create(body);
    }

    @Delete('delete')
    async deleteContact(@Body() body: DeleteContactDTO): Promise<void> {
        await this.contact.deleteBySignedName(body);
    }

    @Patch('patch')
    async updateContact(@Body() body: UpdateContactDTO) {
        await this.contact.updateBySignedName(body);
    }
}
