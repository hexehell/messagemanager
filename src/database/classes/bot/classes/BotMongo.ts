import BotModel from "@CampaignCreator/database/Schemas/Bot/Bot.Schema";
import { AbstractBotData } from "../abstract/AbstractBot";
import { Bot } from "../interfaces/Bot";
import { UpdateQuery } from "mongoose";

export class BotMongo extends AbstractBotData {

    async getBotById(id: string): Promise<Bot | undefined> {

        return [(await BotModel.findOne({ id: id }, {
            id: 1,
            phone: 1,


        }))].map(bot => ({

            id: bot?.id,
            phone: bot?.phone

        } as Bot))[0]


    }
    async   listAllByPhoneId(): Promise<Bot[]> {

        return (await BotModel.find({}, { id: 1, phone: 1,botType:1 })).map(botbd => ({ id: botbd.id, phone: botbd.phone,botType:botbd.botType } as Bot))
    }
    async create({ id, phone }: Bot): Promise<boolean> {
        return !!(await BotModel.create({ id, phone }))
    }
    async upsert(bot:Bot): Promise<boolean> {

        const { id, phone, botType = 'wwjs' } = bot

        const filter = { phone };
        const update: UpdateQuery<Bot> = { id, phone, botType };
        const options = { upsert: true, new: true,setDefaultsOnInsert:true };

        return !!(await BotModel.findOneAndUpdate(filter, update, options).exec().catch(err => console.log(err)));


    }
    async delete({ phone }: Bot): Promise<boolean> {

        return !!(await BotModel.deleteOne({ phone: phone })).deletedCount

    }

}