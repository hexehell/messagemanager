import { Subject, fromEvent, takeUntil } from "rxjs";
import { WSAlert } from "../interfaces/WSAlert";
import { UnexpectedError } from "../interfaces/UnexpectedError";
import { ClientFactory } from "@CampaignCreator/transformers/Factories/interfaces/Client";


export class ErrorHandling {

    WSBLOCK: Subject<WSAlert> = new Subject()
    UnexpectedError: Subject<UnexpectedError> = new Subject()


    // fromEvent<{ err: Error, origin: string }>(process, 'uncaughtException')
    UnexpectedBreaker: Subject<boolean> = new Subject()
    lastError: Date | undefined
    errorCounter: number = 0
    errorConsecutiveLimit: number = 3
    errorConsecutiveIntervalSeconds = 10;

    private constructor() {

        this.processUnhandledEventDeclaration()
        this.handleUnexpected()
        this.handleUnexpectedBreaker()

    }

    private static instance: ErrorHandling | undefined;

    static get ErrorHandlingInstance() {

        if (!!!ErrorHandling.instance)
            ErrorHandling.instance = new ErrorHandling()

        return ErrorHandling.instance

    }


    emitWSAlert( client:ClientFactory,message: string, state: string) {

        return this.WSBLOCK.next({client, message, waState: state } as WSAlert)
    }


    processUnhandledEventDeclaration() {
        process.on('uncaughtException', (err: Error, origin: string) => {

            this.UnexpectedError.next({ err, origin })
        })
    }

    handleWsAlert() {
        this.WSBLOCK.subscribe()
    }

    handleUnexpected() {

        this.UnexpectedError
            .pipe(

                takeUntil(this.UnexpectedBreaker)
            )
            .subscribe({
                next: (val) => {

                    console.log(val.err.message)
                },

                complete: () => {

                    console.error('Major.... im burning up!!!! ')
                     process.exit(1)
                }
            })
    }

    handleUnexpectedBreaker() {

        this.UnexpectedError.subscribe({
            next: () => {

                if (!!!this.lastError){
                    this.lastError = new Date()

                    this.errorCounter++;
                }
                else if (Math.floor((new Date().getTime() - this.lastError.getTime()) / 1000) < this.errorConsecutiveIntervalSeconds)
                    this.errorCounter++;
                else
                    this.errorCounter = 1
                
                this.lastError = new Date()

                console.log(this.errorCounter)

                if (this.errorConsecutiveLimit < this.errorCounter)
                    return this.UnexpectedBreaker.next(true)






            }
        })

    }









}