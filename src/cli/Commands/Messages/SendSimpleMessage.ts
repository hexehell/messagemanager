import { CliAction } from "@CampaignCreator/cli/interfaces/CliAction";
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import inquirer, { QuestionCollection, } from "inquirer";
import { input, confirm } from "@inquirer/prompts";
import { Observable, concatMap, from, of } from "rxjs";
import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram";

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
    previousOptions?: CliAction | undefined;
    back: CLICommand | undefined;
    manageOptions = async (options: CliAction) => {

        const messageCreation = this.previousOptions?.extraParams as MessageConstructor ?? {}

        const action = options?.action

        switch (action) {

            case 'Preparar Mensaje':


                messageCreation.titulo = await input({ message: "titulo del Mensaje" })



                messageCreation.mensaje = await input({ message: "texto del Mensaje" })

                options.extraParams = messageCreation

                CLIProgram.setNextCommand(this, options)

                break;

            case 'Agregar Afiliados u otros telefonos a enviar':

                break;

            case 'Seleccionar telefonos Bots':

                break;

            case 'Vista previa antes de Enviar':
                console.clear()
                console.log({ ...this.previousOptions?.extraParams } ?? {})
                CLIProgram.setNextCommand(this, options)




                break;


        }

    };
    ListOptions = (options?: CliAction | undefined): QuestionCollection<any> => ({
        type: 'list',        
        name: 'action',
        message: 'Selecciona una opcion',
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