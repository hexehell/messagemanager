import { EventEmitter } from 'events'

import { Observable, Subject, Subscription, catchError, delay, firstValueFrom, from, fromEvent, interval, map, merge, repeat, scan, switchMap, takeUntil, tap, timer } from 'rxjs'
import { v4 as uuid } from 'uuid'
import { Semaphore } from 'async-mutex'

import { Configuration, SendMode, TimeUnit } from '@CampaignCreator/database/classes/Campaigns/interfaces/Configuration';
import { Campaign } from '@CampaignCreator/database/classes/Campaigns/interfaces/Campaign';
import { ContactMessage } from '@CampaignCreator/database/classes/Campaigns/interfaces/Contact';



interface SchedulerOptions {
    runOnReady: boolean
    executionRamp?: number,
    schedulerEventCallbacks?: SchedulerEventCallbacks
}

interface SchedulerEventCallbacks {
    
    
    start: (scheduler:CampaignScheduler) => Promise<void>

    sendMessageAction: (contactMessage: ContactMessage) => Promise<void>
    sendMessageError: (Error: string | Error, contactMessage: ContactMessage) => Promise<void>
    sendMessageEnd: (contactMessage: ContactMessage) => Promise<void>

    prepare: (resume:ScheduledRecord[]) => Promise<void>
    ready: () => Promise<void>
    pause: () => Promise<void>
    dispatch: () => Promise<void>
    finish: () => Promise<void>
    overdue: () => Promise<void>

}

interface MessageProperties {

    contact: ContactMessage,
    callbacks: SchedulerEventCallbacks
    startDate?: Date
    scheduler: CampaignScheduler
    index: number

}

interface ResumeSchedule {
    prepare: number
    started: number
    ready: number
    dispatch: number
    message: number
    messageEnd: number
    messageError: number
    finished: number
    overdue: number

}

enum MessageState {

    scheduled = 'scheduled',
    running = 'running',
    onWait = 'onWait',
    finished = 'finished',
    error = 'error'

}

enum SchedulerEvents {

    prepare = 'prepare',
    ready = 'ready',
    started = 'started',
    dispatch = 'dispatch',
    paused = 'paused',
    message = 'message',
    messageEnd = 'messageEnd',
    messageError = 'messageError',
    finished = 'finished',
    overdue = 'overdue'
}

class SchedulerEventsEmitter {



    constructor(private scheduler: CampaignScheduler) { }

    start() {

        this.scheduler.emit(SchedulerEvents.started)

        
        this.scheduler.callbacks?.start(this.scheduler)

    }

    prepare(resume:ScheduledRecord[]) {

        this.scheduler.emit(SchedulerEvents.prepare)

        this.scheduler.callbacks?.prepare(resume)
    }

    ready() {
        this.scheduler.emit(SchedulerEvents.ready)

        this.scheduler.callbacks?.ready()
    }

    pause() {
        this.scheduler.emit(SchedulerEvents.paused)
    }

    dispatch() {
        this.scheduler.emit(SchedulerEvents.dispatch)

        this.scheduler.callbacks?.dispatch()
    }

    message(message: Message) {

        this.scheduler.emit(SchedulerEvents.message, message)

    }

    messageEnd(message: Message) {

        this.scheduler.emit(SchedulerEvents.messageEnd, message)

        this.scheduler.callbacks?.sendMessageEnd(message.properties.contact)
    }

    messageError(message: Message) {
        this.scheduler.emit(SchedulerEvents.messageError, message)

         this.scheduler.callbacks?.sendMessageError(message.error!,message.properties.contact)
    }

    finish() {

        this.scheduler.emit(SchedulerEvents.finished)

        this.scheduler.callbacks?.finish()
        
    }
    
    overdue() {
        this.scheduler.emit(SchedulerEvents.overdue)
        
        this.scheduler.callbacks?.overdue()
    }
}

export interface ScheduledRecord{
   contact:ContactMessage,
   scheduledDate:Date 
}

class SchedulerParams {

    ResumeSchedule:ScheduledRecord[] = []

    messagesScheduled: Message[] = []
    messagesDispatched: Map<string, Message> = new Map()
    messagesEnded: Message[] = []
    messagesError: Message[] = []
    messagesEndedSempahore: Semaphore = new Semaphore(1)
    messagesScheduledSempahore: Semaphore = new Semaphore(1)
    messagesDispatchedSempahore: Semaphore = new Semaphore(1)
    messagesErrorSempahore: Semaphore = new Semaphore(1)
    stop: boolean = false

    resume: ResumeSchedule | undefined
    debug: boolean = false

}

class Message {

    id: string = uuid()

    error?:string|Error|undefined

    subscription: Subscription | null = null

    state: MessageState = MessageState.scheduled

    get endDate(): Date {
        return this.properties.scheduler.campaign.configuration.endDate
    }

    get startDate(): Date{
        return this.properties.startDate!
    }

    constructor(public properties: MessageProperties) {

     }

    setState(messageState: MessageState) {

        this.state = messageState

    }




    run() {

        this.setState(MessageState.onWait)



        const overdue = () => {
            return Math.abs(new Date(new Date().getTime() + 60000).getTime() - this.endDate.getTime()) / (1000 * 60) >= 1
        }



        this.subscription = timer(this.properties.startDate!)
            .pipe(tap(() => overdue() ? this.properties.scheduler.events.overdue() : undefined))
            .pipe(
                tap(() => this.setState(MessageState.running)),
                tap(() => {
                    this.properties.scheduler.events.message(this)
                }),
                switchMap(() => {

                    return from(

                        this.properties.callbacks.sendMessageAction(this.properties.contact)
                    )



                }
                ),
                catchError((err: any, caught: Observable<any>) => {

                    const error = err as Error

                    this.setState(MessageState.error)

                    // this.properties.callbacks.sendMessageError(error,this.properties.contact)

                    return err

                })
            )
            .subscribe({

                error: () => {

                    this.properties.scheduler.events.messageError(this)


                },
                complete: () => {
                    this.setState(MessageState.finished)
                    this.properties.scheduler.events.messageEnd(this)
                }
            })

        return this.subscription

    }


}

class SchedulerActions {

    currentDate: undefined | Date;

    get params(): SchedulerParams {

        return this.scheduler.params
    }

    get campaing(): Campaign {
        return this.scheduler.campaign

    }


    get configuration(): Configuration {
        return this.scheduler.campaign.configuration
    }


    constructor(private scheduler: CampaignScheduler) { }

    indexLatency: number = 0

    async waitMe(awaitTime: number): Promise<number> {

        return new Promise((resolve) => {
            setTimeout(() => {

                resolve(1)

            }, awaitTime);
        })


    }

    calculateNextDate(currentDate: Date): Date {

        let timeToAdd: number = 0

        if (this.configuration.behaviour.mode === SendMode.random)
            this.indexLatency = Math.trunc(Math.random() * this.configuration.behaviour.latency.length)

        const currLatency = this.configuration.behaviour.latency[this.indexLatency]

        return new Date(this.addTime(currentDate, currLatency, this.configuration.behaviour.unit))




    }

    addTime(currentDate: Date, timeAdded: number, unit: TimeUnit): number {

        switch (unit) {
            case TimeUnit.day:
                return currentDate.getTime() + (timeAdded * 60 * 60 * 1000 * 24)

            case TimeUnit.hour:
                return currentDate.getTime() + (timeAdded * 60 * 60 * 1000)

            case TimeUnit.minute:
                return currentDate.getTime() + (timeAdded * 60 * 1000)

            case TimeUnit.second:
                return currentDate.getTime() + (timeAdded * 1000)

        }
    }

    nextDate(): Date {


        if (!!!this.currentDate) {
            this.currentDate = this.scheduler.campaign.configuration.startDate

        }
        else
            this.currentDate = this.calculateNextDate(this.currentDate)







        return this.currentDate
    }



    prepare(schedulerCallbacks: SchedulerEventCallbacks): boolean {




        this.scheduler.params.messagesScheduled = this.scheduler.campaign.contacts.map((contact: ContactMessage, index: number) => {


            return new Message({
                contact: contact,
                callbacks: schedulerCallbacks,
                startDate: this.nextDate(),
                scheduler: this.scheduler,
                index

            })

        })

        this.scheduler.params.ResumeSchedule = this.scheduler.params.messagesScheduled.map(record=>{

            return {
                contact:record.properties.contact,
                scheduledDate:record.startDate

            } as ScheduledRecord
        })

        this.scheduler.events.prepare(this.scheduler.params.ResumeSchedule )

        if (this.scheduler.params.messagesScheduled.length >= 1) {
            this.scheduler.events.ready()

            return true
        }

        return false

    }

    async dispatch() {
        this.scheduler.events.start()

        const awaitTime = this.calcExecutionRamp()

        let message: Message | undefined = await this.scheduler.actions.popMessageScheduled()



        while (!!message && !this.params.stop) {

            message.run()

            !!message && await this.scheduler.actions.pushIntoMessageDispatched(message)

            message = await this.scheduler.actions.popMessageScheduled()


            await this.waitMe(awaitTime)

        }

        this.scheduler.events.dispatch()




    }


    calcExecutionRamp() {

        return 1000 * (this.scheduler.options?.executionRamp ?? 0) / this.params.messagesScheduled.length


    }

    stop() {

        this.params.stop = true




    }

    async pushIntoMessageScheduled(message: Message) {

        await this.params.messagesScheduledSempahore.runExclusive(() => {

            this.params.messagesScheduled.push(message)
        })


    }

    async pushIntoMessageDispatched(message: Message) {

        await this.params.messagesDispatchedSempahore.runExclusive(() => {

            this.params.messagesDispatched.set(message.id, message)
        })

    }

    async pushIntoMessageEndedArray(message: Message) {

        await this.params.messagesEndedSempahore.runExclusive(() => {

            this.params.messagesEnded.push(message)
        })

    }

    async pushIntoMessageError(message: Message) {

        await this.params.messagesErrorSempahore.runExclusive(() => {

            this.params.messagesError.push(message)
        })

    }


    async popMessageScheduled(): Promise<Message | undefined> {

        return await this.params.messagesScheduledSempahore.runExclusive(() => {

            return this.params.messagesScheduled.pop()



        })


    }


    async deleteMessageDispatched(message: Message): Promise<boolean> {

        return await this.params.messagesDispatchedSempahore.runExclusive(() => {


            return !!this.params.messagesDispatched.delete(message.id)



        })

    }

    async popMessageEndedArray(): Promise<Message | undefined> {

        return await this.params.messagesEndedSempahore.runExclusive(() => {

            return this.params.messagesEnded.pop()
        })

    }

    async scheduleMessage(messageProperties: MessageProperties) {

        await this.scheduler.actions.pushIntoMessageScheduled(
            new Message(messageProperties)
        )

        if (this.scheduler.params.messagesScheduled.length == 1) {
            this.scheduler.events.ready()

        }

    }


    async monitorFinished() {

        const finish$ = new Subject()

        const interval$ = interval(1000)




        // const IsFinished$ = 


        this.IsFinished$().pipe(
            // switchMap(() => IsFinished$),
            map((finished: boolean) => {

                if (finished) {
                    this.scheduler.events.finish()
                    finish$.next('finish')

                }

            }

            )
            , delay(100)
            , repeat()
            , tap(() => { this.params.debug && console.log(`checked ${new Date()}`) })

        ).pipe(takeUntil(finish$)).subscribe()


        // const IsFinished$ = defer(() => promesa()).pipe(
        //     tap((finisha: boolean) => {

        //         console.log('finish', finisha)


        //     })
        //     , delay(1000)
        //     , retry()
        //     // ,switchMap(()=>iif(() => finished , of(true), of(false)))
        //     // ,map((finished:boolean) => {

        //     //     if (finished) {
        //     //         this.scheduler.triggers.finish()
        //     //         finish$.next('finish')

        //     //     }

        //     // })



        // )


        // IsFinished$.subscribe(
        //     ()=>{
        //         console.log('asd')
        //     }
        // )

        // const monitor$ = interval$.pipe(
        //     switchMap(() => {

        //     return    IsFinished$
        //     }), )

        // IsFinished$.subscribe()

        // IsFinished$.pipe(takeUntil(finish$)).subscribe()




        // monitor$.subscribe({
        //     complete: (finished) => finished ? this.scheduler.triggers.finish() : undefined
        // })

    }

    IsFinished$(): Observable<boolean> {

        return new Observable((subscribe) => {


            this.params.messagesErrorSempahore.runExclusive(() => {


                this.params.messagesEndedSempahore.runExclusive(() => {


                    if (this.params.messagesScheduled.length < 1 &&
                        this.params.messagesDispatched.size < 1) {



                        subscribe.next(!!!this.params.messagesEnded.find(message => message.state !== MessageState.finished)
                            || !!!this.params.messagesEnded.find(message => message.state !== MessageState.error))
                        subscribe.complete()

                    }

                    subscribe.next(false)
                    subscribe.complete()

                })


            })

        })





    }

    verbose(debug: boolean = true) {
        this.params.debug = debug
    }

    getResume(): ResumeSchedule {

        return this.params.resume!
    }

}

class CampaignScheduler extends EventEmitter {

    actions: SchedulerActions = new SchedulerActions(this)
    events: SchedulerEventsEmitter = new SchedulerEventsEmitter(this)
    params: SchedulerParams = new SchedulerParams()
    callbacks: SchedulerEventCallbacks | undefined

    constructor(public campaign: Campaign, public options?: SchedulerOptions) { super(); 
        
        this.callbacks = options?.schedulerEventCallbacks

        this.initEvents()
     }



    private init() {
        this.initOptions()
        this.initEvents()

    }

    private initOptions() {
        const defaultOptions: SchedulerOptions = {
            runOnReady: false, executionRamp: this.campaign.configuration.executionRamp

        }

        if (!!!this.options)
            this.options = defaultOptions

        if (!!!this.options.executionRamp)
            this.options.executionRamp = defaultOptions.executionRamp
    }

    private initEvents() {



        this.on(SchedulerEvents.message, (message: Message) => {
            this.params.debug && console.log(SchedulerEvents.message, message.properties.startDate, message.id)

        })

        this.on(SchedulerEvents.messageEnd, async (message: Message) => {
            this.params.debug && console.log(SchedulerEvents.messageEnd, message.properties.startDate, message.id)


            await this.actions.pushIntoMessageEndedArray(message)

            await this.actions.deleteMessageDispatched(message)

        })

        this.on(SchedulerEvents.messageError, async (message: Message) => {
            this.params.debug && console.log(SchedulerEvents.messageError, message.properties.startDate, message.id)


            await this.actions.pushIntoMessageError(message)

            await this.actions.deleteMessageDispatched(message)


        })


        this.on(SchedulerEvents.prepare, () => {

            this.params.debug && console.log(SchedulerEvents.prepare)

        })

        this.on(SchedulerEvents.ready, async () => {

            this.params.debug && console.log(SchedulerEvents.ready)

            this.options?.runOnReady && await this.actions.dispatch()


        })


        this.on(SchedulerEvents.started, () => {
            this.params.debug && console.log(SchedulerEvents.started)

            this.actions.monitorFinished()

        })

        this.on(SchedulerEvents.dispatch, () => {

            this.params.debug && console.log(SchedulerEvents.dispatch)

        })

        this.on(SchedulerEvents.finished, () => {
            this.params.debug && console.log(SchedulerEvents.finished)

        })

        this.on(SchedulerEvents.overdue, () => {
            this.params.debug && console.log(SchedulerEvents.overdue)

        })


        this.resumeEvents()

    }

    private resumeEvents() {

        let prepare = 0
        let started = 0
        let ready = 0
        let dispatch = 0
        let message = 0
        let messageEnd = 0
        let messageError = 0
        let finished = 0
        let overdue = 0

        const prepare$ = fromEvent(this, SchedulerEvents.prepare)
        const started$ = fromEvent(this, SchedulerEvents.started)
        const ready$ = fromEvent(this, SchedulerEvents.ready)
        const dispatch$ = fromEvent(this, SchedulerEvents.dispatch)
        const message$ = fromEvent(this, SchedulerEvents.message)
        const messageEnd$ = fromEvent(this, SchedulerEvents.messageEnd)
        const messageError$ = fromEvent(this, SchedulerEvents.messageError)
        const finished$ = fromEvent(this, SchedulerEvents.finished).pipe(scan((counter: any, evt: unknown) => counter + 1, 0), tap((counter: number) => { finished = counter }))
        const overdue$ = fromEvent(this, SchedulerEvents.overdue)



        const resumeWatcher = merge(
            prepare$.pipe(scan((counter: number, evt: unknown) => counter + 1, 0), tap((counter: number) => { prepare = counter })),
            started$.pipe(scan((counter: number, evt: unknown) => counter + 1, 0), tap((counter: number) => { started = counter })),
            ready$.pipe(scan((counter: number, evt: unknown) => counter + 1, 0), tap((counter: number) => { ready = counter })),
            dispatch$.pipe(scan((counter: number, evt: unknown) => counter + 1, 0), tap((counter: number) => { dispatch = counter })),
            message$.pipe(scan((counter: number, evt: unknown) => counter + 1, 0), tap((counter: number) => { message = counter })),
            messageEnd$.pipe(scan((counter: number, evt: unknown) => counter + 1, 0), tap((counter: number) => { messageEnd = counter })),
            messageError$.pipe(scan((counter: number, evt: unknown) => counter + 1, 0), tap((counter: number) => { messageError = counter })),
            finished$,
            overdue$.pipe(scan((counter: number, evt: unknown) => counter + 1, 0), tap((counter: number) => { overdue = counter })),
        ).pipe(takeUntil(finished$)).subscribe(
            {
                complete: () => {
                    this.params.resume = {
                        started
                        , ready
                        , dispatch
                        , message
                        , messageEnd
                        , messageError
                        , finished
                        , overdue
                    } as ResumeSchedule
                }
            }
        )


    }

    startProcess(schedulerEventCallbacks?: SchedulerEventCallbacks): boolean {

        const eventCallBacks = this.options?.schedulerEventCallbacks ?? schedulerEventCallbacks ?? undefined

        this.callbacks = eventCallBacks

        if (eventCallBacks) return this.actions.prepare(eventCallBacks)

        throw 'Scheduller should have a Manager'
    }

    async waitProcessToFinish(): Promise<void> {


        await firstValueFrom(fromEvent(this, SchedulerEvents.finished))


    }



}


export {
    SchedulerOptions
    , SchedulerEventCallbacks
    , MessageProperties
    , MessageState
    , SchedulerEvents
    , SchedulerEventsEmitter
    , SchedulerParams
    , Message
    , SchedulerActions
    , CampaignScheduler
}



