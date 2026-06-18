import * as F from "./forth.js";
import Vocabulary from './vocabulary.js'
import { log } from "./vocabulary_utils.js";
import ForthInterpreter from './forth_interpreter.js';

// CORE funcdtionality

function vocabulary_word({forth}) {
    return () => {
        const description = forth.pop_string();
        const name = forth.pop_string();

        forth.add_vocabulary(name, description);
    }
}

// COMMENTS

function reset_word({forth}) {
    forth.initialize();
}

function comment_word({interpreter}) {
    interpreter.read_code_until(")");
}

function line_comment_word({interpreter}) {
    interpreter.read_code_until("\n");
}

// Generate values on stack.

function null_word({forth}) {
    return ({forth}) => {
        forth.parameter_stack.push(forth.null_value());
    };
}

function true_word({forth}) {
    return ({forth}) => {
        forth.parameter_stack.push(forth.bool_value(true));
    };
}
function false_word({forth}) {
    return ({forth}) => {
        forth.parameter_stack.push(forth.bool_value(false));
    };
}
// TYPE Queries
/*
function typeof_word() {
    return ({forth}) => {
        const x = forth.parameter_stack.peek();
        const {type} = forth.parameter_stack.peek();
        forth.parameter_stack.push(forth.string_value(type));
    }
}*/

function typeof_word() {
    return ({forth}) => {
        const [value_type,] = forth.pop_any();
        forth.parameter_stack.push(forth.string_value(value_type));
    }
}

// VARIABLES

/**
 * Implements the VAR word
 *
 * This version of a variable uses a symbol to access the variable.
 * Thus we write 10SYM myvar VAR to create and set the variable named
 * "myvar" to the numeric value "10".
 * The words VAR@ and VAR! are used to, respectively, fetch and set
 * the value of the given var.
 * This is in support of the "symbolic" nature of this forth.
 * We may in the future move completely to symbols for variables and
 * constants, as well as using symbols for their name property.
 **/
function pop_symbol_or_string(f) {
    const [type, value] = f.pop_any();
    if (type === 'string') {
        return f.dictionary.parse_token(f.strings.get(value));
    } else if (type === 'symbol') {
        return f.symbols.get(value);
    } else {
        throw new Error(`variable ref must be string or symbol, is: '${type}'`);
    }
}

function var_word({forth}) {
    // Look, ma, no compile-time behavior!
    return () => {
        const {vocabulary, name} = pop_symbol_or_string(forth);

        const variableValue = forth.pop_any();

        // Since we don't create a word to embed the variable id,
        // we ignore the return value.
        forth.variables.create(vocabulary, name, variableValue);
    }
}

function var_fetch_word({forth, interpreter}) {
    return () => {
        const {vocabulary, name} = pop_symbol_or_string(forth);
        const value = forth.variables.getNamed(vocabulary, name);
        forth.parameter_stack.push(value);
    }
}

function var_store_word({forth, interpreter}) {
    return () => {
        const {vocabulary, name} = pop_symbol_or_string(forth);
        const value = forth.pop_any();
        forth.variables.setNamed(vocabulary, name, value);
    }
}


// These next two parse the variable name out of the token stream, rather
// then use a symbol (as for VAR) or the variable word (as for @ and !)

function v_fetch_word({forth, interpreter}) {
    const variable_ref = interpreter.next_input_token();
    const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
    return () => {
        const value = forth.variables.getNamed(vocabulary, name);
        forth.parameter_stack.push(value);
    }
}

function v_store_word({forth, interpreter}) {
    const variable_ref = interpreter.next_input_token();
    const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
    return () => {
        const value = forth.pop_any();
        forth.variables.setNamed(vocabulary, name, value);
    }
}
function variable_word({interpreter, forth}) {
    const variable_ref = interpreter.next_input_token();
    if (!variable_ref) {
        return interpeter.error(`Sorry, '${type}' no variable name provided`);
    }
    const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
    // we need to create the variable here because as we parse ahead, we need
    // the variable word to be defined... it just won't be set correctly
    // yet in case any cheeky compile-time-executing goes on referencing the
    // variable!
    // Also, we always create variables in the current context. This means that
    // global variables need to be set ... in the global (top level) context!
    // forth.currentContext().variables.create(vocabulary, name, forth.null_value());
    const var_id = forth.variables.create(vocabulary, name, forth.null_value());
    forth.variables.createWord(vocabulary, name);
    return () => {
        const initialValue = forth.pop_any();
        forth.variables.set(var_id, initialValue);
    }
}

// function variable_word({interpreter, forth}) {
//     const variable_ref = interpreter.next_input_token();
//     if (!variable_ref) {
//         return interpeter.error(`Sorry, '${type}' no variable name provided`);
//     }
//     const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
//     // we need to create the variable here because as we parse ahead, we need
//     // the variable word to be defined... it just won't be set correctly
//     // yet in case any cheeky compile-time-executing goes on referencing the
//     // variable!
//     // Also, we always create variables in the current context. This means that
//     // global variables need to be set ... in the global (top level) context!
//     // forth.currentContext().vari
//     // symbol VAR
//
//     /**
//      * Implements the VAR word
//      *
//      * This version of a variable uses a symbol to access the variable.
//      * Thus we write 10SYM myvar VAR to create and set the variable named
//      * "myvar" to the numeric value "10".
//      * The words VAR@ and VAR! are used to, respectively, fetch and set
//      * the value of the given var.
//      * This is in support of the "symbolic" nature of this forth.
//      * We may in the future move completely to symbols for variables and
//      * constants, as well as using symbols for their name property.
//      **/
//     function svar_word({interpreter}) {
//         const f = interpreter.forth;
//         // Look, ma, no compile-time behavior!
//         return () => {
//             const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol().name);
//             const value = f.parameter_stack.pop();
//
//             // Since we don't create a word to embed the variable id,
//             // we ignore the return value.
//             f.variables.create(vocabulary, name, value);
//         }
//     }
//
//     function svar_fetch_word({interpreter}) {
//         const f = interpreter.forth;
//         return () => {
//             const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol().name);
//             const {value} = f.variables.getNamed(vocabulary, name);
//             f.parameter_stack.push(value);
//         }
//     }
//
//     function svar_store_word({interpreter}) {
//         const f = interpreter.forth;
//         return () => {
//             const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol()).name;
//             const value = f.parameter_stack.pop();
//             f.variables.setNamed(vocabulary, name, value);
//         }
//     }
//
//     ables.create(vocabulary, name, forth.null_value());
//     const var_id = forth.variables.create(vocabulary, name, forth.null_value());
//     return () => {
//         const initialValue = forth.parameter_stack.pop(forth);
//         forth.variables.set(var_id, initialValue);
//     }
// }

function variable_store_word({interpreter, forth}) {
    return () => {
        const id = forth.pop_variable();
        const value = forth.pop_any();

        forth.variables.set(id, value);
    }
}

function variable_fetch_word({forth}) {
    return () => {
        const id = forth.pop_variable();
        const value = forth.variables.get(id);
        forth.parameter_stack.push(value);
    }
}

function inc_variable_word({forth}) {
    return () => {
        const var_id = forth.pop_variable();

        const [var_type, var_value] = forth.variables.get(var_id);

        if (var_type !== 'number') {
            throw new Error(`variable value for inc! must be a number, is '${var_type}`);
        }

        forth.variables.set(var_id, forth.number_value(var_value + 1));
    }
}

function dec_variable_word({forth}) {
    return () => {
        const var_id = forth.pop_variable();

        const [var_type, var_value] = forth.variables.get(var_id);

        if (var_type !== 'number') {
            throw new Error(`variable value for dec! must be a number, is '${var_type}`);
        }

        forth.variables.set(var_id, forth.number_value(var_value - 1));

    }
}

// Properties

// function prop_word({interpreter, forth}) {
//     // const variable_ref = interpreter.next_input_token();
//     // if (!variable_ref) {
//     //     return interpeter.error(`Sorry, '${type}' no variable name provided`);
//     // }
//     // const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
//     // we need to create the variable here because as we parse ahead, we need
//     // the variable word to be defined... it just won't be set correctly
//     // yet in case any cheeky compile-time-executing goes on referencing the
//     // variable!
//     // Also, we always create variables in the current context. This means that
//     // global variables need to be set ... in the global (top level) context!
//     // forth.currentContext().variables.create(vocabulary, name, forth.null_value());
//     return () => {
//         const {type: name_type, value: name} = forth.parameter_stack.pop();
//         const initial_value = forth.parameter_stack.pop();
//         forth.currentContext().properties.(vocabulary, name, initial_value);
//     }
// }
//
// function var_store_word({interpreter, forth}) {
//     const variable_ref = interpreter.next_input_token();
//     if (!variable_ref) {
//         throw new Error(`Sorry, '${type}' no variable name provided`);
//     }
//     const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
//
//     // const variable_id = forth.currentContext().variables.create(vocabulary, name, forth.null_value());
//
//     return () => {
//         const value = forth.parameter_stack.pop(forth);
//         forth.setVariableByName(vocabulary, name, value);
//         // forth.currentContext().variables.set(variable_id, value);
//         /*  const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
//          *       forth.variables.create(vocabulary, name, initial_value); */
//     }
// }
// compilation words (?)

/**
    * Interprets the text between the '[' which is this word,
    * and the first ']' encountered.
    * Note that this may add one or more items to the data stack,
    * which should be consumed by a following word, such as 'LITERAL'.
    **/
function compilation_interp_word({interpreter}) {
    // TODO: throw if not invoked when "compiling" a word definition
    // the quote word
    // get past the initial '[' char
    interpreter.get_next_input_char();
    const code_string = interpreter.get_next_input_until("\]");

    if (code_string === null) {
        return;
    }

    // interpret the string.
    const interp = new ForthInterpreter(interpreter.forth);
    interp.run(code_string);

    // note that this may have affected the FORTH runtime - stacks, variables, etc.

    // return () => {
    //     throw new Error('no interpreter behavior');
    // }
    return null;
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
function const_word({interpreter, forth}) {
    const const_ref = interpreter.next_input_token();
    if (!const_ref) {
        forth.error(`constant name not provided`);
    }
    const {vocabulary, name} = interpreter.forth.dictionary.parse_token(const_ref);

    const constant_id = forth.constants.create(vocabulary, name, forth.null_value());

    return () => {
        const value = forth.pop_any();
        forth.constants.set(constant_id, value);
    }
}

/**
    * LOCALS
    */

function local_word({interpreter, forth}) {
    // For now, just simple names.
    const local_ref = interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`Sorry, no local name provided`);
    }

    return () => {
        const value = forth.pop_any();
        forth.currentContext().createLocal(local_ref, value);
    }
}

function local_spread_word({interpreter, forth}) {
    const tokens = interpreter.collect_tokens_until(']');

    return () => {
        const array = forth.pop_array();

        let index = 0;
        for (const token of tokens) {
          forth.currentContext().locals[token] = array[index];
          index += 1;
        }
    }
}

function local_store_word({interpreter, forth}) {
    const local_ref =   interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`Sorry, no local name provided`);
    }
    return () => {
        const value_to_store = forth.pop_any();
        // we don't have a fancy namespaced variable ref for locls.
        forth.currentContext().locals[local_ref] = value_to_store;
    }
}

function local_store_search_word({interpreter, forth}) {
    const local_ref =   interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`Sorry, no local name provided`);
    }
    return () => {
        const value_to_store = forth.pop_any();
        // we don't have a fancy namespaced variable ref for locls.
        forth.currentContext().locals[local_ref] = value_to_store;
    }
}
function local_incr_word({interpreter, forth}) {
    const local_ref =   interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`Sorry, no local name provided`);
    }478957
    return () => {
        const local = forth.currentContext().locals[local_ref];
        if (local[0] !== 'number') {
            throw new Error(`cannot increment a local of type '${local[0]}'`);
        }
        local[1] += 1;
    }
}

function local_incr_search_word({interpreter, forth}) {
    const local_ref =   interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`Sorry, no local name provided`);
    }
    return () => {
        forth.currentContext().modifyLocal(name, ([type, value]) => {
            if (type === 'number') {
                value += 1;
            }
            return [type, value];
        });
        const local = forth.currentContext().locals[local_ref];
        if (local[0] !== 'number') {
            throw new Error(`cannot increment a local of type '${local[1]}'`);
        }
        local[1] += 1;
    }
}

function local_fetch_word({interpreter, forth}) {
    const local_ref =   interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`no local name provided`);
    }
    return ({}) => {
        const local = forth.currentContext().getLocal(local_ref, false);
        if (typeof local === 'undefined') {
            throw new Error(`local '${local_ref}' does not exist in this context`);
        }
        forth.parameter_stack.push(local);
    }
}

function local_fetch_search_word({interpreter, forth}) {
    const local_ref =   interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`no LOCAL name provided`);
    }
    return ({}) => {
        const local = forth.currentContext().getLocal(local_ref, true);
        if (typeof local === 'undefined') {
            throw new Error(`LOCAL '${local_ref}' does not exist in this or any ancestor context`);
        }
        forth.parameter_stack.push(local);
    }
}
// TYPES


// Strings

function quote_word({interpreter, forth}) {
    // Get the first blank (which would have followed
    // the quote word
    interpreter.get_next_input_char();
    const string = interpreter.get_next_input_until("\"");


    if (string === null) {
        return;
    }

    // We store the string, getting an id
    const string_value = interpreter.forth.string_value(string);

    // Now we just need a string value push.
    return () => {
        forth.parameter_stack.push(string_value)
    }
}

function string_word({interpreter, forth}) {
    // Get the first blank (which would have followed
    // the quote word

    interpreter.skip_input_whitespace();

    const delimiter = interpreter.get_next_input_char();
    const string = interpreter.get_next_input_until(delimiter);

    if (string === null) {
        return;
    }

    // We store the string, getting an id
    const string_value = interpreter.forth.string_value(string);

    // Now we just need a string value push.
    return () => {
        forth.parameter_stack.push(string_value)
    }
}

// SYMBOL

function symbol_word({interpreter, forth}) {
    const symbol_name = interpreter.next_input_token();

    return () => {
        forth.parameter_stack.push(forth.symbol_value(symbol_name));
    }
}


// symbol VAR

/**
 * Implements the VAR word
 *
 * This version of a variable uses a symbol to access the variable.
 * Thus we write 10 SYM myvar VAR to create and set the variable named
 * "myvar" to the numeric value "10".
 * The words VAR@ and VAR! are used to, respectively, fetch and set
 * the value of the given var.
 * This is in support of the "symbolic" nature of this forth.
 * We may in the future move completely to symbols for variables and
 * constants, as well as using symbols for their name property.
 **/
// function svar_word({interpreter}) {
//     const f = interpreter.forth;
//     // Look, ma, no compile-time behavior!
//     return () => {
//         const symbol = f.pop_symbol();
//
//         const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol().name);
//         const symbol = f.symbols.getByName(f.pop_
//         const value = f.parameter_stack.pop();
//
//         // Since we don't create a word to embed the variable id,
//         // we ignore the return value.
//         f.variables.create(vocabulary, name, value);
//     }
// }
//
// function svar_fetch_word({interpreter}) {
//     const f = interpreter.forth;
//     return () => {
//         const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol().name);
//         const {value} = f.variables.getNamed(vocabulary, name);
//         f.parameter_stack.push(value);
//     }
// }
//
// function svar_store_word({interpreter}) {
//     const f = interpreter.forth;
//     return () => {
//         const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol()).name;
//         const value = f.parameter_stack.pop();
//         f.variables.setNamed(vocabulary, name, value);
//     }
// }


// LOOPS and CONTROL STRUCTURES

function if_word({interpreter, forth}) {
    // Get the top value off the stack.
    const [if_stop_word, if_program] = interpreter.compile_until(['THEN', 'ELSE']);

    if (if_stop_word === 'THEN') {
        // we have reached the end of this IF..THEN control program and
        // return a word which c(mapValue[key]onditionally runs a word list.
        return () => {
            const value = forth.pop_any();
            if (forth.is_truthy(value)) {
                // A logic control flow structure should be transparent -
                // that is, we make use it to break out of a loop, or return
                // from a word, so everything should be propagated.
                interpreter.run_word_list(if_program);
            }
        }
    }

    const [else_stop_word, else_program] = interpreter.compile_until( ['THEN']);

    return () => {
        const value = forth.pop_any();
        if (forth.is_truthy(value)) {
            interpreter.run_word_list(if_program);
        } else if (else_program !== null) {
            interpreter.run_word_list(else_program);
        }
    }
}

function cond_word({interpreter, forth}) {
    // Get the top value off the stack.

    const cond_struct = [];

    for (;;) {
        const [stop_word, test_program] = interpreter.compile_until(['END', 'OF']);

        if (stop_word === 'OF') {
            const [of_stop, of_program] = interpreter.compile_until(['END']);
            cond_struct.push({test_program, of_program});
            continue;
         }

         if (stop_word === 'END') {
             break;
         }

         // else it is an error!
    }

    return () => {
        // const value = forth.parameter_stack.pop();

        let success = false;

        for (let {test_program, of_program} of cond_struct) {
            // duplicate the value we are testing against.
            forth.parameter_stack.dup();

            // do the test; this must consume the test value.
            interpreter.run_word_list(test_program);

            // and the word list must produce a bool on the stack
            success = forth.pop_bool();
            if (success) {
                // drop the original value to test against.
                // otherwise we leave it there for the next test, if any.
                forth.pop_any();
                // do what was asked of us!
                interpreter.run_word_list(of_program);
                break;
            }
        }

        // If we didn't actually run matching branch, we still need to
        // drop the original value to test against.
        if (!success) {
            forth.pop_any();
        }
    }
}
function exec_word({interpreter, forth}) {
    return () => {
        const [type, value] = forth.pop_any();
        // TODO: check type

        let word_token;

        switch (type) {
            case 'symbol': word_token = forth.symbols.get(value).name; break;
            case 'string': word_token = forth.strings.get(value); break;
            default: throw new Error(`Not a symbol or string: ${type}`);
        }

        interpreter.compile_and_run_token(word_token);
    }
}

function truthy_word({forth}) {
    return () => {
        const value = forth.pop_any();
        forth.parameter_stack.push(forth.bool_value(forth.is_truthy(value)));
    }
}

function falsey_word({forth}) {
    return () => {
        const value = forth.pop_any();
        forth.parameter_stack.push(forth.bool_value(!forth.is_truthy(value)));
    }
}

function not_word({forth}) {
    return () => {
        const value = forth.pop_any();
        forth.parameter_stack.push(forth.bool_value(!forth.is_truthy(value)));
    }
}

function nullp_word({forth}) {
    return () => {
        const [type,] = forth.pop_any();
        forth.parameter_stack.push(forth.bool_value(type === 'null'));
    }
}

function exit_word({forth}) {
    return () => {
        forth.setControlFlowExit();
    }
}

function break_word({forth}) {
    return () => {
        forth.setControlFlowBreak();
    }
}

function return_word({forth}) {
    return () => {
        forth.setControlFlowReturn();
    }
}
function continue_word({forth}) {
    return ({context}) => {
        forth.setControlFlowContinue();
    }
}
/*
function recurse_word() {
    return ({context}) => {
        context.recurse = true;
    }
}*/

function do_word({interpreter, forth}) {
    const [,program] = interpreter.compile_until( ['LOOP']);

    return () => {
        const start = forth.pop_number();
        const end = forth.pop_number();

        for (let i = start; i < end; i += 1) {
            interpreter.run_word_list(program);
            switch(forth.controlFlowState) {
                case 'break':
                    forth.resetControlFlowState();
                    return;
                case 'continue':
                    forth.resetControlFlowState();
                    break;
                case 'return':
                case 'exit':
                    return;
            }
        }
    }
}

function doindex_word({interpreter, forth}) {
    const [,program] = interpreter.compile_until( ['LOOP']);

    return () => {
        const start = forth.pop_number();
        const end = forth.pop_number();

        for (let i = start; i < end; i += 1) {
            // NB the code in the loop MUST pop this
            forth.parameter_stack.push(forth.number_value(i));
            interpreter.run_word_list(program);
            switch(forth.controlFlowState) {
                case 'break':
                    forth.resetControlFlowState();
                    return;
                case 'continue':
                    forth.resetControlFlowState();
                    break;
                case 'return':
                case 'exit':
                    return;
            }
        }
    }
}
function doi_wordx({interpreter, forth}) {
    const [,program] = interpreter.compile_until( ['LOOP']);

    return () => {
        const start = forth.pop_number();
        const end = forth.pop_number();

        // const context = forth.enterContext();
        // context.setLocal('I', forth.number_value(start));

        for (let i = start; i < end; i += 1) {
            forth.parameter_stack.push(forth.number_value(i));
            interpreter.run_word_list(program);
            switch(forth.controlFlowState) {
                case 'break':
                    forth.resetControlFlowState();
                    // forth.leaveContext();
                    return;
                case 'continue':
                    forth.resetControlFlowState();
                    break;
                case 'return':
                case 'exit':
                    // forth.leaveContext();
                    return;
            }
        }
    }
}

function doi_word({interpreter, forth}) {
    const [,program] = interpreter.compile_until( ['LOOP']);

    return () => {
        const start = forth.pop_number();
        const end = forth.pop_number();

        const context = forth.enterContext('doi', true);
        context.createLocal('I', forth.null_value());

        // context.setLocal('I', forth.number_value(start));

        for (let i = start; i < end; i += 1) {
            context.setLocal('I', forth.number_value(i));
            // forth.parameter_stack.push(forth.number_value(i));
            interpreter.run_word_list(program);
            switch(forth.controlFlowState) {
                case 'break':
                    // forth.resetControlFlowState();
                    forth.leaveContext();
                    forth.currentContext().setControlFlowBreak();
                    return;
                case 'continue':
                    forth.resetControlFlowState();
                    break;
                case 'return':
                    forth.leaveContext();
                    forth.currentCOntext().setControlFlowReturn();
                    return;
                case 'exit':
                    forth.leaveContext();
                    forth.currentCOntext().setControlFlowExit();
                    return;
            }
        }
        forth.leaveContext();
    }
}

// even less magic -
function begin_word({forth, interpreter}) {
    const [stop_token,program] = interpreter.compile_until(['REPEAT', 'CATCH']);
    return () => {
        const context = forth.currentContext();
        switch (stop_token) {
            case 'REPEAT':
                for (;;) {
                    interpreter.run_word_list(program, true);
                    switch(forth.controlFlowState) {
                        case 'break':
                            forth.resetControlFlowState();
                            return;
                        case 'continue':
                            forth.resetControlFlowState();
                            break;
                        case 'return':
                        case 'exit':
                            return;
                    }
                }
                break;
            case 'CATCH':
                interpreter.run_word_list(program, true);
                context.break = false;
        }

    }
}
function every_word({forth, interpreter}) {
    const [stop_token, program] = interpreter.compile_until(['END']);
    let intervalId;
    return () => {
        const interval = forth.pop_number();
        intervalId = window.setInterval(() => {
            const context = forth.currentContext();
            interpreter.run_word_list(program, true);
            switch(forth.controlFlowState) {
                case 'break':
                    forth.resetControlFlowState();
                    window.clearTimeout(intervalId);
                    return;
                case 'continue':
                    forth.resetControlFlowState();
                    break;
                case 'return':
                case 'exit':
                    window.clearTimeout(intervalId);
                    return;
            }
        }, interval);
    }
}

function colon_word({forth, interpreter}) {
    // return () => {
        const word_name = interpreter.next_input_token();
        const {vocabulary, name} = interpreter.forth.dictionary.parse_token(word_name);

        const [,word_list] = interpreter.compile_until([';']);

        const word = () => {
            return () => {
                forth.enterContext(`[word]${word_name}`, false);
                interpreter.run_word_list(word_list);

                switch (forth.controlFlowState) {
                    case null: break;
                    case 'break':
                    case 'continue':
                        console.log(`Unexpected control flow state for word: '${forth.controlFlowState}'`);
                        forth.resetControlFlowState();
                        break;
                    case 'return': forth.resetControlFlowState(); break;
                    case 'exit': break;
                }

                forth.leaveContext();
            }
        };

        forth.add_word(vocabulary, name, word);
    // }
    return null;
}

function word_list_word({forth, interpreter}) {
        const [,word_list] = interpreter.compile_until([']']);

        const word = ({forth}) => {
                // forth.enterContext('wordlist', false);
                forth.interpreter.run_word_list(word_list);

                // switch (forth.controlFlowState) {
                //     case null: break;
                //     case 'break':
                //     case 'continue':
                //         console.log(`Unexpected control flow state for word: '${forth.controlFlowState}'`);
                //         forth.resetControlFlowState();
                //         break;
                //     case 'return': forth.resetControlFlowState(); break;
                //     case 'exit': break;
                // }

                // forth.leaveContext();
        };

        return ({forth}) => {
            forth.parameter_stack.push(forth.word_value(word));
        }
}

function run_word({forth}) {
    return () => {
        const word = forth.pop_word();
        word({forth});
    }
}

function defer_word({forth}) {
    return () => {
        const word = forth.pop_word();
        forth.currentContext().addDeferWord(word);
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

function numeric_comparison(forth, operation_label, operation) {
    const num2 = forth.pop_number();
    const num1 = forth.pop_number();
    forth.parameter_stack.push(forth.bool_value(operation(num1, num2)));
}

function eq_word({forth}) {
    return () => {
        const [type2, value2] = forth.pop_any();
        const [type1, value1] = forth.pop_any();
        if (type1 !== type2) {
            forth.parameter_stack.push(forth.bool_value(false));
            return;
        }
        switch (type1) {
            case 'symbol':
            case 'string':
            case 'number':
            case 'boolean':
                return forth.parameter_stack.push(forth.bool_value(value1 === value2));
            default:
                 forth.error(`eq not applicable to type '${type1}'`);
        }
    };
}

function equal_word({forth}) {
    return () => {
        numeric_comparison(forth, 'Equal', (v1, v2) => {return v1 === v2;});
    }
}

function greater_than_word({forth}) {
    return () => {
        numeric_comparison(forth, 'Greater Than', (v1, v2) => {return v1 > v2;});
    }
}

function less_than_word({forth}) {
    return () => {
        numeric_comparison(forth, 'Less Than', (v1, v2) => {return v1 < v2;});
    }
}

function less_than_or_equal_word({forth}) {
    return () => {
        numeric_comparison(forth, 'Less Than Or Equal', (v1, v2) => {return v1 <= v2;});
    }
}

function greater_than_or_equal_word({forth}) {
    return () => {
        numeric_comparison(forth, 'Greater Than Or Equal', (v1, v2) => {return v1 >= v2;});
    }
}

function not_equal_word({forth}) {
    return () => {
        numeric_comparison(forth, 'Unequal', (v1, v2) => {return v1 !== v2;});
    }
}

// binary math

function binary_and_word({forth}) {
    return () => {
        const num1 = forth.pop_number();
        const num2 = forth.pop_number();
        forth.parameter_stack.push( forth.number_value(num1 & num2));
    }
}

function binary_or_word({forth}) {
    return () => {
        const num1 = forth.pop_number();
        const num2 = forth.pop_number();
        forth.parameter_stack.push( forth.number_value(num1 | num2));
    }
}

// Parameter Stack

function dup_word({forth}) {
    return () => {
        forth.parameter_stack.dup();
    };
}

function swap_word({forth}) {
    return () => {
        forth.parameter_stack.swap();
    };
}

function npick_word({forth}) {
    return () => {
        forth.parameter_stack.move(forth.pop_number());
    };
}

function drop_word({forth}) {
    return () => {
        forth.pop_any();
    };
}

function depth_word({forth}) {
    return () => {
        const stack_size = forth.parameter_stack.size();
        forth.parameter_stack.push(forth.number_value(stack_size));
    }
}

// Return stack ops

function return_stack_pop_word({forth}) {
    return () => {
        forth.parameter_stack.push(forth.pop_any());
    }
}

function return_stack_copy_word({forth}) {
    return () => {
        forth.parameter_stack.push(forth.return_stack.peek());
    }
}

function pop_to_return_stack_word({forth}) {
    return () => {
        forth.return_stack.push(forth.pop_any());
    }
}

function return_stack_drop_word({forth}) {
    return () => {
        forth.pop_any();
    }
}

function return_stack_size_word({forth}) {
    return () => {
        forth.parameter_stack.push(F.number_value(forth.return_stack.size()));
    }
}

function stackmark_word({forth}) {
    return () => {
        const symbol = forth.symbols.use_or_create('', 'stackmark');
        // actually, I don't think we'll evern need to use the stack mark
        // because the symbol itself is the stack mark...
        symbol.setProp('stackmark', true);
        forth.parameter_stack.push(forth.symbol_value(symbol));
    }
}

function stackmark_equal_word({forth}) {
    return () => {
        let isStackmark = false;
        const [type, value] = forth.pop_any();
        if (type === 'symbol') {
            const symbol = forth.symbols.get(value);
            if (symbol.name === 'stackmark') {
                isStackmark = true;
            }
        }
        return forth.parameter_stack.push(forth.bool_value(isStackmark));
    }
}

function noop_token_word () {
    return null;
}


function to_string_word({forth}) {
    return () => {
        const item = forth.pop_any();
        forth.parameter_stack.push(forth.string_value(forth.to_string(item)));
    };
}

function to_int_word({forth}) {
    return () => {
        const item = forth.pop_any();
        const maybeInt = forth.to_int(item);
        if (isNaN(maybeInt)) {
            forth.parameter_stack.push(forth.null_value());
        } else {
            forth.parameter_stack.push(forth.number_value(maybeInt));
        }
    };
}

function to_number_word({forth}) {
    return () => {
        const item = forth.pop_any();
        const maybeNumber = forth.to_number(item);

        if (isNaN(maybeNumber)) {
            forth.parameter_stack.push(forth.null_value());
        } else {
            forth.parameter_stack.push(forth.number_value(maybeNumber));
        }
    };
}

// LEFT OFF HERE
// How are we going to do date conversion?
// I think we need to insist on a normal date form, ISO 8601 w/o time for dates,
// ISO 8601 for datetime. Time is different. We can use custom date parsers to
// coerce funny dates into real dates. What to do about timezones is a different
// matter. It will be a case-by-case basis, I'm afraid, as most sources of dates
// do not include the timezone or offset.
// FOr instance, in the voting data, since it is localized to a state or
// portion of a state, we can assume a timezone/offset I'm pretty sure.
function to_date_word({forth}) {
    return () => {
        const item = forth.pop_any();
        // does not exist yet
        const maybeDate = forth.to_epoch_time(item);
        forth.parameter_stack.push(forth.number_value(maybeDate));
    };
}
/**
 * A macro is pure compile-time which produces code which is in turn injected
 * into the interpreter for compilation...
 *
 * Macros are used for syntactic sugar.
 *
 * For instance, a CONST is just a word that produces a value. It cannot be
 * modified because it is a word. But it is nicer to write
 *
 * CONST 10 foo
 *
 * than
 *
 * : foo 10 ;
 *
 * or is it?
 **/
function macro_word() {
}

let run_count = 0;

const CoreVocabulary = (forth, options = {}) => {


    forth.dictionary.add_vocabulary('', 'The global vocabulary');

    forth.add_word('', 'VOCABULARY', vocabulary_word);

    // comments
    forth.add_word('', '(', comment_word);
    forth.add_word('', '\\', line_comment_word);

    forth.add_word('', 'NULL', null_word);
    forth.add_word('', 'TRUE', true_word);
    forth.add_word('', 'FALSE', false_word);


    // Parameter stack
    forth.add_word('', "DUP", dup_word);
    forth.add_word('', "DROP", drop_word);
    forth.add_word('', 'DEPTH', depth_word);

    forth.add_word('', "SWAP", swap_word);
    forth.add_word('', 'NPICK', npick_word);
    forth.add_word('', '#', stackmark_word);
    forth.add_word('', '#=', stackmark_equal_word);

    // Return stack
    forth.add_word('', 'R>', return_stack_pop_word);
    forth.add_word('', 'R@', return_stack_copy_word);
    forth.add_word('', '>R', pop_to_return_stack_word);
    forth.add_word('', 'RDROP',  return_stack_drop_word);
    forth.add_word('', 'RSIZE', return_stack_size_word);

    // Comparison
    forth.add_word('', '=', equal_word);
    forth.add_word('', '≠', not_equal_word);
    forth.add_word('', '!=', not_equal_word);
    forth.add_word('', '>', greater_than_word);
    forth.add_word('', '<', less_than_word);
    forth.add_word('', '≥', greater_than_or_equal_word);
    forth.add_word('', '>=', greater_than_or_equal_word);
    forth.add_word('', '≤', less_than_or_equal_word);
    forth.add_word('', '<=', less_than_or_equal_word);

    forth.add_word('', '&', binary_and_word);
    forth.add_word('', '|', binary_or_word);
    // forth.add_word('', '~', binary_or_word);
    // forth.add_word('', '^', binary_or_word);

    // generic
    forth.add_word('', 'EQ', eq_word);


    // F.forth_add_word(forth, '', '>=', true, false, forth_word_greater_than_or_equal);
    // F.forth_add_word(forth, '', '<=', true, false, forth_w'', ord_less_than_or_equal);
    // F.forth_add_word(forth, '', '<>', true, false, forth_word_not_equal);

    // Variables
    forth.add_word('', 'VARIABLE', variable_word);
    forth.add_word('', 'V@', v_fetch_word);
    forth.add_word('', 'V!', v_store_word);
    // forth.add_word('', '!VAR', var_store_word);
    forth.add_word('', '!', variable_store_word);
    forth.add_word('', '@', variable_fetch_word);
    forth.add_word('', '!INC', inc_variable_word);
    forth.add_word('', 'INC!', inc_variable_word);
    forth.add_word('', 'DEC!', dec_variable_word);

    forth.add_word('', 'VAR', var_word);
    forth.add_word('', 'VAR@', var_fetch_word);
    forth.add_word('', 'VAR!', var_store_word);


    // forth.add_word('', 'PROP', var_prop_word);
    // forth.add_word('', '!PROP', var_store_prop_word);
    // forth.add_word('', '@PROP', fetch_prop_word);
    // forth.add_word('', '!INCPROP', increment_prop_word);

    // Constants
    forth.add_word('', 'CONST', const_word);

    // Locals
    forth.add_word('', 'LOCAL', local_word);
    forth.add_word('', 'LOCAL@', local_fetch_word);
    forth.add_word('', 'L@', local_fetch_word);
    forth.add_word('', 'LOCAL!', local_store_word);
    forth.add_word('', 'L!', local_store_word);


    forth.add_word('', 'L:>', local_word);
    forth.add_word('', 'L:>[', local_spread_word);
    forth.add_word('', 'L<-', local_fetch_word);
    forth.add_word('', 'L<<-', local_fetch_search_word);
    forth.add_word('', 'L@@', local_fetch_search_word);
    forth.add_word('', 'L->', local_store_word);
    forth.add_word('', 'L->>', local_store_search_word);
    forth.add_word('', 'L+>', local_incr_word);
    forth.add_word('', 'L+>>', local_incr_search_word);


    // conditional logic
    forth.add_word('', 'IF', if_word);
    forth.add_word('', 'FALSEY', falsey_word);
    forth.add_word('', 'TRUTHY', truthy_word);
    forth.add_word('', 'NOT', not_word);

    // Various predicate tests
    forth.add_word('', 'NULLP', nullp_word);
    forth.add_word('', 'IS-NULL', nullp_word);

    forth.add_word('', 'COND', cond_word);

    // Loops and such.
    forth.add_word('', 'DO', do_word);
    forth.add_word('', 'DOI', doi_word);
    forth.add_word('', 'DOINDEX', doindex_word);

    forth.add_word('', 'EXIT', exit_word);
    forth.add_word('', 'BREAK', break_word);
    forth.add_word('', 'RETURN', return_word);
    forth.add_word('', 'CONTINUE', continue_word);
    // forth.add_word('', 'RECURSE', recurse_word);

    // Hmm, a better loop, because it is dead simple and is has less magic?
    forth.add_word('', 'BEGIN', begin_word);
    forth.add_word('', 'EVERY', every_word);
    // forth.add_word('', '', begin_word);

    // TYPES
    forth.add_word('', 'TYPEOF', typeof_word);

    // Strings
    forth.add_word('', "\"", quote_word);
    forth.add_word('', 'STR', string_word);

    // Symbol
    forth.add_word('', "~", symbol_word);
    forth.add_word('', 'SYM', symbol_word);

    // forth.add_word('', 'SVAR', var_word);
    // forth.add_word('', 'SVAR@', var_fetch_word);
    // forth.add_word('', 'SVAR!', var_store_word);

    // Construction
    forth.add_word('', ':', colon_word);
    forth.add_word('', 'EXEC', exec_word);

    // compilation features
    forth.add_word('', '[', compilation_interp_word);
    forth.add_word('', ['{', '}'], noop_token_word);

    // environment manipulation...
    forth.add_word('', 'RESET', reset_word);

    forth.add_word('', 'MACRO', macro_word);

    forth.add_word('', 'TO-STRING', to_string_word);
    forth.add_word('', 'TO-INT', to_int_word);
    forth.add_word('', 'TO-NUMBER', to_number_word);
    forth.add_word('', 'TO-DATE', to_date_word);

    forth.add_word('', 'W[', word_list_word);
    forth.add_word('', 'RUN', run_word);
    forth.add_word('', 'DEFER', defer_word);


}

export default CoreVocabulary;
