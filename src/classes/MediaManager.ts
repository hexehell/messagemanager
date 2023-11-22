import { MessageFactory } from "../transformers/Factories/interfaces/Message.factory"

export class MediaManager {

    downloaded: boolean = false
    uploaded: boolean = false

    data?: string | undefined

    lilnk?: string | undefined

    constructor(private message: MessageFactory) { }

    async getData(): Promise<boolean> {

        this.data = (await this.message.downloadMedia())?.data

        this.downloaded = !!this.data
        // .then((media: MessageMedia|undefined) => media)).data!

        return !!this.data

    }


    async uploadToImageServer(): Promise<boolean> {

        return true
    }
}