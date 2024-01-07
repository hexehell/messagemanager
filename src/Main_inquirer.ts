import { Client, LocalAuth } from "whatsapp-web.js";
import { ClientWwjs } from './transformers/Wwjs/Wwjs'
import { MessageOptions, SaveMessage, Seeker } from "./Seeker/classes/Seeker";
import { concatMap, take, toArray, from, concat, tap, of, distinct, scan, combineLatest, last, map, firstValueFrom, Observable, delay, interval, timer, retry, repeat } from "rxjs";
import { MessageFactory } from "./transformers/Factories/interfaces/Message.factory";
import { ChatFactory } from "./transformers/Factories/interfaces/Chat.factory";
import { UploaderAccess, UploaderOptions, Uploaders } from "./ImagesUploaders/classes/Uploaders";
import { ImgBB } from "./ImagesUploaders/classes/ImgBB";
import { UploadCare } from "./ImagesUploaders/classes/UploadCare";
import { LocalStorage } from "./ImagesUploaders/classes/LocalStorage";
import { OwnServerStorage } from "./ImagesUploaders/classes/OwnServerStorage";
import inquirer, { QuestionCollection } from 'inquirer';
import { input } from "@inquirer/prompts";




const main = async()=>{


    console.clear()

    // const ui = new inquirer.ui.BottomBar()

//     const obs$ = from(
//    [
//     {
//         name: 'programOptions',
//         message: 'Selecciona una opcion',
//         choices: ['Telefonos','Afiliados','Campañas','Mensajes','Salir...'],
//      },
//     { name:'m2', message: 'Enter your name2' },
//     { name:'m3', message: 'Enter your name3' },
//     { name:'m4', message: 'Enter your name4' },
//     { name:'m5', message: 'Enter your name5' },
    
//     ]).pipe( concatMap((message)=>of(message).pipe(delay(1000))))


//     const prompt$ = inquirer.prompt(obs$).ui.process

//     prompt$.subscribe({
//         next:(val)=>console.log(val),
//         complete:()=>console.log('completed')

//     })

    // obs$.subscribe((value)=>console.log(value))
    
    // await new ProgramCLI().startScreen()



    const client = new Client({ authStrategy: new LocalAuth({ clientId: "client-one" }) });

    
    const clientTransformed = new ClientWwjs(client,'')

    
    const imageUploaders = new Uploaders([
        // {
        //     alias: "test1", uploader: new ImgBB({
        //         apiKey: "031cb6405d8add7408208e2a7d297ffd",
        //         url: 'https://ibb.co/album/yh6sq7'
        //     })
        // },
        // {
        //     alias: 'imgbb', uploader: new ImgBB({
        //         apiKey: "3a836951ae8ef991c1c443ea526fbb0a",
        //     })
        // },
        // {
        //     alias:'uploadCare', uploader: new UploadCare({
        //         apiKey:'956fffcb8dbc99dc0ca4'

        //     })
        // },
        {
            alias:'local', uploader: new LocalStorage({
                baseDir:'images',

            })
        },
        // {
        //     alias:'OwnImageServer',
        //     uploader: new OwnServerStorage({
        //         collection:'test'
        //     })
        // }
    ],{access:UploaderAccess.random} as UploaderOptions)
    
    const seeker = new Seeker(clientTransformed,imageUploaders)

    
    // const cli =   new ProgramCLI()

    // const main$ = cli.optionsStartScreen$()
 
    // const flow$ = main$.pipe(concatMap((val)=>{
 
    //     console.log(val)
   
 
    //  return cli.options$(val)
    // }))
 
    // flow$.pipe(repeat()).subscribe({
    //     next:(val)=>{

    //         console.log(val)
    //     }
    // })


    // clientTransformed.on('ready', async () => {

    //     console.log('------------------------------------------------')



     
    
    
    // })

    // clientTransformed.initialize()







}


 

  main()