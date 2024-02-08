import { webcrypto } from 'crypto';

import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
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

    async create(data: CreateContactDTO) {
        try {
            const parsedPubKey = JSON.parse(data.publicKey);
            await webcrypto.subtle.importKey(
                'jwk',
                parsedPubKey,
                {
                    name: 'RSA-OAEP',
                    hash: 'SHA-256',
                },
                true,
                (parsedPubKey.key_ops as KeyUsage[]) ?? [],
            );

            const parsedPubSign = JSON.parse(data.publicSign);
            await webcrypto.subtle.importKey(
                'jwk',
                parsedPubSign,
                {
                    name: 'RSA-PSS',
                    hash: 'SHA-256',
                },
                !!parsedPubSign.ext,
                (parsedPubSign.key_ops as KeyUsage[]) ?? [],
            );
        } catch (e) {
            throw new BadRequestException('Invalid keys');
        }

        return this.contact.create(data);
    }

    async getByName(name: string) {
        const contact = await this.contact.findOne({ name });

        if (!contact) throw new NotFoundException();

        return contact;
    }

    private async isVerified(key: string, data: string, signature: Buffer) {
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
            signature,
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
