import { MessageMongo } from "@CampaignCreator/database/classes/Messages/classes/MessageMongo";
import { Message } from "@CampaignCreator/database/classes/Messages/interfaces/DBMessage";
import { ClientFactory } from "@CampaignCreator/transformers/Factories/interfaces/Client";
import { MessageFactory, MessageMedia } from "@CampaignCreator/transformers/Factories/interfaces/Message.factory";

class SenderUtils {

    static formatNumber(number:string){

        number= number.trim()

        number= /^\d+$/.test(number)?number:number.replace(/\D/g, '');
        number= number.startsWith('521')&& number.length ===13?number
                :number.length ===10? '521'.concat(number):'0000000000000'

        number= !!!number.endsWith('@c.us')?number.concat('@c.us') :number

        return number
    }
}

class DB{

    constructor(private sender:MessageSender){}

    async saveMessage(message:MessageFactory){

        const affBD = new MessageMongo()

        const messageDB = [message].map(({
            timestamp,
            ack,
            id,
            from,
            to,
            author,
            fromMe,
            hasMedia,
            body,
        }:MessageFactory)=>({
            timestamp:timestamp,
            ack:ack,
            id:id,
            from:from,
            to:to,
            author:author,
            fromMe:fromMe,
            hasMedia:hasMedia,
            body:body,

        } as Message))[0]

        messageDB.name = await message.getChat().then(chat=>chat.name)
        messageDB.fromGroup = !!message.author
        

        affBD.create(messageDB)
    }
}


class Test{

    constructor(private sender:MessageSender){}

    async sendTestMessage(number:string){

        number = SenderUtils.formatNumber(number)

        const message:MessageFactory|void = await this.sender.client.sendMessage(number,'Prueba').catch(err=>console.log(err))

        if(message){

            this.sender.DB.saveMessage(message)
           
        }
        
    }

    async sendImageTestMessage(number:string){

        number = SenderUtils.formatNumber(number)

       const message = await this.sender.client.sendMessage(number,{
            data: 'data:image/jpeg;base64,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'
            ,mimetype:'image/jpeg'
            
        }as MessageMedia).catch(err=>console.log(err))
    }

    async sendImageAndMessageTest(number:string){



        await this.sendTestMessage(number)
        await this.sendImageTestMessage(number)
    }

}

export class MessageSender{

    tester:Test = new Test(this)
    DB:DB = new DB(this)

    constructor(public client:ClientFactory){}


}

