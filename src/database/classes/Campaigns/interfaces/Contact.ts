import { MessageMap } from "@CampaignCreator/database/classes/Campaigns/interfaces/MessageMap"
import { MessageStatus  } from "../enum/ScheduleState"

export interface ContactMessage{
    id?:string
    _id?:string
    from:string,
    to:string,
    message:string
    imagefield:string
    messageMap:MessageMap[]
    status:MessageStatus

}