export enum TimeUnit{

    second='second',
    minute='minute',
    hour='hour',
    day='day',

}

export enum SendMode{
    random='random',
    consecutive='consecutive',
    nowait='nowait'

}

export interface SendBehaviour{

    latency:number[],
    unit:TimeUnit,
    mode:SendMode


}

export interface Configuration{

    behaviour:SendBehaviour,
    startDate:Date,
    endDate:Date,
    campaignName:string,
    executionRamp:number|undefined
    

}