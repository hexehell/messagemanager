import { Client,LocalAuth } from "whatsapp-web.js"

const main = ()=>{

    const qrcode = require('qrcode-terminal');

    const client = new Client({authStrategy: new LocalAuth({ clientId: "client-one" })});
    
    client.on('qr', qr => {
        console.log(qr)
        qrcode.generate(qr, {small: true});
    });
    
    client.on('ready', () => {
        console.log('Client is ready!');

        console.log(client.getChats())


    });
    
    client.initialize();
     

}

main()