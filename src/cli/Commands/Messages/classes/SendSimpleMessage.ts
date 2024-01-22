import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection, } from "inquirer";
import { input, confirm } from "@inquirer/prompts";
import { Observable, concatMap, from, of } from "rxjs";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";
import { CLIUtils, PromptInput } from "@CampaignCreator/cli/utils/CliUtils";

export interface MessageConstructor {

    titulo?: string
    mensaje?: string
    rutaImagen?: string
    destinatarios?: []
    remitentes?: []

}

export class SendSimpleMessage implements CLICommand {

    constructor(back: CLICommand) {

        this.back = back;

    }
    passInOptions?: CliAction | undefined;
    back: CLICommand | undefined;
    manageOptions = async (options: CliAction) => {

        const messageCreation = this.passInOptions?.extraParams as MessageConstructor ?? {}

        const action = options?.action

        switch (action) {

            case 'Preparar Mensaje':

                console.clear()

                await CLIUtils.createInput({ name: 'titulo', message: 'titulo del Mensaje' } as PromptInput).then((answer) => {

                    messageCreation.titulo = answer.answer as string
                })

                await CLIUtils.createInput({ name: 'texto', message: 'texto del Mensaje' } as PromptInput).then((answer) => {

                    messageCreation.mensaje = answer.answer as string
                })


                console.table(messageCreation)

                await CLIUtils.createEnterToContinue('presiona enter para continuar....')

                // await inquirer.prompt({ message: "texto del Mensaje", name: 'message', type: 'input' }).then((answer) => {

                //     messageCreation.mensaje = answer.message

                // })




                options.extraParams = messageCreation


                return CLIProgram.setNextCommand(this, options)
                break;

            case 'Agregar Afiliados u otros telefonos a enviar':

                return CLIProgram.setNextCommand(this)
                break;

            case 'Seleccionar telefonos Bots':

                return CLIProgram.setNextCommand(this)
                break;

            case 'Vista previa antes de Enviar':
                console.clear()
                console.table(messageCreation)
                await CLIUtils.createEnterToContinue('presiona enter para continuar....')
                return CLIProgram.setNextCommand(this, options)




                break;

            case 'atras':
                return CLIProgram.setNextCommand(this.back!)
                break;


        }

    };
    ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
        type: 'list',
        name: 'action',
        message: '',
        choices:
            [
                'Preparar Mensaje',
                'Agregar Afiliados u otros telefonos a enviar',
                'Seleccionar telefonos Bots',
                'Vista previa antes de Enviar',
                'Enviar',
                'Guardar',
                'atras'
            ],


    });





}