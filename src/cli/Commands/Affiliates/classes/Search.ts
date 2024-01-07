import { AffiliateMongo } from "@CampaignCreator/database/classes/Affiliates/classes/AfiliateMongo";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { QuestionCollection } from "inquirer";
import { createSpinner } from "nanospinner";
import { CLIUtils, FormPromptChoiceAutoComplete } from "@CampaignCreator/cli/utils/CliUtils";



export class SearchAffiliate implements CLICommand {

  constructor(back: CLICommand, private selectedCommand?: CLICommand) {
    this.back = back

    if (!!!selectedCommand)
      this.selectedCommand = this.back
  }
  passInOptions: CliAction | undefined;

  back: CLICommand | undefined;
  manageOptions = async (options: CliAction) => {

    const action = options?.action

    // if (!!!action)
    // return  CLIProgram.setNextCommand(this.back!)



    switch (action) {

      case 'Por Nombre':

        return await this.searchByName()



        break;

      case 'Por Telefono':

        return await this.searchByPhone()


        break;

      case "atras":

        return CLIProgram.setNextCommand(this.back!)

        break;

    }






  };

  searchByName = async () => {

    const dbAffiliates = new AffiliateMongo()

    const spinner = createSpinner('Cargando...').start()


    // await new Promise(resolve=>setTimeout(()=>resolve(1),3000))

    const listAff = await dbAffiliates.listAllByPhoneNameId()

    const displayAff = listAff.map(x => x.name)

    spinner.stop()

    const displaySelected: string = (await CLIUtils.createAutoComplete({name:'name',autocomplete:displayAff, message:'Selecciona el nombre'} as FormPromptChoiceAutoComplete)).answer.toString()





    let selected = listAff.filter(x => x.name === displaySelected)[0]


    if (displayAff.filter((x: string) => x.toLocaleLowerCase() === displaySelected.toLocaleLowerCase()).length) {

      console.log('existen multiples opciones para este nombre. Especifique')

      selected = await this.promptList(listAff.filter(x => x.name === displaySelected))

    }





    return CLIProgram.setNextCommand(this.selectedCommand!, { extraParams: selected } as CliAction)


  }

  async promptList(arr: { id: string; phone: string; name: string; }[]): Promise<{ id: string; phone: string; name: string; }> {

    const choices = arr.map((x) => `${x.id} - ${x.name} ${x.phone} `)

    const { Select } = require('enquirer');

    const prompt = new Select({
      name: 'aff',
      message: 'Seleccionar',
      choices: choices
    });

    let selected = await prompt.run()
      .then((answer: string) => answer.split('-')[0].trim())
      .catch(console.error);

    return arr.filter(x => x.id === selected)[0]


  }

  searchByPhone = async () => {

    const dbAffiliates = new AffiliateMongo()

    const spinner = createSpinner('Cargando...').start()


    // await new Promise(resolve=>setTimeout(()=>resolve(1),3000))

    const listAff = await (await dbAffiliates.listAllByPhoneNameId())

    const displayAff = listAff.map(x => x.phone)



    spinner.stop()




    const displaySelected: string = (await CLIUtils.createAutoComplete({name:'phone',autocomplete:displayAff, message:'Selecciona el telefono'} as FormPromptChoiceAutoComplete)).answer.toString()


    let selected = listAff.filter(x => x.name === displaySelected)[0]


    if (displayAff.filter((x: string) => x.toLocaleLowerCase() === displaySelected.toLocaleLowerCase()).length) {

      console.log('existen multiples opciones para este telefono. Especifique')

      selected = await this.promptList(listAff.filter(x => x.phone === displaySelected))

    }




    return CLIProgram.setNextCommand(this.selectedCommand!, { extraParams: selected } as CliAction)

  }




  ListOptions = () => {


    const optionsList: QuestionCollection<any> = [{
      type: 'list',
      name: 'action',
      message: 'Como desea buscar?',
      choices:
        [
          'Por Nombre'
          , 'Por Telefono'
          , 'atras'
        ],
    }]


    return optionsList

  }
}