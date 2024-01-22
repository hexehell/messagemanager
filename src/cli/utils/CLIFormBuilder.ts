import { CLIUtils, PromptInput, PromptAnswer, FormPromptChoiceAutoComplete, FormPromptChoiceYesNo } from "./CliUtils";

export class CLIFormBuilder {

    constructor(private choices: (PromptInput | FormPromptChoiceAutoComplete | FormPromptChoiceYesNo)[]) { }

    async prompt(): Promise<PromptAnswer[]> {

        const res: PromptAnswer[] = []

        for (let i = 0; i < this.choices.length; i++) {

            const choice: PromptInput | FormPromptChoiceAutoComplete | FormPromptChoiceYesNo = this.choices[i]


            if ('yesnoQuestion' in choice) {

                res.push(await CLIUtils.YesNoDialog(choice ))


            } else if ('autocomplete' in choice) {

                res.push(await CLIUtils.createAutoComplete(choice))


            } else if('date'in choice){

                res.push(await CLIUtils.createDateTimePicker(choice))
            }
            else {

                res.push(await CLIUtils.createInput(choice))

            }

        }

        return res;

    }

}