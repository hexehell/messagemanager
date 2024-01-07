import * as fs from 'fs'
import { CampaignCreator } from "./CampaignCreator"
import { Campaign, ContactMessage, ImageCampaign, MessageMap } from '../interfaces'
import { CampaignsInfo } from './CampaingsInfo'
import { CampaignScheduler, ScheduledRecord, SchedulerEventCallbacks } from './CampaignScheduler'
import { ClientFactory } from '@CampaignCreator/transformers/Factories/interfaces/Client'
import { MessageContent, MessageFactory, MessageMedia } from '@CampaignCreator/transformers/Factories/interfaces/Message.factory'
import { AbstractMessageData } from '@CampaignCreator/database/classes/Messages/abstract/Message'
import { MessageMongo } from '@CampaignCreator/database/classes/Messages/classes/MessageMongo'
import { Message } from '@CampaignCreator/database/classes/Messages/interfaces/DBMessage'
import { PhonesInfo } from '@CampaignCreator/transformers/PhonesInfo'
import { CampaignMongo } from '@CampaignCreator/database/classes/Campaigns/classes/CampaignMongo'
import { AbstractCampaignData } from '@CampaignCreator/database/classes/Campaigns/abstract/AbstractCampaignData'

export interface MessageInputManager {


    clients?: ClientFactory[],
    campaign: Campaign,
    messageData: AbstractMessageData,
    campaignData: AbstractCampaignData


}

export class SchedulerEventsManager implements SchedulerEventCallbacks {

    constructor(private params: MessageInputManager) { }

    start = async (scheduler: CampaignScheduler): Promise<void> => {
        console.log('start')


        await this.setCampaignStartProcess()
    }
    prepare = async (resume: ScheduledRecord[]): Promise<void> => {
        console.log('prepare')

        console.table(resume.map(record => (`${record.contact.to} || ${record.scheduledDate.toDateString()} - ${record.scheduledDate.toTimeString()}  `)))

    }
    ready = async (): Promise<void> => {
        console.log('ready')

        await this.setCampaignInProgress()
    }
    pause = async (): Promise<void> => {
        console.log('pause')
    }
    dispatch = async (): Promise<void> => {
        console.log('dispatch')
    }
    finish = async (): Promise<void> => {
        console.log('finish')

        await this.setCampaignCompleted()
    }
    overdue = async (): Promise<void> => {
        console.log('overdue')

        await this.setCampaignOverdue()
    }


    async setCampaignStartProcess() {


        await this.params.campaignData.campaignStartProcess(this.params.campaign)
    }

    async setCampaignOverdue() {

        await this.params.campaignData.campaignOverdue(this.params.campaign)

    }

    async setCampaignInProgress() {



        await this.params.campaignData.campaignInProgress(this.params.campaign)
    }

    async setCampaignCompleted() {


        await this.params.campaignData.campaignCompleted(this.params.campaign)
    }

    async setMessageError({ _id }: ContactMessage) {


        return await this.params.campaignData.messageError(this.params.campaign, _id!)


    }

    async setMessageInProgress({ _id }: ContactMessage) {


        return await this.params.campaignData.messageInProgress(this.params.campaign, _id!)
    }

    async setMessageCompleted({ _id }: ContactMessage) {


        return await this.params.campaignData.messageCompleted(this.params.campaign, _id!)
    }

    sendMessageAction = async (contactMessage: ContactMessage) => {

        await this.setMessageInProgress(contactMessage)

        const messageEventsController: MessageController = new MessageController(contactMessage, this.params)

        await messageEventsController.sendMessage()



    }
    sendMessageError = async (err: Error | string, contactMessage: ContactMessage) => {

        const { from, imagefield, message, messageMap, status, to } = contactMessage

        console.log(`${from} ${to} ${message} --- Error:${typeof err === 'string' ? err : err.message}`)

        await this.setMessageError(contactMessage)
    }
    sendMessageEnd = async (contactMessage: ContactMessage) => {
        const { from, imagefield, message, messageMap, status, to } = contactMessage

        console.log(`${from} ${to} ${message} --- Mensaje Enviado`)

        await this.setMessageCompleted(contactMessage)
    }



}

export class MessageController {

    message: string = ''


    constructor(private contact: ContactMessage, private params: MessageInputManager) {

        this.message = contact.message

        // this.prepareMessage()

    }

    
    selectClient(clients: ClientFactory[]): ClientFactory {


        return clients[Math.floor(Math.random() * clients.length)]
    }


    prepareMessage() {

        // this.contact.messageMap.reduce(({ key, value }: MessageMap) => {

        //     this.message = this.message.replace(`[${key}]`, value)

        //     return { key, value }
        // })

        this.contact.messageMap.forEach(messageMap => {

            this.message = this.message.replace(`[${messageMap.key}]`, messageMap.value)
        })


    }

    getMessage(): string {
        return this.message
    }

    getImage() {

        const imageCampaign: ImageCampaign[] = this.params.campaign.images.filter(image => image.name == this.contact.imagefield.replace('{', '').replace('}', ''))

        return {

            data: !!imageCampaign ? imageCampaign[0].image : '',
            mimetype: this.getImageExt()


        } as MessageMedia

    }

    getImageExt() {

        const imageCampaign = this.params.campaign.images.filter(image => image.name == this.contact.imagefield.replace('{', '').replace('}', ''))

        return !!imageCampaign ? imageCampaign[0].ext : ''

    }

    async sendMessage() {


        const { from, imagefield, to, message } = this.contact


        let clientSelected:ClientFactory|undefined 

        if(['','-','.',','].some(x=>x===from.trim())
            || from.length == 0){

                clientSelected = this.selectClient(this.params.clients!)

        }

        clientSelected = this.params.clients!.find(x => x.getPhone() ===from)



        if (!!clientSelected) {

            console.log(clientSelected.getPhone(),to, message)

            return true

            // if (!!imagefield) return this.sendImage(clientSelected)


            // this.sendText(clientSelected);
            //  await new Promise(resolve=>{
            //     setTimeout(() => {

            //         resolve(1)
            //     }, Math.floor(Math.random()*10000));
            //  })


        }
        else throw `Bot no encontrado ${from} ${to} ${this.getMessage()}`

    }

    async sendImage(client:ClientFactory) {

        const { to } = this.contact

        return this.saveOnDb(await client.sendMessage(to, this.getImage(), this.getMessage())!)
    }

    async sendText(client:ClientFactory) {
        const { to } = this.contact

        client.sendMessage(to, this.getMessage())

    }

    async saveOnDb(message: MessageFactory) {

        const messageDB = [message].map(({
            timestamp,
            ack,
            id,
            from,
            to,
            author,
            fromMe,
            hasMedia,
            body,
        }: MessageFactory) => ({
            timestamp: timestamp,
            ack: ack,
            id: id,
            from: from,
            to: to,
            author: author,
            fromMe: fromMe,
            hasMedia: hasMedia,
            body: body,

        } as Message))[0]

        messageDB.name = await message.getChat().then(chat => chat.name)
        messageDB.fromGroup = !!message.author

        return await this.params.messageData.create(messageDB)

    }
}

export class CampaignManager {

    constructor(private schedule?: CampaignScheduler) { }



    async createCampaingFromFile(excelPath: string) {

        const creator = new CampaignCreator()

        const campaign: Campaign | void = await creator.createCampaing(fs.readFileSync(excelPath)).catch(err => console.log(err))


        return !!campaign && CampaignsInfo.loadCampaing(campaign)




    }

    scheduleCampaign(campaign: Campaign) {

        const schedule = this.prepareCampaign(campaign, PhonesInfo.selectAvailablePhonesClients([]))

        this.schedule = schedule

        return !!schedule
    }

    async startProcess(): Promise<void> {

        this.schedule?.startProcess()

        await this.schedule?.waitProcessToFinish()

    }


    prepareCampaign(campaign: Campaign, clients: ClientFactory[]) {

        //Cambia el enfoque que aqui le estas mandando un cliente solamente y deben ser multiples
        const schedulerManager = new SchedulerEventsManager({ campaign: campaign, campaignData: new CampaignMongo(), messageData: new MessageMongo(), clients: clients })
        const scheduler = new CampaignScheduler(campaign, { runOnReady: true, schedulerEventCallbacks: schedulerManager })



        return scheduler
        // return scheduler.startProcess()



    }
}