import { Chalk } from "chalk";
import { LoggerFactory } from "../interfaces/LoggerFactory";
import { BasicLogErrStyle, BasicLogStyle } from "./ConsoleStyles";


export class ConsoleLogger implements LoggerFactory {
    resetErr() {
        this.logErrStyle = new BasicLogErrStyle()


    }
    resetLog() {

        this.LogStyle = new BasicLogStyle()

    }

    static instance: ConsoleLogger | undefined
    static get logger() {

        if (!!!ConsoleLogger.instance) {
            ConsoleLogger.instance = new ConsoleLogger()
        }

        return ConsoleLogger.instance
    }

    chalk: Chalk | undefined

    LogStyle: ConsoleStyle = new BasicLogStyle()
    logErrStyle: ConsoleStyle = new BasicLogErrStyle()

    constructor() {

        this.initLogger()
    }

    initLogger() {



        this.chalk = require('chalk')
    }


    getLogByType(style: LogType) {

        switch (style) {
            case LogType.err:
                return this.logErrStyle
            case LogType.log:
                return this.LogStyle
        }

    }



    setLogStyle(type: LogType, { bgColor, fgColor, bold, underline, dashedBox }: ConsoleStyle) {

        this.setStyle(type, bgColor, fgColor, bold, underline, dashedBox)
    }

    mixToRight(type: LogType, ...styles: ConsoleStyle[]) {

        styles.forEach(({ bgColor, fgColor, bold, underline, dashedBox }) => {

            this.setStyle(type, bgColor, fgColor, bold, underline, dashedBox)
        })

    }


    setStyle(logType: LogType, bgColor?: string | undefined, fgColor?: string | undefined, bold?: boolean | undefined, underline?: boolean | undefined, dashedBox?: boolean | undefined) {

        const logSelected: ConsoleStyle = this.getLogByType(logType)

        if (!!bgColor) logSelected.bgColor = bgColor
        if (!!fgColor) logSelected.fgColor = fgColor
        if (typeof bold !== 'undefined') logSelected.bold = bold
        if (typeof underline !== 'undefined') logSelected.underline = underline
        if (typeof underline !== 'undefined') logSelected.dashedBox = dashedBox

    }







    processColor = (message: string, { bgColor, bold, underline, fgColor }: ConsoleStyle) => {

        let format = this.chalk!.hex(fgColor ?? '#FFFFFF').bgHex(bgColor ?? '#FFFFFF')

        return underline ? format.underline(message) : bold ? format.bold(message) : format(message)

    }

    printDashedLine = (message: string, style: ConsoleStyle) => {
        console.log(this.processColor(new Array(message.length).fill('-').join(''), style))
    }

    log = (message: string, options?: ConsoleStyle) => {

        const logOptions = options ?? this.LogStyle

        logOptions.dashedBox && this.printDashedLine(message, logOptions)

        console.log(this.processColor(message, logOptions))

        logOptions.dashedBox && this.printDashedLine(message, logOptions)

    };

    logErr = (message: string, options?: ConsoleStyle) => {

        const logOptions = options ?? this.logErrStyle

        console.log(this.processColor(message, logOptions))

    };

    logInfo = () => { }





}

export enum LogType {
    'log',
    'err'
}

export interface ConsoleStyle {
    bgColor?: string | undefined
    fgColor?: string
    bold?: boolean
    underline?: boolean
    mayus?: boolean
    dashedBox?: boolean
}

