import inquirer, { QuestionCollection } from "inquirer";
import { Observable, concatMap, from, fromEvent, of, repeat, retry, tap } from 'rxjs';
// import { ProgramCLI } from "./cli/classes/ProgramCLI";
import { CliAction } from "./cli/interfaces/CliAction";
import { CaptureInput } from "./cli/Commands/utils/CaptureInput";
import { CLIProgram } from "./cli/classes/CLIProgram";
import AffiliateModel from "./database/Schemas/Affiliate/Affiliate.schema"
import mongoose from "mongoose";
import { DialogNFD } from "./FileDialogs/classes/DialogNFD";
import { DialogInquirer } from "./FileDialogs/classes/DialogInquirer";
import * as Path from 'path'

const main = async () => {

    // const dialogNFD = new DialogNFD()

    // console.log(await dialogNFD.showSingleOpenDialog())
    // console.log(await dialogNFD.showMultipleOpenDialog())
    // console.log(await dialogNFD.showSaveDialog())
    // console.log(await dialogNFD.showDirectoryDialog())

    // const dialogInquirer = new DialogInquirer()

    // console.log(await dialogInquirer.showSingleOpenDialog())

//     const { selectFiles } = require('select-files-cli');
 
// selectFiles({startingPath:process.env.USERPROFILE}).then((something:any) => {
//   console.log(something);
 
//   // [
//   //  '/Users/sam/Documents/select-files-cli/README.md',
//   //  '/Users/sam/Documents/select-files-cli/index.js'
//   // ]
 
//   console.log(status);
 
//   // 'SELECTION_COMPLETED' (or 'SELECTION_CANCELLED')
// });



}

main()