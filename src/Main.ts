import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, fromEvent, of, repeat, retry, tap } from 'rxjs';
// import { ProgramCLI } from "./cli/classes/ProgramCLI";
import { CliAction } from "./cli/interfaces/CliAction";
import { CLIProgram } from "./cli/classes/CLIProgram";
import AffiliateModel from "./database/Schemas/Affiliate/Affiliate.schema"
import mongoose from "mongoose";
import {conf} from './conf/configuration'
import { ErrorHandling } from "./ErrorHandling/classes/ErrorHandling";
import {ConsoleLogger, LogType, ConsoleLogger as cLogging} from '@CampaignCreator/Logging/classes/ConsoleLogger'
import { BasicDashed, BasicUnderline, BoldErrBG, BoldLogBG, ErrDashed, IndigoColor, OrangeColor, PrimaryColor, SuccessColor, TealColor, WarningColor } from "./Logging/classes/ConsoleStyles";



const init_ErrorHandling = async():Promise<ErrorHandling>=>{
  const err: ErrorHandling = ErrorHandling.ErrorHandlingInstance

  return err
}

const init_moongoose = async()=>{



 return await mongoose.connect(conf().Mongo.connectionString)
  .then(() => {
    cLogging.logger.setLogStyle(LogType.log ,new SuccessColor())
    
    cLogging.logger.log('Conexión exitosa a la base de datos');
    cLogging.logger.resetLog()
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


const main = async () => {


   await init_moongoose()

   const errorHandler = await init_ErrorHandling()

   console.clear()



     const cli = new CLIProgram()

     CLIProgram.setNextCommand(cli)

     CLIProgram.menuNext.subscribe({
        next:async(options:CliAction)=>
        await CLIProgram.nextCommand.manageOptions(options),
        complete:()=> {
          
          cLogging.logger.setLogStyle(LogType.log ,new SuccessColor())
          cLogging.logger.log('complete')
          cLogging.logger.resetLog()
        }
     })










}

main()