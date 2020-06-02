import * as initArrays from './initArrays';

export class ModelWasm {

    public static rows = 115;
    public static columns = 80;

    protected memory = new WebAssembly.Memory({initial: 256, maximum: 256});
    protected exports: any
    
    constructor() { }

    async createWebAssembly() {
    
        const env = {
          '__handle_stack_overflow': ()=>{},
          'table': new WebAssembly.Table({initial: 0, maximum: 0, element: 'anyfunc'}),
          'tableBase': 0,
          'memory': this.memory,
          'memoryBase': 1024,
          'STACKTOP': 0,
          'STACK_MAX': this.memory.buffer.byteLength,
        };
    
        let importObject = { env };
    
        let res = await fetch('./wasm/model-wasm.wasm');
        let bytes = await res.arrayBuffer();
        let obj = await WebAssembly.instantiate(bytes, importObject);
    
        return obj.instance.exports;
    }
    
    static async create() {
        let mwasm = new ModelWasm();

        return await mwasm.createWebAssembly().then(obj =>  {
            mwasm.exports = obj;

            return mwasm;
        });
    }
    
    get board(): number[][] {
        return this.getBoardArr();
    }

    get generation(): number {
        return this.exports._Z13getGenerationv();
    }
    
    get livingCells(): number {
        return this.exports._Z14getlivingCellsv();
    }


    protected clear() {
        this.exports._Z5clearv();
    
        return this;
    }

    public randomize(val: number) {
        this.exports._Z14randomizeBoardf(val);
    }
    
    public transform() {
        this.exports._Z9transformv();
    }
    
    private getBoardArr(): number[][] {
        let ptr = this.exports._Z11getBoardPtrv();
        let board = new Array(ModelWasm.rows);
    
        for (let r = 0; r < board.length; r++) {
          board[r] = new Int32Array(this.memory.buffer, ptr, ModelWasm.columns);
      
          ptr = ptr + ModelWasm.columns * Int32Array.BYTES_PER_ELEMENT;
        }
    
        return board;
    }

    private buildInitState() {
        this.clear();

        let tmp = initArrays.get20pArray();

        for (let r = 0; r < tmp.length; r++) {
            for (let c = 0; c < tmp[c].length; c++) {
                this.exports._Z12writeToArrayiii(r, c, tmp[r][c]);          
            }
        }
    }
    
    public initBoard() {
        //this.randomize(prob);
        this.buildInitState();
    }
}