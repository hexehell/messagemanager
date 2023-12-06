import { ChatFactory } from "./Chat.factory"
import { ContactFactory } from "./Contact.factory"

export interface MessageQuery{

    ack?:MessageAck,
    author?:string
    body?:string,
    broadcast?:boolean,
    isStatus?:boolean,
    from?:string,
    to?: string
    fromMe?:boolean,
    hasMedia?:boolean,
    id?:string,
    vCards?:string[]
    timestamp?: number
    type?: MessageTypes
    orderId?: string
    title?: string
    description?: string

}

export interface MessageFactory{

    ack:MessageAck,
    author?:string,
    body:string,
    broadcast:boolean,
    isStatus:boolean,
    from:string,
    to: string,
    fromMe:boolean,
    hasMedia:boolean,
    id:string,
    vCards:string[]
    timestamp: number,
    type: MessageTypes,
    orderId: string,
    title?: string,
    description?: string,

    downloadMedia: () => Promise<MessageMedia|undefined>
    getChat: () => Promise<ChatFactory>

    getAckString (ack:number):string
}

export enum MessageAck{

    ACK_ERROR = -1,
    ACK_PENDING = 0,
    ACK_SERVER = 1,
    ACK_DEVICE = 2,
    ACK_READ = 3,
    ACK_PLAYED = 4,

}

export interface MessageSendOptions {
    /** Show links preview. Has no effect on multi-device accounts. */
    linkPreview?: boolean
    /** Send audio as voice message with a generated waveform */
    sendAudioAsVoice?: boolean
    /** Send video as gif */
    sendVideoAsGif?: boolean
    /** Send media as sticker */
    sendMediaAsSticker?: boolean
    /** Send media as document */
    sendMediaAsDocument?: boolean
    /** Send photo/video as a view once message */
    isViewOnce?: boolean
    /** Automatically parse vCards and send them as contacts */
    parseVCards?: boolean
    /** Image or videos caption */
    caption?: string
    /** Id of the message that is being quoted (or replied to) */
    quotedMessageId?: string
    /** Contacts that are being mentioned in the message */
    mentions?: ContactFactory[]
    /** Send 'seen' status */
    sendSeen?: boolean
    /** Media to be sent */
    media?: MessageMedia
    /** Extra options */
    extra?: any
    /** Sticker name, if sendMediaAsSticker is true */
    stickerName?: string
    /** Sticker author, if sendMediaAsSticker is true */
    stickerAuthor?: string
    /** Sticker categories, if sendMediaAsSticker is true */
    stickerCategories?: string[]
}

    /** Media attached to a message */
    export class MessageMedia {
        /** MIME type of the attachment */
        mimetype: string = ''
        /** Base64-encoded data of the file */
        data: string = ''
        /** Document file name. Value can be null */
        filename?: string | null
        /** Document file size in bytes. Value can be null. */
        filesize?: number | null

    }


    /** Message types */
    export enum MessageTypes {
        TEXT = 'chat',
        AUDIO = 'audio',
        VOICE = 'ptt',
        IMAGE = 'image',
        VIDEO = 'video',
        DOCUMENT = 'document',
        STICKER = 'sticker',
        LOCATION = 'location',
        CONTACT_CARD = 'vcard',
        CONTACT_CARD_MULTI = 'multi_vcard',
        REVOKED = 'revoked',
        ORDER = 'order',
        PRODUCT = 'product',
        PAYMENT = 'payment',
        UNKNOWN = 'unknown',
        GROUP_INVITE = 'groups_v4_invite',
        LIST = 'list',
        LIST_RESPONSE = 'list_response',
        BUTTONS_RESPONSE = 'buttons_response',
        BROADCAST_NOTIFICATION = 'broadcast_notification',
        CALL_LOG = 'call_log',
        CIPHERTEXT = 'ciphertext',
        DEBUG = 'debug',
        E2E_NOTIFICATION = 'e2e_notification',
        GP2 = 'gp2',
        GROUP_NOTIFICATION = 'group_notification',
        HSM = 'hsm',
        INTERACTIVE = 'interactive',
        NATIVE_FLOW = 'native_flow',
        NOTIFICATION = 'notification',
        NOTIFICATION_TEMPLATE = 'notification_template',
        OVERSIZED = 'oversized',
        PROTOCOL = 'protocol',
        REACTION = 'reaction',
        TEMPLATE_BUTTON_REPLY = 'template_button_reply',
        POLL_CREATION = 'poll_creation',
    }