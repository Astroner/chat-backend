import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.scheme';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private message: Model<Message>
    ) {}


    async addMessage(data: Buffer, timestamp: number = Date.now()) {
        await this.message.create({
            data: data,
            timestamp
        })
    }

    async getAll(from?: number, to?: number) {
        const filter: FilterQuery<Message> = {};

        if(from) {
            if(!filter.timestamp) {
                filter.timestamp = {};
            }
            filter.timestamp.$gte = from;
        }
        if(to) {
            if(!filter.timestamp) {
                filter.timestamp = {};
            }

            filter.timestamp.$lt = to;
        }

        return await this.message.find(filter);
    }
}
