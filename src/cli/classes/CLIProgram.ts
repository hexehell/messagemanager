import { input } from '@inquirer/prompts';
import inquirer, { QuestionCollection } from 'inquirer';
import { createSpinner } from 'nanospinner'
import { Observable, Subject, concatMap, from, of, repeat, retry } from 'rxjs';
import { CliAction } from '../interfaces/CliAction';
import { CLICommand, Command } from '../interfaces/Command.Factory';
import { Messages } from '../Commands/Messages/Messages';
import { CLIPhones } from '../Commands/Phones/classes/CLIPhones';

export class CLIProgram implements CLICommand {

  constructor() {

    CLIProgram.baseCommand = this

  }
  back: CLICommand | undefined;


  static menuNext = new Subject<CliAction>()

  static showMenu = (options: QuestionCollection<any>) => {
    inquirer.prompt(options).then((respuestas) => {
      CLIProgram.menuNext.next(respuestas);
    });
  }

   static nextCommand: CLICommand

  static setNextCommand(command: CLICommand,options?:CliAction) {

    if(options)command.previousOptions = options

    CLIProgram.nextCommand = command
    CLIProgram.showMenu(CLIProgram.nextCommand.ListOptions())

  }

  static baseCommand: CLICommand


  manageOptions = (options?: CliAction) => {

    const action = options?.action

    switch (action) {

      case 'Telefonos':

        const phones = new CLIPhones(this)

        CLIProgram.setNextCommand(phones)


        break;

      case 'Afiliados':
        // return of(console.log(action))
        break;

      case 'Campañas':

        // return of(console.log(action))
        break;

      case 'Mensajes':
      
      const messages = new Messages(this)

      CLIProgram.setNextCommand(messages)
      
      break;

      case 'Salir':
        process.exit(0)
        break;


    }


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