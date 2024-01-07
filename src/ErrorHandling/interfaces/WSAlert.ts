import { ClientFactory } from "@CampaignCreator/transformers/Factories/interfaces/Client";

export interface WSAlert{
    client:ClientFactory,
    message:string,
    waState:string
}