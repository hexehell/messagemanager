const init_InputCaptures = ()=>{

    const captureCtrlD = new CaptureInput()
    // const captureCtrlA = new CaptureInput('A',true)
    // const captureCtrlR = new CaptureInput('R',true)
  
    captureCtrlD.inputCaptured('r',true).subscribe({
      next:(val)=>{
  
        !!val &&console.clear()
  
        !!val &&console.log('pantalla borrada')
        !!val &&console.log('presiona una tecla ↓ para continuar')
      }
    })
  
    captureCtrlD.inputCaptured('a',true).subscribe({
      next:(val)=>{
  
        !!val && CLIProgram.closeCurrentPrompt()
        !!val &&console.clear()
        !!val && CLIProgram.backToBegining()
  
  
      }
    })
  
  
  
  }

import { CLIProgram } from "@CampaignCreator/cli/classes/CLIProgram"
  import { Observable, concatMap, fromEvent, of } from "rxjs";

export class CaptureInput {

    constructor() { }

    inputCaptured = (keySearch: string,control: boolean):Observable<any> => {

        let readline = require('readline');

        readline.emitKeypressEvents(process.stdin);


        if (process.stdin.isTTY)
            process.stdin.setRawMode(true);

     return   fromEvent(process.stdin, 'keypress').pipe(concatMap((emition) => {
            // console.log('got "keypress"', ch, key);
            const [a, { name, ctrl }] = emition as [string, { name: string, ctrl: boolean }]

            if ((name === keySearch) && control && ctrl)
                return of({ name, ctrl })

             return of()
        }))

    }
}
  