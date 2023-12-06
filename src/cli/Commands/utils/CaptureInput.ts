import { Observable, concatMap, fromEvent, of } from "rxjs";

export class CaptureInput {

    constructor(public keySearch: string, public control: boolean) { }

    inputCaptured = ():Observable<any> => {

        let readline = require('readline');

        readline.emitKeypressEvents(process.stdin);


        if (process.stdin.isTTY)
            process.stdin.setRawMode(true);

     return   fromEvent(process.stdin, 'keypress').pipe(concatMap((emition) => {
            // console.log('got "keypress"', ch, key);
            const [a, { name, ctrl }] = emition as [string, { name: string, ctrl: boolean }]

            if ((name === this.keySearch) && this.control && ctrl)
                return of({ name, ctrl })

            return of()
        }))

    }
}