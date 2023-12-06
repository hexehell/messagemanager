import * as fs from 'fs-extra'
import { PhoneCreator } from './PhoneCreator'

export enum PhoneTypes{
    wwjs='wwjs',
    venom='venom',
    meta='meta'
}

export class PhonesInfo {

    static ListPhonesTypes = () => {

        return Array.from(Object.keys(PhoneTypes))
    }

    static getPhonesfrom(phoneType: string) {

        return PhonesInfo.ListPhonesTypes()
            .filter(type => phoneType.toLocaleLowerCase() === type.toLocaleLowerCase())
            .map(type => `${process.env.PATHTOPHONES}/${type}`)
            .flat(1)
            .map(pathTo => fs.readdirSync(pathTo))
            .flat(1)

    }


    static evaluateTypePath(type: string, path: string) {

        switch (type.toLocaleLowerCase()) {
            case 'wwjs': return PhonesInfo.IsWwjsPhone(path)
        }

        return false
    }

    static getAvailablePhoneTypes = () => {

        const listTypes: string[] = PhonesInfo.ListPhonesTypes()


        return fs.readdirSync(process.env.PATHTOPHONES!)
            .filter((file: string) => fs.statSync(`${process.env.PATHTOPHONES}/${file}`).isDirectory())
            .filter(dir => !!listTypes.find(type => type.toLocaleLowerCase() === dir.toLocaleLowerCase()))
            .filter(type => fs.readdirSync(`${process.env.PATHTOPHONES!}/${type}`)
                .filter(dir => PhonesInfo.evaluateTypePath(type, dir)).some(x => x)
            )



    }

    static IsWwjsPhone(path: string) {

        return path.startsWith('session')
        //    && ( fs.readdirSync(path).map(dir=>true)).every()


    }

}