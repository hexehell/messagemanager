import { ChatFactory } from "./Chat.factory";
import { EventEmitter } from 'node:events'

export enum ClientEvents {

    qr = 'qr',
    init = 'init',
    ready = 'ready',
    saved = 'saved',
    saveError = 'saveError',


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

    on(event: ClientEvents.init,      listener: (client:ClientFactory) => void): this
    on(event: ClientEvents.ready,     listener: (client:ClientFactory) => void): this
    on(event: ClientEvents.saved,     listener: (client:ClientFactory) => void): this
    on(event: ClientEvents.saveError, listener: (error?:Error|string) => void): this
}