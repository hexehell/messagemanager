import { Suburb } from "../interfaces/Suburb";

export abstract class AbstractSuburbData {

    constructor(){}


    abstract getSuburbByID(id:string):Promise<Suburb|undefined>

    abstract listAllByName():Promise<Suburb[]>

    abstract create(suburb:Suburb): Promise<boolean>;
   
    abstract update(suburb:Suburb):Promise<boolean>
    abstract delete(old:Suburb):Promise<boolean>
}
