import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, fromEvent, of, repeat, retry, tap } from 'rxjs';
import { ProgramCLI } from "./cli/classes/ProgramCLI";
import { CliAction } from "./cli/interfaces/CliAction";
import { CaptureInput } from "./cli/Commands/utils/CaptureInput";
import { CLIProgram } from "./cli/classes/CLIProgram";


const main = async () => {


    // new CaptureInput('a', true).inputCaptured().subscribe((val)=>console.log(val))


    console.clear()

     const cli = new CLIProgram()

     CLIProgram.setNextCommand(cli)

     CLIProgram.menuNext.subscribe({
        next:async(options:CliAction)=>
        await CLIProgram.nextCommand.manageOptions(options),
        complete:()=>console.log('complete')
     })


    // const program$ = cli.optionsStartScreen$().pipe(repeat())



    // program$.subscribe({
    //     next: (val) => {

    //         console.log(val)
    //     },
    //     error: (err) => console.log(err),
    //     complete: () => console.log('complete')
    // })








}

main()