import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { QuestionCollection } from "inquirer";
import { SearchAffiliate } from "./Search";
import Table = require('cli-table');
import { AffiliateMongo } from "@CampaignCreator/database/classes/Affiliates/classes/AfiliateMongo";
import { Affiliate } from "@CampaignCreator/database/classes/Affiliates/interfaces/Affiliate";
import { CLIUtils } from "@CampaignCreator/cli/utils/CliUtils";



export class ShowAffiliate implements CLICommand {

    constructor(command: CLICommand) {
        this.back = command
    }

    prompt?: boolean | undefined = false;

    passInOptions: CliAction | undefined;

    back: CLICommand | undefined;
    manageOptions = async (options: CliAction) => {

        const dbAffiliate = new AffiliateMongo()



        const AffSelected: any | undefined = await dbAffiliate.getAffByID(this.passInOptions?.extraParams!.id)


        CLIUtils.showVerticalTable(AffSelected)

        


         await CLIUtils.createEnterToContinue( 'presione enter para continuar...')


        return  CLIProgram.setNextCommand(this.back!)


    };



    ListOptions = () => {


        const optionsList: QuestionCollection<any> = {
        };


        return optionsList

    }
}