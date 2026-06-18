
/**
 * The array type - an implementation of an array for usage by forth.
 *
 * [ el1 el2 el3 ] - create an array; leaves the array's object id on the data stack
 *
 * <i> <id> a@ - put element 'i' of array 'id'  on the stack; use @ to put the value on the stack.
 *
 * <i> <id> <value> a! = set element <i> of array <id> to <value>
 *
 * <id> length - put the length of the array on to the stack.
 **/


/**
 * a compile and run time facility for creating array_size
 *
 * note how it is different from array::create - it must compile
 * the contents and then run them, i guess at run time, in order to
 * populate the array.
 **/
function array_brace_word({interpreter, forth}) {
    // const context = forth.new_context();

    // TODO: I don't think we actually want WORDs in the list, do we?
    // maybe we do, but not now?
    // in our data stack we have values and words, but perhaps we just want
    // to have words, or rather some executable thing, which in our case would
    // be a function - though in a different version of this they may be some
    // token - an execution token.
    const [, word_list] = interpreter.compile_until([']']);

    return () => {
        // This should result in N items on the data stack.
        // interpret the string.

        // I THINK this may be the best way - keep the code as text and
        // interpret it at run time. The code inside will expect that state
        // of FORTH to be what it should be at runtime - variables set, stack in a certain state (though using the stack inside the array may not be the best thing...)
        // Also, we want to observe the overall effect on the stack of running
        // the code. We could possibly do that if we introduct the concept of
        // a stack marker - the ability to put a mark (like a bookmark) on the
        // data stack before we start an operation like running a word list
        // so that we can get a count of new stack items in order to create the
        // array ad-hoc (i.e. without specifying a count up front.)

        // const interp = new ForthInterpreter(interpreter.forth);
        // interp.run(code_string);

        forth.parameter_stack.set_bookmark();

        interpreter.run_word_list(word_list, {breakOn: 'exit'});

        switch(forth.controlFlowState) {
            case null:
                break;
            case 'break':
                console.warn('break detected in map brace word; ignored, reset');
                forth.resetControlFlowState();
                break;
            case 'continue':
                console.warn('continue detected in map brace word; ignored, reset');
                forth.resetControlFlowState();
                break;
            case 'return':
                console.warn('return detected in map brace word; ignored, reset');
                forth.resetControlFlowState();
                break;
            case 'exit':
                return;
                break;
        }

        const array_size = forth.parameter_stack.size_to_bookmark();

        const items = forth.parameter_stack.popn(array_size);
        forth.parameter_stack.push(forth.array_value(items));
    }
}

/**
* (<id> <i> -- <valu>)
**/
function array_get_word({forth}) {
    return () => {
        const array = forth.pop_array();
        const index = forth.pop_number();

        forth.parameter_stack.push(array[index]);
    }
}

/**
* ( <value> <index> <array> -- )
**/
function array_set_word({forth}) {
    return () => {
        const array = forth.pop_array();
        const index = forth.pop_number();
        const itemToSet = forth.pop_any();

        array[index] = itemToSet;
    }
}

/*
 * creates an array from items on the stack
 *
 * expects the stack to look like:
 *   SIZE ITEM1 ITEM2 ITEM3
 * in other words
 *   " foo" " bar" " baz" 3 array::create
 * will create an array like:
 *   [ "baz", "bar", "foo" ]
 */
function narray_word({forth}) {
    return () => {
        const array_size = forth.pop_number();
        const array_value = [];
        if (array_size > 0) {
            for (let i = 0; i < array_size; i += 1) {
                const value = forth.pop_any();
                array_value.push(value);
            }
        }

        forth.parameter_stack.push(forth.array_value(array_value));
    }
}
function ncreate_word({forth}) {
    return () => {
        const array_size = forth.pop_number();
        const array_value = [];
        if (array_size > 0) {
            const value = forth.pop_any();
            for (let i = 0; i < array_size; i += 1) {
                array_value.push(value);
            }
        }

        forth.parameter_stack.push(forth.array_value(array_value));
    }
}
function empty_word({forth}) {
    return () => {
        forth.parameter_stack.push(forth.array_value([]));
    }
}
function array_word({forth}) {
    return () => {
        const array_value = [];
        for (;;) {
           const [type, value] = forth.pop_any();
           if (type === 'symbol' && value === 'end') {
               break;
           }
           array_value.push([type, value]);
            // array_value.push(forth.parameter_stack.pop());
        }

        forth.parameter_stack.push(forth.array_value(array_value.toReversed()));
    }
}

function length_word({forth}) {
    return () => {
        const array = forth.pop_array();
        forth.parameter_stack.push(forth.number_value(array.length));
    }
}

function array_reverse_word({forth}) {
    return () => {
        const array = forth.pop_array();

        forth.parameter_stack.push(forth.array_value(array.toReversed()));
    }
}

function array_append_word({forth}) {
    return () => {
        const array = forth.pop_array();

        const valueToAppend = forth.pop_any();

        array.push(valueToAppend);
    }
}

function array_prepend_word({forth}) {
    return () => {
        const array = forth.pop_array();

        const valueToAppend = forth.pop_any();

        array.unshift(valueToAppend);
    }
}

function array_concat_word({forth}) {
    return () => {
        const array = forth.pop_array();

        const toAppend = forth.pop_array();

        forth.parameter_stack.push(forth.array_value(array.concat(toAppend)));
    }
}

function array_extend_word({forth}) {
    return () => {
        const array = forth.pop_array();
        const toAppend = forth.pop_array();

        for (const item of toAppend) {
            array.push(item);
        }
    }
}


const ArrayVocabulary = (forth, options = {}) => {
    forth.add_word('', 'a[', array_brace_word);
    forth.add_word('', 'a@', array_get_word);
    forth.add_word('', 'a!', array_set_word);
    forth.add_word('', 'array', array_word);

    forth.add_vocabulary('ARRAY', 'Extended array functionality');
    forth.add_word('array', 'narray', narray_word);
    forth.add_word('array', 'ncreate', ncreate_word);
    forth.add_word('array', 'empty', empty_word);
    forth.add_word('array', 'create', array_word);
    forth.add_word('array', '!', array_set_word);
    forth.add_word('array', 'set', array_set_word);
    forth.add_word('array', '@', array_get_word);
    forth.add_word('array', 'get', array_get_word);
    forth.add_word('array', 'length', length_word);
    forth.add_word('array', 'reverse', array_reverse_word);
    forth.add_word('array', 'append', array_append_word);
    forth.add_word('array', 'prepend', array_prepend_word);
    forth.add_word('array', 'concat', array_concat_word);
    forth.add_word('array', 'extend', array_extend_word);
}

export default ArrayVocabulary;
