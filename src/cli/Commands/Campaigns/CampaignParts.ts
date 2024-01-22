import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, of } from "rxjs";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CLIUtils, FormPromptChoiceAutoComplete, PromptAnswer } from "@CampaignCreator/cli/utils/CliUtils";
import { DialogNFD } from "@CampaignCreator/FileDialogs/classes/DialogNFD";
import { CampaignsInfo } from "@CampaignCreator/CampaignCreator/classes/CampaingsInfo";
import { Campaign } from "@CampaignCreator/CampaignCreator/interfaces";


export class CampaginParts implements CLICommand {

    // prompt?: boolean | undefined = false;

    constructor(back: CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;

    passInOptions?: CliAction | undefined;


    manageOptions = async (options: CliAction) => {

        const action = options?.action

        switch (action) {


            case 'Contactos':

                let resContacts = await CLIUtils.createAutoComplete({ name: 'contact', autocomplete: ['Resumen', 'Telefonos', 'Contactos', 'Mensajes','atras'] } as FormPromptChoiceAutoComplete)

                if(resContacts.answer ==='atras')return CLIProgram.setNextCommand(this)

                this.contactsManageOptions(resContacts)

                return CLIProgram.setNextCommand(this)

                break



            case 'Imagenes':

                let resImages= await CLIUtils.createAutoComplete({ name: 'add', autocomplete: ['Resumen','atras' ] } as FormPromptChoiceAutoComplete)

                if(resImages.answer ==='atras')return CLIProgram.setNextCommand(this)

                this.imagesManageOptions(resImages)

                return CLIProgram.setNextCommand(this)


                break
            case 'Configuracion':

                let resConf = await CLIUtils.createAutoComplete({ name: 'add', autocomplete: ['Resumen','atras'] } as FormPromptChoiceAutoComplete)

                if(resConf.answer ==='atras')return CLIProgram.setNextCommand(this)

                this.confManageOptions(resConf)

                return CLIProgram.setNextCommand(this)


                break

        }










        return CLIProgram.setNextCommand(this.back!)

    };

    confManageOptions(res:PromptAnswer){
        switch (res.answer) {
            case 'Resumen':
                CampaignsInfo.confResume(this.passInOptions!.extraParams as Campaign)
                break;
            
        }

    }

    imagesManageOptions(res: PromptAnswer) {

        switch (res.answer) {
            case 'Resumen':
                CampaignsInfo.imageResume(this.passInOptions!.extraParams as Campaign)
                break;
            
        }

    }


    contactsManageOptions(res: PromptAnswer) {

        switch (res.answer) {
            case 'Resumen':
                CampaignsInfo.contactResume(this.passInOptions!.extraParams as Campaign)
                break;
            case 'Telefonos':
                CampaignsInfo.contactBots(this.passInOptions!.extraParams as Campaign)
                break;
            case 'Contactos':
                CampaignsInfo.contactPhones(this.passInOptions!.extraParams as Campaign)
                break;
            case 'Mensajes':
                CampaignsInfo.contactPhones(this.passInOptions!.extraParams as Campaign)
                break;
        }

    }

    ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
        type: 'list',
        name: 'action',
        message: '',
        choices:
            [
                'Contactos',
                'Imagenes',
                'Configuracion',
                'atras'
            ],
    })




}