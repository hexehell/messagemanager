import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, of } from "rxjs";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CLIUtils, FormPromptChoiceAutoComplete } from "@CampaignCreator/cli/utils/CliUtils";
import { DialogNFD } from "@CampaignCreator/FileDialogs/classes/DialogNFD";
import { CampaignsInfo } from "@CampaignCreator/CampaignCreator/classes/CampaingsInfo";
import { CampaginParts } from "./CampaignParts";
import { CampaignMongo } from "@CampaignCreator/database/classes/Campaigns/classes/CampaignMongo";


export class LoadedCampaigns implements CLICommand {

    prompt?: boolean | undefined = false;

    constructor(back: CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;
    manageOptions = async (options: CliAction) => {

        const action = options?.action




        const selectCampaing =
            await CLIUtils.createAutoComplete({ name: 'campaign', message: 'Selecciona Campaña', autocomplete: Array.prototype.concat(CampaignsInfo.listLoadedCampaings(), 'atras') } as FormPromptChoiceAutoComplete)

        if (selectCampaing.answer === 'atras') return CLIProgram.setNextCommand(this.back!)

        const campaignSelected = CampaignsInfo.getLoadedCampaign(selectCampaing.answer as string)


        const actionWithCampaign = await CLIUtils.createAutoComplete({
            name: 'action', message: `Que deseas hacer con la campaña: ${campaignSelected.createDate.getTime()}-${campaignSelected.configuration.campaignName}`, autocomplete: ['Salvar', 'Ver Detalles', 'atras']
        } as FormPromptChoiceAutoComplete)

        switch (actionWithCampaign.answer) {

            case 'Salvar':

                const campaignMongo = new CampaignMongo()

                if (!!(await campaignMongo.create(campaignSelected).catch(err => console.log(err)))) console.log('Campaña ha sido Guardada')

                return CLIProgram.setNextCommand(this.back!)


                break;
            case 'Ver Detalles':


                const campaginParts = new CampaginParts(this)

                campaginParts.passInOptions = { action: 'campaign', extraParams: campaignSelected }

                return CLIProgram.setNextCommand(campaginParts)

                break;
            case 'atras':
                return CLIProgram.setNextCommand(this.back!)
                break;
        }




        // console.log(campaignSelected)








        return CLIProgram.setNextCommand(this.back!)

    };
    ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
        type: 'list',
        name: 'action',
        message: 'Selecciona una opcion',
        choices:
            [
                // 'Crear Campaña',
                // 'Visualizar',
                // 'atras'
            ],
    })




}