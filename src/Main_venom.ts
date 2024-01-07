import { ClientEvents } from "./transformers/Factories/interfaces/Client";
import { ClientVenom } from "./transformers/venom/venom"


const main = async () => {



  console.clear()

  const venomClient = new ClientVenom('hexehell')

  const qrcode = require('qrcode-terminal');

  venomClient.on('qr', qr => {
    // console.log(qr)
    qrcode.generate(qr, { small: true });
  });

  venomClient.on(ClientEvents.ready,()=>{


    console.log('connected')

  })


  await venomClient.initialize()










}

main()