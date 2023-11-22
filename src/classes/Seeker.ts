import { Observable, catchError, combineLatest, concatMap, from, map, merge, mergeMap, of, scan, tap, timeout, toArray, count, lastValueFrom, last } from "rxjs"
import { ChatFactory, SearchOptions } from "../transformers/Factories/interfaces/Chat.factory"
import { Client } from "../transformers/Factories/interfaces/Client"
import { MessageFactory, MessageMedia } from "../transformers/Factories/interfaces/Message.factory"
import { Media } from "exceljs"
import { MediaManager } from "./MediaManager"
import { DBMessage } from "../interfaces/db/DBMessage"

export class Params {

    timeout: number = 5000
    downloadTries: number = 3
}

export interface MessageOptions {
    getMedia?: boolean,
    uploadToServer?:boolean
    timeout?: number,
}




export interface SaveMessage extends DBMessage {

    manager: MediaManager | undefined
}

export class SeekerRX {

    constructor(private seeker: Seeker) { }


    getChatsOneByOne$ = (chatMessages: ChatFactory[]): Observable<ChatFactory> => {

        return from(chatMessages)

    }

    getMessagesOneByOne$ = (chatMessage: ChatFactory): Observable<MessageFactory> => {

        return from(chatMessage.messages!)

    }

    getMessagesSorted$ = (messages: MessageFactory[]): Observable<MessageFactory> => {

        return from(

            messages
                .sort((msg1, msg2) => msg1.timestamp - msg2.timestamp)
            // .sort((msg1: MessageFactory, msg2: MessageFactory) => msg1.to.localeCompare(msg2.to))
        )

    }


    getMessagesToSave$ = (message: MessageFactory, { getMedia, timeout }: MessageOptions): Observable<SaveMessage> => {

        const message$ = of(message)

        const chat$ = message$.pipe(concatMap((message: MessageFactory) => message.getChat()))

        const chatName$ = chat$.pipe(concatMap((chat: ChatFactory) => of(chat.name)))

        const media$ = message$.pipe(concatMap((message: MessageFactory) => message.hasMedia ? this.getMediaFromMessage$(message, getMedia, timeout) : of(undefined)))

        const saveMessage$ = message$.pipe(concatMap(({ timestamp, id, ack, getChat, from: fromMessage, to, fromMe, hasMedia, author, body }: MessageFactory) => of({ timestamp, ack, id, from: fromMessage, to, author, fromGroup: !!author, fromMe, body, hasMedia } as SaveMessage)))

        const combine$ = combineLatest({ save: saveMessage$, manager: media$, name: chatName$ })

        const returnMessage$ = combine$.pipe(concatMap(({ save, manager, name }: { save: SaveMessage, manager: MediaManager | undefined, name: string }) => {
            save.manager = manager
            save.name = name

            return of(save)
        }))




        return returnMessage$


    }

    getAllContactChats$(chats: ChatFactory[]): Observable<ChatFactory[]> {


        return from(chats)
            .pipe(toArray())
            .pipe(concatMap((chats: ChatFactory[]) => chats.filter(chat => !chat.isGroup && !chat.name.startsWith('+'))))
            .pipe(toArray())
    }

    getAllNonGroupNonContactChats$(chats: ChatFactory[]): Observable<ChatFactory[]> {


        return from(chats)
            .pipe(toArray())
            .pipe(concatMap((chats: ChatFactory[]) => chats.filter(chat => !chat.isGroup && chat.name.startsWith('+'))))
            .pipe(toArray())
    }

    getAllGroupChats$(chats: ChatFactory[]): Observable<ChatFactory[]> {


        return from(chats)
            .pipe(toArray())
            .pipe(concatMap((chats: ChatFactory[]) => chats.filter(chat => chat.isGroup)))
            .pipe(toArray())

    }

    getAllChats$(client: Client = this.seeker.client): Observable<ChatFactory[]> {
        return from(client.getChats())

    }

    fetchMessagesfromChats$(chats: ChatFactory[]): Observable<ChatFactory[]> {
        return from(chats)
            .pipe(concatMap((chat: ChatFactory) => {



                return combineLatest({
                    chat: of(chat),
                    messages: from(chat.fetchMessages({ limit: 10000 } as SearchOptions))
                        .pipe(concatMap((messages: MessageFactory[]) => this.getMessagesSorted$(messages)))
                        .pipe(toArray())
                })
                    .pipe(concatMap(({ chat, messages }: { chat: ChatFactory; messages: MessageFactory[]; }) => {

                        chat.messages = messages

                        return of(chat)


                    }))

            })).pipe(toArray())
    }





    getAllMessagesToSave$(chats: ChatFactory[], options: MessageOptions): Observable<SaveMessage[]> {

        const ChatsWithMessages$ = this.fetchMessagesfromChats$(chats)

        const eachChat$ = ChatsWithMessages$.pipe(concatMap(chat => chat))

        const eachMessage$ = eachChat$.pipe(concatMap(chat => chat.messages ? chat.messages : []))

        const eachSaveMessage$ = eachMessage$.pipe(concatMap(message => this.getMessagesToSave$(message, options)))

        //  eachSaveMessage$.subscribe({next:(value)=>value.hasMedia?console.log({from:value.from,to:value.to  ,hasMedia:value.hasMedia,downloaded:value.manager?.downloaded}):undefined})


        return eachSaveMessage$.pipe(toArray())

    }

    getEachMessagesToSave$(chats: ChatFactory[], options: MessageOptions): Observable<SaveMessage> {

        const ChatsWithMessages$ = this.fetchMessagesfromChats$(chats)
        const eachChat$ = ChatsWithMessages$.pipe(concatMap(chat => chat))
        const eachMessage$ = eachChat$.pipe(concatMap(chat => chat.messages ? chat.messages : []))
        const eachSaveMessage$ = eachMessage$.pipe(concatMap(message => this.getMessagesToSave$(message, options)))

        //  eachSaveMessage$.subscribe({next:(value)=>value.hasMedia?console.log({from:value.from,to:value.to  ,hasMedia:value.hasMedia,downloaded:value.manager?.downloaded}):undefined})

        // ChatsWithMessages$.subscribe(() => console.log("ChatsWithMessages$"))
        // eachChat$.subscribe(() => console.log("eachChat$"))
        // eachMessage$.subscribe(() => console.log("eachMessage$"))
        // eachSaveMessage$.subscribe(() => console.log("eachSaveMessage$"))
        // eachSaveMessage$.pipe(scan((acc: number, val) => acc + 1, 0), tap((current) => console.log(current))).subscribe()


        return eachSaveMessage$

    }


    getAllMediaMessages$ = (messages: MessageFactory[], getMedia: boolean = false, timeoutbreak: number = 3000): Observable<MediaManager | undefined> => {

        return from(messages)
            .pipe(concatMap((message: MessageFactory) => {
                return this.getMediaFromMessage$(message)
            }))

    }


    getMediaFromMessage$ = ((message: MessageFactory, getMedia: boolean = false, timeoutbreak: number = 3000): Observable<MediaManager | undefined> => {

        return of(message)
            .pipe(concatMap((message: MessageFactory) => {

                const mediaManager = new MediaManager(message)

                if (!message.hasMedia)
                    return of(undefined)

                if (getMedia)

                    return from(mediaManager.getData())
                        .pipe(concatMap(() => of(mediaManager))
                            , timeout(timeoutbreak)
                            , catchError(err => {
                                return of(undefined)
                            }))

                else return of(mediaManager)


            }),

            )

    })


    mergeSaveMessages$(destination: SaveMessage[], mergeMessage: Observable<SaveMessage>) {

        const incoming$ = mergeMessage

        const foundMessage$ = incoming$.pipe(concatMap((incoming: SaveMessage) => {

            const { id: incomingId } = incoming

            return !!destination.find(({ id }: SaveMessage) => id === incomingId) ? of(undefined) : of(incoming)



        }))

        const append$ = foundMessage$.pipe(concatMap((append: undefined | SaveMessage) => {
            !!append ? destination.push(append) : undefined

            return of(destination)
        }))

        return append$

    }

    mergeSaveMessages$$(destination: SaveMessage[], mergeMessages: Observable<SaveMessage>[]) {

        const messagesEach$ = from(mergeMessages)


        return messagesEach$.pipe(concatMap((message$: Observable<SaveMessage>) => this.mergeSaveMessages$(destination, message$)))





    }




}

export class SeekerActions {

    constructor(private seeker: Seeker) { }


    supportedFormats = (mimetype: string) => {
        switch (mimetype) {
            case 'image/gif': return 'gif'
            case 'image/jpeg': return 'jpeg'
            case 'image/png': return 'png'

        }

        if (mimetype.startsWith('audio/ogg')) return 'oog'
    }

    async getAllSaveMessages(options?:MessageOptions):Promise<SaveMessage[]>{


        const messageOptions = options??{getMedia:false,timeout:3000} as MessageOptions

        const allChats$ = this.seeker.rx.getAllChats$();


        const contactChats$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getAllContactChats$(chats)))
        const groupChats$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getAllGroupChats$(chats)))

        const nonContactChat$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getAllNonGroupNonContactChats$(chats)))

        const groupSaveMessagesEach$ =groupChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getEachMessagesToSave$(chats,messageOptions)))

        const contactSaveMessagesEach$ =contactChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getEachMessagesToSave$(chats,messageOptions)))

        const nonContactSaveMessagesEach$ =nonContactChat$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getEachMessagesToSave$(chats,messageOptions)))
        
        const allSaveMessages$ = this.seeker.rx.mergeSaveMessages$$([],[groupSaveMessagesEach$,contactSaveMessagesEach$,nonContactSaveMessagesEach$]).pipe(last())

        return await lastValueFrom(allSaveMessages$)

    }
    

}

export class Seeker {


    actions: SeekerActions = new SeekerActions(this)
    rx: SeekerRX = new SeekerRX(this)

    constructor(public client: Client) {

    }





}