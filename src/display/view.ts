export class View {
    protected handler:(event:string, data:any) => void;

    protected outputGeneration:HTMLSpanElement;
    protected outputTime:HTMLSpanElement;
    protected outputGps:HTMLSpanElement;

    protected selectProc:HTMLSelectElement;
    protected selectLimit:HTMLSelectElement;
    protected selectInit:HTMLSelectElement;

    protected buttonStart:HTMLButtonElement;
    protected buttonEnd:HTMLButtonElement;

    constructor() {
        this.outputGeneration = document.querySelector('#outputGen');
        this.outputTime = document.querySelector('#outputTime');
        this.outputGps = document.querySelector('#outputGenSec');

        this.selectProc = document.querySelector('#proc-select');
        this.selectLimit = document.querySelector('#lim-select');
        this.selectInit = document.querySelector('#init-select');


        this.buttonStart = document.querySelector('#start-button');
        this.buttonEnd = document.querySelector('#end-button');

        this.selectProc.addEventListener('change', (event:any) => this.changeProcessor(event.target.value));
        this.selectLimit.addEventListener('change', (event:any) => this.changeLimit(event.target.value));
        this.selectInit.addEventListener('change', (event:any) => this.changeInit(event.target.value));

        this.buttonStart.addEventListener('click', () => this.start());
        this.buttonEnd.addEventListener('click', () => this.end());
    }

    start() {
        this.buttonEnd.removeAttribute("disabled");
        this.buttonStart.setAttribute("disabled", "true");
        this.buttonStart.innerHTML = "Running ..."

        this.selectLimit.setAttribute("disabled", "true");
        this.selectProc.setAttribute("disabled", "true");
        this.selectInit.setAttribute("disabled", "true");

        this.trigger('start');
    }

    end() {
        this.buttonStart.removeAttribute("disabled");
        this.buttonStart.innerHTML = "Start";
        this.buttonEnd.setAttribute("disabled", "true");

        this.selectLimit.removeAttribute("disabled");
        this.selectProc.removeAttribute("disabled");
        this.selectInit.removeAttribute("disabled");

        this.trigger('end');
    }

    changeProcessor(proc: number) {
        this.trigger('chProc', {
            proc: proc
        })
    }

    
    changeLimit(limit: number) {
        this.trigger('chLimit', {
            limit: limit
        })
    }

    changeInit(init: number) {
        this.trigger('chInit', {
            init: init
        })
    }

    render(data:{generation: string, time: string, gps: string} = {generation: "-", time: "-", gps: "-"}) {
        this.outputGeneration.innerHTML = data.generation.toString();
        this.outputTime.innerHTML = data.time.toString() + " seconds";
        this.outputGps.innerHTML = data.gps.toString();
    }

    reset() {
        this.buttonStart.removeAttribute("disabled");
        this.buttonStart.innerHTML = "Start";
        this.buttonEnd.setAttribute("disabled", "true");

        this.selectLimit.removeAttribute("disabled");
        this.selectProc.removeAttribute("disabled");
        this.selectInit.removeAttribute("disabled");
        //this.selectLimit.selectedIndex = 0;
    }

    trigger(event:string, data:any = undefined) {
        if (this.handler) {
            this.handler(event, data);
        }        
    }

    register(handler:(event:string, data:any) => void) {
        this.handler = handler;
    }
}