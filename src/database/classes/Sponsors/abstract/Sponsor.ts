import { Sponsor } from "../interfaces/Sponsor";

export abstract class AbstractSponsorData {

    constructor(){}


    abstract getAffByID(id:string):Promise<Sponsor|undefined>

    abstract listAllByName():Promise<Sponsor[]>


    abstract create(name:string): Promise<boolean>;
    abstract findFirst(name:string):Promise<Sponsor>
    abstract update(old:Sponsor,newName:Sponsor):Promise<boolean>
    abstract delete(old:Sponsor):Promise<boolean>
}
