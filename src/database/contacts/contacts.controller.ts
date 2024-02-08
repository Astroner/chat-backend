import {
    Body,
    Controller,
    Delete,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import {
    CreateContactDTO,
    DeleteContactDTO,
    FindContactDTO,
    UpdateContactDTORaw,
} from './contacts.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('contacts')
export class ContactsController {
    constructor(private contact: ContactsService) {}

    @Post('create')
    async createContact(@Body() body: CreateContactDTO): Promise<void> {
        await this.contact.create(body);
    }

    @Post('find')
    async findContact(@Body() body: FindContactDTO) {
        const contact = await this.contact.getByName(body.name);

        return {
            name: contact.name,
            publicKey: contact.publicKey,
            publicSign: contact.publicSign,
        };
    }

    @Delete('delete')
    @UseInterceptors(FileInterceptor('signature'))
    async deleteContact(
        @Body() body: DeleteContactDTO,
        @UploadedFile() signature: Express.Multer.File,
    ): Promise<void> {
        await this.contact.deleteBySignedName({
            name: body.name,
            signature: signature.buffer,
        });
    }

    @Patch('patch')
    @UseInterceptors(FileInterceptor('signature'))
    async updateContact(
        @Body() body: UpdateContactDTORaw,
        @UploadedFile() signature: Express.Multer.File,
    ) {
        const parsedUpdate = JSON.parse(body.update);

        await this.contact.updateBySignedName({
            name: body.name,
            update: parsedUpdate,
            signature: signature.buffer,
        });
    }
}
