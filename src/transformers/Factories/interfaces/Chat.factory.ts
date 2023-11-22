import { MessageFactory } from "./Message.factory"

export interface  SearchOptions{
    limit:number,
    fromMe?:boolean
}

export interface ChatFactory{

isGroup:boolean,
name:string,
timestamp: number,
id:string
messages:MessageFactory[]|undefined,

fetchMessages(searchOptions:SearchOptions): Promise<MessageFactory[]>
sendMessage()

}