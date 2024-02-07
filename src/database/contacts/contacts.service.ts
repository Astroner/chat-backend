import { webcrypto } from 'crypto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contact } from './contact.scheme';
import {
    CreateContactDTO,
    DeleteContactDTO,
    UpdateContactDTO,
} from './contacts.dto';

@Injectable()
export class ContactsService {
    constructor(@InjectModel(Contact.name) private contact: Model<Contact>) {}

    create(data: CreateContactDTO) {
        return this.contact.create(data);
    }

    getByName(name: string) {
        const contact = this.contact.findOne({ name });

        return contact;
    }

    private async isVerified(key: string, data: string, signature: string) {
        const publicKeyJWK = JSON.parse(key);

        const wKey = await webcrypto.subtle.importKey(
            'jwk',
            publicKeyJWK,
            {
                name: 'RSA-PSS',
                hash: 'SHA-256',
            },
            !!publicKeyJWK.ext,
            (publicKeyJWK.key_ops as KeyUsage[]) ?? [],
        );

        const result = await webcrypto.subtle.verify(
            {
                name: 'RSA-PSS',
                saltLength: 32,
            },
            wKey,
            Buffer.from(signature, 'hex'),
            new TextEncoder().encode(data),
        );

        return result;
    }

    async updateBySignedName(dto: UpdateContactDTO) {
        const contact = await this.contact.findOne({ name: dto.name });

        if (!contact) throw new NotFoundException();

        if (
            !this.isVerified(
                contact.publicSign,
                Object.values(dto.update).join(''),
                dto.signature,
            )
        ) {
            throw new NotFoundException();
        }

        await contact.updateOne(dto.update);
    }

    async deleteBySignedName({ name, signature }: DeleteContactDTO) {
        const contact = await this.contact.findOne({ name });

        if (!contact) throw new NotFoundException();

        if (!this.isVerified(contact.publicSign, name, signature)) {
            throw new NotFoundException();
        }

        await contact.deleteOne();
    }
}
