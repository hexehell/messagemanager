import { ScheduleState } from  "@CampaignCreator/database/classes/Campaigns/enum/ScheduleState"
import { Configuration } from  "@CampaignCreator/database/classes/Campaigns/interfaces/Configuration"
import { ContactMessage } from "@CampaignCreator/database/classes/Campaigns/interfaces/Contact"
import { ImageCampaign } from  "@CampaignCreator/database/classes/Campaigns/interfaces/ImageCampaign"

export interface Campaign{

    id?:string
    createDate:Date
    configuration:Configuration
    contacts:ContactMessage[]
    images:ImageCampaign[]
    state:ScheduleState
}