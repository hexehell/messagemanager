import Table from "cli-table"
import { ObjectUnsubscribedError } from "rxjs";
import { v4 as uuid } from 'uuid'

export class CLIUtils {


    static async createInput({ name, message, initial }: FormPromptChoice): Promise<PromptAnswer> {

        const { Input } = require('enquirer');
        const prompt = new Input({
            message: message,
            initial: initial

        });

        return await prompt.run().then((answer: any) => {
            return { answer: answer, field: name } as PromptAnswer
        }).catch(console.log);

    }

    static async YesNoDialog({ name, message }: FormPromptChoiceYesNo): Promise<PromptAnswer> {
        const { Confirm } = require('enquirer');

        const prompt = new Confirm({
            name: 'question',
            message: message
        });

        return await prompt.run()
            .then((answer: boolean) => {
                return { answer: answer, field: name } as PromptAnswer
            })
            .catch(console.error);
    }


    static async createForm(message: string, choices: FormPromptChoice[]): Promise<any> {

        const { Form } = require('enquirer');

        const prompt = new Form({
            name: 'something',
            message: message,
            choices: choices
        });

        return await prompt.run()
            .then((value: any) => value)
            .catch(console.error)

    }

    static async createDateTimePicker({ name, message }: FormPromptChoice) {

        const inquirer = require('inquirer');

        inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

        var questions = [
            {
                type: 'datetime',
                name: 'dt',
                message: message + ' (dd/MM/yyyy)',
                format: ['dd', '/', 'MM', '/', 'yyyy']


            }
        ];

        return await inquirer.prompt(questions).then((answer: any) => {

            return { answer: answer.dt, field: name } as PromptAnswer
            // console.log(JSON.stringify(answers, null, '  '));
        });

    }


    static async createAutoComplete({ name, autocomplete, message, fieldToShow }: FormPromptChoiceAutoComplete): Promise<PromptAnswer> {


        const arrWithID = autocomplete.map(row => {

            return { show: fieldToShow ? row[fieldToShow] : row, id: uuid() }
        })

        const arrShow = autocomplete.map(row => fieldToShow ? row[fieldToShow] : row)

        const { AutoComplete } = require('enquirer');

        const prompt = new AutoComplete({
            name: 'autocomplete',
            message: message,
            limit: 10,
            initial: 0,
            choices: Array.from(arrShow.filter((x, i, a) => a.indexOf(x) == i)),


        });

        const ans: (boolean | string) = await prompt.run()
            .then((answer: any) => answer).catch((error: any) => console.log(error));

        return { answer: ans, field: name } as PromptAnswer


    }

    static showVerticalTable(something: any) {


        if (Array.isArray(something))
            return console.table(something)
        else
            return console.table(Object.entries(something))

        // console.log(CLIUtils.createVerticalTable(something).toString())


    }

    static showHorizontalTable(something: any[], colsWidth?: number[]) {


        const values = something.map(entry => Object.values(entry)).map(entry => entry.map(val => val as string))
        const headers = something.map(entry => Object.keys(entry))[0]

        console.log(CLIUtils.createHorizontalTable(headers, values, colsWidth).toString())

    }

    static createHorizontalTable(headers: string[], body: string[][], colsWidth?: number[]) {



        let tbl: Table | undefined

        if (!!!colsWidth)
            tbl = new Table({ style: { 'padding-right': 10 }, head: headers })
        else
            tbl = new Table({ style: { 'padding-right': 10 }, head: headers, colWidths: colsWidth })


        body.forEach(arr => {

            tbl!.push(arr)
        })

        return tbl


    }

    static createVerticalTable(something: any): Table {

        const affTbl = new Table({ style: { 'padding-right': 10 } })

        Object.entries(something).map((entry: [string, unknown]) => {

            let row: { [clave: string]: any } = {}

            if (typeof entry[1] === typeof Date) {

                entry[1] = new Date((entry[1] as Date).getDate())
            }

            if (Array.isArray(entry[1])) {

                entry[1] = entry[1].join(' ')

            }



            row[entry[0]] = entry[1]


            affTbl.push(row)

            return 0
        })

        return affTbl
    }
}

export interface PromptAnswer {

    answer: string | boolean
    field: string
}

export interface FormPromptChoice {
    name: string
    message: string
    initial: string
}

export interface FormPromptChoiceYesNo extends FormPromptChoice {
    yesnoQuestion: boolean
}

export interface FormPromptChoiceDatePicker extends FormPromptChoice {
    date: boolean
}

export interface FormPromptChoiceAutoComplete extends FormPromptChoice {
    autocomplete: any[]
    fieldToShow?: string
}