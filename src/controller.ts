import * as gol from './model/index';
import { View } from './display/view';

export class Controller {

    protected model: any
    protected display: View

    protected genLimit: number;
    protected processor: number;
    protected procName: string;
    protected probability: number;

    private playing = false;
    private startTime: any;

    private constructor() { }

    static async create(genLimit: number = 0, processor: number = 0, probability: number = 20) {
        let ctrl = new Controller();

        ctrl.display = new View();

        ctrl.genLimit = genLimit;
        ctrl.processor = processor;
        ctrl.probability = probability;

        if (processor == 0) {
            ctrl.procName = "JavaScript";
            ctrl.model = new gol.ModelJS();

        } else {
            ctrl.procName = "WebAssembly";
            ctrl.model = await gol.ModelWasm.create();
        }

        ctrl.registerEventHandler();

        return ctrl;
    }

    registerEventHandler() {
        this.display.register((event:string, data:any) => {
            if (event == "start") {
                this.start();
            } else if (event == "end") {
                this.end();
            } else if (event == "chProc") {
                this.processor = data['proc'];

                if (this.playing) {
                    this.end();
                } else {
                    this.changeProcessor();
                } 
            }
            else if (event == "chLimit") {
                this.genLimit = data['limit'];

                if (this.playing) {
                    this.end();
                } else {
                    this.init();  
                } 
            }

            else if (event == "chInit") {
                this.probability = parseInt(data['init']);

                if (this.playing) {
                    this.end();
                } else {
                    this.init();  
                } 
            }
        });
    }

    loop() {
        setTimeout(() => {           
            if (this.playing) {
                this.model.transform();

                this.loop();
            }            
        }, 1000 / 30); //no gen limit = calculation limited to 30 gens/sec
    }

    loopLimit() {
        while (this.model.generation < this.genLimit) {
            this.model.transform();
        }
        //gen limit = calculation of gen/sec unlimited -> 100% cpu usage
        return;
    }

    start() {
        this.outputConfig(this.procName, this.model.livingCells);

        this.playing = true;
        this.startTime = new Date().getTime(); //UNIX EPOCH

        this.display.render({
            generation: "...",
            time: "...",
            gps: "..."
        });

        if (this.genLimit > 0) { this.loopLimit(); this.end(); } else this.loop();
    }

    end() {
        this.playing = false;

        let time = new Date().getTime() - this.startTime;
        let gen = this.model.generation;
        let gps = gen / (time / 1000);
        
        this.outputResults(gen, time, gps, this.model.livingCells);

        this.display.render({
            generation: gen.toString(),
            time: (time / 1000).toString(),
            gps: gps.toFixed().toString()
        });

        this.resetDisplay(0);

        this.init();
    }

    async init() {
        this.playing = false;

        return await this.model.initBoard(this.probability);
    }

    async changeProcessor() {
        this.resetDisplay(1);

        if (this.processor == 0) {
            this.procName = "JavaScript";
            this.model = new gol.ModelJS();
            this.model.initBoard(this.probability);
        } 
        
        else {
            return await gol.ModelWasm.create().then(obj => {
                this.procName = "WebAssembly";
                obj.initBoard(this.probability);
                return this.model = obj;
            });
        }
    }

    
    resetDisplay(val: number) {
        if (val > 0) {
            this.display.render({
                generation: "-",
                time: "-",
                gps: "-"
            });
        }
   
        this.display.reset();
    }

    outputConfig(procName: string, livingCells: number) {
        console.log("--- Configuration ---")
        console.log("Processor:\t\t\t" + procName);
        
        //115 * 80 = 9200 total cells on board;
        let percentageAlive = (livingCells / (11.5 * 8)).toFixed();
        console.log("Initial cells:\t\t" + livingCells + " (" + percentageAlive + "%)" );
        console.log("---------------------")
    }

    outputResults(gen: number, time: number, gps: number, livingCells: number) {
        console.log("--- Results ---")
        console.log("Generation:\t\t\t" + gen);
        console.log("Elapsed time:\t\t"  + time + " ms");
        console.log("Generations/sec:\t" + gps);
        console.log("Living cells:\t\t" + livingCells)
        console.log("---------------------")
    }
}