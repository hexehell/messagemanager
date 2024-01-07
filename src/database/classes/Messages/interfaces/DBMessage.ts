export interface Message{

    timestamp: number,
    ack: number,
    name: string
    id: string,
    from: string | undefined,
    to: string | undefined,
    author: string | undefined
    fromMe: boolean,
    fromGroup: boolean
    hasMedia: boolean
    body: string
    link?:string
}