import * as F from "./forth.js";
import Vocabulary from './vocabulary.js'
import { log } from "./vocabulary_utils.js";
import ForthInterpreter from './forth_interpreter.js';

// COMMENTS

function reset_word({forth}) {
    forth.initialize();
    // forth.parameter_stack.empty();
    // forth.return_stack.empty();
    // forth.contexts[0] = new ForthContext();
    // forth.constants.empty();
    // forth.strings.empty();
    // forth.objects.empty();
    // forth.dictionary.empty();
}

function comment_word({interpreter}) {
    interpreter.read_code_until(")");
}

function line_comment_word({interpreter}) {
    interpreter.read_code_until("\n");
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
        const {type: value_type} = forth.parameter_stack.pop();
        forth.parameter_stack.push(forth.string_value(value_type));
    }
}

// VARIABLES

/**
 * Implements the VAR word
 *
 * This version of a variable uses a symbol to access the variable.
 * Thus we write 10 ~myvar VAR to create and set the variable named
 * "myvar" to the numeric value "10".
 * The words VAR@ and VAR! are used to, respectively, fetch and set
 * the value of the given var.
 * This is in support of the "symbolic" nature of this forth.
 * We may in the future move completely to symbols for variables and
 * constants, as well as using symbols for their name property.
 **/
function var_word({interpreter}) {
    const f = interpreter.forth;
    // Look, ma, no compile-time behavior!
    return () => {
        const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol().name);
        const value = f.parameter_stack.pop();

        // Since we don't create a word to embed the variable id,
        // we ignore the return value.
        f.variables.create(vocabulary, name, value);
    }
}

function var_fetch_word({interpreter}) {
    const f = interpreter.forth;
    return () => {
        const {type, value} = f.parameter_stack.pop();
        let variableRef;
        if (type === 'string') {
            variableRef = f.strings.get(value);
        } else if (type === 'symbol') {
            variableRef = f.symbols.get(value).name;
        } else {
            throw new Error(`variable ref must be string or symbol, is: '${type}'`);
        }

        const {vocabulary, name} = f.dictionary.parse_token(variableRef);
        const variable = f.variables.getNamed(vocabulary, name);
        f.parameter_stack.push(variable.value);
    }
}

function var_store_word({interpreter}) {
    const f = interpreter.forth;
    return () => {
        const {type, value} = f.parameter_stack.pop();
        let variableRef;
        if (type === 'string') {
            variableRef = f.strings.get(value);
        } else if (type === 'symbol') {
            variableRef = f.symbols.get(value).name;
        } else {
            throw new Error(`variable ref must be string or symbol, is: '${type}'`);
        }
        const variableValue = f.parameter_stack.pop();
        f.variables.setNamed(vocabulary, name, variableValue);
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
    // forth.currentContext().vari
    // symbol VAR

    /**
     * Implements the VAR word
     *
     * This version of a variable uses a symbol to access the variable.
     * Thus we write 10 ~myvar VAR to create and set the variable named
     * "myvar" to the numeric value "10".
     * The words VAR@ and VAR! are used to, respectively, fetch and set
     * the value of the given var.
     * This is in support of the "symbolic" nature of this forth.
     * We may in the future move completely to symbols for variables and
     * constants, as well as using symbols for their name property.
     **/
    function svar_word({interpreter}) {
        const f = interpreter.forth;
        // Look, ma, no compile-time behavior!
        return () => {
            const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol().name);
            const value = f.parameter_stack.pop();

            // Since we don't create a word to embed the variable id,
            // we ignore the return value.
            f.variables.create(vocabulary, name, value);
        }
    }

    function svar_fetch_word({interpreter}) {
        const f = interpreter.forth;
        return () => {
            const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol().name);
            const {value} = f.variables.getNamed(vocabulary, name);
            f.parameter_stack.push(value);
        }
    }

    function svar_store_word({interpreter}) {
        const f = interpreter.forth;
        return () => {
            const {vocabulary, name} = f.dictionary.parse_token(f.pop_symbol()).name;
            const value = f.parameter_stack.pop();
            f.variables.setNamed(vocabulary, name, value);
        }
    }

    ables.create(vocabulary, name, forth.null_value());
    const var_id = forth.variables.create(vocabulary, name, forth.null_value());
    return () => {
        const initialValue = forth.parameter_stack.pop(forth);
        forth.variables.set(var_id, initialValue);
    }
}

function variable_store_word({interpreter, forth}) {
    // const variable_ref = interpreter.next_input_token();
    // if (!variable_ref) {
    //     throw new Error(`Sorry, '${type}' no variable name provided`);
    // }
    // const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);

    // const variable_id = forth.currentContext().variables.create(vocabulary, name, forth.null_value());

    return () => {
        const {type: var_type, value: var_id} = forth.parameter_stack.pop();
        const value = forth.parameter_stack.pop();
        forth.variables.set(var_id, value);
        // forth.currentContext().variables.set(variable_id, value);
      /*  const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
        forth.variables.create(vocabulary, name, initial_value); */
    }
}

function variable_fetch_word({forth}) {
    return () => {
        const {type: var_type, value: var_id} = forth.parameter_stack.pop();
        const value = forth.variables.get(var_id);
        forth.parameter_stack.push(value);
        // forth.currentContext().variables.set(variable_id, value);
        /*  const {vocabulary, name} = forth.dictionary.parse_token(variable_ref);
         *   forth.variables.create(vocabulary, name, initial_value); */
    }
//     return () => {
//         // get the variable id from the stack
//         const {type, value} = forth.parameter_stack.pop();
//
//         switch (type) {
//             case 'symbol':
//                 // const variable_value = forth_get_variable_from_symbol(forth, value);
//                 // const variable_value = forth_get_variable(forth, value);
//                 const {vocabulary, name} = forth.dictionary_parse_token(value);
//                 const variable = forth.variables.get_from_name(vocabulary, name);
//                 if (!variable) {
//                     throw new Error(`no variable can be fetched for '${vocabulary}::${name}'`);
//                 }
//                 forth.parameter_stack.push(variable.value);
//                 break;
//             case 'number':
//                 // const variable_value = ;
//                 // console.log('fetch?', value, forth.variables.get(value).value.type);
//                 forth.parameter_stack.push(forth.variables.get(value).value);
//                 break;
//             default:
//                 throw new Error(`Sorry, '${type}' not a supported variable ref`);
//         }
//     }
}

// function store_word({forth}) {
//     return () => {
//         const variable_value = forth.parameter_stack.pop();
//         const value_to_store = forth.parameter_stack.pop();
//
//         switch (variable_value.type) {
//             case 'symbol':
//                 const {vocabulary, name} = forth.dictionary.parse_token(forth.symbol.get(variable_value.value);
//
//                 forth.contextStack.doOnce((stackItem) => {
//                     if (stackItem.variables.hasNamed(vocabulary, name)) {
//                         stackItem.variables.setNamed(vocabular, name, value_to_store);
//                         return true;
//                     }
//                     return false;
//                 });
//                 break;
//             case 'number':
//                 forth.contextStack.doOnce((stackItem) => {
//                     if (stackItem.variables.has(variable_value.value)) {
//                         stackItem.variables.set(variable_value.value, value_to_store);
//                         return true;
//                     }
//                     return false;
//                 });
//                 break;
//             default:
//                 throw new Error(`Sorry, '${variable_value.type}' not a supported variable ref`);
//         }
//     }
// }

function inc_variable_word({forth}) {
    return () => {
        const {type: ref_type, value: var_id} = forth.parameter_stack.pop();
        // TODO: ref type should be 'variable'!
        if (ref_type !== 'variable') {
            throw new Error(`variable ref must be a 'variable', but is a '${ref_type}'`);
        }

        const {type: var_type, value: var_value} = forth.variables.get(var_id);

        if (var_type !== 'number') {
            throw new Error(`variable value for inc! must be a number, is '${var_type}`);
        }

        forth.variables.set(var_id, forth.number_value(var_value + 1));

        // forth.contextStack.doOnce((stackItem) => {
        //     const variable = stackItem.variables.get(variable_ref);
        //     if (!variableRef) {
        //         return;
        //     }
        //     if (variable_value.type !== 'number') {
        //         forth.console(`Error! Cannot 'inc' a value of type ${variable_value.type}`);
        //                           return false;
        //     }
        //     variable_value.value += 1;
        //     return true;
        // });
    }
}

function dec_variable_word({forth}) {
    return () => {
        const {type: ref_type, value: var_id} = forth.parameter_stack.pop();
        if (ref_type !== 'variable') {
            throw new Error(`variable ref must be a 'variable', but is a '${ref_type}'`);
        }

        const {type: var_type, value: var_value} = forth.variables.get(var_id);

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
        const value = forth.parameter_stack.pop();
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
        const value = forth.parameter_stack.pop();
        forth.currentContext().locals[local_ref] = value;
    }
}

function local_store_word({interpreter, forth}) {
    const local_ref =   interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`Sorry, no local name provided`);
    }
    return () => {
        // const variable_value = forth.parameter_stack.pop();
        const value_to_store = forth.parameter_stack.pop();
        // we don't have a fancy namespaced variable ref for locls.
        // context.locals[variable_value.value] = value_to_store;
        forth.currentContext().locals[local_ref] = value_to_store;
    }
}

function local_fetch_word({interpreter, forth}) {
    const local_ref =   interpreter.next_input_token();
    if (!local_ref) {
        throw new Error(`no local name provided`);
    }
    return ({}) => {
        if (!(local_ref in forth.currentContext().locals)) {
            throw new Error(`local '${local_ref}' does not exist in this context`);
        }
        forth.parameter_stack.push(forth.currentContext().locals[local_ref]);
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

function symbol_name_word({forth}) {
    return () => {
        const symbol = forth.pop_symbol();
        forth.parameter_stack.push(forth.string_value(symbol.name));
    };
}

// symbol VAR

/**
 * Implements the VAR word
 *
 * This version of a variable uses a symbol to access the variable.
 * Thus we write 10 ~myvar VAR to create and set the variable named
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
            const value = forth.parameter_stack.pop();
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
        const value = forth.parameter_stack.pop();
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
                forth.parameter_stack.pop();
                // do what was asked of us!
                interpreter.run_word_list(of_program);
                break;
            }
        }

        // If we didn't actually run matching branch, we still need to
        // drop the original value to test against.
        if (!success) {
            forth.parameter_stack.drop();
        }
    }
}
function exec_word({interpreter, forth}) {
    return () => {
        const {type, value} = forth.parameter_stack.pop();
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
        const value = forth.parameter_stack.pop();
        forth.parameter_stack.push(forth.bool_value(forth.is_truthy(value)));
    }
}

function falsey_word({forth}) {
    return () => {
        const value = forth.parameter_stack.pop();
        forth.parameter_stack.push(forth.bool_value(!forth.is_truthy(value)));
    }
}

function not_word({forth}) {
    return () => {
        const value = forth.parameter_stack.pop();
        forth.parameter_stack.push(forth.bool_value(!forth.is_truthy(value)));
    }
}

function nullp_word({forth}) {
    return () => {
        const {type} = forth.parameter_stack.pop();
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
        const context = forth.currentContext();

        const start = forth.parameter_stack.pop();
        const end = forth.parameter_stack.pop();

        for (let i = start.value; i < end.value; i += 1) {
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
function colon_word({forth, interpreter}) {
    return () => {
        const word_name = interpreter.next_input_token();
        const {vocabulary, name} = interpreter.forth.dictionary.parse_token(word_name);

        const [,word_list] = interpreter.compile_until([';']);

        const word = () => {
            return () => {
                forth.enterContext();
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

                forth.exitContext();
            }
        };

        forth.add_word(vocabulary, name, word);
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
    const value2 = forth.parameter_stack.pop();
    const value1 = forth.parameter_stack.pop();

    if (value1.type !== value2.type) {
        return forth.error(`${operation_label} may not be applied to two values of different types '${value1.type}' and '${value2.type}'`);
    }

    switch (value1.type) {
        case 'number':
            forth.parameter_stack.push(forth.bool_value(operation(value1.value, value2.value)));
            break;
        default:
            forth.error(`${operation_label} not applicable to type '${value1.type}'`);
    }
}

function eq_word({forth}) {
    return () => {
        const x = forth.parameter_stack.pop();
        const {type: type2, value: value2} = x;
        // const {type: type2, value: value2} = forth.parameter_stack.pop();
        const {type: type1, value: value1} = forth.parameter_stack.pop();
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
                 forth.error(`eq not applicable to type '${value1.type}'`);
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

function move_word({forth}) {
    return () => {
        const movePosition = forth.pop_number();
        forth.parameter_stack.move(movePosition);
    };
}

function drop_word({forth}) {
    return () => {
        forth.parameter_stack.pop();
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
        forth.parameter_stack.push(forth.return_stack.pop());
    }
}

function return_stack_copy_word({forth}) {
    return () => {
        forth.parameter_stack.push(forth.return_stack.peek());
    }
}

function pop_to_return_stack_word({forth}) {
    return () => {
        forth.return_stack.push(forth.parameter_stack.pop());
    }
}

function return_stack_drop_word({forth}) {
    return () => {
        forth.return_stack.pop();
    }
}

function return_stack_size_word({forth}) {
    return () => {
        forth.parameter_stack.push(F.number_value(forth.return_stack.size()));
    }
}

function stackmark_word({forth}) {
    return () => {
        const symbol = forth.symbols.create('stackmark');
        // actually, I don't think we'll evern need to use the stack mark
        // because the symbol itself is the stack mark...
        symbol.setProp('stackmark', true);
        forth.parameter_stack.push(forth.symbol_value(symbol));
    }
}

function stackmark_equal_word({forth}) {
    return () => {
        let isStackmark = false;
        const {type, value} = forth.parameter_stack.pop();
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

let run_count = 0;

const CoreVocabulary = (forth, options = {}) => {

    // if (run_count > 0 && !options.fresh) {
    //     return;
    // }
    // run_count += 1;

    // forth.variables.addVocabulary('', 'The global vocabulary');
    // comments
    forth.add_word('', '(', comment_word);
    forth.add_word('', '\\', line_comment_word);
    forth.add_word('', '//', line_comment_word);

    // Parameter stack
    forth.add_word('', "DUP", dup_word);
    forth.add_word('', "SWAP", swap_word);
    forth.add_word('', 'MOVE', move_word);
    forth.add_word('', "DROP", drop_word);
    forth.add_word('', 'DEPTH', depth_word);
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

    // generic
    forth.add_word('', 'EQ', eq_word);


    // F.forth_add_word(forth, '', '>=', true, false, forth_word_greater_than_or_equal);
    // F.forth_add_word(forth, '', '<=', true, false, forth_w'', ord_less_than_or_equal);
    // F.forth_add_word(forth, '', '<>', true, false, forth_word_not_equal);

    // Variables
    forth.add_word('', 'VARIABLE', variable_word);
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

    // conditional
    forth.add_word('', 'IF', if_word);
    forth.add_word('', 'FALSEY', falsey_word);
    forth.add_word('', 'TRUTHY', truthy_word);
    forth.add_word('', 'NOT', not_word);
    forth.add_word('', 'NULLP', nullp_word);

    forth.add_word('', 'COND', cond_word);

    // Loops and such.
    forth.add_word('', 'DO', do_word);

    forth.add_word('', 'EXIT', exit_word);
    forth.add_word('', 'BREAK', break_word);
    forth.add_word('', 'RETURN', return_word);
    forth.add_word('', 'CONTINUE', continue_word);
    // forth.add_word('', 'RECURSE', recurse_word);

    // Hmm, a better loop, because it is dead simple and is has less magic?
    forth.add_word('', 'BEGIN', begin_word);
    // forth.add_word('', '', begin_word);

    // TYPES
    forth.add_word('', 'TYPEOF', typeof_word);

    // Strings
    forth.add_word('', "\"", quote_word);
    forth.add_word('', 'STR', string_word);

    // Symbol
    forth.add_word('', "~", symbol_word);
    forth.add_word('', 'SYM', symbol_word);
    forth.add_word('SYMBOL', 'NAME', symbol_name_word);

    forth.add_word('', 'SVAR', var_word);
    forth.add_word('', 'SVAR@', var_fetch_word);
    forth.add_word('', 'SVAR!', var_store_word);

    // Construction
    forth.add_word('', ':', colon_word);
    forth.add_word('', 'EXEC', exec_word);

    // compilation features
    forth.add_word('', '[', compilation_interp_word);
    forth.add_word('', ['{', '}'], noop_token_word);

    // environment manipulation...
    forth.add_word('', 'RESET', reset_word);



}

export default CoreVocabulary;
