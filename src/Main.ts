import WAWebJS, { Client,LocalAuth } from "whatsapp-web.js"

const main = async()=>{

    const qrcode = require('qrcode-terminal');

    const client = new Client({authStrategy: new LocalAuth({ clientId: "client-one" })});
    
    client.on('qr', qr => {
        console.log(qr)
        qrcode.generate(qr, {small: true});
    });
    
    client.on('ready', async() => {
        console.log('Client is ready!');

        const chatContactsMessages:unknown[] = []

        const chats:WAWebJS.Chat[] = await client.getChats()

        const chatsNotContacts:WAWebJS.Chat[] = chats.filter(chat=>!chat.isGroup && chat.name.startsWith('+'))
        const chatsContacts:WAWebJS.Chat[] = chats.filter(chat=>!chat.isGroup && !chat.name.startsWith('+'))

        const waitForFetching:Promise<unknown>[] = []

        chatsContacts.forEach(async(chat:WAWebJS.Chat) => {
            
          waitForFetching.push(
            new Promise(async (resolve)=>{

                chatContactsMessages.push({
                    number:chat.id.user,
                    name:chat.name,
                    messages:await chat.fetchMessages({limit:1024})
                    // messagesFromMe: await chat.fetchMessages({fromMe:true,limit:Infinity}),
                    // messagesNotFromMe: await chat.fetchMessages({fromMe:false,limit:Infinity})
                })
    
                resolve(1)

            })


          ) 


            

        });

       await Promise.all(waitForFetching)


        console.log(chatContactsMessages)

    });
    
    client.initialize();
     

}

main()