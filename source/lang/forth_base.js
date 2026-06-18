import ForthStack from './forth_stack.js';
import ForthConstants from './forth_constants.js';
import ForthVariables from './forth_variables.js';
import ForthStrings from './forth_strings.js';
import ForthSymbols from './forth_symbols.js';
import ForthObjects from './forth_objects.js';
import ForthDictionary from './forth_dictionary.js';
import ForthInterpreter from './forth_interpreter.js';
import ForthContext from './forth_context.js';
// import * as std from 'std';

function log(message) {
    console.log(message);
}

const CF_BREAK = 'break';
const CF_CONTINUE = 'continue';
const CF_RETURN = 'return';
const CF_EXIT = 'exit';

export default class ForthBase {
    constructor({onInterp, onInitialize, ui} = {}) {
        this.onInterp = onInterp;
        this.onInitialize = onInitialize;
        this.ui = ui;
        this.initialize();
    }

    initialize() {
        this.parameter_stack = new ForthStack({capacity: 1000});
        this.return_stack = new ForthStack();
        this.dictionary = new ForthDictionary();
        this.input_code = '';
        this.vocabularies = {};
        this.variables = new ForthVariables(this);
        this.contextStack = new ForthStack();
        this.constants = new ForthConstants(this);
        this.strings = new ForthStrings();
        this.symbols = new ForthSymbols(this);
        this.objects = new ForthObjects(this);
        this.interpreter = new ForthInterpreter(this, {onInterp: this.onInterp});

        this.stacks = {};
        this.current_stack_id = -1;

        this.controlFlowState;

        if (this.onInitialize) {
            this.onInitialize(this);
        }
    }

    reset() {
        this.initialize();
    }

    number_value(value) {
        return ['number', value];
    }

    string_value(value) {
        return ['string', this.strings.create(value)];
    }

    bool_value(value) {
        return ['bool', value];
    }

    symbol_value(nameOrSymbol) {
        let symbol;
        if (typeof nameOrSymbol === 'string') {
            const {vocabulary, name} = this.dictionary.parse_token(nameOrSymbol);
            symbol = this.symbols.use_or_create(vocabulary, name);
        } else {
            symbol = nameOrSymbol;
        }
        return ['symbol', symbol.id];
    }

    null_value(value) {
        return ['null', null];
    }

    array_value(value) {
        return ['array', value];
    }

    map_value(value) {
        return ['map', value];
    }

    stack_value(value) {
        return ['stack', value];
    }

    variable_value(value) {
        return ['variable', value];
    }

    object_value(value) {
        return ['object', this.objects.create(value)];
    }

    word_value(value) {
        return ['word', value];
    }

    pop_number() {
        const [type, value] =  this.parameter_stack.pop();
        if (type !== 'number') {
            throw new Error(`pop_number expects a number on the stack, got a '${type}'`);
        }
        return value;
    }
    peek_number() {
        const [type, value] = this.parameter_stack.peek();
        if (type !== 'number') {
            throw new Error(`peek_number expects a number on the stack, got a '${type}'`);
        }
        return value;
    }

    pop_bool() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'bool') {
            throw new Error(`pop_bool expects a bool on the stack, got a '${type}'`);
        }
        return value;
    }
    pop_symbol() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'symbol') {
            throw new Error(`pop_symbol expects a symbol on the stack, got a '${type}'`);
        }
        return this.symbols.get(value);
    }

    pop_string() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'string') {
            throw new Error(`pop_string expects a string on the stack, got a '${type}'`);
        }
        return this.strings.get(value);
    }

    pop_string_or_symbol_name() {
        const [type, value] = this.parameter_stack.pop();
        switch (type) {
            case 'string': return this.strings.get(value);
            case 'symbol': return this.symbols.get(value).name;
            default: throw new Error(`pop_string_or_symbol_name expects a string or symbol on the stack, got a '${type}'`);
        }
    }

    pop_array() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'array') {
            throw new Error(`pop_array expects an array value on the stack, got a '${type}'`);
        }
        return value;
    }

    pop_object() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'object') {
            throw new Error(`pop_object expects an object value on the stack, got a '${type}'`);
        }
        return this.objects.get(value);
    }

    pop_map() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'map') {
            throw new Error(`pop_map expects a map on the stack, got a '${type}'`);
        }
        return value;
    }

    pop_stack() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'stack') {
            throw new Error(`pop_stack expects a stack value on the stack, got a '${type}'`);
        }
        return this.stacks[value];
    }

    pop_word() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'word') {
            throw new Error(`pop_word expects a stack value on the stack, got a '${type}'`);
        }
        return value;
    }

    pop_variable() {
        const [type, value] = this.parameter_stack.pop();
        if (type !== 'variable') {
            throw new Error(`pop_variable expects a variable value on the stack, got a '${type}'`);
        }
        return value;
    }

    pop_any() {
        return this.parameter_stack.pop();
    }

    pop_n(n_to_pop) {
        return this.parameter_stack.popn(n_to_pop);
    }

    is_truthy([type,value]) {
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

    to_string([type, value]) {
        switch (type) {
            case 'string': return this.strings.get(value);
            case 'symbol': return this.symbols.get(value).name;
            case 'number': return value.toFixed();;
            case 'array': {
                return value.map((item) => {
                    return this.to_string(item);
                }).join(' ');
            }
            case 'map':
                const {map} = value;
                return Object.entries(value).map(([key, value]) => {
                    return `${key}=>${this.to_string(value)}`;
                }).join(' ');
            case 'object':
                return `[ Object # ${value} ]`;
            case 'null': return '';
            case 'bool': return value ? 'true' : 'false';
            case 'variable': return this.to_string(forth.variables.get(value));
            default: return `[unknown type ${type}]`;
        }
    }

    to_int([type, value]) {
        switch (type) {
            case 'string': return parseInt(this.strings.get(value), 10);
            case 'symbol': return parseInt(this.symbols.get(value).name, 10);
            case 'number': return Math.floor(value);
            case 'null': return 0;
            case 'bool': return value ? 1 : 0;
            case 'variable': return this.to_int(forth.variables.get(value));
            default:throw new Error(`cannot convert type '${type}' to int`);
        }
    }

    to_number([type, value]) {
        switch (type) {
            case 'string': return new Number(value);
            case 'symbol': return new Number(this.symbols.get(value).name);
            case 'number': return value;
            case 'null': return 0;
            case 'bool': return value ? 1 : 0;
            case 'variable': return this.to_number(forth.variables.get(value));
            default: throw new Error(`cannot convert type '${type}' to number`);
        }
    }

    to_epoch_time([type, value]) {
        switch (type) {
            case 'string': return new Date(value).getTime();
            case 'symbol': return new Date(this.symbols.get(value).name).getTime();
            case 'number': return value;
            case 'variable': return this.to_date(forth.variables.get(value));
            default: throw new Error(`cannot convert type '${type}' to date`);
        }
    }

    add_word(vocabulary, names, func) {
        if (names instanceof Array) {
            for (const name of names) {
                this.dictionary.add(vocabulary, name, 'word', {func});
            }
        } else {
            this.dictionary.add(vocabulary, names, 'word', {func});
        }
    }

    print(message) {
        // IMPLEMENT in SUBCLASS
    }

    println(message) {
        // IMPLEMENT IN SUBCLASS
    }

    info(message) {
        this.println(message);
    }

    error(message) {
        this.ui.print_console(message);
        this.ui.print_console('Re-initializing system to the starting state.');
        this.ui.print_console(`If you wish to inspect the system post-error, set the global state variable "MODE" to the symbol 'debug`);
        this.initialize();
    }

    warning(message) {
        this.ui.println(message);
    }

    run(code) {
        if (code) {
            this.interpreter.add_code(forth, code);
        }
        this.interpreter.interpret();
        if (this.interpreter.state === 'error') {
            this.ui.print_console('Interpreter error, resetting system');
            this.initialize();
        }
    }
/*
    new_context(controlFlowState) {
        const context = new ForthContext({forth: this});
        this.contextStack.push(context);
    }*/

    currentContextOrNull() {
        if (this.contextStack.size(0) === 0) {
            return null;
        } else {
            return this.currentContext();
        }
    }

    enterContext(name, lexical = false) {
        let parent = this.currentContextOrNull();
        if (this.contextStack.size() === 0) {
            parent = null;
        } else {
            parent = this.currentContext();
        }
        const context = new ForthContext({name, lexical, parent, forth: this});
        this.contextStack.push(context);
        return context;
    }

    leaveContext() {
        const oldContext = this.currentContext();
        oldContext.leave();
        this.contextStack.pop();
        const context = this.currentContextOrNull();
        if (context) {
            context.break = oldContext.break;
            context.exit = oldContext.exit;
        }
        return context;
    }

    currentContext() {
        return this.contextStack.peek();
    }

    value_to_string([type, value]) {
        switch (type) {
            case 'string': return this.strings.get(value);
            case 'symbol': return this.log(value);
            case 'number': return '' + value;
            case 'array': return `[array ${value.map((item) => {return this.to_string(item)}).join(', ')}]`;
            case 'object': return `[object ${value}]`;
            case 'null':  return '';
            case 'bool': return value ? 'true' : 'false';
        }
    }

    setControlFlowBreak() {
        this.controlFlowState = CF_BREAK;
    }

    isControlFlowBreak() {
        return this.controlFlowState === CF_BREAK;
    }

    setControlFlowContinue() {
        this.controlFlowState = CF_CONTINUE;
    }

    isControlFlowwContinue() {
        return this.controlFlowState === CF_CONTINUE;
    }

    setControlFlowReturn() {
        this.controlFlowState = CF_RETURN;
    }

    isControlFlowReturn() {
        return this.controlFlowState === CF_RETURN;
    }

    setControlFlowExit() {
        this.controlFlowState = CF_EXIT;
    }

    isControlFlowExit() {
        return this.controlFlowState === CF_EXIT;
    }

    clearControlFlow() {
        this.controlFlowState = null;
    }
    resetControlFlowState() {
        this.controlFlowState = null;
    }

    add_constant(vocabulary, name, value) {
        this.constants.create(vocabulary, name, value);
    }

    add_vocabulary(name, description) {
        this.dictionary.add_vocabulary(name, description);
    }
}
