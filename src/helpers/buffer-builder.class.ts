type OperationTemplate<T, D> = {
    type: T;
    data: D;
};

type Operation =
    | OperationTemplate<'append-byte', number>
    | OperationTemplate<'append-uint16', number>
    | OperationTemplate<'append-string', { src: string; skipLength: boolean }>
    | OperationTemplate<
          'append-buffer',
          { src: Buffer; skipLength: boolean }
      >
    | OperationTemplate<'append-uint64', bigint>

export class BufferBuilder {
    private operations: Operation[] = [];
    private bufferSize = 0;

    appendByte(value: number): BufferBuilder {
        this.operations.push({ type: 'append-byte', data: value });
        this.bufferSize += 1;

        return this;
    }

    appendUint16(num: number): BufferBuilder {
        this.operations.push({ type: 'append-uint16', data: num });
        this.bufferSize += 2;

        return this;
    }

    appendString(str: string, skipLength?: 'SKIP_LENGTH'): BufferBuilder {
        this.operations.push({
            type: 'append-string',
            data: { src: str, skipLength: !!skipLength },
        });
        if (!skipLength) this.bufferSize += 2;
        this.bufferSize += str.length;

        return this;
    }

    appendBuffer(data: Buffer, skipLength?: 'SKIP_LENGTH'): BufferBuilder {
        this.operations.push({
            type: 'append-buffer',
            data: { src: data, skipLength: !!skipLength },
        });
        if (!skipLength) this.bufferSize += 2;
        this.bufferSize += data.byteLength;

        return this;
    }

    appendUint64(data: bigint): BufferBuilder {
        this.operations.push({ type: 'append-uint64', data });
        this.bufferSize += 8;

        return this;
    }

    getBuffer() {
        const buffer = Buffer.allocUnsafe(this.bufferSize)

        let cursor = 0;

        for (const operation of this.operations) {
            switch (operation.type) {
                case 'append-byte':
                    buffer[cursor++] = operation.data;

                    break;

                case 'append-uint16': {
                    buffer.writeUInt16LE(operation.data, cursor);
                    cursor += 2;

                    break;
                }

                case 'append-uint64': {
                    buffer.writeBigUint64LE(operation.data, cursor);
                    cursor += 8;

                    break;
                }

                case 'append-string': {
                    if (!operation.data.skipLength) {
                        buffer.writeUInt16LE(operation.data.src.length, cursor);
                        cursor += 2;
                    }

                    buffer.write(operation.data.src, cursor);

                    cursor += operation.data.src.length;

                    break;
                }

                case 'append-buffer': {
                    if (!operation.data.skipLength) {
                        buffer.writeUInt16LE(operation.data.src.byteLength, cursor);
                        cursor += 2;
                    }

                    buffer.set(operation.data.src, cursor);

                    cursor += operation.data.src.byteLength;

                    break;
                }
            }
        }

        return buffer;
    }

    getCurrentSize() {
        return this.bufferSize;
    }
}
