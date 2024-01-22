import { ConfigurationFactory } from "./interfaces/configuration";
import dotenv from 'dotenv'

let confObj: ConfigurationFactory | undefined = undefined

const init_dotenv = async () => {

    return dotenv.config()
}


const castBoolProp = (prop: string | undefined): boolean => {

    return !!prop && (prop?.toLocaleLowerCase() === 'true' || parseInt(prop ?? '') === 1)
}

export const conf = (): ConfigurationFactory => {

    if (!!!confObj) {
        init_dotenv()

        confObj = {
            Paths: {
                toPhones: process.env.PATHTOPHONES ?? ''
            },
            Mongo: {
                connectionString: process.env.MONGOCONNECTIONSTRING ?? ''
            },
            Testing: {
                sending: castBoolProp(process.env.SENDING)
            },
            behaviour: {
                historyVerbose: castBoolProp(process.env.HISTORYVERBOSE)
            }
        }
    }

    return confObj

} 
