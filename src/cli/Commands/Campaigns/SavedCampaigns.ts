import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, of } from "rxjs";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CLIUtils, FormPromptChoiceAutoComplete, FormPromptChoiceYesNo } from "@CampaignCreator/cli/utils/CliUtils";
import { DialogNFD } from "@CampaignCreator/FileDialogs/classes/DialogNFD";
import { CampaignsInfo } from "@CampaignCreator/CampaignCreator/classes/CampaingsInfo";
import { CampaginParts } from "./CampaignParts";
import { CampaignMongo } from "@CampaignCreator/database/classes/Campaigns/classes/CampaignMongo";
import { CampaignScheduler } from "@CampaignCreator/CampaignCreator/classes/CampaignScheduler";
import { CampaignManager } from "@CampaignCreator/CampaignCreator/classes/CampaignManager";


export class SavedCampaigns implements CLICommand {

    prompt?: boolean | undefined = false;

    constructor(back: CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;
    manageOptions = async (options: CliAction) => {

        const action = options?.action


        const savedCampaigns = await CampaignsInfo.listSavedActiveCampaigns()

        const selections =  savedCampaigns.map(selection=>selection.selection)


        const selectCampaing =
            await CLIUtils.createAutoComplete({ name: 'campaign', message: 'Selecciona Campaña', autocomplete: Array.prototype.concat(selections, 'atras') } as FormPromptChoiceAutoComplete)

        if (selectCampaing.answer === 'atras') return CLIProgram.setNextCommand(this.back!)
        
        const campaignSelected = await CampaignsInfo.getSavedCampaign(savedCampaigns.find(selection =>selection.selection === selectCampaing.answer)!.id)
        
        // getLoadedCampaign(selectCampaing.answer as string)
        
        
        const actionWithCampaign = await CLIUtils.createAutoComplete({
            name: 'action', message: `Que deseas hacer con la campaña: ${campaignSelected.createDate.getTime()}-${campaignSelected.configuration.campaignName}`, autocomplete: ['Correr','Desactivar', 'Ver Detalles','Borrar', 'atras']
        } as FormPromptChoiceAutoComplete)
        
        switch (actionWithCampaign.answer) {
            
            case 'Desactivar':
            
                const deactivateCampaign = await CLIUtils.YesNoDialog({name:'delete',message:'¿Estas seguro que deseas desactivar la campaña?'} as FormPromptChoiceYesNo)

                if(deactivateCampaign.answer){
                    await new CampaignMongo().activate(campaignSelected,false) &&  
                    console.log('campaña desactivada')
                }

                 return CLIProgram.setNextCommand(this.back!)
            break;

            case 'Borrar':
            
                const deleteCampaign = await CLIUtils.YesNoDialog({name:'delete',message:'¿Estas seguro que deseas borrar la campaña?'} as FormPromptChoiceYesNo)

                if(deleteCampaign.answer){

                   await new CampaignMongo().delete(campaignSelected) &&  console.log('campaña borrada')
                }

                 return CLIProgram.setNextCommand(this.back!)
            break;
            case 'Correr':

               const manager = new CampaignManager()

               manager.scheduleCampaign(campaignSelected)

               await manager.startProcess()
    
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
        message: '',
        choices:
            [
                // 'Crear Campaña',
                // 'Visualizar',
                // 'atras'
            ],
    })




}