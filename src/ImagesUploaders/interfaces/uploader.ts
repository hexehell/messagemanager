export interface Uploader{

    defBaseDir:string

    download(dirBase:string,filename:string):Promise<Buffer>
    upload(dirBase:string,filename:string,base64:string,mimetype?:string):Promise<string>
}