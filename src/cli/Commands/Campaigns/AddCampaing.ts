import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, of } from "rxjs";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CLIUtils, FormPromptChoiceAutoComplete } from "@CampaignCreator/cli/utils/CliUtils";
import { DialogNFD } from "@CampaignCreator/FileDialogs/classes/DialogNFD";
import { CampaignsInfo } from "@CampaignCreator/CampaignCreator/classes/CampaingsInfo";
import {Chalk} from 'chalk';

export class AddCampaign implements CLICommand {

    prompt?: boolean | undefined = false;

    constructor(back: CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;
    manageOptions = async (options: CliAction) => {

        const action = options?.action


        const res = await CLIUtils.createAutoComplete({ name: 'add',message:'Crear Campaña', autocomplete: ['Subir Excel', 'atras'] } as FormPromptChoiceAutoComplete)


        await this.runSelection(res.answer as string).catch(err => console.log( err))






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

    async runSelection(selection: string) {

        if (selection === 'Subir Excel') {

            const fileSelected = await this.showUploadDialog()

            await this.processFile(fileSelected)
        }
    }

    async processFile(fileSelected: string) {

      

        if (fileSelected !== '') await CampaignsInfo.Manager.createCampaingFromFile(fileSelected).then(()=>console.log('Campaña creada'))

    }


    async showUploadDialog(): Promise<string> {

        const openDialog = new DialogNFD()

        return await openDialog.showSingleOpenDialog()

    }




}