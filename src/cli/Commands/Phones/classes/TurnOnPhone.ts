import * as fs from 'fs-extra'
import { CliAction } from "../../../../cli/interfaces/CliAction"
import { ClientFactory } from "../../../../transformers/Factories/interfaces/Client"
import { PhoneCreator } from "../../../../transformers/PhoneCreator"
import { PhonesInfo } from "../../../../transformers/PhonesInfo"
import inquirer, { QuestionCollection } from "inquirer"
import { concatMap, from, merge, of, take } from "rxjs"
import { CLICommand } from '@CampaignCreator/cli/interfaces/Command.Factory'
import { CLIProgram } from '@CampaignCreator/cli/classes/CLIProgram'


export interface TurnOnCliAction extends CliAction {

  phoneType: string
}

export class TurnOnPhone implements CLICommand {


  constructor(back: CLICommand) {

    this.back = back;

  }
  back: CLICommand | undefined
  manageOptions = (options: CliAction) => {

    const action = options?.action

    switch (action.toLocaleLowerCase()) {

      case "wwjs":

        // console.log(PhonesInfo.getPhonesfrom(action))

        const listPhones = new TurnOnList(this, options)



        CLIProgram.setNextCommand(listPhones, options)
        break

      case "atras":

        CLIProgram.setNextCommand(this.back!)
        break;

    }
  }

  ListOptions = (): QuestionCollection<any> => {

    const options = Array.prototype.concat(PhonesInfo.getAvailablePhoneTypes(), ['atras'])

    return {
      type: 'list',
      name: 'action',
      message: 'Selecciona un tipo de telefono',
      choices: options,
    };

  }





}

export class TurnOnList implements CLICommand {

  constructor(back: CLICommand | undefined, private phoneTypeOpts: CliAction) {
    this.back = back
  }

  back: CLICommand | undefined

  ListOptions = (options?: CliAction | undefined) => ({
    type: 'list',
    name: 'action',
    message: 'Selecciona un tipo de telefono',
    choices: Array.prototype.concat(PhonesInfo.getPhonesfrom(options!.action), ['atras'])
  } as QuestionCollection<any>)

  manageOptions = (options: CliAction) => {

    if (options.action === 'atras') {
      CLIProgram.setNextCommand(this.back!)
    
      return
    }
    const turnOnOptions = { ...options, phoneType: this.phoneTypeOpts.action } as TurnOnCliAction

    this.turnOnPhone(turnOnOptions)

    CLIProgram.setNextCommand(this.back!)
  }

  turnOnPhone = (option: TurnOnCliAction) => {


    return new PhoneCreator().reconnectToClient(option)
  }

}