import { ChatFactory } from "./Chat.factory";

export interface ContactFactory{
    number: string,
    isBusiness: boolean,
    id: ContactId,
    isEnterprise: boolean,
    isGroup: boolean,
    isMe: boolean,
    isMyContact: boolean
    isUser: boolean,
    isWAContact: boolean,
    isBlocked: boolean,
    name?: string,
    pushname: string,

    block: () => Promise<boolean>,
    unblock: () => Promise<boolean>,

    getChat: () => Promise<ChatFactory>,



}


export interface ContactId {
    server: string,
    user: string,
    _serialized: string,
}