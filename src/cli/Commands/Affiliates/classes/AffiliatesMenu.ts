import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { QuestionCollection } from "inquirer";
import { SearchAffiliate } from "./Search";
import { ShowAffiliate } from "./ShowAffiliate";
import { CreateAffiliate } from "./CreateAffiliate";


export class AffiliatesMenu implements CLICommand {

    constructor(command: CLICommand) {
        this.back = command
    }

    back: CLICommand | undefined;
    manageOptions = (options: CliAction) => {

        const action = options?.action

        switch (action) {

            case 'Listar':


                break;
            case 'Buscar':

                const showAff = new ShowAffiliate(this)

                const search = new SearchAffiliate(this, showAff)


                return CLIProgram.setNextCommand(search)

                break;

            case 'Crear':

                const createAff = new CreateAffiliate(this)

                return CLIProgram.setNextCommand(createAff)

                break;

            case 'Modificar':



                break;

            case 'Eliminar':
                break;
            case 'Eliminar todos':
                break;

            case 'atras':
                return CLIProgram.setNextCommand(this.back!)
                break;




        }
        return CLIProgram.setNextCommand(this.back!)


    };



    ListOptions = () => {


        const optionsList: QuestionCollection<any> = {
            type: 'list',
            name: 'action',
            message: 'Selecciona una opcion',
            choices:
                [
                    'Listar'
                    , 'Buscar'
                    , 'Crear'
                    , 'Modificar'
                    , 'Eliminar'
                    , 'Eliminar todos'
                    , 'atras'
                ],
        };


        return optionsList

    }
}