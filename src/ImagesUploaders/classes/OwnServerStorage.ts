import axios from "axios";
import { MediaManager } from "../../MediaManager/classes/MediaManager";
import { Uploader } from "../interfaces/uploader";
import { catchError, concatMap, from, lastValueFrom, of } from "rxjs";

export class OwnServerStorage implements Uploader {

    location: string = 'http://localhost'

    port: number = 3000

    constructor(private options?: OwnServerStorageOptions) {

        this.defBaseDir = `${this.options?.collection}`

        this.location = this.options?.urlLocation ?? this.location

        this.port = this.options?.port ?? this.port
    }

    defBaseDir: string;
    download(dirBase: string, filename: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    async upload(dirBase: string, filename: string, base64: string, mime?: string | undefined): Promise<string> {

        const uploadServicePath:string = 'images/upload'

        const ext: string = !!mime ? MediaManager.supportedFormats(mime) ?? '' : '';

        const imageDto:CreateImageDto = {
            collection:this.defBaseDir,
            data:base64,
            mimetype:mime!

        }

        const post$ = from(axios.post(`${this.location}:${this.port}/${uploadServicePath}`,imageDto ))

        const response$ = post$.pipe(concatMap((response) => {

            return of(response.data)
        }), catchError(err => {


            return of(undefined)
        }))


        const processingResponse$ = response$.pipe(concatMap((response: uploadResponse | undefined) => !!response ? response.status===StatusServerStatus.OK?of(response.url!):of(''):of('')), catchError(err => of('')))


        return await lastValueFrom(processingResponse$)
    }

}

export interface CreateImageDto {

    data:string
    mimetype:string
    collection:string

}

export interface OwnServerStorageOptions {

    collection: string,
    urlLocation?: string,
    port?: number

}

export interface uploadResponse {

    url?: string
    status: StatusServerStatus

}

export enum StatusServerStatus {
    OK = 1,
    ERR = -1
}