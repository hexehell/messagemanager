import { v4 as uuid } from 'uuid'

// export enum FillOptions {
//     FillRight = 'FillRight',
//     FillLeft = 'FillLeft'

// }

// export enum TrimOptions {
//     TrimLeft = 'TrimLeft',
//     TrimRight = 'TrimRight'
// }


// export interface TableOptions {
//     fill: FillOptions
//     trim: TrimOptions

// }

interface IndexTable {
    id: string,
    name: string,
    order: number
}

class Cell {

    id: string = uuid()

    constructor(public value: unknown) { }
}

class Column {

    id: string = uuid()
    name: string | undefined = undefined


    static newColumn(name: string, parent: Table) {
        const column: Column = new Column(parent)

        column.name = name

        return column
    }

    constructor(private table: Table) { }


}

class Row {


    id: string = uuid()

    Cells: Map<IndexTable, Cell> = new Map()

    index: number = -1


    constructor(private table: Table) {


    }

    setFullRow(row: unknown[]) {

        for (let value of row)
            this.set(value)

    }

    setNewCell(key: IndexTable, newCell: Cell) {

        this.Cells.set(key, newCell)
    }

    set(value: unknown) {

        const newCell = new Cell(value)

        this.Cells.set({ id: newCell.id, name: this.table.getColumnNameByOrder(this.Cells.size)!, order: this.Cells.size }, newCell)
    }

    setRowToTheRight(value: unknown, position: number) {
        if (this.Cells.size <= position) {

            this.set(value)

            return true
        }

        return false
    }

    setRowsOnPosition(value: unknown, position: number) {


        return this.setRowToTheRight(value, position) || this.setRowInBetween(value, position)



    }





    setRowInBetween(value: unknown, position: number) {

        if (this.Cells.size > position) {


            const kvFirstPart = Array.from(this.Cells.entries()).slice(0, position)
            const kvSecondPart = Array.from(this.Cells.entries()).slice(position, this.Cells.size).map(([key, value]: [IndexTable, Cell]) => {

                key.order++;

                return [key, value] as [IndexTable, Cell]
            })

            this.Cells.clear()

            for (let [key, value] of kvFirstPart) {

                this.Cells.set(key, value)

            }

            this.set(value)

            for (let [key, value] of kvSecondPart) {

                this.Cells.set(key, value)

            }


            return true
        }

        return false
    }



    replaceByName(column: string, value: unknown) {

        const newCell = new Cell(value)


        const cellTobeReplaced = Array.from(this.Cells.keys()).find((cell: IndexTable) => {

            return cell.name === column

        })

        if (!!cellTobeReplaced) {

            this.setNewCell({ id: newCell.id, name: column, order: cellTobeReplaced.order }, newCell)

            this.Cells.delete(cellTobeReplaced)

        }


    }


    get(column: string | number) {


        return this.getCellByNumber(column) ?? this.getCellByString(column)


    }

    getCellByNumber(column: unknown): unknown {

        if (typeof column === 'number') {

            const index = column as number

            return Array.from(this.Cells.entries())[index]





        }


    }

    getCellByString(columnName: unknown): Cell | undefined {
        if (typeof columnName === 'string') {

            columnName = columnName as string

            const selectedCell = Array.from(this.Cells.keys()).find((column: IndexTable) => { return column.name == columnName })!

            return this.Cells.get(selectedCell)
        }

    }

    static newRow(row: unknown[], parent: Table) {
        const newRow: Row = new Row(parent)

        newRow.setFullRow(row)


        return newRow
    }

    toLog() {

        let toLog = ''

        this.Cells.forEach((cell: Cell) => {

            toLog += `${cell.value}  `

        })

        console.log(toLog)
    }

}

class Table {



    // columns:Column[]
    firstRowColumns: boolean = false
    columns: Map<IndexTable, Column> = new Map()
    rows: Map<IndexTable, Row> = new Map()

    constructor(
        // private options?: TableOptions
    ) { }

    get HeadersBeenSet(): boolean {
        return this.columns.size > 1
    }

    addColumn(name: string, defaultFill: unknown = undefined) {

        const newColumn = Column.newColumn(name, this)


        this.columns.set({
            id: newColumn.id,
            name: name,
            order: this.columns.size
        }, newColumn)

        this.verticalPopulateRows(defaultFill, this.columns.size)
    }

    addColumnToRigth(name: string, defaultFill: unknown = undefined) {


        this.addColumnWhenLoaded(name, this.columns.size, defaultFill)

    }

    addColumnInBetween(name: string, position: number, defaultFill: unknown = undefined) {

        const newColumn = Column.newColumn(name, this)

        this.setColummnsOnPosition(newColumn, position)


        this.addRowsInBetween(position, defaultFill)

    }

    getColumnNameByOrder(order: number) {
        let orderSelected = Array.from(this.columns.keys()).find((indexValue: IndexTable) => indexValue.order === order)

        return !!orderSelected ? orderSelected.name : undefined
    }

    getColumnOrderByName(name: string) {
        let orderSelected = Array.from(this.columns.keys()).find((indexValue: IndexTable) => indexValue.name === name)

        return !!orderSelected ? orderSelected.order : -1


    }

    setValueOn(row:number,col:number,value:unknown){

        Array.from(this.rows).filter(rowValue=>row === rowValue[0].order)
                             .map(rowValue=>Array.from(rowValue[1].Cells))[0]
                             .filter(cellValue=>cellValue[0].order ===col)
                             .map(cellValue=>cellValue[1])[0].value = value
    }

    fillRow(row:unknown[]){

        const diff = this.columns.size-row.length

        if(diff>0){

           row = Array.prototype.concat(row,(new Array(diff).fill(''))) 

        }

        this.addRow(row)
    }

    addRow(row: unknown[]) {


        if (this.columns.size < 1) return false



        return this.addHeaderRow(row) || this.addExactRow(row)






    }

    addHeaderRow(row: unknown[], override: boolean = false) {

        if (override || !this.HeadersBeenSet) {

            this.addColumnFirstRow(row)

            return true

        }

        return false

    }




    private addColumnFirstRow(row: unknown[]) {



        for (let column of row)
            this.addColumn(column!.toString())


    }




    private addExactRow(row: unknown[]) {



        if (row.length == this.columns.size) {

            const newRow = Row.newRow(row, this)

            newRow.index = this.rows.size

            this.rows.set({ id: newRow.id, name: newRow.id, order: this.rows.size }, newRow)

            return true
        }

        return false

    }


    private addRowsInBetween(position: number, defaultFill: unknown = undefined) {

        this.verticalPopulateRows(defaultFill, position)
    }

    private verticalPopulateRows(defaultFill: unknown, order: number) {

        if (this.rows.size < 1) return true

        this.rows.forEach((row: Row) => {



            row.setRowsOnPosition(defaultFill, order)


        })

    }


    private addColumnWhenLoaded(name: string, pos?: number, defaultFill?: unknown) {
        const newColumn = Column.newColumn(name, this)

        if (this.columns.size < pos!)
            this.addColumn(name)


    }

    private setColumnToLeft(column: Column, position: number): boolean {

        if (this.columns.size <= position) {

            this.columns.set({
                id: column.id,
                name: column.name!,
                order: position
            }, column)

            return true
        }

        return false
    }

    private setColummnsOnPosition(column: Column, position: number): boolean {

        return this.setColumnToLeft(column, position) || this.setColumnInBetween(column, position)

    }

    private setColumnInBetween(column: Column, position: number): boolean {

        if (this.columns.size > position) {


            const kvFirstPart = Array.from(this.columns.entries()).slice(0, position)
            const kvSecondPart = Array.from(this.columns.entries()).slice(position, this.columns.size).map(([key, value]: [IndexTable, Column]) => {

                key.order++;

                return [key, value] as [IndexTable, Column]
            })

            this.columns.clear()

            for (let [key, value] of kvFirstPart) {

                this.columns.set(key, value)

            }

            this.columns.set({
                id: column.id,
                name: column.name!,
                order: position
            }, column)


            //  this.addColumn(column)

            for (let [key, value] of kvSecondPart) {

                this.columns.set(key, value)

            }


            return true
        }

        return false
    }



    static fromScratch(columns?: string[]) {

        const newTable = new Table()

        columns ? newTable.addColumnFirstRow(columns) : undefined

        return newTable

    }



    static fromMatrixArray(table: unknown[][], firstRowColumns: boolean) {

        const newTable = new Table()

        newTable.firstRowColumns = firstRowColumns





    }

    toLog() {

        let tologHeaders = ''

        Array.from(this.columns.values()).forEach((columnName) => {
            tologHeaders += `${columnName.name}  `
        })

        console.log(tologHeaders)

        Array.from(this.rows.values()).forEach((rowvalue) => {
            rowvalue.toLog()
        })

    }

}

export {

    IndexTable
    , Cell
    , Column
    , Row
    , Table

}

