export type CreateContactDTO = {
    name: string;
    publicKey: string;
    publicSign: string;
};

export type DeleteContactDTO = {
    name: string;
    signature: string;
};

export type UpdateContactDTO = {
    name: string;
    update: Partial<CreateContactDTO>;
    signature: string;
};
