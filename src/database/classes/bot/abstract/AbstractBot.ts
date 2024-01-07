import { Bot } from "../interfaces/Bot";

export abstract class AbstractBotData {

    constructor(){}


    abstract getBotById(id:string):Promise<Bot|undefined>

    abstract listAllByPhoneId():Promise<Bot[]>

    abstract create(suburb:Bot): Promise<boolean>;   
    abstract upsert(suburb:Bot):Promise<boolean>
    abstract delete(old:Bot):Promise<boolean>
}
