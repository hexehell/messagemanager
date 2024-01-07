import { input } from '@inquirer/prompts';
import inquirer, { QuestionCollection } from 'inquirer';
import { createSpinner } from 'nanospinner'
import { Observable, Subject, concatMap, from, of, repeat, retry } from 'rxjs';
import { CliAction } from '../interfaces/CliAction';
import { CLICommand, Command } from '../interfaces/Command.Factory';
import { Messages } from '../Commands/Messages/classes/Messages';
import { CLIPhones } from '../Commands/Phones/classes/CLIPhones';
import { AffiliatesMenu } from '../Commands/Affiliates/classes/AffiliatesMenu';
import { CampaignCLI } from '../Commands/Campaigns/Campaigns';

export class CLIProgram implements CLICommand {

  constructor() {

    CLIProgram.baseCommand = this

  }
  back: CLICommand | undefined;


  static menuNext = new Subject<CliAction>()
  static nextCommand: CLICommand
  static nextOptions: CliAction|undefined
  static currentPrompt: any

  static showMenu = (options: QuestionCollection<any>,prompt?:boolean) => {
    
    if(!!!prompt) return     CLIProgram.menuNext.next({} as CliAction);

    CLIProgram.currentPrompt = inquirer.prompt(options)
    CLIProgram.currentPrompt.then((respuestas: any | any[]) => {

      // Array.isArray(respuestas)
      // console.log(respuestas)

      CLIProgram.menuNext.next(respuestas);
    });
  }



   static closeCurrentPrompt(){

    !!CLIProgram.currentPrompt && CLIProgram.currentPrompt.ui.close(); 
   }

  static setNextCommand(command: CLICommand, options?: CliAction) {

     command.passInOptions = options?? command.passInOptions

    CLIProgram.nextCommand = command
    CLIProgram.nextOptions = options

    let prompt:boolean = true

    if(typeof command.prompt !== 'undefined') prompt = command.prompt

    CLIProgram.showMenu(CLIProgram.nextCommand.ListOptions(CLIProgram.nextOptions),prompt)

  }

  static baseCommand: CLICommand

  static backToBegining(){
    CLIProgram.setNextCommand(CLIProgram.baseCommand)
  }


  manageOptions = (options?: CliAction) => {

    const action = options?.action

    switch (action) {

      case 'Telefonos':

        const phones = new CLIPhones(this)

        return CLIProgram.setNextCommand(phones)


        break;

      case 'Afiliados':

        const affMenu = new AffiliatesMenu(this)

        return CLIProgram.setNextCommand(affMenu)

        break;

      case 'Campañas':


      const campaignMenu = new CampaignCLI(this)

      return CLIProgram.setNextCommand(campaignMenu)
      
      
      // return of(console.log(action))
      break;
      
      case 'Mensajes':
        
        const messages = new Messages(this)
        
        return CLIProgram.setNextCommand(messages)

        break;

      case 'Salir':
        process.exit(0)
        break;


    }

    return CLIProgram.setNextCommand(this)


    // return of()

  };



  ListOptions(): QuestionCollection<any> {


    return {
      type: 'list',
      name: 'action',
      message: 'Selecciona una opcion',
      choices: ['Telefonos', 'Afiliados', 'Campañas', 'Mensajes', 'Salir'],
    };







  }






}