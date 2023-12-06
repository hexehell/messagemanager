import { input } from '@inquirer/prompts';
import inquirer, { QuestionCollection } from 'inquirer';
import { createSpinner } from 'nanospinner'
import { Observable, concatMap, from, of, repeat, retry } from 'rxjs';
import { Phones } from '../Commands/Phones/classes/Phones';
import { CliAction } from '../interfaces/CliAction';
import { Command } from '../interfaces/Command.Factory';
import { Messages } from '../Commands/Messages/Messages';

export class ProgramCLI implements Command {

  constructor() {

  }


  flow$ = (options?: CliAction) => {

    const action = options?.action

    switch (action) {

      case 'Telefonos':


        const phones = new Phones()

        return phones.PhoneActionsDisplay$()
        break;

      case 'Afiliados':
        return of(console.log(action))
        break;

      case 'Campañas':
        return of(console.log(action))
        break;

      case 'Mensajes':
        return new Messages().PhoneActionsDisplay$()
        break;

      case 'Salir':
        process.exit(0)
        break;


    }


    return of()

  };

  optionsStartScreen$ = () => {


    const optionsList: QuestionCollection<any> = {
      type: 'list',
      name: 'action',
      message: 'Selecciona una opcion',
      choices: ['Telefonos', 'Afiliados', 'Campañas', 'Mensajes', 'Salir'],
    };

    // const options:CliAction = 
    return of(optionsList)
      .pipe(concatMap(() => from(inquirer.prompt(optionsList))))
      .pipe(concatMap((option: CliAction) => this.flow$(option)))

    // return await this.flow(options)




  }


  static writeLog = (message: string) => {

    const log = new inquirer.ui.BottomBar()

    log.log.write(message)

  }



}