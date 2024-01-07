import { AbstractDialog } from "../abstract/Dialog";
import {DialogType} from  '../interfaces/DialogType'
export class DialogNFD extends AbstractDialog{
    async showSingleOpenDialog(): Promise<string >{

        const dialog = require('node-file-dialog')
        const config={type:DialogType.open_file}

       return dialog(config)
        .then((file:string[]) => file.length>0?file[0]:'')
        .catch((err:any) => '')


    }
    async showMultipleOpenDialog(): Promise<string[] >{
        const dialog = require('node-file-dialog')
        const config={type:DialogType.open_files}

       return dialog(config)
        .then((files:string[]) => files)
        .catch((err:any) =>[])
    }
    async showSaveDialog(): Promise<boolean >{
        const dialog = require('node-file-dialog')
        const config={type:DialogType.save_file}

       return dialog(config)
        .then((files:string[]) => files)
        .catch((err:any) =>'')
    }
    async showDirectoryDialog(): Promise<boolean >{
        const dialog = require('node-file-dialog')
        const config={type:DialogType.directory}

       return dialog(config)
        .then((dir:string[]) => dir.length>0?dir[0]:'')
        .catch((err:any) =>'')
    }

}