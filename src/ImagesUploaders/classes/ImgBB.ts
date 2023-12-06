import {URLSearchParams} from 'url'
import axios from 'axios';
import { catchError, concatMap, from,lastValueFrom,of } from 'rxjs';
import { Uploader } from "../interfaces/uploader";


export class ImgBB implements Uploader{


    constructor(private options:ImgBBOptions){}

    defBaseDir: string ='';

    download(dirBase: string, filename: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    async upload(dirBase: string, filename: string, base64: string,mimetype?:string): Promise<string> {

        
        const formData = new URLSearchParams();
        formData.append('image', base64);

        const post$ = from(axios.post(this.options.url??'https://api.imgbb.com/1/upload', formData, {
            params: {
                key: this.options.apiKey,
                name: filename

            },
        }))
        
        const response$ = post$.pipe(concatMap((response)=> {
          return of(new ImgbbImageResponse(response.data))
        }),catchError(err=>{
          return  of(undefined)
        }))


        const processingResponse$ = response$.pipe(concatMap((response:ImgbbImageResponse|undefined)=>!!response?response.success?of(response.data.url):of(''):of('')),catchError(err=>of('')))


        return await lastValueFrom(processingResponse$)

    }

}   

export interface ImgBBOptions{
    url?:string
    apiKey:string
}


interface ImgbbImage {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  }
  
  interface ImgbbData {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: ImgbbImage;
    thumb: ImgbbImage;
    medium: ImgbbImage;
    delete_url: string;
  }
  
  interface ImgbbResponse {
    data: ImgbbData;
    success: boolean;
    status: number;
  }
  
 export class ImgbbImageResponse {
    private readonly _data: ImgbbData;
    private readonly _success: boolean;
    private readonly _status: number;
  
    constructor(response: ImgbbResponse) {
      this._data = response.data;
      this._success = response.success;
      this._status = response.status;
    }
  
    get data(): ImgbbData {
      return this._data;
    }
  
    get success(): boolean {
      return this._success;
    }
  
    get status(): number {
      return this._status;
    }
  }
  