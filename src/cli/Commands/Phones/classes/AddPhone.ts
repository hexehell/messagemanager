import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory"
import { CliAction } from "../../../../cli/interfaces/CliAction"
import { ClientFactory } from "../../../../transformers/Factories/interfaces/Client"
import { PhoneCreator } from "../../../../transformers/PhoneCreator"
import { PhoneTypes, PhonesInfo } from "../../../../transformers/PhonesInfo"
import inquirer, { QuestionCollection } from "inquirer"
import { catchError, concatMap, firstValueFrom, from, merge, of, take, timeout } from "rxjs"
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram"
import { WwjsCreator } from "@CampaignCreator/transformers/Wwjs/WwjsCreator"

export class AddPhone implements CLICommand {

  constructor(back: CLICommand) {

    this.back = back

  }
  back: CLICommand | undefined
   manageOptions = async(options: CliAction) => {
    switch (options.action) {

      case PhoneTypes.wwjs:
    
        const wwjsCreator = new  WwjsCreator()

        await wwjsCreator.create().catch(err=>console.log(err))

        return CLIProgram.setNextCommand(this.back!)
        break;
      case "atras":
        return CLIProgram.setNextCommand(this.back!)

        break

    }

  }
  ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
    type: 'list',
    name: 'action',
    message: 'Selecciona un tipo de bot',
    choices: Array.prototype.concat(PhonesInfo.ListPhonesTypes(), ['atras']),
  })
  



}