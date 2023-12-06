import { SupportedFileInput, uploadFile } from "@uploadcare/upload-client";
import { Uploader } from "../interfaces/uploader";
import { UploadcareFile } from "@uploadcare/upload-client/dist/cjs/index.node.cjs";
import { catchError, concatMap, from, lastValueFrom, of } from "rxjs";
import axios from "axios";
import { MediaManager } from "../../MediaManager/classes/MediaManager";
import FormData from 'form-data'

export class UploadCare implements Uploader {

    // ed5ca75bcf21d3cb9ec9
    constructor(private options: UploadCareOptions) { }

    defBaseDir: string = '';
    download(dirBase: string, filename: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    async upload(dirBase: string, filename: string, base64: string, mime?: string): Promise<string> {
        // throw new Error("Method not implemented.");

        const ext: string = !!mime ? MediaManager.supportedFormats(mime) ?? '' : '';
        const fileData = Buffer.from(base64, 'base64')
        const fileName = `${filename}.${ext}`



        const formData = new FormData();
        formData.append('UPLOADCARE_PUB_KEY', this.options.apiKey);
        formData.append('UPLOADCARE_STORE', 'auto');
        // formData.append(fileName, `data:${mime};${base64}`);
        formData.append(fileName, fileData, { filename: fileName, contentType: mime });
        // formData.append(fileName, fileData);

        const post$ = from(axios.post('https://upload.uploadcare.com/base/', formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
                // ...formData.getHeaders()
            }
        }))


        const response$ = post$.pipe(concatMap((response) => {

            return of(response.data)
        }), catchError(err => {


            return of(undefined)
        }))




        const processingResponse$ = response$.pipe(concatMap((response: UploadCareResponse | undefined) => !!response ? response.filename || response.uuid ? of(response.uuid) : of('') : of('')), catchError(err => of('')))


        return await lastValueFrom(processingResponse$)
    }



}

export interface UploadCareResponse { filename: string, uuid: string }

export interface UploadCareOptions {
    apiKey: string

}
