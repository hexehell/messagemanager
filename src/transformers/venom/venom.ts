import { ChatFactory, SearchOptions } from "../Factories/interfaces/Chat.factory";
import { ClientFactory, ClientEvents } from "../Factories/interfaces/Client";
import { MessageAck, MessageContent, MessageFactory, MessageMedia, MessageTypes } from "../Factories/interfaces/Message.factory";
import { EventEmitter } from "node:events";
import { createSpinner } from 'nanospinner'

export class ClientVenom extends EventEmitter implements ClientFactory {

    venomClient:any

    venom = require('venom-bot');

    constructor(private session: string) {
        super();

        this.wwjsParsedEvents()
    }

   async sendMessage(chatId: string, content: MessageContent): Promise<MessageFactory> {

        let messageResponse:any = {}

        if(typeof content === 'string'){

            messageResponse = await this.venomClient.sendText(chatId,content)

        }
        else if('mimetype' in content){

            const {data} = content as MessageMedia

            messageResponse = await this.venomClient.sendImageFromBase64(chatId,data)
        }



        return {} as MessageFactory
    }

    disconnect = async (): Promise<void> => {



        // return await this.wwjsClient.destroy().then(() => {
        //     createSpinner('session closed').success()

        // }).catch((err: Error) => { console.log(createSpinner(err.message).error()) })
    }

    whereIsRunning = () => {



        return 'this.dataPath'
    };

    getPhone = () => {

        return 'this.wwjsClient.info.wid.user'

    };

    async initialize(): Promise<void> {

        this.emit(ClientEvents.init, this)

        this.venomClient = await this.venom.create({session:this.session,debug:false,logQR: false,disableSpins: true,disableWelcome: true,updatesLog: true,autoClose: 0},(base64Qrimg:any, asciiQR:any, attempts:any , urlCode:string) => {
            // console.log('Number of attempts to read the qrcode: ', attempts);
            // console.log('Terminal qrcode: ', asciiQR);
            // console.log('base64 image string qrcode: ', base64Qrimg);
            // console.log('urlCode (data-ref): ', urlCode);
            this.emit(ClientEvents.qr,urlCode)
          },
          // statusFind
          (statusSession:any, session:any) => {
            // console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
            // Create session wss return "serverClose" case server for close
            //  console.log('Session name: ', session);

            if(statusSession === 'successChat'){
                this.emit(ClientEvents.ready)
            }

          })  .then((client:any) => client).catch((err:any)=>console.log(err))

        

        // this.emit(ClientEvents.ready, this)

    }

    clientSaved = () => {

        this.emit(ClientEvents.saved, this)

    }

    clientSavingError = (err: Error | string) => {
        this.emit(ClientEvents.loadError, err)
    }




    wwjsParsedEvents() {

        // this.wwjsClient.on(ClientEvents.qr, (qr: string) => this.emit(ClientEvents.qr, qr))

        // this.wwjsClient.on(ClientEvents.ready, () => this.emit(ClientEvents.ready, this))

    }

    async getChats(): Promise<ChatFactory[]> {
        // throw new Error("Method not implemented.");

        // return (await this.wwjsClient.getChats()).map((chat: Chat) => {

        //     return (new ChatVenom(chat)) as ChatFactory

        // })

        return []

    }

    // on(event: 'qr', listener: (
    //     qr: string
    //  ) => void): this

    //  on(event: 'ready', listener: () => void): this

}

// export class ChatVenom implements ChatFactory {

//     constructor(private wwjschat: Chat) {
//         const { isGroup
//             , name
//             , timestamp
//             , id } = wwjschat
//         this.isGroup = isGroup
//         this.name = name
//         this.timestamp = timestamp
//         this.id = id.user

//     }
//     messages: MessageFactory[] | undefined;

//     isGroup: boolean;
//     name: string;
//     timestamp: number;
//     id: string;
//     async fetchMessages(searchOptions: SearchOptions): Promise<MessageFactory[]> {
//         return (await this.wwjschat.fetchMessages(searchOptions as MessageSearchOptions)).map((message: Message) => {

//             return new MessageVenom(message, this)
//         })
//     }
//     sendMessage(): Promise<MessageFactory> {
//         throw new Error("Method not implemented.");
//     }

// }
export class MessageVenom implements MessageFactory {

    constructor(private message: any ) {
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

    chat: ChatFactory|undefined


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
        return undefined 
        
        
        // await this.message.downloadMedia().then((media: MessageMediaWwjs) => {


        //     // const { } = media

        //     const data = media.data ?? undefined
        //     const mimetype = media.mimetype ?? undefined
        //     const filename = media.filename ?? undefined
        //     const filesize = media.filesize ?? undefined

        //     return { data, mimetype, filename, filesize } as MessageMedia

        // })
    }
    getChat = async (): Promise<ChatFactory> => {

        return this.chat!
    };

    getAckString(ack: number): string {

        return Object.entries(MessageAck).filter(state => state[1] === ack)[0][0]

    };

    // delete: (everyone?: boolean | undefined) => Promise<void>;

}