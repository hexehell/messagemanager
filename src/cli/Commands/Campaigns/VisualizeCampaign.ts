import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, of } from "rxjs";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { AddCampaign } from "./AddCampaing";
import { LoadedCampaigns } from "./LoadedCampaigns";
import { SavedCampaigns } from "./SavedCampaigns";


export class VisualizeCampaign implements CLICommand {

    constructor(back: CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;
    manageOptions = (options: CliAction) => {

        const action = options?.action

        switch (action) {

            case 'Ver Campañas Cargadas':

                const loadedCampaigns = new LoadedCampaigns(this)

                return CLIProgram.setNextCommand(loadedCampaigns)


                break;

            case 'Ver Campañas Salvadas':

                const savedCampaigns = new SavedCampaigns(this)

                return CLIProgram.setNextCommand(savedCampaigns)

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
                'Ver Campañas Cargadas',
                'Ver Campañas Salvadas',
                'atras'],
    })







}