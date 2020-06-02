import * as initArrays from './initArrays';

export class ModelJS {
    public static livingCell = 1;
    public static deadCell = 0;
    public static initCell = -1;

    public static rows = 115;
    public static columns = 80;

    protected _board: number[][] = [];
    protected _generation = 0;

    constructor(){  };

    get board(): number[][] {
        return this._board;
    }

    get generation(): number {
        return this._generation;
    }

    get livingCells(): number {
        let livingCells = 0;

        for (let i = 0; i < this._board.length; i++) {
            for (let j = 0; j < this._board[i].length; j++) {
                if (this._board[i][j] > 0) {
                    livingCells++;
                }                
            }
        }

        return livingCells;
    }

    protected clear() {
        for (let r = 0; r < 115; r++) {
            this._board[r] = [];

            for (let c = 0; c < 80; c++) {
                this._board[r][c] = ModelJS.initCell;
            }
        } 
        
        this._generation = 0;
    }

    public randomize(val: number) {
        this.clear();

        for (let r = 0; r < this._board.length; r++) {
            for (let c = 0; c < this._board[r].length; c++) {
                if (Math.random() <= val) {
                    this._board[r][c] = ModelJS.livingCell;
                }
            }
        }  
    }

    private countLivingNeighbours(row: number, column: number): number {
        let count = 0;
    
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = column - 1; c <= column + 1; c++) {
                if (r >= 0 && r < this._board.length &&
                    c >= 0 && c < this._board[0].length &&
                    (c != column || r != row))
                    count += (this._board[r][c] > 0 ? 1 : 0);
            }
        }
    
        return count;
    }

    private getNextState(state: number, neighbours: number): number {
        if (state <= ModelJS.deadCell && neighbours == 3) {
            return ModelJS.livingCell;
        } else if (state == ModelJS.livingCell && neighbours >= 2 && neighbours <= 3) {
            return ModelJS.livingCell;
        } else if (state == ModelJS.initCell) {
            return ModelJS.initCell;
        } else {
            return ModelJS.deadCell;
        }
    }

    public transform(): number[][] {
        this._generation += 1;

        return (this._board = this._board.map((row, r) => {
            return row.map((column, c) => {
                return this.getNextState(column, this.countLivingNeighbours(r, c));
            });
        }));
    }

    private buildInitState(val: number) {
        this.clear();

        switch(val) {
            case 20:
                this._board = initArrays.get20pArray();
                break;
            case 40:
                this._board = initArrays.get40pArray();
                break;
            case 60:
                this._board = initArrays.get60pArray();
                break;
            case 80:
                this._board = initArrays.get80pArray();
                break;
        }
    }

    public async initBoard(val: number) {
        //this.randomize(0.8);
        return this.buildInitState(val);
     }

}