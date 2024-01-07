import { Observable, catchError, combineLatest, concatMap, from, map, merge, mergeMap, of, scan, tap, timeout, toArray, count, lastValueFrom, last, Subject, race, filter, concat } from "rxjs"
import { ChatFactory, SearchOptions } from "../../transformers/Factories/interfaces/Chat.factory"
import { ClientFactory } from "../../transformers/Factories/interfaces/Client"
import { MessageFactory, MessageMedia, MessageQuery } from "../../transformers/Factories/interfaces/Message.factory"
import { Media } from "exceljs"
import { MediaManager } from "../../MediaManager/classes/MediaManager"
import { Message } from "../../database/classes/Messages/interfaces/DBMessage"
import { Uploaders } from "../../ImagesUploaders/classes/Uploaders"

export class Params {

    timeout: number = 5000
    downloadTries: number = 3
}


export interface MessageOptions {
    getMedia?: boolean,
    uploadToServer?: boolean
    timeout?: number,
    Query?: MessageQuery
}


export interface Results {
    messages: SaveMessage[],
    okMessages: SaveMessage[],
    issueMessages: SaveMessage[],
    shouldHaveMedia: string[]
}



export interface SaveMessage extends Message {

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

    QueryMessage$ = (message: MessageFactory, { Query }: MessageOptions): Observable<MessageFactory | undefined> => {

        const message$ = of(message)

        const QuerySelection$ = message$.pipe(concatMap((message: MessageFactory) => {



            const messageEntries = Object.entries(message)
            const queryEntries = Object.entries(Query ?? {})

            const results = queryEntries.map(([key, value]) => {
                const entry = messageEntries.find(entry => entry[0] === key)

                return entry![1] === value
            })

            if (results.some(x => x)) return of(message)

            return of(undefined)

        }))


        return QuerySelection$

    }

    shouldHaveMedia$ = (saveMessage: SaveMessage): Observable<string | undefined> => {

        const saveMessage$ = of(saveMessage)

        const shouldHavetheMediaObject$ = saveMessage$.pipe(concatMap(({ id, manager, hasMedia }: SaveMessage) => !!!manager && hasMedia ? of(id) : of(undefined)))

        const shouldHavetheMediaLink$ = saveMessage$.pipe(concatMap(({ id, manager, hasMedia }: SaveMessage) => !!manager && hasMedia && !!!manager.lilnk ? of(id) : of(undefined)))

        const mediaId$ = concat(shouldHavetheMediaLink$,shouldHavetheMediaObject$)

        return mediaId$
    }


    getMessagesToSave$ = (message: MessageFactory, { getMedia, timeout, uploadToServer, Query }: MessageOptions): Observable<SaveMessage> => {




        const message$ = of(message)






        const chat$ = message$.pipe(concatMap((message: MessageFactory) => message.getChat()))


        const saveMessage$ = message$.pipe(concatMap(({ timestamp, id, ack, getChat, from: fromMessage, to, fromMe, hasMedia, author, body }: MessageFactory) => of({ timestamp, ack, id, from: fromMessage, to, author, fromGroup: !!author, fromMe, body, hasMedia } as SaveMessage)))



        const media$ = message$.pipe(concatMap((message: MessageFactory) => message.hasMedia ? this.getMediaFromMessage$(message, getMedia, timeout, uploadToServer) : of(undefined)))



        const chatName$ = chat$.pipe(concatMap((chat: ChatFactory) => of(chat.name)))


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

    getAllChats$(client: ClientFactory = this.seeker.client): Observable<ChatFactory[]> {
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


    ResultMessages$ = (messages: SaveMessage[], shouldHaveMedia: string[]): Observable<Results> => {

        const messages$ = from(messages)

        const issueMessage$ = messages$.pipe(
            concatMap((saveMessage: SaveMessage) => of([saveMessage, saveMessage.id])),
            concatMap(([message, id]: (string | SaveMessage)[]) => !!shouldHaveMedia.find(idS => id === idS) ? of(message as SaveMessage) : of()), toArray())

        const okMessages$ = messages$.pipe(
            concatMap((saveMessage: SaveMessage) => of([saveMessage, saveMessage.id])),
            concatMap(([message, id]: (string | SaveMessage)[]) => !!!shouldHaveMedia.find(idS => id === idS) ? of(message as SaveMessage) : of()), toArray())

        const returnResult$ = combineLatest({ messages: of(messages), okMessages: okMessages$, issueMessages: issueMessage$, shouldHaveMedia: of(shouldHaveMedia) }).pipe(concatMap(val => of(val as Results)))

        return returnResult$

    }


    getAllMessagesToSave$(chats: ChatFactory[], options: MessageOptions): Observable<SaveMessage[]> {

        const ChatsWithMessages$ = this.fetchMessagesfromChats$(chats)

        const eachChat$ = ChatsWithMessages$.pipe(concatMap(chat => chat))

        const eachMessage$ = eachChat$.pipe(concatMap(chat => chat.messages ? chat.messages : [] as MessageFactory[]))

        const eachQueryMessage$ = eachMessage$.pipe(concatMap(message => this.QueryMessage$(message, options))).pipe(filter((value: MessageFactory | undefined) => typeof (value) !== 'undefined'), map(val => val as MessageFactory))

        const eachSaveMessage$ = eachQueryMessage$.pipe(concatMap(message => this.getMessagesToSave$(message, options)))


        //  eachSaveMessage$.subscribe({next:(value)=>value.hasMedia?console.log({from:value.from,to:value.to  ,hasMedia:value.hasMedia,downloaded:value.manager?.downloaded}):undefined})


        return eachSaveMessage$.pipe(toArray())

    }

    getEachMessagesToSave$(chats: ChatFactory[], options: MessageOptions): Observable<SaveMessage> {

        const ChatsWithMessages$ = this.fetchMessagesfromChats$(chats)
        const eachChat$ = ChatsWithMessages$.pipe(concatMap(chat => chat))
        const eachMessage$ = eachChat$.pipe(concatMap(chat => chat.messages ? chat.messages : []))

        const eachQueryMessage$ = eachMessage$.pipe(concatMap(message => this.QueryMessage$(message, options))).pipe(filter((value: MessageFactory | undefined) => typeof (value) !== 'undefined'), map(val => val as MessageFactory))
        const eachSaveMessage$ = eachQueryMessage$.pipe(concatMap(message => this.getMessagesToSave$(message, options)))



        return eachSaveMessage$

    }


    getAllMediaMessages$ = (messages: MessageFactory[], getMedia: boolean = false, timeoutbreak: number = 3000): Observable<MediaManager | undefined> => {

        return from(messages)
            .pipe(concatMap((message: MessageFactory) => {
                return this.getMediaFromMessage$(message)
            }))

    }


    getMediaFromMessage$ = ((message: MessageFactory, getMedia: boolean = false, timeoutbreak: number = 3000, uploadToServer: boolean = false): Observable<MediaManager | undefined> => {

        return of(message)
            .pipe(concatMap((message: MessageFactory) => {

                const mediaManager = new MediaManager(message, this.seeker.imageUploaders, uploadToServer)

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




    async getAllSaveMessages(options?: MessageOptions): Promise<Results> {


        const messageOptions = options ?? { getMedia: false, timeout: 3000, justMedia: false, uploadToServer: false } as MessageOptions

        const allChats$ = this.seeker.rx.getAllChats$();


        const contactChats$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getAllContactChats$(chats)))
        const groupChats$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getAllGroupChats$(chats)))
        const nonContactChat$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getAllNonGroupNonContactChats$(chats)))

        const groupSaveMessagesEach$ = groupChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getEachMessagesToSave$(chats, messageOptions)))
        const contactSaveMessagesEach$ = contactChats$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getEachMessagesToSave$(chats, messageOptions)))
        const nonContactSaveMessagesEach$ = nonContactChat$.pipe(concatMap((chats: ChatFactory[]) => this.seeker.rx.getEachMessagesToSave$(chats, messageOptions)))

        const allSaveMessages$ = this.seeker.rx.mergeSaveMessages$$([], [groupSaveMessagesEach$, contactSaveMessagesEach$, nonContactSaveMessagesEach$]).pipe(last())

        const eachSaveMessage$ = merge(groupSaveMessagesEach$, contactSaveMessagesEach$, nonContactSaveMessagesEach$).pipe(concatMap((savemessage: SaveMessage) => this.seeker.rx.shouldHaveMedia$(savemessage)))
        const shouldHaveMedia$ = eachSaveMessage$.pipe(concatMap((id: string | undefined) => of(id)), filter((value: string | undefined) => typeof (value) !== 'undefined'), map(val => val as string))
        const ResultsBeforeSplit$ = combineLatest({ messages: allSaveMessages$, shouldHaveMedia: shouldHaveMedia$.pipe(toArray()) })

        const Results$ = ResultsBeforeSplit$.pipe(concatMap(({ messages, shouldHaveMedia }: { messages: SaveMessage[], shouldHaveMedia: string[] }) => this.seeker.rx.ResultMessages$(messages, shouldHaveMedia)))

        return await lastValueFrom(Results$.pipe(concatMap((val) => of(val as Results))))

    }


}

export class Seeker {


    actions: SeekerActions = new SeekerActions(this)
    rx: SeekerRX = new SeekerRX(this)


    constructor(public client: ClientFactory, public imageUploaders: Uploaders) {

    }





}