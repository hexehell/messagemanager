import { Row as ExRow, ImageRange, Workbook, Worksheet } from 'exceljs'
import { MessageStatus, ScheduleState } from '@CampaignCreator/database/classes/Campaigns/enum/ScheduleState'
import { replaceAll } from '@CampaignCreator/CampaignCreator/classes/utils/utils'
import { Campaign } from '@CampaignCreator/database/classes/Campaigns/interfaces/Campaign'
import { Table, Row, Cell, IndexTable } from './utils/Table'
import { ContactMessage } from '@CampaignCreator/database/classes/Campaigns/interfaces/Contact'
import { MessageMap } from '@CampaignCreator/database/classes/Campaigns/interfaces/MessageMap'
import { ImageCampaign } from '@CampaignCreator/database/classes/Campaigns/interfaces/ImageCampaign'
import { Configuration, SendMode, TimeUnit } from '@CampaignCreator/database/classes/Campaigns/interfaces/Configuration'
import { CampaingEnviromentConfiguration } from '@CampaignCreator/CampaignCreator/interfaces/CampaignEnviromentConfiguration'


class CampaignCreator {


    constructor(public campaignConfiguration: CampaingEnviromentConfiguration = {

        SHEETCONTACTS: 'CONTACTS',
        SHEETCONF: 'CONF',
        SHEETIMAGES: 'IMAGES',
        FROMFIELD: 'FROM',
        TOFIELD: 'TO',
        MESSAGEFIELD: 'MESSAGE',
        IMAGEMESSAGEFIELD: 'IMAGE',
        IMAGEFIELD: 'IMAGE',
        IMAGENAME: 'NAME',
        LATENCYFIELD: 'LATENCY',
        UNITFIELD: 'UNIT',
        MODELATENCYFIELD: 'MODE',
        STARTDATEFIELD: 'STARTDATE',
        STARTTIMEFIELD: 'STARTTIME',
        ENDDATEFIELD: 'ENDDATE',
        ENDTIMEFIELD: 'ENDTIME',
        CAMPAIGNNAME: 'CAMPAIGNNAME',
        RAMPFIELD: 'RAMPFIELD'

    } as CampaingEnviromentConfiguration) { }

    async createCampaing(buffer: Buffer): Promise<Campaign> {

        const workbook = new Workbook();

        await workbook.xlsx.load(buffer);



        const tblContacts: Table | undefined = await this.getTableJustText(workbook.getWorksheet(this.campaignConfiguration.SHEETCONTACTS!)!)
        const tblImages: Table | undefined = await this.getTableWithImages(workbook.getWorksheet(this.campaignConfiguration.SHEETIMAGES!)!)
        const tblConf: Table | undefined = await this.getTableJustText(workbook.getWorksheet(this.campaignConfiguration.SHEETCONF!)!)

        let contacts: ContactMessage[] | undefined = !!tblContacts ? await this.createContacts(tblContacts) : undefined;
        const images: ImageCampaign[] | undefined = !!tblImages ? await this.createImages(tblImages) : undefined;
        const conf: Configuration | undefined = !!tblConf ? (await this.createConfiguration(tblConf))[0] : undefined;

        if (contacts?.length! > 100)
            conf!.executionRamp = 40

        // if(conf!.executionRamp === NaN)

        contacts = this.avoidContactRepetition(contacts!)


        return {

            configuration: conf,
            contacts,
            createDate: new Date(),
            images,
            state: ScheduleState.CREATED

        } as Campaign

        


    }

    avoidContactRepetition(contacts:ContactMessage[]){

        return contacts.filter((x, i, a) => a.indexOf(x) == i)
    }

    validateContacts(contacts: ContactMessage[]) {
        return !!!contacts.find(({ from, to, message, }: ContactMessage) => !(!!from && !!to && !!message))

    }

    validateImages(images: ImageCampaign[]) {

        images.map(({ name, image, ext }: ImageCampaign) => !(!!name && image && ext))

    }

    async createConfiguration(confTable: Table): Promise<Configuration[]> {

        return Array.from(confTable.rows.values()).map((row: Row) => {

            let [latencyInstruction, unit, mode, startDate, startTime, endDate, endTime, campaignName, executionRamp] =
                [
                    row.getCellByString(this.campaignConfiguration.LATENCYFIELD)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.UNITFIELD)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.MODELATENCYFIELD)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.STARTDATEFIELD)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.STARTTIMEFIELD)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.ENDDATEFIELD)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.ENDTIMEFIELD)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.CAMPAIGNNAME)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.RAMPFIELD)?.value as string ?? '15',
                ]


            const configuration = {
                behaviour: {
                    latency: this.getLatencyPeriods(latencyInstruction),
                    mode: this.getSendMode(mode),
                    unit: this.getTimeUnit(unit as TimeUnit)

                },
                startDate: this.getDateFromString(startDate, startTime),
                endDate: this.getDateFromString(endDate, endTime),
                campaignName: campaignName,
                executionRamp: parseInt(executionRamp) 

            } as Configuration

            return configuration

        })

    }

    
    processMessage(message:string,messageMap:MessageMap[]) {



        messageMap.forEach(messageMap =>{

            message = message.replace(`[${messageMap.key}]`,messageMap.value)
        })

        return message

    }

    async createContacts(contactTable: Table): Promise<ContactMessage[]> {

        return Array.from(contactTable.rows.values()).map((row: Row) => {

            let [from, to, image, message] = [
                row.getCellByString(this.campaignConfiguration.FROMFIELD)?.value as string ?? '',
                row.getCellByString(this.campaignConfiguration.TOFIELD)?.value as string ?? '',
                row.getCellByString(this.campaignConfiguration.IMAGEMESSAGEFIELD)?.value as string ?? '',
                row.getCellByString(this.campaignConfiguration.MESSAGEFIELD)?.value as string ?? '']

            const contact = {
                from: from,
                to: to,
                imagefield: image,
                message: message,
                status:MessageStatus.CREATED
            } as ContactMessage


            contact.messageMap = Array.from(row.Cells.entries())
                .filter(([, cell]: [IndexTable, Cell]) => ![from, to, image, message].includes(cell.value as string))
                .map(([index, cell]: [IndexTable, Cell]) => {

                    return {
                        key: index.name,
                        value: cell.value

                    } as MessageMap
                })

            contact.message = this.processMessage(contact.message,contact.messageMap) 
            
        


            return contact
        })


    }

    async createImages(imagesTbl: Table): Promise<ImageCampaign[]> {

        return Array.from(imagesTbl.rows.values()).map((row: Row) => {

            let [name,
                image,
                ext,] =
                [
                    row.getCellByString(this.campaignConfiguration.IMAGENAME)?.value as string ?? '',
                    row.getCellByString(this.campaignConfiguration.IMAGEFIELD)?.value as string ?? '',
                    row.getCellByString('EXT')!.value
                ]

            return {
                ext,
                image,
                name

            } as ImageCampaign


        })



    }

    getDateFromString(date: string, time: string): Date {




        const [day, month, year, hour, minute, second] = replaceAll(replaceAll(date, '-', ' '), '/', ' ')
            .split(/ /).concat(time.split(/:/)).map((part: string) => parseInt(part))

        let newDate: Date = new Date(
            year, month - 1, day, hour ?? 0, minute ?? 0, second ?? 0
        )

        return newDate
        // return new Date(year,month,day,hour,minute,second)

    }

    getLatencyPeriods(latency: string): number[] {

        return latency.replace('-', ' ').replace(';', ' ').split(/ /).map((period: string) => parseInt(period.trim()))

    }

    getTimeUnit(unit: string): TimeUnit | undefined {

        switch (unit.toLocaleLowerCase()) {

            case "seconds":
            case "second":
            case "segundos":
            case "segundo":
                return TimeUnit.second
                break;

            case "minute":
            case "minutes":
            case "minuto":
            case "minutos":
                return TimeUnit.minute
                break;

            case "hour":
            case "hours":
            case "hora":
            case "horas":
                return TimeUnit.hour
                break;

            case "day":
            case "days":
            case "dia":
            case "dia":
                return TimeUnit.day
                break;
            default:
                return undefined






        }
    }

    getSendMode(mode: string): SendMode | undefined {

        switch (mode.toLocaleLowerCase()) {

            case "random":
            case "aleatorio":
                return SendMode.random
                break;
            case "consecutive":
            case "consecutivo":
                return SendMode.consecutive
                break;
            case "nowait":
            case "sinespera":
                return SendMode.nowait

                break;
        }

    }

    async addHeaders(table: Table, sheet: Worksheet) {

        const columns: string[] = []

        const promise: Promise<any>[] = []

        sheet.getRows(1, 1)?.map(row => {
            row.eachCell({ includeEmpty: true }, ((cell, index) => {

                promise.push(new Promise(resolve => {

                    columns.push(cell.value ? cell.value.toString() : '')

                    resolve(1)
                }))
            }))
        })

        await Promise.all(promise)

        if (!table.HeadersBeenSet)columns.push('EXT') 


        

        table.addHeaderRow(columns)


    }

    async addTextCells(table: Table, sheet: Worksheet) {


        if (sheet.rowCount < 2) return

        sheet.getRows(2, sheet.rowCount - 1)?.map((row) => {

            const cells: string[] = []


            row.eachCell({ includeEmpty: true }, ((cell, index) => {


                cells.push(cell.value ? cell.value.toString() : '')






            }))



            table.fillRow(cells)

        })




    }

    async addImageCells(table:Table,sheet: Worksheet){

        const images: Array<{
            type: 'image',
            imageId: string;
            range: ImageRange;
        }> = sheet.getImages()

        const imagesRanges = images.map(({ range,imageId }: {
            type: 'image',
            imageId: string;
            range: ImageRange;
        }) => ({ id:imageId ,col: range.tl.nativeCol, row: range.tl.nativeRow }))

        // table.rows.

        imagesRanges.forEach(({id,col,row}:{col:number,row:number,id:string})=>{
            
            const {buffer,extension} = sheet.workbook.model.media.filter((media,index)=>index ===parseInt(id)).pop()!

            const imgBase64 = Buffer.from(buffer).toString('base64')

            
            table.setValueOn(row-1,col,imgBase64)
            table.setValueOn(row-1,col+1,extension)

        })




    }


    async getTableWithImages(sheet: Worksheet): Promise<Table | undefined> {

        const table: Table = Table.fromScratch()

        await this.addHeaders(table, sheet)

        await this.addTextCells(table, sheet)

        await this.addImageCells(table,sheet)


        return table ?? undefined
    }


    async getTableJustText(Sheet: Worksheet): Promise<Table | undefined> {

        const table: Table = Table.fromScratch()

        await this.addHeaders(table,Sheet)

        await this.addTextCells(table, Sheet)
        

        return table.rows.size > 0 ? table : undefined

    }




}



export { CampaignCreator }
