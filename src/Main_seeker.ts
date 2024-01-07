import { Client, LocalAuth } from "whatsapp-web.js";
import { ClientWwjs } from './transformers/Wwjs/Wwjs'
import { MessageOptions, SaveMessage, Seeker } from "./Seeker/classes/Seeker";
import { concatMap, take, toArray, from, concat, tap, of, distinct, scan, combineLatest, last, map, firstValueFrom } from "rxjs";
import { MessageFactory } from "./transformers/Factories/interfaces/Message.factory";
import { ChatFactory } from "./transformers/Factories/interfaces/Chat.factory";
import { UploaderAccess, UploaderOptions, Uploaders } from "./ImagesUploaders/classes/Uploaders";
import { ImgBB } from "./ImagesUploaders/classes/ImgBB";
import { UploadCare } from "./ImagesUploaders/classes/UploadCare";
import { LocalStorage } from "./ImagesUploaders/classes/LocalStorage";
import { OwnServerStorage } from "./ImagesUploaders/classes/OwnServerStorage";

const main = async () => {

    // const palindromo =  (str:string)=>{

    //     const strlower = Array.from(str.toLocaleLowerCase()).filter(char=>char!==' ').join('')
    //     if(strlower.length<3)return false

    //     for(let i=0;i<strlower.length/2;i++)
    //         if(strlower[i]!==strlower[strlower.length-1-i]) return false

    //         return true
    // }

    // const palabra = 'anita lava la tinae'

    // console.log(`${palabra} ${palindromo(palabra)?'es':'no es'} un palindromo`)

    // process.exit(0)

    const qrcode = require('qrcode-terminal');

    const client = new Client({ authStrategy: new LocalAuth({ clientId: "client-one" }) });

    const clientTransformed = new ClientWwjs(client,'')


    client.on('qr', qr => {
        console.log(qr)
        qrcode.generate(qr, { small: true });
    });



    client.on('ready', async () => {

        console.log('------------------------------------------------')

        // const imageUploaders = new Uploaders([
        //     // {
        //     //     alias: "test1", uploader: new ImgBB({
        //     //         apiKey: "031cb6405d8add7408208e2a7d297ffd",
        //     //         url: 'https://ibb.co/album/yh6sq7'
        //     //     })
        //     // },
        //     // {
        //     //     alias: 'imgbb', uploader: new ImgBB({
        //     //         apiKey: "3a836951ae8ef991c1c443ea526fbb0a",
        //     //     })
        //     // },
        //     // {
        //     //     alias:'uploadCare', uploader: new UploadCare({
        //     //         apiKey:'956fffcb8dbc99dc0ca4'

        //     //     })
        //     // },
        //     // {
        //     //     alias:'local', uploader: new LocalStorage({
        //     //         baseDir:'images',

        //     //     })
        //     // }
        //     {
        //         alias:'OwnImageServer',
        //         uploader: new OwnServerStorage({
        //             collection:'test'
        //         })
        //     }
        // ],{access:UploaderAccess.random} as UploaderOptions)

        // const seeker = new Seeker(clientTransformed, imageUploaders)

        // console.log(await seeker.actions.getAllSaveMessages({getMedia:true,uploadToServer:true,Query:{from:'120363040316141455@g.us',hasMedia:true}}))



        // console.log(await seeker.actions.getAllContactMessages())

        console.log('------------------------------------------------')

        // const allChats$ = seeker.rx.getAllChats$();

        // const contactChats$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => seeker.rx.getAllContactChats$(chats)))
        // const groupChats$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => seeker.rx.getAllGroupChats$(chats)))

        // const nonContactChat$ = allChats$.pipe(concatMap((chats: ChatFactory[]) => seeker.rx.getAllNonGroupNonContactChats$(chats)))

        // const groupSaveMessagesEach$ =groupChats$.pipe(concatMap((chats: ChatFactory[]) => seeker.rx.getEachMessagesToSave$(chats,{getMedia:false,timeout:3000})))

        // const ContactSaveMessagesEach$ =contactChats$.pipe(concatMap((chats: ChatFactory[]) => seeker.rx.getEachMessagesToSave$(chats,{getMedia:false,timeout:3000})))

        // const NonContactSaveMessagesEach$ =nonContactChat$.pipe(concatMap((chats: ChatFactory[]) => seeker.rx.getEachMessagesToSave$(chats,{getMedia:false,timeout:3000})))

        // const allSaveMessages$ = seeker.rx.mergeSaveMessages$$([],[NonContactSaveMessagesEach$]).pipe(last())

        // const groupSaveMessages$ = seeker.rx.mergeSaveMessages$([],groupSaveMessagesEach$).pipe(last())

        // const groupMessages:SaveMessage[] = await firstValueFrom(groupSaveMessages$)

        // const allSaveMessages$ = seeker.rx.mergeSaveMessages$(groupMessages,ContactSaveMessagesEach$).pipe(last())


        // allSaveMessages$.subscribe((reIntetrate:SaveMessage[])=>{

        //     console.log(reIntetrate)
        // })



        // const reIntegrate$ = seeker.rx.mergeSaveMessages$()


        // const mediaMessages$ = waitIntegration$.pipe(map((messages:SaveMessage[])=>messages.filter(({manager}:SaveMessage)=>!!manager )))

        //  waitIntegration$.subscribe((val)=>console.log(val))
        // mediaMessages$.subscribe((val)=>console.log(val))



        // const groupSaveMessagesArray$ = groupSaveMessagesEach$.pipe(toArray())


    })

    clientTransformed.initialize()

}


main()
