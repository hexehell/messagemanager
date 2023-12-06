import fs from 'fs'
import path from 'path'
import { CLICommand, Command } from "@CampaignCreator/cli/interfaces/Command.Factory";
import { Observable, from, of } from "rxjs";
import { CliAction } from '@CampaignCreator/cli/interfaces/CliAction';
import { ProgramCLI } from '@CampaignCreator/cli/classes/ProgramCLI';
import { QuestionCollection } from 'inquirer';
import { CLIProgram } from '@CampaignCreator/cli/classes/CLIProgram';

export class ListPhones implements CLICommand {

    constructor(back:CLICommand) {

        this.back = back

    }
    back: CLICommand | undefined;

    manageOptions = (options: CliAction) => {

        CLIProgram.setNextCommand(this.back!)
        
    }
    
    ListOptions = ():QuestionCollection<any> => {
        
        
        
        
        this.printPhones()



        return {
            type: 'list',
            name: 'action',
            message: 'Selecciona una opcion',
            choices: ['atras'],
          };


    }

    // flow$ = (back?: Observable<any> | undefined) => {

    //     this.printPhones()

    // return    back??of()
    // };

    printPhones() {

        !fs.existsSync(process.env.PATHTOPHONES ?? '') && fs.mkdirSync(process.env.PATHTOPHONES ?? '')

        return from(fs.readdirSync(process.env.PATHTOPHONES ?? '')
            .filter(file => fs.statSync(process.env.PATHTOPHONES + file).isDirectory())
            .filter(dir => ['wwjs', 'venom'].map(phonesCollection => phonesCollection.toLocaleLowerCase() === dir).some(res => res))
            .map(dir => {

                const botDir = process.env.PATHTOPHONES + dir

                return fs.readdirSync(botDir).map(phoneDir =>`${botDir}/${phoneDir}` )
            })


            //   
            //   .filter(dir=>fs.statSync(process.env.PATHTOPHONES+dir).isDirectory())
            //   .filter(dir=>path.basename(dir).startsWith('session-'))
        )
        //   .forEach(phone=>console.log(phone))

    }
}