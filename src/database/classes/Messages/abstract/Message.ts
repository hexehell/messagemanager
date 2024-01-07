import { Message } from "../interfaces/DBMessage";

export abstract class AbstractMessageData {

    constructor(){}


    abstract getAffByID(id:string):Promise<Message|undefined>

    abstract listAllByName():Promise<Message[]>


    abstract create(message:Message): Promise<boolean>;
    abstract findFirst(name:string):Promise<Message>
    abstract update(old:Message,newName:Message):Promise<boolean>
    abstract delete(old:Message):Promise<boolean>
}
