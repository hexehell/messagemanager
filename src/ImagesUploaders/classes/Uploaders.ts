import { Uploader } from "../interfaces/uploader";

export class Uploaders {


    collection: Map<string, Uploader> = new Map()

    indexSelected: number = 0

    access: UploaderAccess = UploaderAccess.selectedOnly
    currentSelected: { alias: string, uploader: Uploader } | undefined

    constructor(private initialUploaders?: { alias: string, uploader: Uploader }[], private uploaderOptions?: UploaderOptions) {


        this.initialUploaders?.forEach(({alias,uploader}) =>this.add(alias,uploader))

        
        if (!!uploaderOptions) {

            const arrOfEntries = Array.from(this.collection.entries()).map(entry=>({alias:entry[0],uploader:entry[1]}))

            this.access = uploaderOptions.access??UploaderAccess.selectedOnly
            this.currentSelected = this.get(uploaderOptions.selected)? {alias:uploaderOptions.selected,uploader:this.get(uploaderOptions.selected)!}:arrOfEntries[0]??undefined
            
            // !!initialUploaders ? initialUploaders![0] : undefined

        }


    }




    getSelectedUploader = ():Uploader|undefined => {

        const arrOfEntries = Array.from(this.collection.entries()).map(entry=>({alias:entry[0],uploader:entry[1]}))

        switch (this.access) {
            case UploaderAccess.random:

                if (this.collection.size > 0) {

                    this.indexSelected = Math.floor(Math.random() * this.collection.size)

                    return arrOfEntries[this.indexSelected].uploader

                }


                break;
            case UploaderAccess.selectedOnly:

                if (!!this.currentSelected)
                    return this.collection.get(this.currentSelected.alias)

                break;
            case UploaderAccess.sequential:

                this.currentSelected =  arrOfEntries[this.indexSelected]

                this.indexSelected = this.collection.size-1 !== this.indexSelected?this.indexSelected+1:0

                return this.currentSelected?.uploader

                break;
        }

        return  arrOfEntries[this.indexSelected].uploader


    }

    setOptions = (uploaderOptions?: UploaderOptions) => this.uploaderOptions = uploaderOptions

    add(alias: string, uploader: Uploader) {

        this.collection.set(alias, uploader)
    }

    get(alias: string) {

       return this.collection.get(alias)
    }

    remove(alias: string) {
        this.collection.delete(alias)
    }
}

export enum UploaderAccess {
    random = 'random',
    sequential = 'sequiential',
    selectedOnly = 'selectedOnly'
}

export interface UploaderOptions {

    selected: string,
    access?: UploaderAccess

}