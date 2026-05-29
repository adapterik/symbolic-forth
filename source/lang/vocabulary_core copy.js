import * as F from "/lang/forth.js";
import { log } from "/lang/vocabulary_utils.js";

// COMMENTS

function forth_compiling_word_comment(forth) {
    forth.read_code_until(")");
}

function forth_compiling_word_line_comment(forth) {
    forth.read_code_until("\n");
}

// TYPE Queries

function forth_word_typeof() {
    return (forth) => {
        const x = forth.parameter_stack.peek(forth);
        const {type} = forth.parameter_stack.peek(forth);
        forth.parameter_stack.push(forth.string_value(type));
    }
}

// VARIABLES

function forth_word_var(forth) {
    const variable_ref = forth.next_input_token();
    if (!variable_ref) {
        throw new Error(`Sorry, '${type}' no variable name provided`);
    }

    return (forth) => {
        const initial_value = forth.parameter_stack.pop(forth);
        const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
        forth.variables.create(vocabulary, name, initial_value);
    }
}

/**
 * 123 CONST X
 * creates a constant named 'X' with value 123.
 *
 * This differs from a variable in that it stores the value
 * directly in the word, rather than storing a reference to a variable,
 * whose value is stored in a separate modifyable storage area.
 *
 * Actually, although we could simply implement it this way,
 * it is better for the sake of introspection, which is after all
 * part of the point of this project, to store them separately.
 * Otherwise, we cannot really display a list of constants and
 * their values!
 *
 * We could also overload variables with constants, but let us keep
 * them separate.
 *
 */
function forth_word_const(forth) {
    const const_ref = forth.next_input_token();
    if (!const_ref) {
        throw new Error(`Sorry, '${type}' no constant name provided`);
    }
    const {vocabulary, name} = forth.dictionary.parse_token(const_ref);

    return (forth) => {
        const value = forth.parameter_stack.pop(forth);
        // forth.variables.create(vocabulary, name, initial_value);
        // forth.add_word(vocabulary, name, true, false, (forth) => {
            // forth.parameter_stack.push(initial_value);
        // });
        forth.constants.create(vocabulary, name, value);
    }
}

function forth_word_store() {
    return (forth) => {
        const variable_value = forth.parameter_stack.pop();
        const value_to_store = forth.parameter_stack.pop();

        switch (variable_value.type) {
            case 'symbol':
                const {vocabulary, name} = forth.dictionary.parse_token(variable_value.value);
                forth.variables.set_from_symbol(vocabulary, name, value_to_store);
                break;
            case 'number':
                forth.variables.set(variable_value.value, value_to_store);
                break;
            default:
                throw new Error(`Sorry, '${variable_value.type}' not a supported variable ref`);
        }
    }
}

function forth_word_fetch() {
    return (forth) => {
        // get the variable id from the stack
        const {type, value} = forth.parameter_stack.pop();

        switch (type) {
            case 'symbol':
                // const variable_value = forth_get_variable_from_symbol(forth, value);
                // const variable_value = forth_get_variable(forth, value);
                const {vocabulary, name} = forth.dictionary_parse_token(value);
                const variable = orth.variables.get_from_symbol(vocabulary, name);
                if (!variable) {
                    throw new Error(`no variable can be fetched for '${vocabulary}::${name}'`);
                }
                forth.parameter_stack.push(variable.value);
                break;
            case 'number':
                // const variable_value = ;
                forth.parameter_stack.push(forth.variables.get(value).value);
                break;
            default:
                throw new Error(`Sorry, '${type}' not a supported variable ref`);
        }
    }
}

/**
 * LOCALS
 */

function forth_word_local(forth) {
    const variable_ref = forth.next_input_token();
    if (!variable_ref) {
        throw new Error(`Sorry, '${type}' no variable name provided`);
    }

    return (forth, context) => {
        const value = forth.parameter_stack.pop();
        context.locals[variable_ref] = value;
    }
}

function forth_word_local_store() {
    return (forth, context) => {
        const variable_value = forth.parameter_stack.pop();
        const value_to_store = forth.parameter_stack.pop();
        // we don't have a fancy namespaced variable ref for locls.
        context[variable_value.value] = value_to_store;
    }
}

function forth_word_local_fetch() {
    return (forth, context) => {
        // get the variable id from the stack
        const {type, value} = forth.parameter_stack.pop();
        forth.parameter_stack.push(context.locals[value]);
    }
}

// TYPES


// Strings

function forth_compiling_word_string(forth) {
    // Get the first blank (which would have followed
    // the quote word
    forth.get_next_input_char();
    const string = forth.get_next_input_until("\"");


    if (string === null) {
        return;
    }

    // We store the string, getting an id
    const string_value = forth.string_value(string);

    // Now we just need a string value push.
    return (forth) => {
        forth.parameter_stack.push(string_value)
    }
    // }
}

// SYMBOL

function forth_compiling_word_symbol(forth) {
    const symbol_name = forth.next_input_token();
    return (forth) => {
        forth.parameter_stack.push(forth.symbol_value(symbol_name));
    }
}

// LOOPS and CONTROL STRUCTURES

function forth_compiling_word_if(forth, context) {
    const runtime_exec = (forth, context) => {
        const value = forth.parameter_stack.pop();
        if (forth.is_truthy(value)) {
            forth.run_word_list(if_program, context);
        } else if (else_program !== null) {
            forth.run_word_list(else_program, context);
        }
    }

    // Get the top value off the stack.
    const [if_stop_word, if_program] = forth.compile_until(['THEN', 'ELSE'], context);

    if (if_stop_word === 'THEN') {
        return (forth, context) => {
            const value = forth.parameter_stack.pop();
            if (forth.is_truthy(value)) {
                forth.run_word_list(if_program, context);
            }
        }
    }

    const [else_stop_word, else_program] = forth.compile_until( ['THEN'], context);

    return (forth, context) => {
        const value = forth.parameter_stack.pop();
        if (forth.is_truthy(value)) {
            forth.run_word_list(if_program, context);
        } else if (else_program !== null) {
            forth.run_word_list(else_program, context);
        }
    }
}

function forth_word_exit() {
    return (forth, context) => {
        context.exit = true;
    }
}

function forth_word_break() {
    return (forth, context) => {
        context.break = true;
    }
}

function forth_word_continue() {
    return (forth, context) => {
        context.continue = true;
    }
}

function forth_word_recurse() {
    return (forth, context) => {
        context.recurse = true;
    }
}

function forth_compiling_word_do(forth) {
    // establish a new context for this do loop.
    const context = F.forth_context_new();

    // Create the index counter.
    context.dictionary['I'] = () => {
        return (forth) => {
            const stack_value = forth.return_stack.peek(forth);
            forth.parameter_stack.push(stack_value);
        }
    };

    const [,program] = forth.compile_until( ['LOOP'], context);

    return (forth) => {
        const start = forth.parameter_stack.pop(forth);
        const end = forth.parameter_stack.pop(forth);

        // This is our loop counter.
        forth.return_stack.push({type: 'number', value: 0});

        context.exit = false;
        context.recurse = false;

        for (let i = start.value; i < end.value; i += 1) {
            context.continue = false;
            // F.forth_set_variable(forth, i_var, {type: 'number', value: i});
            // TODO: update value on stack; why not, since we can in JS.
            const {type, value} = forth.return_stack.pop(forth);
            forth.return_stack.push({type: 'number', value: i});
            forth.run_word_list(program, context);

            if (context.exit) {
                break;
            }
        }
    }
}


function forth_compiling_word_colon() {
    return (forth) => {
        const context = F.forth_context_new();
        const word_name = forth.next_input_token();
        const {vocabulary, name} = forth.dictionary.parse_token(word_name);

        const [,word_list] = forth.compile_until([';'], context);


        const word = () => {
            return (forth) => {
                forth.run_word_list(word_list, context);
            }
        };
        forth.add_word(vocabulary, name, true, false, word);
    }
}

/**
 * (v1 v2 -- <bool>)
 *
 * Given two values on the stack, place a boolean value on the
 * stack indicating whether the two values are equal.
 *
 * Unlike real FORTH, we do a type-sensitive compare.
 *
 **/
function forth_word_equal() {
    return (forth) => {
        const value1 = forth.parameter_stack.pop(forth);
        const value2 = forth.parameter_stack.pop(forth);

        if (value1.type !== value2.type) {
            forth.parameter_stack.push(forth.bool_value(false));
        }

        switch (value1.type) {
            case 'number':
            case 'bool':
            case 'symbol':
            case 'string':
                return forth.parameter_stack.push(forth.bool_value(value1.value === value2.value));
            case 'word':
                return forth.parameter_stack.push(forth.bool_value(value1.value === value2.value));
            case 'object':
                throw new Error('We do not have a way to compare objects yet...');
            default:
                throw new Error(`This type has no equality comparison defined: ${value1.type}`);
        }
    }
}
function forth_word_greater_than() {
    return (forth) => {
        const value1 = forth.parameter_stack.pop(forth);
        const value2 = forth.parameter_stack.pop(forth);

        if (value1.type !== value2.type) {
            forth.parameter_stack.push(forth.bool_value(false));
        }

        switch (value1.type) {
            case 'number':
                return forth.parameter_stack.push(forth.bool_value(value1.value > value2.value));
            case 'bool':
                throw new Error('Greater Than not applicable to bool');
            case 'symbol':
            case 'string':
                return forth.parameter_stack.push(forth.bool_value(value1.localeCompare(value2.value) > 0));
            case 'word':
                throw new Error('Greater Than not applicable to word');
            case 'object':
                throw new Error('We do not have a way to compare objects yet...');
            default:
                throw new Error(`This type has no equality comparison defined: ${value1.type}`);
        }
    }
}
function forth_word_less_than() {
    return (forth) => {
        const value1 = forth.parameter_stack.pop(forth);
        const value2 = forth.parameter_stack.pop(forth);

        if (value1.type !== value2.type) {
            forth.parameter_stack.push(forth.bool_value(false));
        }

        switch (value1.type) {
            case 'number':
                return forth.parameter_stack.push(forth.bool_value(value1.value < value2.value));
            case 'bool':
                throw new Error('Less Than not applicable to bool');
            case 'symbol':
            case 'string':
                return forth.parameter_stack.push(forth.bool_value(value1.localeCompare(value2.value) > 0));
            case 'word':
                throw new Error('Less Than not applicable to word');
            case 'object':
                throw new Error('We do not have a way to compare objects yet...');
            default:
                throw new Error(`This type has no comparison defined: ${value1.type}`);
        }
    }
}


// Parameter Stack


function forth_word_dup() {
    return (forth) => {
        forth.parameter_stack.dup(forth);
    };
}

function forth_word_drop() {
    return (forth) => {
        forth.parameter_stack.pop(forth);
    };
}

function forth_word_depth() {
    return (forth) => {
        const stack_size = forth.parameter_stack.size(forth);
        forth.parameter_stack.push(forth.number_value(stack_size));
    }
}



// Return stack ops
function forth_word_return_stack_pop() {
    return (forth) => {
        forth.parameter_stack.push(forth.return_stack.pop());
    }
}

function forth_word_return_stack_copy() {
    return (forth) => {
        forth.parameter_stack.push(forth.return_stack.peek());
    }
}

function forth_word_pop_to_return_stack() {
    return (forth) => {
        forth.return_stack.push(forth.parameter_stack.pop());
    }
}

function forth_word_return_stack_drop() {
    return (forth) => {
        forth.return_stack.pop(forth);
    }
}

function forth_word_return_stack_size() {
    return (forth) => {
        forth.parameter_stack.push(F.number_value(forth.return_stack.size()));
    }
}


/// Add words

export function init(forth) {
    // forth.variables.addVocabulary('', 'The global vocabulary');
    // comments
    forth.add_word('', '(', true, true, forth_compiling_word_comment);
    forth.add_word('', '\\', true, false, forth_compiling_word_line_comment);

    // Parameter stack
    forth.add_word('', "DUP", true, false, forth_word_dup);
    forth.add_word('', "DROP", true, false, forth_word_drop);
    forth.add_word('', 'DEPTH', true, false, forth_word_depth);

    // Return stack
    forth.add_word('', 'R>', true, false, forth_word_return_stack_pop);
    forth.add_word('', 'R@', true, false, forth_word_return_stack_copy);
    forth.add_word('', '>R', true, false, forth_word_pop_to_return_stack);
    forth.add_word('', 'RDROP', true, false, forth_word_return_stack_drop);
    forth.add_word('', 'RSIZE', true, false, forth_word_return_stack_size);

    // Comparison
    forth.add_word('', '=', true, false, forth_word_equal);
    forth.add_word('', '>', true, false, forth_word_greater_than);
    forth.add_word('', '<', true, false, forth_word_less_than);
    // F.forth_add_word(forth, '', '>=', true, false, forth_word_greater_than_or_equal);
    // F.forth_add_word(forth, '', '<=', true, false, forth_word_less_than_or_equal);
    // F.forth_add_word(forth, '', '<>', true, false, forth_word_not_equal);

    // Variables
    forth.add_word('', 'VAR', true, true, forth_word_var);
    forth.add_word('', 'CONST', true, true, forth_word_const);
    forth.add_word('', '!', true, false, forth_word_store);
    forth.add_word('', '@', true, false, forth_word_fetch);

    // Constants
    // TODO

    // Locals
    forth.add_word('', 'local', true, false, forth_word_local);
    forth.add_word('', 'l@', true, false, forth_word_local_fetch);
    forth.add_word('', 'l!', true, false, forth_word_local_store);

    // conditional
    forth.add_word('', 'IF', true, false, forth_compiling_word_if);

    // Loops and such.
    forth.add_word('', 'DO', true, true, forth_compiling_word_do);

    forth.add_word('', 'EXIT', true, false, forth_word_exit);
    forth.add_word('', 'BREAK', true, false, forth_word_break);
    forth.add_word('', 'CONTINUE', true, false, forth_word_continue);
    forth.add_word('', 'RECURSE', true, false, forth_word_recurse);

    // Construction
    forth.add_word('', ':', true, false, forth_compiling_word_colon);
    forth.add_word('', 'typeof', true, false, forth_word_typeof);

    // TYPES

    // Strings
    forth.add_word('', "\"", true, true, forth_compiling_word_string);
    forth.add_word('', 'STR', true, true, forth_compiling_word_string);

    // Symbol
    forth.add_word('', 'sym', true, false, forth_compiling_word_symbol);
}
