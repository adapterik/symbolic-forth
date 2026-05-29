import ForthStack from './forth_stack.js';
import ForthConstants from './forth_constants.js';
import ForthVariables from './forth_variables.js';
import ForthStrings from './forth_strings.js';
import ForthSymbols from './forth_symbols.js';
import ForthObjects from './forth_objects.js';
import ForthDictionary from './forth_dictionary.js';
import ForthInterpreter from './forth_interpreter.js';

// WORD HELPERS

function log(message) {
    // const root = document.getElementById('output');
    // const line = document.createElement('div');
    // line.innerText = message;
    // root.appendChild(line);
    console.log(message);
}

class ForthContext {
    constructor() {
        this.locals = {};
        this.dictionary = {};
        this.exit = false;
    }
}

export class Forth {
    constructor({onInterp, outputSelector, consoleSelector, onInitialize} = {}) {
        this.onInterp = onInterp;

        this.output_selector = outputSelector || '#output';
        this.output_element = document.querySelector(this.output_selector);
        if (!this.output_element) {
            throw new Error(`output element not found with selector '${this.output_selector}'`);
        }

        this.console_selector = consoleSelector || '#console';
        this.console_element = document.querySelector(this.console_selector);

        if (!this.console_element) {
            throw new Error(`console element not found with selector '${this.console_selector}'`);
        }

        this.onInitialize = onInitialize;

        this.initialize();

    }

    initialize() {
        this.parameter_stack = new ForthStack({capacity: 1000});
        this.return_stack = new ForthStack();
        this.dictionary = new ForthDictionary();
        this.input_code = '';
        // TODO: make a class
        this.vocabularies = {};
        this.variables = new ForthVariables(this);
        this.constants = new ForthConstants(this);
        // this.constants.create('', 'output_selector', {type: 'domelm', value: this.output_selector});
        // this.constants.create('', 'console_selector', {type: 'domelm', value: this.console_selector});

        this.strings = new ForthStrings();
        this.symbols = new ForthSymbols();
        this.objects = new ForthObjects(this);

        this.interpreter = new ForthInterpreter(this, {onInterp: this.onInterp});

        if (this.onInitialize) {
            this.onInitialize(this);
        }
    }

    reset() {
        this.initialize();
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

    output_cr() {
        const el = document.createElement('div');
        el.style.display = 'block';
        this.output_html(el);
        return el;
    }

    output_text(message) {
        this.output_html(this.message_el(message));
    }

    output_html(el) {
        this.output_element.appendChild(el);
    }

    console(message) {
        this.console_element.appendChild(document.createTextNode(message +   '\n'));
    }

    clear_output() {
        this.output_element.innerText = '';
    }

    clear_console() {
        this.console_element.innerText = '';
    }

    number_value(value) {
        return {
            type: 'number',
            value
        };
    }

    string_value(value) {
        return {
            type: 'string',
            value: this.strings.create(value)
        };
    }

    bool_value(value) {
        return {
            type: 'bool',
            value
        };
    }

    symbol_value(value) {
        return {
            type: 'symbol',
            value: this.symbols.create(value)
        };
    }

    null_value(value) {
        return {
            type: 'null'
        };
    }

    array_value(value) {
        return {
            type: 'array',
            value
        }
    }

    is_truthy({type,value}) {
        switch(type) {
            case 'bool':
                return value;
            case 'string':
                return this.strings.get(value).length > 0;
            case 'symbol':
                return value.length > 0;
            case 'number':
                return value > 0;
            case 'null':
                return false;
            case 'array':
                return value.length > 0;
            default:
                return false;
        }
    }

    add_word(vocabulary, name, func) {
        this.dictionary.add(vocabulary, name, 'word', {func});
    }

    print(message) {
        const dot_element = document.getElementById('output');
        dot_element.innerText = dot_element.innerText + message;
    }
    println(message) {
        const dot_element = document.getElementById('output');
        dot_element.innerText = dot_element.innerText + message + '\n';
    }

    info(message) {
        const dot_element = document.getElementById('info');
        dot_element.innerHTML += `<div class="info">${message}</div>`;
        // dot_element.innerText = `${dot_element.innerText}${message}\n`;
    }

    error(message) {
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

    warning(message) {
        const dot_element = document.getElementById('info');
        dot_element.innerHTML += `<div class="warning">Warning: ${message}</div>`;
    }

    run(code) {
        if (code) {
            this.interpreter.add_code(forth, code);
        }
        this.interpreter.interpret();
        if (this.interpreter.state === 'error') {
            this.console('Interpreter error, resetting system');
            this.initialize();
        }
    }

    new_context() {
        return new ForthContext();
    }

    value_to_string({type, value}) {
        switch (type) {
            case 'string': return this.strings.get(value);
            case 'symbol': return this.log(value);
            case 'number': return '' + value;
            case 'object': return `[object ${value}]`;
            case 'null':  return '';
            case 'bool': return value ? 'true' : 'false';
        }
    }
}
