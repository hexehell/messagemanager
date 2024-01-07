
import AffiliateModel from "@CampaignCreator/database/Schemas/Affiliate/Affiliate.schema";

import   SponsorModel, { Sponsor } from "@CampaignCreator/database/Schemas/Sponsor/Sponsor.schema";
import { AbstractAffiliateData } from "../abstract/Affiliates";
import { Affiliate } from "../interfaces/Affiliate";
import mongoose, { Mongoose, Query } from "mongoose";
import { PhoneCreator } from "@CampaignCreator/transformers/PhoneCreator";
import SuburbModel, { Suburb } from "@CampaignCreator/database/Schemas/Suburb/Suburb.schema";
import { SponsorMongo } from "../../Sponsors/classes/SponsorMongo";

export class AffiliateMongo extends AbstractAffiliateData {
   
    async getAffByID(id: string): Promise<Affiliate|undefined> {


       let sponsor =  SponsorModel
       let suburb = SuburbModel

       const Aff = await AffiliateModel.findOne({_id:id})
       .populate<{sponsor:Sponsor}>({ path: 'sponsor', model: 'Sponsor' })
       .populate<{suburb:Suburb}>({ path: 'suburb', model: 'Suburb' })
       .catch(err=>console.log(err))


       

       

      
       return Aff? {
        
         name:Aff.name
        ,phone:Aff.phone
        ,marital: Aff.marital
        ,kids:Aff.kids
        ,birthDate:Aff.birthDate
        ,relation:Aff.relation
        ,active:Aff.active
        ,sponsor:Aff.sponsor.name
        ,suburb:Aff.suburb.colonia
        ,id:Aff._id.toHexString()


       } as Affiliate :undefined
         
    }
    async listAllByPhoneNameId(): Promise<{ id:string; phone: string; name: string; }[]> {
        return (await AffiliateModel.find({}, { name: 1, phone: 1, _id: 1 })).map(({ _id, name, phone }) => ({ id: _id.toHexString(), name, phone }))
    }


    async listAllByName(): Promise<string[]> {


        return (await AffiliateModel.find({}, { name: 1, _id: 0 })).map(x => x.name)

    }

    async find({
        
        name,
        phone,
        marital,
        kids,
        birthDate,
        suburb,
        sponsor,
        relation,
        active,


    }:Affiliate): Promise<Affiliate[]> {
        const sponsorFrom = await new SponsorMongo().findFirst(name)

        const suburbFrom = await new SponsorMongo().findFirst(name)

        return (await AffiliateModel.find({
            name:name,
            phone:phone,
            marital:marital,
            kids:kids,
            birthDate:birthDate,
            relation:relation,
            active:active,
            suburb: mongoose.Types.ObjectId.createFromHexString(suburbFrom.id!) ,
            sponsor:mongoose.Types.ObjectId.createFromHexString(sponsorFrom.id!),
        },{
            _id:1,
            name:1,
            phone:1,
            marital:1,
            kids:1,
            birthDate:1,
            relation:1,
            active:1,
            suburb:1,
            sponsor:1,
        })
       .populate<{sponsor:Sponsor}>({ path: 'sponsor', model: 'Sponsor' })
       .populate<{suburb:Suburb}>({ path: 'suburb', model: 'Suburb' })
       
        ).map(Aff=>({

             name:Aff.name
            ,phone:Aff.phone
            ,marital: Aff.marital
            ,kids:Aff.kids
            ,birthDate:Aff.birthDate
            ,relation:Aff.relation
            ,active:Aff.active
            ,sponsor:Aff.sponsor.name
            ,suburb:Aff.suburb.colonia
            ,id:Aff._id.toHexString()

        }))
        


    }

    createWithId(newAff: Affiliate): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async create({

        name,
        phone,
        marital,
        kids,
        birthDate,
        suburb,
        sponsor,
        relation,
        active,


    }:Affiliate): Promise<boolean> {

        const sponsorData = new SponsorMongo()

        const sponsorFrom = await sponsorData.findFirst(name)

        const suburbData = new SponsorMongo()

        const suburbFrom = await suburbData.findFirst(name)

        return !!(await AffiliateModel.create({
            name:name,
            phone:phone,
            marital:marital,
            kids:kids,
            birthDate:birthDate,
            relation:relation,
            active:active,
            suburb: mongoose.Types.ObjectId.createFromHexString(suburbFrom.id!) ,
            sponsor:mongoose.Types.ObjectId.createFromHexString(sponsorFrom.id!),
        }))

    }

    readAll(): Affiliate[] {



        // throw new Error("Method not implemented.");
        // const q:Query =  AffiliateModel.find()

        return []
    }

    async update({
        id,
        name,
        phone,
        marital,
        kids,
        birthDate,
        suburb,
        sponsor,
        relation,
        active,


    }:Affiliate): Promise<boolean> {


        const sponsorFrom = await new SponsorMongo().findFirst(name)

        const suburbFrom = await new SponsorMongo().findFirst(name)

        return !!(await AffiliateModel.updateOne({_id:id},{
            name:name,
            phone:phone,
            marital:marital,
            kids:kids,
            birthDate:birthDate,
            relation:relation,
            active:active,
            suburb: mongoose.Types.ObjectId.createFromHexString(suburbFrom.id!) ,
            sponsor:mongoose.Types.ObjectId.createFromHexString(sponsorFrom.id!),
        }))

    }

    async delete(aff:Affiliate): Promise<boolean> {

        return !!(await SponsorModel.deleteOne({_id:aff.id})).deletedCount
    }

}