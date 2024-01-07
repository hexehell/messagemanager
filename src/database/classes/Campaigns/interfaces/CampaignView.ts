import {ScheduleState} from '@CampaignCreator/database/classes/Campaigns/enum/ScheduleState'

export interface CampaignView{
    id:string,
    createDate:Date,
    name:string
    contacts:number
    created:number,
    inProgress:number,
    error:number,
    completed:number,
    state:ScheduleState
    
}