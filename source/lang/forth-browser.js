function log(message) {
    console.log(message);
}

export default class WebUI {
    constructor() {
        this.initializeOutputElement();
        this.initializeConsoleElement();
    }

    initializeOutputElement() {
        this.output_selector = '#output';
        this.output_element = document.querySelector(this.output_selector);

        if (!this.output_element) {
            throw new Error(`output element not found with selector '${this.output_selector}'`);
        }
    }

    initializeConsoleElement() {
        this.console_selector = '#console';
        this.console_element = document.querySelector(this.console_selector);

        if (!this.console_element) {
            throw new Error(`console element not found with selector '${this.console_selector}'`);
        }

    }

    message_el(message) {
        const message_el = document.createElement('div');
        message_el.style.display = 'inline-block';
        message_el.style.border = '1px solid silver';
        message_el.style.padding = '0.25rem';
        message_el.style.margin = '0.25rem';
        message_el.innerText = message;
        return message_el;
    }

    /** OUTPUT **/

    output_html(el) {
        this.output_element.appendChild(el);
    }

    print(message) {
        this.output_element.innerText = this.output_element.innerText + message;
    }
    println(message) {
        this.output_element.innerText = this.output_element.innerText + message + '\n';
    }


    /** CONSOLE **/



    console_error(message) {
        // TODO: make this configurable at the system level.
        // The program mode 'normal' is the classic FORTH behavior - reset the
        // system and print the error message.
        // In 'debug' mode, though, we leave everything alone so the programmer
        // can inspect the state of the system.
        // const dot_element = document.getElementById('info');
        this.console(message);
        this.console('Re-initializing system to the starting state.');
        this.console(`If you wish to inspect the system post-error, set the global state variable "MODE" to the symbol 'debug`);
        // dot_element.innerHTML += `<div class="error">Error: ${message}</div>`;
        this.initialize();
    }

    console_warning(message) {
        const dot_element = document.getElementById('info');
        dot_element.innerHTML += `<div class="warning">Warning: ${message}</div>`;
    }



    /** public interface **/


    output_text(message) {
        this.output_html(this.message_el(message));
    }

    output_cr() {
        const el = document.createElement('div');
        el.style.display = 'block';
        this.output_html(el);
        return el;
    }

    output_printf(format, params) {
        // std.printf.apply(null, [format, ...params]);
        this.console_error('NO PRINTF IN BROWSER YET');
        this.ouput_text('NO PRINTF IN BROWSER YET');
    }

    clear_output() {
        this.output_element.innerText = '';
    }

    console(message) {
        this.console_element.appendChild(document.createTextNode(message +   '\n'));
    }

    clear_console() {
        this.console_element.innerText = '';
    }

}

