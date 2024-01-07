import { Campaign } from "../interfaces/Campaign";
import { CampaignView } from "../interfaces/CampaignView";

export abstract class AbstractCampaignData {

    constructor(){}

    abstract create(campaign:Campaign):Promise<boolean>;

    abstract delete(campaign:Campaign):Promise<boolean>

    abstract activate(campaign:Campaign,activate:boolean):Promise<boolean>

    abstract getById(id:string):Promise<Campaign>

    abstract listAllActive():Promise<CampaignView[]>

    abstract campaignInProgress(campaign:Campaign):Promise<boolean>
    abstract campaignStartProcess(campaign:Campaign):Promise<boolean>
    abstract campaignOverdue(campaign:Campaign):Promise<boolean>
    abstract campaignCompleted(campaign:Campaign):Promise<boolean>
    // abstract campaignError(campaign:Campaign):Promise<boolean>

    abstract messageInProgress(campaign:Campaign,id:string):Promise<boolean>
    abstract messageCompleted(campaign:Campaign,id:string):Promise<boolean>
    abstract messageError(campaign:Campaign,id:string):Promise<boolean>
 
}
