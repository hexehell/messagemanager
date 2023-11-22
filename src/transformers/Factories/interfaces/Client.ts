import { ChatFactory } from "./Chat.factory";

export interface Client{

 
    getChats(): Promise<ChatFactory[]>
}