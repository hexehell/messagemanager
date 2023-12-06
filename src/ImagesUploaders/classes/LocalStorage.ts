import fs from 'fs'
import { MediaManager } from "../../MediaManager/classes/MediaManager";
import { Uploader } from "../interfaces/uploader";

export class LocalStorage implements Uploader {

    constructor(private options: LocalStorageOptions) {

        this.defBaseDir = `${options.baseDir.startsWith('/')?options.baseDir:`${process.cwd()}/${options.baseDir}`}/${options.subDir??''}/`


    }

    defBaseDir: string = ''
    download(dirBase: string, filename: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    async upload(dirBase: string, filename: string, base64: string, mime?: string | undefined): Promise<string> {

        if(!!!(await this.existDirBase()))return ''




        const ext: string = !!mime ? MediaManager.supportedFormats(mime) ?? '' : '';

        const fileData = Buffer.from(base64,'base64')

        const fileName = `${filename}.${ext}`

        const filePath = `${dirBase}/${fileName}`

        const fileResult: Promise<string> = new Promise((resolve) => {

            fs.writeFile(filePath, fileData, (err) => {


                if (!!err) return resolve('')

                return resolve(filePath)

            })



        })


        return await fileResult


    }

    async existDirBase(): Promise<boolean> {
        if (!!!fs.existsSync(this.defBaseDir)) {

            return await new Promise((resolve) => {

                fs.mkdir(this.defBaseDir, (err) => {
                    if (err)return resolve(false)
                    

                    return resolve(true)
                });
            })



        }

        return true
    }



}

export interface LocalStorageOptions {

    baseDir: string,
    subDir?: string

}