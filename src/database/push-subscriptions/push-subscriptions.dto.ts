export interface CreatePushSubscriptionDTO {
    endpoint: string;
    key: string;
    auth: string;
}

export interface DeleteSubscriptionDTO {
    id: string
}