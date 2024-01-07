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