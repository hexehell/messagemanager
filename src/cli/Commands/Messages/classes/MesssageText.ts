import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { QuestionCollection } from "inquirer";

export class MessageText implements CLICommand{

    constructor(back:CLICommand){
        this.back = back
    }

    back: CLICommand | undefined;
    manageOptions= (options: CliAction) => {

        
    if (options.action === 'atras') {
        CLIProgram.setNextCommand(this.back!)
      
        return
      }

    };
    ListOptions= () => ({
        type: 'list',
        name: 'action',
        message: 'Selecciona un tipo de telefono',
        choices:  ['atras']
      } as QuestionCollection<any>)

}