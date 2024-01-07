import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { CLIUtils, FormPromptChoiceAutoComplete } from "@CampaignCreator/cli/utils/CliUtils";
import { BotMongo } from "@CampaignCreator/database/classes/bot/classes/BotMongo";
import { PhoneCreator } from "@CampaignCreator/transformers/PhoneCreator";
import { PhonesInfo } from "@CampaignCreator/transformers/PhonesInfo";
import { QuestionCollection } from "inquirer";

export class ListSavedPhones implements CLICommand {
    prompt?: boolean | undefined = false;
    passInOptions?: CliAction | undefined;
    back: CLICommand | undefined;

    constructor(back: CLICommand, private nextCommand: CLICommand) {
        this.back = back

        if (!!!nextCommand)
            this.nextCommand = this.back
    }

    manageOptions = async (options: CliAction) => {


        const savedPhones = await PhonesInfo.getBots((options.action as string))

        const selectionPhones = Array.prototype.concat(savedPhones.map(bot=>bot.phone), ['atras'])

        const phoneKeySelected = (await CLIUtils.createAutoComplete({ name: 'available', message: 'elige un telefono disponible', autocomplete: Array.from(PhonesInfo.PhonesAvailables.keys()) } as FormPromptChoiceAutoComplete)).answer.toString()

        if(phoneKeySelected === 'atras')
           return CLIProgram.setNextCommand(this.back!)
        

        const phoneClientSelected = savedPhones.filter(bot=>bot.phone === phoneKeySelected)[0]

        CLIProgram.setNextCommand(this.nextCommand!, { action: phoneKeySelected, extraParams: phoneClientSelected })
    }

    ListOptions = () => {


        const optionsList: QuestionCollection<any> = {
        };


        return optionsList

    }

}