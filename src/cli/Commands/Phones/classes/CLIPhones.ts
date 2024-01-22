import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { QuestionCollection } from "inquirer";
import { ListPhones } from "./ListPhones";
import { TurnOnPhone } from "./TurnOnPhone";
import { AddPhone } from "./AddPhone";

export class CLIPhones implements CLICommand {

    constructor(command: CLICommand) {
        this.back = command
    }

    back: CLICommand | undefined;
    manageOptions = (options: CliAction) => {

        const action = options?.action

        switch (action) {

            case 'Listar telefonos':

                const list = new ListPhones(this)

                CLIProgram.setNextCommand(list)

              

                break;

            case 'Agregar telefono':

                const addPhone = new AddPhone(this)

                CLIProgram.setNextCommand(addPhone)
                break;

            case 'Encender telefono':

                const turnOnPhone = new  TurnOnPhone(this)

                CLIProgram.setNextCommand(turnOnPhone)


                break;

            case 'Encender todos':
                break;
            case 'Eliminar telefono':
                break;
            case 'Eliminar todos':
                break;

            case 'Atras':
                CLIProgram.setNextCommand(this.back!)
                break;


        }

    };



    ListOptions = () => {



        const optionsList: QuestionCollection<any> = {
            type: 'list',
            name: 'action',
            message: '',
            choices:
                [
                    'Listar telefonos',
                    'Agregar telefono',
                    'Encender telefono',
                    'Encender todos',
                    'Eliminar telefono',
                    'Eliminar todos',
                    'Atras'],
        };


        return optionsList

    }
}