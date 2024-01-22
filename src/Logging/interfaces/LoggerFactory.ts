export interface LoggerFactory{

    log:(message:string)=>void
    logErr:(message:string)=>void
}