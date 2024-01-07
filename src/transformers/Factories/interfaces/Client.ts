import { ChatFactory } from "./Chat.factory";
import { EventEmitter } from 'node:events'
import { MessageFactory, MessageContent } from "./Message.factory";

export enum ClientEvents {

    qr = 'qr',
    init = 'init',
    ready = 'ready',
    reloaded = 'reloaded',
    saved = 'saved',
    loadError = 'loadError',
    change_state = 'change_state',
    message = 'message'


}


export interface ClientFactory extends EventEmitter {
    whereIsRunning: () => string

    disconnect(): Promise<void>

    getPhone: () => string

    getChats(): Promise<ChatFactory[]>

    clientSavingError: (err:Error|string)=>void

    initialize(): Promise<void>

    on(event: ClientEvents.qr, listener: (
        qr: string
    ) => void): this

     sendMessage(chatId: string, content: MessageContent,caption?:string): Promise<MessageFactory>

    on(event: ClientEvents.init,      listener: (client:ClientFactory) => void): this
    on(event: ClientEvents.ready,     listener: (client:ClientFactory) => void): this
    on(event: ClientEvents.reloaded,     listener: (client:ClientFactory) => void): this
    on(event: ClientEvents.saved,     listener: (client:ClientFactory) => void): this
    on(event: ClientEvents.loadError, listener: (error?:Error|string) => void): this
    on(event: ClientEvents.change_state, listener: (somethig?:any) => void): this
}