import ForthBase from './forth_base.js';
import * as std from 'std';

function log(message) {
    console.log(message);
}

class TextUI {
    constructor() {
    }

    println(s) {
        print(s);
    }


    output_html(el) {
        this.println(message);
    }



    /** public interface **/


    output_cr() {
        print("");
    }

    output_text(message) {
        std.printf('%s', message);
        std.out.flush();
    }

    output_printf(format, params) {
        std.printf.apply(null, [format, ...params]);
    }
    clear_output() {
        this.println('NO CLEAR OUTPUT FOR NOW');
    }

    print_console(message) {
        this.println(message);
    }

    clear_console() {
        this.println('NO CLEAR OUTPUT FOR NOW');
    }

}

export class Forth extends ForthBase {
    constructor(init) {
        super(init);
        this.ui = new TextUI();
    }

    print(message) {
        print(messsage);
    }
    println(message) {
        print(message);
    }

    error(message) {
        this.print_console(message);
        this.print_console('Re-initializing system to the starting state.');
        this.print_console(`If you wish to inspect the system post-error, set the global state variable "MODE" to the symbol 'debug`);
        this.initialize();
    }
}
