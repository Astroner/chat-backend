export type CreateContactDTO = {
    name: string;
    publicKey: string;
    publicSign: string;
};

export type DeleteContactDTO = {
    name: string;
    signature: Buffer;
};

export type UpdateContactDTO = {
    name: string;
    update: Partial<CreateContactDTO>;
    signature: Buffer;
};

export type UpdateContactDTORaw = {
    name: string,
    update: string
}

export type FindContactDTO = {
    name: string;
}