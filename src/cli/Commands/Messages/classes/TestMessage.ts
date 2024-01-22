import { MessageSender } from "@CampaignCreator/Sender/MessageSender";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { CLIUtils, PromptInput, FormPromptChoiceAutoComplete } from "@CampaignCreator/cli/utils/CliUtils";
import { PhonesInfo } from "@CampaignCreator/transformers/PhonesInfo";
import { QuestionCollection } from "inquirer";

export class TestMessage implements CLICommand {

    constructor(back: CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;
    manageOptions = async (options: CliAction) => {

        const action = options?.action

        if (action === 'atras')
            return CLIProgram.setNextCommand(this.back!)

        const typeMessage = await CLIUtils.createAutoComplete({ name: 'type', message: 'Que tipo de mensaje deseas mandar?', autocomplete: ['texto', 'imagen'] } as FormPromptChoiceAutoComplete)

        // console.log(typeMessage)



        const phoneTo = await CLIUtils.createInput({ name: 'message', message: 'escribie el telefono prueba' } as PromptInput)


        const sender = new MessageSender(PhonesInfo.getClientByPhone(options.action as string)!)

        switch (typeMessage.answer as string) {
            case 'texto':
                await sender.tester.sendTestMessage(phoneTo.answer as string)
                console.log('Mensaje de prueba ha sido enviado')

                break

            case 'imagen':

                await sender.tester.sendImageTestMessage(phoneTo.answer as string)
                console.log('Mensaje de prueba ha sido enviado')
                break
        }




        return CLIProgram.setNextCommand(this.back!)





    };
    ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
        type: 'list',
        name: 'action',
        message: '',
        choices: Array.prototype.concat(PhonesInfo.listAllAvailablePhonesForChoosing(), ['atras'])

    })






}