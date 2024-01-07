
import SponsorModel from "@CampaignCreator/database/Schemas/Sponsor/Sponsor.schema";

import { AbstractSponsorData } from "../abstract/Sponsor";
import { Sponsor } from "../interfaces/Sponsor";
import { Mongoose, Query } from "mongoose";
import { PhoneCreator } from "@CampaignCreator/transformers/PhoneCreator";
import SuburbModel, { Suburb } from "@CampaignCreator/database/Schemas/Suburb/Suburb.schema";

export class SponsorMongo extends AbstractSponsorData {
    getAffByID(id: string): Promise<Sponsor | undefined> {
        throw new Error("Method not implemented.");
    }
    async listAllByName(): Promise<Sponsor[]> {
        
       return  (await SponsorModel.find({}, { name: 1, _id: 1 })).map(({ _id, name }) => ({ id: _id.toHexString(), name })).map(sponsor=>({name:sponsor.name,id:sponsor.id} as Sponsor))

    }
    async create(name: string): Promise<boolean> {

      return !!(await SponsorModel.create({name:name}as Sponsor))

    }
    async findFirst(name: string): Promise<Sponsor> {

    return [(await SponsorModel.findOne({name:name}, { name: 1, _id: 1 }))]
        .map(sponsor => ({ id: sponsor?._id.toHexString(), name:sponsor?.name }as Sponsor))[0]
        
    }
    async update(old:Sponsor,newName:Sponsor): Promise<boolean> {

        return !!(await SponsorModel.updateOne({_id:old.id},{name:newName})).upsertedCount
    }
    async delete(old:Sponsor): Promise<boolean> {
        return !!(await SponsorModel.deleteOne({_id:old.id})).deletedCount
    }
   

}