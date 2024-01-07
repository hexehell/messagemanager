import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, fromEvent, of, repeat, retry, tap } from 'rxjs';
// import { ProgramCLI } from "./cli/classes/ProgramCLI";
import { CliAction } from "./cli/interfaces/CliAction";
import { CaptureInput } from "./cli/Commands/utils/CaptureInput";
import { CLIProgram } from "./cli/classes/CLIProgram";
import AffiliateModel from "./database/Schemas/Affiliate/Affiliate.schema"
import mongoose from "mongoose";
import { ErrorHandling } from "./ErrorHandling/classes/ErrorHandling";

const init_ErrorHandling = async():Promise<ErrorHandling>=>{
  const err: ErrorHandling = ErrorHandling.ErrorHandlingInstance

  return err
}

const init_moongoose = async()=>{

 return await mongoose.connect(process.env.MONGOCONNECTIONSTRING!)
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos:', error);
  });

}

 const sendThrow = (wait:number)=>{

  setTimeout(() => {
    throw new Error('Este error no se maneja con un try...catch');
  }, wait*1000);
}

const init_InputCaptures = ()=>{

  const captureCtrlD = new CaptureInput()
  // const captureCtrlA = new CaptureInput('A',true)
  // const captureCtrlR = new CaptureInput('R',true)

  captureCtrlD.inputCaptured('r',true).subscribe({
    next:(val)=>{

      !!val &&console.clear()

      !!val &&console.log('pantalla borrada')
      !!val &&console.log('presiona una tecla ↓ para continuar')
    }
  })

  captureCtrlD.inputCaptured('a',true).subscribe({
    next:(val)=>{

      !!val && CLIProgram.closeCurrentPrompt()
      !!val &&console.clear()
      !!val && CLIProgram.backToBegining()


    }
  })


  // captureCtrlA.inputCaptured().subscribe({
  //   next:(val)=>console.log(val)
  // })

  // captureCtrlR.inputCaptured().subscribe({
  //   next:(val)=>console.log(val)
  // })


}

const main = async () => {

   await init_moongoose()

   const errorHandler = await init_ErrorHandling()

   init_InputCaptures()

    // new CaptureInput('a', true).inputCaptured().subscribe((val)=>console.log(val))


    console.clear()

     const cli = new CLIProgram()

     CLIProgram.setNextCommand(cli)

     CLIProgram.menuNext.subscribe({
        next:async(options:CliAction)=>
        await CLIProgram.nextCommand.manageOptions(options),
        complete:()=>console.log('complete')
     })










}

main()