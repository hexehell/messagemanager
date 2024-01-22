import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, fromEvent, of, repeat, retry, tap } from 'rxjs';
// import { ProgramCLI } from "./cli/classes/ProgramCLI";
import { CliAction } from "../cli/interfaces/CliAction";
import { CLIProgram } from "../cli/classes/CLIProgram";
import AffiliateModel from "../database/Schemas/Affiliate/Affiliate.schema"
import mongoose from "mongoose";
import {conf} from '../conf/configuration'
import { ErrorHandling } from "../ErrorHandling/classes/ErrorHandling";
import {LogType, ConsoleLogger as cLogging} from '@CampaignCreator/Logging/classes/ConsoleLogger'
import { BasicDashed, BasicUnderline, BoldErrBG, BoldLogBG, ErrDashed, IndigoColor, OrangeColor, PrimaryColor, TealColor, WarningColor } from "../Logging/classes/ConsoleStyles";



const init_ErrorHandling = async():Promise<ErrorHandling>=>{
  const err: ErrorHandling = ErrorHandling.ErrorHandlingInstance

  return err
}

const init_moongoose = async()=>{



 return await mongoose.connect(conf().Mongo.connectionString)
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


const main = async () => {


   await init_moongoose()

   const errorHandler = await init_ErrorHandling()

   console.clear()

   cLogging.logger.log('asd')

   cLogging.logger.setLogStyle(LogType.log, new BoldLogBG())
   
   cLogging.logger.log('Este es un ejemplo de Log')
   
   
   cLogging.logger.setLogStyle(LogType.log, new BasicUnderline())
   cLogging.logger.log('Este es un ejemplo de Log')

   cLogging.logger.setLogStyle(LogType.log, new BasicDashed())
   cLogging.logger.log('Este es un ejemplo de Log dashed')

   cLogging.logger.setLogStyle(LogType.log, new ErrDashed())
   cLogging.logger.log('Este es un ejemplo de Err dashed')

   
   cLogging.logger.setLogStyle(LogType.log, new ErrDashed())
   cLogging.logger.mixToRight(LogType.log, new PrimaryColor())
   cLogging.logger.mixToRight(LogType.log, new IndigoColor())
   cLogging.logger.mixToRight(LogType.log, new WarningColor())
   cLogging.logger.mixToRight(LogType.log, new OrangeColor())
   cLogging.logger.mixToRight(LogType.log, new TealColor())

   cLogging.logger.log('Este es un ejemplo de Color dashed')
   
   cLogging.logger.setLogStyle(LogType.err, new BoldErrBG())
   cLogging.logger.logErr('Este es un ejemplo de Error')

   cLogging.logger.resetLog()
   cLogging.logger.resetErr()

   cLogging.logger.logErr('Este es un ejemplo de Error')
   cLogging.logger.log('Este es un ejemplo de Color dashed')





    

    

    process.exit(0)









}

main()