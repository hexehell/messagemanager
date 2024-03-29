import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, of } from "rxjs";
import { SendSimpleMessage } from "./SendSimpleMessage";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { TestMessage } from "./TestMessage";


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

            case 'Enviar Mensaje de Prueba':

                const testMessage = new TestMessage(this)

                CLIProgram.setNextCommand(testMessage)
                break;

            case 'atras':
                CLIProgram.setNextCommand(this.back!)
                break;


        }



    };
    ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
        type: 'list',
        name: 'action',
        message: '',
        choices:
            [
                'Enviar Mensaje simple',
                'Enviar Mensaje de Prueba',
                'atras'],
    })







}