import * as fs from 'fs-extra'
import { PhoneAvailabe, PhoneCreator } from './PhoneCreator'
import { Bot } from '@CampaignCreator/database/classes/bot/interfaces/Bot'
import { BotMongo } from '@CampaignCreator/database/classes/bot/classes/BotMongo'
import { CLIUtils } from '@CampaignCreator/cli/utils/CliUtils'
import { ClientFactory } from './Factories/interfaces/Client'

export enum PhoneTypes {
    wwjs = 'wwjs',
    venom = 'venom',
    meta = 'meta'
}

export class PhonesInfo {

    static PhonesAvailables:Map<string, PhoneAvailabe> = new Map()


    static ListPhonesTypes = () => {

        return Array.from(Object.keys(PhoneTypes))
    }

    static getPhonesfrom(phoneType: string) {

        return PhonesInfo.ListPhonesTypes()
            .filter(type => phoneType.toLocaleLowerCase() === type.toLocaleLowerCase())
            .map(type => `${process.env.PATHTOPHONES}/${type}`)
            .flat(1)
            .map(pathTo => fs.readdirSync(pathTo))
            .flat(1)

    }

    static async getBots(phoneType: string): Promise<Bot[]> {

        const botBD = new BotMongo()

        const savedPhones = (await botBD.listAllByPhoneId())

 

        return savedPhones.filter(bot => bot.botType === phoneType.toLocaleLowerCase())


    }


    static evaluateTypePath(type: string, path: string) {

        switch (type.toLocaleLowerCase()) {
            case 'wwjs': return PhonesInfo.IsWwjsPhone(path)
        }

        return false
    }

    static getAvailablePhoneTypes = () => {

        const listTypes: string[] = PhonesInfo.ListPhonesTypes()


        return fs.readdirSync(process.env.PATHTOPHONES!)
            .filter((file: string) => fs.statSync(`${process.env.PATHTOPHONES}/${file}`).isDirectory())
            .filter(dir => !!listTypes.find(type => type.toLocaleLowerCase() === dir.toLocaleLowerCase()))
            .filter(type => fs.readdirSync(`${process.env.PATHTOPHONES!}/${type}`)
                .filter(dir => PhonesInfo.evaluateTypePath(type, dir)).some(x => x)
            )



    }

    static selectAvailablePhonesClients(phones:string[]):ClientFactory[]{

       return phones.length !== 0?
                                   Array.from(PhonesInfo.PhonesAvailables.values())
                                  .map(({bot,client}:PhoneAvailabe) => ({phone:bot.phone, client:client}))
                                  .filter(({phone})=>!!phones.find(selected=>phone===selected))
                                  .map(phone=>phone.client)
                : Array.from(PhonesInfo.PhonesAvailables.values()).map(({client}:PhoneAvailabe) =>client)
    }

    static getAllAvailablePhonesForChoosing():string[]{

        return Array.from(PhonesInfo.PhonesAvailables.keys())
    }

    static getClientByPhone(phone:string):ClientFactory|undefined{

        return PhonesInfo.PhonesAvailables.get(phone)?.client
    }

    static getAvailablePhonesByType(type:string):PhoneAvailabe[]{

       return Array.from(PhonesInfo.PhonesAvailables.values()).filter(({bot}:PhoneAvailabe) => bot.botType === type )


    }

    static IsWwjsPhone(path: string) {

        return path.startsWith('session')
        //    && ( fs.readdirSync(path).map(dir=>true)).every()


    }

}