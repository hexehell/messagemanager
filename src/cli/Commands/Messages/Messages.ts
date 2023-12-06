import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, of } from "rxjs";
import { SendSimpleMessage } from "./SendSimpleMessage";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";


export class Messages implements CLICommand {

    constructor(back: CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;
    manageOptions = (options: CliAction) => {

        const action = options?.action

        switch (action) {

            case 'Enviar Mensaje simple':

                const simpleMessage = new SendSimpleMessage(this);

                CLIProgram.setNextCommand(simpleMessage)
                break;

            case 'Crear lista de afiliados':

                break;

            case 'Enviar grupo de mensajes':

                break;

            case 'atras':
                break;


        }



    };
    ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
        type: 'list',
        name: 'action',
        message: 'Selecciona una opcion',
        choices:
            [
                'Enviar Mensaje simple',
                'Crear lista de afiliados',
                'Enviar grupo de mensajes',
                'atras'],
    })







}