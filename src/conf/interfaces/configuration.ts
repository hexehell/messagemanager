export interface ConfigurationFactory{

    Paths:{
        toPhones:string
    },
    Mongo:{
        connectionString:string
    },
    behaviour:{
        historyVerbose:boolean

    },
    Testing:{
        sending:boolean;
    }
}