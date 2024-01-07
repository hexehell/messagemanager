import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { QuestionCollection } from "inquirer";
import { SearchAffiliate } from "./Search";
import Table = require('cli-table');
import { AffiliateMongo } from "@CampaignCreator/database/classes/Affiliates/classes/AfiliateMongo";
import { Affiliate } from "@CampaignCreator/database/classes/Affiliates/interfaces/Affiliate";
import { CLIUtils, FormPromptChoice, FormPromptChoiceAutoComplete, FormPromptChoiceDatePicker, FormPromptChoiceYesNo, PromptAnswer } from "@CampaignCreator/cli/utils/CliUtils";
import { SponsorMongo } from "@CampaignCreator/database/classes/Sponsors/classes/SponsorMongo";
import { SuburbMongo } from "@CampaignCreator/database/classes/Suburb/classes/SuburbMongo";
import { CLIFormBuilder } from "@CampaignCreator/cli/utils/CLIFormBuilder";
import { createSpinner } from "nanospinner";



export class CreateAffiliate implements CLICommand {

    constructor(command: CLICommand) {
        this.back = command
    }

    prompt?: boolean | undefined = false;

    passInOptions: CliAction | undefined;

    back: CLICommand | undefined;
    manageOptions = async (options: CliAction) => {

        const dbAffiliate = new AffiliateMongo()
        const dbSponsors = new SponsorMongo()
        const dbSuburbs = new SuburbMongo()

        const sponsors = await dbSponsors.listAllByName()
        const suburbs = await dbSuburbs.listAllByName()

        const choices: Map<string, FormPromptChoice | FormPromptChoiceAutoComplete | FormPromptChoiceDatePicker | FormPromptChoiceYesNo> = new Map()

        choices.set('name', { name: 'name', message: 'Escribe el nombre del Afiliado', initial: '' })
        choices.set('phone', { name: 'phone', message: 'Escribe el telefono del Afiliado', initial: '' })
        choices.set('marital', { name: 'marital', message: 'Esta casado/a?', initial: '', yesnoQuestion: true })
        choices.set('kids', { name: 'kids', message: 'tiene hijos?', initial: '', yesnoQuestion: true })
        choices.set('birthDate', { name: 'birthDate', message: 'Escribe la fecha de nacimiento', initial: '', date: true })
        choices.set('suburb', { name: 'suburb', message: 'En que colonia vive?', initial: '', autocomplete: suburbs, fieldToShow: 'colonia' })
        choices.set('sponsor', { name: 'sponsor', message: 'Quien es el responsable?', initial: '', autocomplete: sponsors, fieldToShow: 'name' })
        choices.set('relation', { name: 'relation', message: 'Que relacion se tiene?', initial: '', autocomplete: ['AFILIADO', 'EXTERNO', 'SINDICALIZADO'] })


        const affForm = new CLIFormBuilder(Array.from(choices.values()))


        const newAffiliate = (await affForm.prompt())
            .map(({ answer, field }: PromptAnswer) => {

                const row: any = new Object()

                row[field] = answer

                return row
            })
            .reduce((result: any, element: any, index: number) => {
                result = {...result, ...element};
                return result;
            }, {}) as Affiliate;

        //  console.log(answers)

         CLIUtils.showVerticalTable(newAffiliate)

         await CLIUtils.YesNoDialog({name:'create',message:'Se creara un Affiliado. Deseas guardarlo?'} as FormPromptChoiceYesNo).then(async (answer:PromptAnswer)=>{

            if(!!answer.answer){
               await dbAffiliate.create(newAffiliate).catch(err=>console.log(err))
            
               createSpinner('Affiliado Guardado').success()
            }
            

         })





        CLIProgram.setNextCommand(this.back!)

    };

    createAutocompleteEnquirer(arr: []) {

        return
    }


    ListOptions = () => {


        const optionsList: QuestionCollection<any> = {
        };


        return optionsList

    }
}