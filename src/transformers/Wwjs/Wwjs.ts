import { Client as WwjsClient, Chat, MessageSearchOptions, Message, MessageMedia as MessageMediaWwjs } from "whatsapp-web.js";
import { ChatFactory, SearchOptions } from "../Factories/interfaces/Chat.factory";
import { ClientFactory, ClientEvents } from "../Factories/interfaces/Client";
import { MessageAck, MessageContent, MessageFactory, MessageMedia, MessageTypes } from "../Factories/interfaces/Message.factory";
import { EventEmitter } from "node:events";
import { createSpinner } from 'nanospinner'
import { v4 as uuid } from 'uuid'
import path from "node:path";
import fs from 'fs-extra'

export class ClientWwjs extends EventEmitter implements ClientFactory {

    constructor(private wwjsClient: WwjsClient, private dataPath: string) {
        super();

        this.wwjsParsedEvents()
    }
    async sendMessage(chatId: string, content: MessageContent, caption?: string): Promise<MessageFactory> {

        //   const message = await  this.wwjsClient.sendMessage(chatId,content,undefined)

        if (typeof content === 'string')
            return this.sendMessageText(chatId, content)
        else {
            return this.sendMessageImage(chatId, content, caption)
        }


    }

    async sendMessageText(chatId: string, message: string) {
        const messageSent = await this.wwjsClient.sendMessage(chatId, message, undefined)

        return new MessageWwjs(messageSent, new ChatWwjs(await messageSent.getChat()))
    }



    async sendMessageImage(chatId: string, image: MessageMedia, caption?: string) {



        let mediaPath = uuid()

        const  base64:string = image.data

        const mimetype = image.mimetype.replace("data:", "").replace(";base64", "").replace('image/', '')

        mediaPath = path.join('./media', mediaPath + '.' + mimetype)

        fs.writeFileSync(mediaPath, Buffer.from(base64, 'base64'))


        // const fileMedia:string = uuid() +"."+image.mimetype.replace("image/","  ")

        // let mediaPath:string = path.join( "./media/",fileMedia);

        // image.data = image.data.replace("data:","").replace(";base64","").replace(image.mimetype,'')

        // fs.writeFileSync(mediaPath,Buffer.from(image.data, 'base64') )



        const content = MessageWwjs.fromFilePath(mediaPath)

        const messageSent = await this.wwjsClient.sendMessage(chatId+"@c.us", content, { caption: caption })

        try {


            fs.unlinkSync(mediaPath);

        }
        catch (err) {

            console.log(err)
        }

        return new MessageWwjs(messageSent, new ChatWwjs(await messageSent.getChat()))
    }

    disconnect = async (): Promise<void> => {



        return await this.wwjsClient.destroy().then(() => {
            createSpinner('session closed').success()

        }).catch((err: Error) => { console.log(createSpinner(err.message).error()) })
    }

    whereIsRunning = () => {



        return this.dataPath
    };

    getPhone = () => {

        return this.wwjsClient.info.wid.user

    };

    async initialize(): Promise<void> {


        this.wwjsClient.initialize()
        this.emit(ClientEvents.init, this)

    }

    clientSaved = () => {

        this.emit(ClientEvents.saved, this)

    }

    clientReloaded = () => {
        this.emit(ClientEvents.reloaded, this)
    }

    clientSavingError = (err: Error | string) => {
        this.emit(ClientEvents.loadError, err)
    }


    async parseMessage(something:Message):Promise<MessageWwjs>{

        const chatWwjs = await something.getChat()

        const chat = new ChatWwjs(chatWwjs)

        return new MessageWwjs(something, chat)

    }


    wwjsParsedEvents() {

        this.wwjsClient.on(ClientEvents.qr, (qr: string) => this.emit(ClientEvents.qr, qr))
        this.wwjsClient.on(ClientEvents.ready, () => this.emit(ClientEvents.ready, this))
        this.wwjsClient.on(ClientEvents.change_state, (something:any) => this.emit(ClientEvents.change_state, something))
        
        this.wwjsClient.on(ClientEvents.message, async(message:Message) => {

            this.emit(ClientEvents.message, this.parseMessage(message))
        })

        this.wwjsClient.on('media_uploaded', async(message:Message) => {

            this.emit(ClientEvents.message, this.parseMessage(message))

        })

        this.wwjsClient.on('message_ack', async(message:Message,ack:any) => {

            this.emit(ClientEvents.message, this.parseMessage(message))

        })
        this.wwjsClient.on('message_edit', async(message:Message) => {
            this.emit(ClientEvents.message, this.parseMessage(message))

        })



    }

    async getChats(): Promise<ChatFactory[]> {
        // throw new Error("Method not implemented.");

        return (await this.wwjsClient.getChats()).map((chat: Chat) => {

            return (new ChatWwjs(chat)) as ChatFactory

        })

    }

    // on(event: 'qr', listener: (
    //     qr: string
    //  ) => void): this

    //  on(event: 'ready', listener: () => void): this

}

export class ChatWwjs implements ChatFactory {

    constructor(private wwjschat: Chat) {
        const { isGroup
            , name
            , timestamp
            , id } = wwjschat
        this.isGroup = isGroup
        this.name = name
        this.timestamp = timestamp
        this.id = id.user

    }
    messages: MessageFactory[] | undefined;

    isGroup: boolean;
    name: string;
    timestamp: number;
    id: string;
    async fetchMessages(searchOptions: SearchOptions): Promise<MessageFactory[]> {
        return (await this.wwjschat.fetchMessages(searchOptions as MessageSearchOptions)).map((message: Message) => {

            return new MessageWwjs(message, this)
        })
    }
    sendMessage(): Promise<MessageFactory> {
        throw new Error("Method not implemented.");
    }

}
export class MessageWwjs implements MessageFactory {

    constructor(private message: Message, private chat: ChatFactory) {
        this.ack = message.ack
        this.author = message.author
        this.body = message.body
        this.broadcast = message.broadcast
        this.isStatus = message.isStatus
        this.from = message.from
        this.to = message.to
        this.fromMe = message.fromMe
        this.hasMedia = message.hasMedia
        this.id = message.id.id
        this.vCards = message.vCards
        this.timestamp = message.timestamp
        this.type = message.type
        this.orderId = message.orderId
        this.title = message.title
        this.description = message.description


    }



    ack: MessageAck;
    author?: string | undefined;
    body: string;
    broadcast: boolean;
    isStatus: boolean;
    from: string;
    to: string;
    fromMe: boolean;
    hasMedia: boolean;
    id: string;
    vCards: string[];
    timestamp: number;
    type: MessageTypes;
    orderId: string;
    title?: string | undefined;
    description?: string | undefined;

    async downloadMedia(): Promise<MessageMedia | undefined> {
        return await this.message.downloadMedia().then((media: MessageMediaWwjs) => {


            // const { } = media

            const data = media.data ?? undefined
            const mimetype = media.mimetype ?? undefined
            const filename = media.filename ?? undefined
            const filesize = media.filesize ?? undefined

            return { data, mimetype, filename, filesize } as MessageMedia

        })
    }
    getChat = async (): Promise<ChatFactory> => {

        return this.chat
    };

    getAckString(ack: number): string {

        return Object.entries(MessageAck).filter(state => state[1] === ack)[0][0]

    };

    static fromFilePath(mediaPath: string) {
        return MessageMediaWwjs.fromFilePath(mediaPath)
    }


    // delete: (everyone?: boolean | undefined) => Promise<void>;

}