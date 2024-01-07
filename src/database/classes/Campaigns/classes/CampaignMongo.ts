import mongoose from 'mongoose'
import { CampaignDb, CampaignModel } from "@CampaignCreator/database/Schemas/Campaign/Campaign.Schema";
import { AbstractCampaignData } from "../abstract/AbstractCampaignData";
import { Campaign } from "../interfaces/Campaign";
import { MessageStatus } from "../enum/ScheduleState";
import { ScheduleState } from "../enum/ScheduleState";
import { ContactMessage } from "../interfaces/Contact";
import { CampaignView } from "../interfaces/CampaignView";

export class CampaignMongo implements AbstractCampaignData {
    async activate({id}: Campaign, activate: boolean): Promise<boolean> {
     

           return !!(await CampaignModel.updateOne({_id:id},{ state: !!activate? ScheduleState.CREATED:ScheduleState.DEACTIVATED }))

        
    }

    async getById(id: string): Promise<Campaign> {

        return [(await CampaignModel.findOne({ _id: id }).lean().exec())!].map((
            { _id,
                createDate,
                configuration,
                contacts,
                images,
                state, }: CampaignDb) => ({

                    id: _id.toHexString(),
                    createDate,
                    configuration,
                    contacts: contacts.map(contact => ({ ...contact, id: _id.toHexString() })),
                    images,
                    state,

                }))[0]

    }
    async listAllActive(): Promise<CampaignView[]> {


        return (await CampaignModel.find({"state":{"$ne":ScheduleState.DEACTIVATED}})).map(({ _id, createDate, configuration, contacts, state }: CampaignDb) => ({
            id: _id.toHexString(),
            state: state,
            createDate: createDate,
            name: configuration.campaignName,
            contacts: contacts.length,
            created: contacts.filter(contact => contact.status === MessageStatus.CREATED).length,
            inProgress: contacts.filter(contact => contact.status === MessageStatus.INPROGRESS).length,
            error: contacts.filter(contact => contact.status === MessageStatus.ERROR).length,
            completed: contacts.filter(contact => contact.status === MessageStatus.COMPLETED).length,
        } as CampaignView))


    }

    async listAll(): Promise<CampaignView[]> {

        return (await CampaignModel.find({})).map(({ _id, createDate, configuration, contacts, state }: CampaignDb) => ({
            id: _id.toHexString(),
            state: state,
            createDate: createDate,
            name: configuration.campaignName,
            contacts: contacts.length,
            created: contacts.filter(contact => contact.status === MessageStatus.CREATED).length,
            inProgress: contacts.filter(contact => contact.status === MessageStatus.INPROGRESS).length,
            error: contacts.filter(contact => contact.status === MessageStatus.ERROR).length,
            completed: contacts.filter(contact => contact.status === MessageStatus.COMPLETED).length,
        } as CampaignView))


    }

    async create(campaign: Campaign): Promise<boolean> {

        return !!(await CampaignModel.create(campaign))

    }

    async delete(campaign: Campaign): Promise<boolean> {
        return !!(await CampaignModel.deleteOne({ _id: campaign.id }))
    }


    async campaignInProgress({ id: id }: Campaign): Promise<boolean> {
        return !!(await CampaignModel.updateOne({ _id: id }, { state: ScheduleState.INPROGRESS }))
    }
    async campaignCompleted({ id: id }: Campaign): Promise<boolean> {

        const campaign = await this.getById(id!)

        if (campaign.state === ScheduleState.OVERDUE)
            return !!(await CampaignModel.updateOne({ _id: id }, { state: ScheduleState.COMPLETEDOVERDUE }))
        else
            return !!(await CampaignModel.updateOne({ _id: id }, { state: ScheduleState.COMPLETED }))

    }

    async campaignStartProcess({ id: id }: Campaign): Promise<boolean> {
        return !!(await CampaignModel.updateOne({ _id: id }, { state: ScheduleState.STARTPROCESS }))

    }
    async campaignOverdue({ id: id }: Campaign): Promise<boolean> {

        return !!(await CampaignModel.updateOne({ _id: id }, { state: ScheduleState.OVERDUE }))
    }
    // async campaignError({id}: Campaign): Promise<boolean> {
    //     return !!(await CampaignModel.updateOne({_id:id},{state:ScheduleState.}))
    // }


    async messageInProgress({ id: id, contacts }: Campaign, idMessage: string): Promise<boolean> {

        const dbCampaign = await CampaignModel.findById(id)


        if (!!!dbCampaign) return false

        const contact = dbCampaign?.contacts.find(contact => contact._id === idMessage)

        if (!!!contact) return false

        contact.status = MessageStatus.INPROGRESS

        return !!(await dbCampaign?.save())


        // return !!(await CampaignModel.updateOne({ _id: id }, { state: ScheduleState.COMPLETED }))
    }
    async messageCompleted({ id: id }: Campaign, idMessage: string): Promise<boolean> {
        const dbCampaign = await CampaignModel.findById(id)



        if (!!!dbCampaign) return false

        return (await !!dbCampaign.updateOne({
            $set: { "contacts.$[x].status": MessageStatus.COMPLETED }
        }, {
            arrayFilters: [{
                "x._id": idMessage
                // new mongoose.Types.ObjectId(idMessage) 
            }]
        }))

        //    return (!! await CampaignModel.updateOne({_id:new mongoose.Types.ObjectId(id)},{
        //         $set:{"contacts.$[x].status":MessageStatus.COMPLETED}
        //     }, {arrayFilters:[{
        //         "x._id": new mongoose.Types.ObjectId(idMessage) 
        //     }]}))



        // await CampaignModel.aggregate([
        //     {"$unwind":"$contacts"},
        //     {"$match":{"contacts.to":"5216141553808"}},
        //     {"$set":{"contacts.status":MessageStatus.COMPLETED}},
        //     {"$project":{"contacts.to":1,"contacts.message":1}}
        //   ])


        // const contact = dbCampaign?.contacts.find(contact => contact._id ===   (idMessage))

        // if (!!!contact) return false

        // contact.status = MessageStatus.COMPLETED

        // return !!(await dbCampaign?.save())
    }
    async messageError({ id: id }: Campaign, idMessage: string): Promise<boolean> {
        const dbCampaign = await CampaignModel.findById(id)

        if (!!!dbCampaign) return false

        const contact = dbCampaign?.contacts.find(contact => contact._id === idMessage)

        if (!!!contact) return false

        contact.status = MessageStatus.ERROR

        return !!(await dbCampaign?.save())
    }


}