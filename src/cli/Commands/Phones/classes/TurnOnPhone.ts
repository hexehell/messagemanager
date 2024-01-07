import * as fs from 'fs-extra'
import { CliAction } from "../../../../cli/interfaces/CliAction"
import { ClientFactory } from "../../../../transformers/Factories/interfaces/Client"
import { PhoneCreator } from "../../../../transformers/PhoneCreator"
import { PhoneTypes, PhonesInfo } from "../../../../transformers/PhonesInfo"
import inquirer, { QuestionCollection } from "inquirer"
import { concatMap, from, merge, of, take } from "rxjs"
import { CLICommand } from '@CampaignCreator/cli/interfaces/Command.Factory'
import { CLIProgram } from '@CampaignCreator/cli/classes/CLIProgram'
import { WwjsCreator } from '@CampaignCreator/transformers/Wwjs/WwjsCreator'
import { ListSavedPhones } from './ListSavedPhones'
import { CLIUtils, FormPromptChoiceAutoComplete } from '@CampaignCreator/cli/utils/CliUtils'


export interface TurnOnCliAction extends CliAction {

  phoneType: string
}

export class TurnOnPhone implements CLICommand {


  constructor(back: CLICommand) {

    this.back = back;

  }
  back: CLICommand | undefined
  manageOptions = async (options: CliAction) => {

    const action = options?.action as string

    switch (action.toLocaleLowerCase()) {

      case "wwjs":


        // const savedPhones = new ListSavedPhones(this.back!,this)

        const savedPhones = await PhonesInfo.getBots((options.action as string))

        const selectionPhones = Array.prototype.concat(savedPhones.map(bot => bot.phone), ['atras'])

        const phoneKeySelected = (await CLIUtils.createAutoComplete({ name: 'available', message: 'elige un telefono disponible', autocomplete: selectionPhones } as FormPromptChoiceAutoComplete)).answer.toString()

        if (phoneKeySelected === 'atras')
          return CLIProgram.setNextCommand(this.back!)


        const phoneClientSelected = savedPhones.filter(bot => bot.phone === phoneKeySelected)[0]

        const wwjsCreator = new WwjsCreator()

        await wwjsCreator.reconnect(phoneClientSelected)



        CLIProgram.setNextCommand(this.back!, options)
        break

      case "atras":

        CLIProgram.setNextCommand(this.back!)
        break;

    }
  }

  ListOptions = (): QuestionCollection<any> => {

    const options = Array.prototype.concat(PhonesInfo.ListPhonesTypes(), ['atras'])

    return {
      type: 'list',
      name: 'action',
      message: 'Selecciona un tipo de telefono',
      choices: options,
    };

  }





}

