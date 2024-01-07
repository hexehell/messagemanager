import MessageModel from "@CampaignCreator/database/Schemas/Message/Message.schema";
import { AbstractMessageData } from "../abstract/Message";
import { Message } from "../interfaces/DBMessage";

export class MessageMongo extends AbstractMessageData {
    getAffByID(id: string): Promise<Message | undefined> {
        throw new Error("Method not implemented.");
    }
    listAllByName(): Promise<Message[]> {
        throw new Error("Method not implemented.");
    }
    async create(message:Message): Promise<boolean> {

        return !!(await MessageModel.create(message))

    }
    findFirst(name: string): Promise<Message> {
        throw new Error("Method not implemented.");
    }
    update(old: Message, newName: Message): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(old: Message): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}