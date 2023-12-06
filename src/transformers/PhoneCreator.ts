import fs from 'fs-extra'
import readline from 'readline'
import * as keypress from 'keypress.js';
import { Subject, concatMap, fromEvent, of, take, from, race, first, Observable, filter, timeout, catchError } from "rxjs"
import { ClientWwjs } from "./Wwjs"
import { Client, LocalAuth } from "whatsapp-web.js"
import { v4 as uuid } from 'uuid'
import { ClientEvents, ClientFactory } from "./Factories/interfaces/Client"
import { Spinner, createSpinner } from 'nanospinner'
import { TurnOnCliAction } from '@CampaignCreator/cli/Commands/Phones/classes/TurnOnPhone'
import { PhoneTypes } from './PhonesInfo'
import { CaptureInput } from '@CampaignCreator/cli/Commands/utils/CaptureInput';

export class PhoneCreator {

    spiner: Spinner | undefined = undefined

    init$: Observable<unknown> | undefined
    ready$: Observable<unknown> | undefined
    saved$: Observable<unknown> | undefined
    saveError$: Observable<unknown> | undefined



    cancel$: Observable<unknown> | undefined

    reconnectToClient({ action, phoneType }: TurnOnCliAction) {

        switch (phoneType) {

            case PhoneTypes.wwjs:

                return this.reconectWwjsClient$(action)

                break;

        }

        return of('')
    }

    reconectWwjsClient$ = (phonePathName: string) => {
        const savedPath = `${process.env.PATHTOPHONES}/wwjs`

        const strategy = new LocalAuth({ clientId: `${phonePathName.replace('session-', '')}`, dataPath: savedPath })

        const client = new Client({ authStrategy: strategy });

        const clientTransformed = new ClientWwjs(client, savedPath)

        this.init$ = fromEvent(clientTransformed, ClientEvents.init)
        this.ready$ = fromEvent(clientTransformed, ClientEvents.ready)

        this.init$.subscribe((client) => this.init(client as ClientWwjs))
        this.ready$.subscribe((client) => this.ready(client as ClientWwjs))
        this.saveError$ = fromEvent(clientTransformed, ClientEvents.saveError)


        client.initialize()


        const return$ = race(this.ready$, this.saveError$)

        return return$.pipe(first())
    }

    createWwjsClient$ = (timeoutInSeconds:number = 90) => {



        // '5216141378757'
        const strategy = new LocalAuth({ clientId: uuid(), dataPath: process.env.UNSAVEDPHONES })

        const client = new Client({ authStrategy: strategy });

        const savedPath = `${strategy.dataPath}\\session-${strategy.clientId}`

        const clientTransformed = new ClientWwjs(client, savedPath)




        // clientTransformed.on(ClientEvents.qr, qr => {




        // });

        const qr$ = fromEvent(clientTransformed, 'qr')

        const subsqr = qr$.subscribe((qr) => {

            const qrcode = require('qrcode-terminal');
            this.spiner?.success({ text: 'qr Recibido' })
            qrcode.generate(qr, { small: true });
        })


        this.init$ = fromEvent(clientTransformed, ClientEvents.init)
        this.ready$ = fromEvent(clientTransformed, ClientEvents.ready)
        this.saved$ = fromEvent(clientTransformed, ClientEvents.saved)
        this.saveError$ = fromEvent(clientTransformed, ClientEvents.saveError)






        this.cancel$ = new CaptureInput('a', true).inputCaptured()

        this.cancel$.subscribe(val => console.log(val))



        //  this.cancel$ =  fromEvent(rl,'line').pipe(concatMap((input:unknown)=>{

        //    this.spiner?.clear()
        //    subsqr.unsubscribe()
        //     // rl.close()

        //     clientTransformed.disconnect().catch()

        //     return of('')
        // }))

        //  this.cancel$.subscribe((val)=>console.log(val))

        const savedAndClosed$ = this.saved$.pipe(concatMap((client) => of(client ? this.spiner?.success({ text: 'telefono agregado' }) : '')), concatMap(() => of('')))

        const return$ = race(savedAndClosed$, this.saveError$)

        this.ready$.subscribe((client) => this.ready(client as ClientWwjs, true))
        this.init$.subscribe((client) => this.init(client as ClientWwjs, true))
        this.saved$.subscribe((client) => this.saved(client as ClientWwjs))

        clientTransformed.initialize()


        return return$.pipe(first()).pipe(timeout(timeoutInSeconds*1000),catchError(err=>{

            clientTransformed.disconnect().catch()

           return of('')
        }))



    }

    saveClient(client: ClientFactory) {


        const pathToSave = process.env.PATHTOPHONES! + `wwjs/session-${client.getPhone()}`

        try {

            fs.existsSync(pathToSave) && fs.rmSync(pathToSave, { force: true, recursive: true })
            fs.mkdirsSync(pathToSave)
            fs.copySync(client.whereIsRunning(), pathToSave)

        }
        catch (err) {

            client?.clientSavingError(typeof (err) === 'string' ? err : (err as Error).message)



        }

    }

    init = (client: ClientWwjs, create?: boolean) => {

        !!create ? this.spiner = createSpinner('esperando Qr...').start()
            : this.spiner = createSpinner('esperando reconexion...').start()
    }

    ready = (client: ClientWwjs, create?: boolean) => {



        createSpinner(`telefono conectado: ${client.getPhone()}`).success()

        if (!!create) {
            this.spiner = createSpinner(`Salvando...`).start()
            this.saveClient(client)
            client.clientSaved()
        }



    }
    saved = (client: ClientWwjs) => {
        this.spiner?.success({ text: 'Salvado' })


    }

    cancelQR = () => {

    }
}