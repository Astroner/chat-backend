import { Controller, Get, Query, Res } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { BufferBuilder } from 'src/helpers/buffer-builder.class';
import { Response } from 'express';

@Controller('messages')
export class MessagesController {

    constructor(
        private messages: MessagesService
    ){}

    @Get("/all")
    async getAll(@Res() res: Response, @Query("from") fromString: string, @Query("to") toString: string) {
        let from: number | undefined;
        if(isNaN(from = +fromString)) {
            from = undefined;
        }

        let to: number | undefined;
        if(isNaN(to = +toString)) {
            to = undefined;
        }

        const data = await this.messages.getAll(from, to);

        const payload = new BufferBuilder();

        payload.appendUint16(data.length);
        for(const datum of data) {
            payload.appendUint64(BigInt(datum.timestamp));
            payload.appendBuffer(datum.data);
        }

        res.send(payload.getBuffer());
    }
}
