import fs from 'fs-extra'
import readline from 'readline'
import * as keypress from 'keypress.js';
import { Subject, concatMap, fromEvent, of, take, from, race, first, Observable, filter, timeout, catchError, firstValueFrom } from "rxjs"
import { ClientWwjs, MessageWwjs } from "./Wwjs/Wwjs"
import { Client, LocalAuth } from "whatsapp-web.js"
import { v4 as uuid } from 'uuid'
import { ClientEvents, ClientFactory } from "./Factories/interfaces/Client"
import { Spinner, createSpinner } from 'nanospinner'
import { TurnOnCliAction } from '@CampaignCreator/cli/Commands/Phones/classes/TurnOnPhone'
import { PhoneTypes } from './PhonesInfo'
import { CaptureInput } from '@CampaignCreator/cli/Commands/utils/CaptureInput';
import { Console } from 'console';
import { Bot } from '@CampaignCreator/database/classes/bot/interfaces/Bot';
import { MessageFactory } from './Factories/interfaces/Message.factory';

export interface PhoneAvailabe{

    bot:Bot,
    client:ClientFactory

}

export abstract class PhoneCreator {

    
    state$ : Observable<unknown> |undefined
    spiner: Spinner | undefined = undefined
    init$: Observable<unknown> | undefined
    ready$: Observable<unknown> | undefined
    reloaded$: Observable<unknown> | undefined
    saved$: Observable<unknown> | undefined
    saveError$: Observable<unknown> | undefined
    message$:Observable<unknown>|undefined

    abstract message(message:MessageFactory):void

    abstract reconnect(bdBot: Bot): Promise<unknown>

    abstract create(timeoutInSeconds:number): Promise<unknown> 

    abstract save(client: ClientFactory):void

    abstract qr(qr:string):void

    abstract init(client: ClientWwjs):void
    abstract initReload(client: ClientWwjs):void

    abstract ready(client: ClientWwjs):void
    abstract reloading(client: ClientWwjs):void


    abstract saved(client: ClientWwjs):void

    abstract cancelQR():void
}