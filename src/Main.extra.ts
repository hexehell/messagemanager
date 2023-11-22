import * as fs from 'fs'
import { Semaphore } from 'async-mutex'
import WAWebJS, { Message, Client, LocalAuth, MessageAck, MessageMedia } from "whatsapp-web.js"
import { v4 as uuid } from "uuid";
import { catchError, concatMap, defer, firstValueFrom, from, map, of, tap, timeout } from 'rxjs';

const main = async () => {


    const semaphore: Semaphore = new Semaphore(1)

    const qrcode = require('qrcode-terminal');

    const client = new Client({ authStrategy: new LocalAuth({ clientId: "client-one" }) });

    client.on('qr', qr => {
        console.log(qr)
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', async () => {
        console.log('Client is ready!');

        const chatContactsMessages: { number: string, name: string, messages: WAWebJS.Message[] }[] = []

        const chats: WAWebJS.Chat[] = await client.getChats()

        const chatsNotContacts: WAWebJS.Chat[] = chats.filter(chat => !chat.isGroup && chat.name.startsWith('+'))
        const chatsContacts: WAWebJS.Chat[] = chats.filter(chat => !chat.isGroup && !chat.name.startsWith('+'))

        const waitForFetching: Promise<unknown>[] = []
        const workDownloading: (() => unknown)[] = []

        chatsContacts.forEach(async (chat: WAWebJS.Chat) => {

            waitForFetching.push(
                new Promise(async (resolve) => {

                    const chatSample = {
                        number: chat.id.user,
                        name: chat.name,
                        messages: await chat.fetchMessages({ limit: 10000 })
                        // messagesFromMe: await chat.fetchMessages({fromMe:true,limit:Infinity}),
                        // messagesNotFromMe: await chat.fetchMessages({fromMe:false,limit:Infinity})
                    }

                    chatContactsMessages.push(chatSample)

                    resolve(1)

                })


            )




        });

        await Promise.all(waitForFetching)

        const supportedFormats = (mimetype: string) => {
            switch (mimetype) {
                case 'image/gif': return 'gif'
                case 'image/jpeg': return 'jpeg'
                case 'image/png': return 'png'
                
            }

            if(mimetype.startsWith('audio/ogg'))return 'oog'
        }

        interface saveInteface {
            timestamp: number,
            id?:string,
            from: string,
            to:string,
            fromMe:boolean,
            media: MessageMedia | undefined
        }


        const downloading$ = from(chatContactsMessages)
            .pipe(concatMap(({ messages }: { number: string, name: string, messages: WAWebJS.Message[] }) => messages))
            .pipe(concatMap((message: WAWebJS.Message) =>
                from(message.downloadMedia())
                    .pipe(timeout(3000), catchError((err: Error) => { console.log(err.message); return of(undefined) }))
                    .pipe(
                        concatMap((value: MessageMedia | undefined) => {

                            if (!value) return of(undefined)

                            const save: saveInteface = {

                                timestamp: message.timestamp,
                                id:message.id.id,
                                from: message.from,
                                to:message.to,
                                fromMe:message.fromMe,
                                media: value ? value : undefined
                            }

                            return of(save)
                        })
                    )


            ))


        const saving$ = downloading$.pipe(concatMap((value: saveInteface | undefined) => {

            if (typeof (value) === 'string' || !value) return of(undefined);

            const toSave = value as saveInteface

            if (!toSave.media) return of(undefined)

            const fmt = supportedFormats(toSave.media!.mimetype)


            if(!fmt){console.log(toSave.media!.mimetype);return of(undefined)}


            fs.writeFile(`./media/${uuid()}.${fmt}`, Buffer.from(toSave.media!.data, 'base64'),(err)=>{

                if(err)console.log(`error to save ${value.id,value.timestamp,value.from,value.to}`)

            })

            // if (fmt) fs.writeFileSync()


            return of('done')


        })

        )


        saving$.subscribe({
            error: (err) => console.log(`Error:${err}`),
        })
        
        downloading$.subscribe({
            next:(message:saveInteface|undefined)=>{
            
                if(!message)return

                const {id,timestamp,to,from,fromMe} = message

                console.log({id,timestamp,to,from,fromMe})
            },
            complete: () => console.log('complete')
        })





        // const saving = downloading$.subscribe({
        //     next: (value: saveInteface | undefined) => {

        //         if (typeof (value) === 'string' || !value) return;

        //         const toSave = value as saveInteface

        //         if (!toSave.media) return

        //         const fmt = supportedFormats(toSave.media!.mimetype)

        //         if (fmt)
        //             fs.writeFileSync(`./media/${uuid()}.${fmt}`, Buffer.from(toSave.media!.data, 'base64'))

        //         console.log(toSave.timestamp, toSave.from)

        //     },

        // })




        // const imagesEverywhere: WAWebJS.MessageMedia[] = []




        // imagesEverywhere.map(({ data, mimetype }: WAWebJS.MessageMedia) => {

        //     // './media/'+uuid()+'.jpg'
        //     // data:image/png;base64,

        //     // const image = `data:${mimetype};base64,${data}`

        //     const fmt = supportedFormats(mimetype)

        //     if (fmt)
        //         fs.writeFileSync(`./media/${uuid()}.${fmt}`, Buffer.from(data, 'base64'))



        // })



        // console.log(chatContactsMessages)

    });

    client.initialize();


}

main()