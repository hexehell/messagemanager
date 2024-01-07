import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, of } from "rxjs";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { AddCampaign } from "./AddCampaing";
import { VisualizeCampaign } from "./VisualizeCampaign";


export class CampaignCLI implements CLICommand {

    constructor(back: CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;
    manageOptions = (options: CliAction) => {

        const action = options?.action

        switch (action) {

            case 'Crear Campaña':

                const addCampaign = new AddCampaign(this)

                return CLIProgram.setNextCommand(addCampaign)


                break;

            case 'Visualizar':

                const vizualize = new VisualizeCampaign(this)

                return CLIProgram.setNextCommand(vizualize)

                break;

            case 'atras':
                return CLIProgram.setNextCommand(this.back!)

                break;

                return CLIProgram.setNextCommand(this.back!)
        }



    };
    ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
        type: 'list',
        name: 'action',
        message: 'Selecciona una opcion',
        choices:
            [
                'Crear Campaña',
                'Visualizar',
                'atras'],
    })







}