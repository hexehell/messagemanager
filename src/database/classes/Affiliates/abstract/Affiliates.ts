import { Affiliate } from "../interfaces/Affiliate";

export abstract class AbstractAffiliateData {

    constructor(){}


    abstract getAffByID(id:string):Promise<Affiliate|undefined>

    abstract listAllByName():Promise<string[]>

    abstract listAllByPhoneNameId():Promise<{phone:string,name:string}[]>

    abstract create(newAff:Affiliate): Promise<boolean>;
    abstract createWithId(newAff:Affiliate): Promise<boolean>;
    abstract readAll():Affiliate[]
    abstract find(aff:Affiliate):Promise<Affiliate[]>
    abstract update(aff:Affiliate):Promise<boolean>
    abstract delete(aff:Affiliate):Promise<boolean>
}
