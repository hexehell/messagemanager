export abstract class AbstractDialog{

    abstract showSingleOpenDialog():Promise<string>
    abstract showMultipleOpenDialog():Promise<string[]>
    abstract showSaveDialog():Promise<boolean>
    abstract showDirectoryDialog():Promise<boolean>
}