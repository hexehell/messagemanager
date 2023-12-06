import { Client as WwjsClient, Chat, MessageSearchOptions, Message, MessageMedia as MessageMediaWwjs } from "whatsapp-web.js";
import { ChatFactory, SearchOptions } from "./Factories/interfaces/Chat.factory";
import { ClientFactory, ClientEvents } from "./Factories/interfaces/Client";
import { MessageAck, MessageFactory, MessageMedia, MessageTypes } from "./Factories/interfaces/Message.factory";
import { EventEmitter } from "node:events";
import {createSpinner} from 'nanospinner'

export class ClientWwjs extends EventEmitter implements ClientFactory {

    constructor(private wwjsClient: WwjsClient,private dataPath:string) {
        super();

        this.wwjsParsedEvents()
    }
     disconnect = async(): Promise<void>=> {



        return await this.wwjsClient.destroy().then(()=>{
            createSpinner('session closed').success()

        }).catch((err:Error)=>{console.log(createSpinner(err.message).error())})
    }

    whereIsRunning= () => {
        
        

        return this.dataPath
    };

    getPhone = () =>{

        return this.wwjsClient.info.wid.user
        
    };

    async initialize(): Promise<void> {

        
        this.wwjsClient.initialize()
        this.emit(ClientEvents.init,this)
   
    }

    clientSaved=()=>{

        this.emit(ClientEvents.saved,this)

    }

    clientSavingError= (err:Error|string)=>{
        this.emit(ClientEvents.saveError,err)
    }




    wwjsParsedEvents(){

        this.wwjsClient.on(ClientEvents.qr,(qr:string)=>this.emit(ClientEvents.qr,qr))
        this.wwjsClient.on(ClientEvents.ready,()=>this.emit(ClientEvents.ready,this))

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
    sendMessage():Promise<MessageFactory> {
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

    async downloadMedia(): Promise<MessageMedia|undefined> {
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

    // delete: (everyone?: boolean | undefined) => Promise<void>;

}