import { MessageMedia } from "whatsapp-web.js"
import { Uploaders } from "../../ImagesUploaders/classes/Uploaders"
import { MessageFactory } from "../../transformers/Factories/interfaces/Message.factory"

export class MediaManager {

    downloaded: boolean = false
    uploaded: boolean = false

    data?: string | undefined
    lilnk?: string | undefined

    mime?: string | undefined

    constructor(private message: MessageFactory, private uploaders: Uploaders, private uploadToServer: boolean) { }

    async getData(): Promise<boolean> {

        const media: MessageMedia | undefined = await this.message.downloadMedia()

        this.data = media?.data

        this.mime = !!media ? media.mimetype : undefined

        this.downloaded = !!this.data

        this.downloaded && this.uploadToServer && await this.uploadToImageServer()
        // .then((media: MessageMedia|undefined) => media)).data!

        return !!this.data

    }


    async uploadToImageServer(): Promise<boolean> {

        if(!!!MediaManager.supportedFormats(this.mime??''))return false

        const uploader = this.uploaders.getSelectedUploader()

        if (!!uploader) {

            this.lilnk = await uploader.upload(uploader.defBaseDir, this.message.id, this.data!, this.mime)
        }

        this.uploaded = !!this.lilnk

        return this.uploaded
    }

    static supportedFormats = (mimetype: string) => {
        switch (mimetype) {
            case 'image/gif': return 'gif'
            case 'image/jpeg': return 'jpg'
            case 'image/png': return 'png'

        }

        if (mimetype.startsWith('audio/ogg')) return 'oog'
    }
}