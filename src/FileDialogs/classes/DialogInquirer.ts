import inquirer from "inquirer";
import { AbstractDialog } from "../abstract/Dialog";

export class DialogInquirer extends AbstractDialog {

    constructor(){
        super();
        inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))
    }

    showSingleOpenDialog(): Promise<string> {
        return inquirer.prompt([
            {
              type: 'fuzzypath',
              name: 'path',
            //   excludePath: nodePath => nodePath.startsWith('node_modules'),
                // excludePath :: (String) -> Bool
                // excludePath to exclude some paths from the file-system scan
            //   excludeFilter: nodePath => nodePath == '.',
                // excludeFilter :: (String) -> Bool
                // excludeFilter to exclude some paths from the final list, e.g. '.'
              itemType: 'any',
                // itemType :: 'any' | 'directory' | 'file'
                // specify the type of nodes to display
                // default value: 'any'
                // example: itemType: 'file' - hides directories from the item list
              rootPath: 'app',
                // rootPath :: String
                // Root search directory
              message: 'Select a target directory for your component:',
              default: 'components/',
              suggestOnly: false,
                // suggestOnly :: Bool
                // Restrict prompt answer to available choices or use them as suggestions
              depthLimit: 5,
                // depthLimit :: integer >= 0
                // Limit the depth of sub-folders to scan
                // Defaults to infinite depth if undefined
            }
          ]);
    }
    showMultipleOpenDialog(): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    showSaveDialog(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    showDirectoryDialog(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

export const homeDir = () => {

    const os = require('os');

    const platform = os.platform();

    if (platform === 'win32') {
        return process.env.USERPROFILE

    } else if (platform === 'linux') {
        const os = require('os');
        
        return  os.homedir();
    } else if (platform === 'darwin') {
        const os = require('os');
        
        return  os.homedir();
    } else {
        const os = require('os');
        
        return  os.homedir();
    }
}