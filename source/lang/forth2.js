import ForthBase from './forth_base.js';
import * as std from 'std';

function log(message) {
    console.log(message);
}

export class Forth extends ForthBase {
    constructor(init) {
        super(init);
    }

    print(message) {
        print(messsage);
    }
    println(message) {
        print(message);
    }

    error(message) {
        this.console(message);
        this.console('Re-initializing system to the starting state.');
        this.console(`If you wish to inspect the system post-error, set the global state variable "MODE" to the symbol 'debug`);
        this.initialize();
    }
}
