import { CLIUtils } from "@CampaignCreator/cli/utils/CliUtils";
import { MessageStatus } from "../../database/classes/Campaigns/enum/ScheduleState";
import { Campaign } from "../interfaces";
import { CampaignManager } from "./CampaignManager";
import { CampaignScheduler } from "./CampaignScheduler";
import { ImageSize, translateSizeIntoString } from "./utils/utils";
import { Configuration } from "puppeteer";
import { CampaignMongo } from "@CampaignCreator/database/classes/Campaigns/classes/CampaignMongo";
import { CampaignView } from "@CampaignCreator/database/classes/Campaigns/interfaces/CampaignView";

export class CampaignsInfo {

    static Campaings: Map<string, Campaign> = new Map()

    static CampaignsController: Map<string, CampaignScheduler> = new Map()

    private static _Manager: CampaignManager | undefined

    static get Manager() {
        if (!!!CampaignsInfo._Manager)
            CampaignsInfo._Manager = new CampaignManager()

        return CampaignsInfo._Manager
    }

    static loadSchedule(schedule: CampaignScheduler) {

        return !!CampaignsInfo.CampaignsController.set(schedule.campaign.configuration.campaignName, schedule)

    }

    static loadCampaing(campaign: Campaign) {


        return !!CampaignsInfo.Campaings.set(`${campaign.createDate.getTime()}-${campaign.configuration.campaignName}`, campaign)

    }

    static contactPhones({ contacts }: Campaign) {



        const recieverPhones = contacts.map(contact => contact.to)
            .filter((phone, index, arr) => arr.indexOf(phone) === index)

        CLIUtils.showVerticalTable({
            Remitentes: recieverPhones,
        })
    }

    static contactBots({ contacts }: Campaign) {



        const botPhones = contacts.map(contact => contact.from)
            .filter((phone, index, arr) => arr.indexOf(phone) === index)
        const recieverPhones = contacts.map(contact => contact.to)

        CLIUtils.showVerticalTable({
            bots: botPhones,
        })
    }


    static confResume({ configuration }: Campaign) {

        const { behaviour, campaignName, startDate, endDate } = configuration

        const { latency, mode, unit } = behaviour

        const parsedConf = { campaignName, latency, mode, unit, startDate, endDate }



        CLIUtils.showHorizontalTable([parsedConf])


    }

    static imageResume({ images }: Campaign) {



        const sizeParsed = images.map(({ ext, image, name }) => ({ name: name, ext: ext, size: translateSizeIntoString(ImageSize(image)) }))


        CLIUtils.showHorizontalTable(sizeParsed)


    }

    static contactResume({ contacts }: Campaign) {


        const numberOfMessages = contacts.length

        const botPhones = contacts.map(contact => contact.from)
            .filter((phone, index, arr) => arr.indexOf(phone) === index)
        const recieverPhones = contacts.map(contact => contact.to)
            .filter((phone, index, arr) => arr.indexOf(phone) === index)

        CLIUtils.showVerticalTable({
            Cantidad: numberOfMessages,
            bots: botPhones,
            Remitentes: recieverPhones
        })
    }

    static async getSavedCampaign(id: string): Promise<Campaign> {

        const campaignMongo = new CampaignMongo()

        return await campaignMongo.getById(id)
    }

    static getLoadedCampaign(selection: string): Campaign {

        return Array.from(this.Campaings.entries()).find(entry => {

            const [name, campaing] = entry

            return selection === `${name} => id: ${campaing.id ?? 'sin salvar'} || status: ${campaing.state} ||  mensajes enviados: ${campaing.contacts.filter(message => message.status === MessageStatus.COMPLETED).length ?? 0}/${campaing.contacts.length} || mensajes error envio: ${campaing.contacts.filter(message => message.status === MessageStatus.ERROR).length ?? 0}`
        })?.[1]!
    }



    static async listSavedActiveCampaigns(): Promise<{ selection: string, id: string }[]> {

        const campaignMongo = new CampaignMongo()

        return (await campaignMongo.listAllActive()).map(({

            completed, contacts, createDate, created, error, id, inProgress, name, state

        }: CampaignView) => ({ selection: `${createDate.getTime()}-${name} => id: ${id} || status: ${state}`, id: id }))


    }

    static listLoadedCampaings(): string[] {

        return Array.from(CampaignsInfo.Campaings.entries()).map(entry => {

            const [name, campaing] = entry

            return `${name} => id: ${campaing.id ?? 'sin salvar'} || status: ${campaing.state} ||  mensajes enviados: ${campaing.contacts.filter(message => message.status === MessageStatus.COMPLETED).length ?? 0}/${campaing.contacts.length} || mensajes error envio: ${campaing.contacts.filter(message => message.status === MessageStatus.ERROR).length ?? 0}`
        })


    }

}