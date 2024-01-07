import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { CLIUtils, FormPromptChoiceAutoComplete } from "@CampaignCreator/cli/utils/CliUtils";
import { PhoneCreator } from "@CampaignCreator/transformers/PhoneCreator";
import { PhonesInfo } from "@CampaignCreator/transformers/PhonesInfo";
import { QuestionCollection } from "inquirer";

export class ListAvailablePhones implements CLICommand{
    prompt?: boolean | undefined = false;
    passInOptions?: CliAction | undefined;
    back: CLICommand | undefined;

    constructor(back:CLICommand, private nextCommand:CLICommand){
        this.back = back

        if(!!!nextCommand)
        this.nextCommand = this.back
    }

    manageOptions = async (options: CliAction) => {

        const phoneKeySelected = (await CLIUtils.createAutoComplete({name:'available',message:'elige un telefono disponible',autocomplete:Array.from(PhonesInfo.PhonesAvailables.keys())} as FormPromptChoiceAutoComplete)).answer.toString()

        const phoneClientSelected = PhonesInfo.PhonesAvailables.get(phoneKeySelected)

        CLIProgram.setNextCommand(this.nextCommand!,{action:phoneKeySelected,extraParams:phoneClientSelected})
    }
    
    ListOptions = () => {


        const optionsList: QuestionCollection<any> = {
        };


        return optionsList

    }

}