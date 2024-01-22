import fs from 'fs-extra'

import {
    Subject,
    concatMap,
    fromEvent,
    of,
    take,
    from,
    race,
    first,
    Observable,
    filter,
    timeout,
    catchError,
    firstValueFrom
} from "rxjs"

import { v4 as uuid } from 'uuid'
import { Client, LocalAuth, WAState } from "whatsapp-web.js";
import { ClientEvents, ClientFactory } from "../Factories/interfaces/Client";
import { PhoneAvailabe, PhoneCreator } from "../PhoneCreator";
import { ClientWwjs } from "./Wwjs";
import { createSpinner } from 'nanospinner';
import { BotMongo } from '@CampaignCreator/database/classes/bot/classes/BotMongo';
import { Bot } from '@CampaignCreator/database/classes/bot/interfaces/Bot';
import { PhonesInfo } from '../PhonesInfo';
import { MessageFactory } from '../Factories/interfaces/Message.factory';
import {conf} from '@CampaignCreator/conf/configuration'


export class WwjsCreator extends PhoneCreator {



    BotBD = new BotMongo()
    clientId: string | undefined

    constructor() {
        super()
    }

    message(message: MessageFactory): void {
        throw new Error('Method not implemented.');
    }

    state = async (something: any) => {


        console.info(`state: ${something}`)

        if (!![WAState.PROXYBLOCK
            , WAState.SMB_TOS_BLOCK
            , WAState.TOS_BLOCK].find(evt => evt === something)) {

            console.error(something)

        }

    }

    reconnect = async ({ id, phone }: Bot) => {
        const savedPath = ``

        this.clientId = id

        const strategy = new LocalAuth({
            clientId: `${id}`
            // , dataPath: savedPath 
        })

        const client = new Client({ authStrategy: strategy });

        const clientTransformed = new ClientWwjs(client, savedPath)


        const qr$ = fromEvent(clientTransformed, 'qr')

        const subsqr = qr$.subscribe((qr) => {

            console.log('you shouldnt have done that!')

            clientTransformed.emit(ClientEvents.loadError, 'El qr se cargo despues de haber sido salvada la sesion')

            clientTransformed.disconnect().catch(err => console.log(err))

        })


        this.init$ = fromEvent(clientTransformed, ClientEvents.init)
        this.ready$ = fromEvent(clientTransformed, ClientEvents.ready)
        this.reloaded$ = fromEvent(clientTransformed, ClientEvents.reloaded)
        this.saveError$ = fromEvent(clientTransformed, ClientEvents.loadError)
        this.state$ = fromEvent(clientTransformed, ClientEvents.change_state)

        this.state$.subscribe((something: any) => this.state(something))

        this.init$.subscribe((client) => this.initReload(client as ClientWwjs))
        this.ready$.subscribe((client) => this.reloading(client as ClientWwjs))


        clientTransformed.initialize()


        const return$ = race(this.reloaded$, this.saveError$)

        return firstValueFrom(return$)
    }

    create = (timeoutInSeconds: number = 90) => {

        const savedPath = ``
        this.clientId = uuid()


        const strategy = new LocalAuth({
            clientId: this.clientId
            // , dataPath: process.env.UNSAVEDPHONES 
        })

        const client = new Client({ authStrategy: strategy });
        const clientTransformed = new ClientWwjs(client, savedPath)

        const qr$ = fromEvent(clientTransformed, ClientEvents.qr)
        this.init$ = fromEvent(clientTransformed, ClientEvents.init)
        this.ready$ = fromEvent(clientTransformed, ClientEvents.ready)
        this.saved$ = fromEvent(clientTransformed, ClientEvents.saved)
        this.saveError$ = fromEvent(clientTransformed, ClientEvents.loadError)

        this.message$ = fromEvent(clientTransformed, ClientEvents.message)





        const savedAndClosed$ = this.saved$.pipe(concatMap((client) => of(client ? this.spiner?.success({ text: 'telefono agregado' }) : '')), concatMap(() => of('')))

        const return$ = race(savedAndClosed$, this.saveError$).pipe(first()).pipe(timeout(timeoutInSeconds * 1000), catchError(err => {

            clientTransformed.disconnect().catch()

            return of('')
        }))

        const subsqr = qr$.subscribe((qr) => this.qr(qr as string))
        this.ready$.subscribe((client) => this.ready(client as ClientWwjs))
        this.init$.subscribe((client) => this.init(client as ClientWwjs))
        this.saved$.subscribe((client) => this.saved(client as ClientWwjs))

        clientTransformed.initialize()


        return firstValueFrom(return$)



    }

    save(client: ClientFactory) {


        const pathToSave = conf().Paths.toPhones + `wwjs/session-${client.getPhone()}`

        try {

            // fs.existsSync(pathToSave) && fs.rmSync(pathToSave, { force: true, recursive: true })
            // fs.mkdirsSync(pathToSave)
            // fs.copySync(client.whereIsRunning(), pathToSave)

        }
        catch (err) {

            client?.clientSavingError(typeof (err) === 'string' ? err : (err as Error).message)



        }

    }

    qr = (qr: string) => {

        const qrcode = require('qrcode-terminal');
        this.spiner?.success({ text: 'qr Recibido' })
        qrcode.generate(qr, { small: true });

    }

    init = (client: ClientWwjs) => {

        this.spiner = createSpinner('esperando Qr...').start()
    }

    initReload = (client: ClientWwjs) => {

        this.spiner = createSpinner('recargando...').start()
    }

    ready = (client: ClientWwjs, create?: boolean) => {



        createSpinner(`telefono conectado: ${client.getPhone()}`).success()


        this.spiner = createSpinner(`Salvando...`).start()
        this.save(client)
        client.clientSaved()



    }

    reloading(client: ClientWwjs, create?: boolean | undefined): void {
        const phone = client.getPhone()

        this.spiner?.success({ text: `telefono reCargado: ${phone}` })

        const phoneAvailableTouple = { bot: { id: this.clientId!, phone, botType: 'wwjs' }, client: client } as PhoneAvailabe

        PhonesInfo.PhonesAvailables.set(phone, phoneAvailableTouple)


        client.clientReloaded()
    }

    saved = (client: ClientWwjs) => {
        this.spiner?.success({ text: 'Salvado' })

        const phone = client.getPhone()

        this.BotBD.upsert({ id: this.clientId!, phone, botType: 'wwjs' })
        const phoneAvailableTouple = { bot: { id: this.clientId!, phone, botType: 'wwjs' }, client: client } as PhoneAvailabe



        PhonesInfo.PhonesAvailables.set(phone, phoneAvailableTouple)

    }

    cancelQR = () => {

    }

}