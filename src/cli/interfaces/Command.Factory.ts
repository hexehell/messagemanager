import { Observable } from "rxjs";
import { CliAction } from "./CliAction";
import { QuestionCollection } from "inquirer";

export interface Command{

    

    flow$:(action?:CliAction)=>Observable<any>
}

export interface CLICommand{

    prompt?:boolean

    passInOptions?:CliAction|undefined

    back:CLICommand|undefined

    manageOptions: (options: CliAction)=>void

    ListOptions:(options?: CliAction | undefined)=>QuestionCollection<any> 
}