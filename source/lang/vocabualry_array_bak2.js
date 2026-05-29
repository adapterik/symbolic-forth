import * as F from '/lang/forth.js';
import Vocabulary from '/lang/vocabulary.js';

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

class ArrayVocabularyImplementation extends Vocabulary {

    constructor(forth, options = {}) {
        super(forth, options);
        this.vocabulary = 'arr';

        this.add_word('a[', this.array_brace_word, '');
        this.add_word('a@', this.array_get_word, '');
        this.add_word('a!', this.array_set_word, '');

        this.add_word('array', this.array_word);
        this.add_word('!', this.set_word);
        this.add_word('@', this.get_word);
        this.add_word('length', this.length_word);
    }

    array_brace_word({interpreter, forth}) {
        const context = forth.new_context();
        const [, word_list] = interpreter.compile_until([']'], context);
        const length = word_list.length;

        // now we "run" the array items to let them put items on the stack, then suck
        // them into the array as values :)
        // this is tricky ... but one way out of the dilemma.
        interpreter.run_word_list(word_list, forth.new_context());

        // now collect the items from the stack.
        const items = forth.parameter_stack.popn(length);

        const array = {
            items,
            length
        };

        const id = forth.objects.create('array', array);

        return () => {
            forth.parameter_stack.push(forth.string_value(id))
        }
    }

    /**
     * (<id> <i> -- <valu>)
     **/
    array_get_word({forth}) {
        return () => {
            const array_id_id = forth.parameter_stack.pop();
            const array_id = forth.strings.get(array_id_id.value);
            // const array_id = forth.parameter_stack.pop();
            const element_i = forth.parameter_stack.pop();

            const array_object = forth.objects.get(array_id);

            const value = array_object.value.items[element_i.value];

            forth.parameter_stack.push(value);
            // value();
        }
    }

    /**
     * (<id> <i> <value> -- )
     **/
    array_set_word({forth}) {
        return () => {
            const value = forth.parameter_stack.pop();
            const array_id_id = forth.parameter_stack.pop();
            const array_id = forth.strings.get(array_id_id.value);
            const element_i = forth.parameter_stack.pop();

            const array_object = forth.objects.get(array_id);

            array_object.value.items[element_i.value] = value;
        }
    }

    array_word({forth}) {
        return () => {
            const array_size = forth.parameter_stack.pop();
            const array_value = [];
            for (let i = 0; i < array_size.value; i += 1) {
                array_value.push(forth.parameter_stack.pop());
            }

            const array = {
                items: array_value,
                length: array_size.value
            };

            const id = forth.objects.create('array', array);
            forth.parameter_stack.push(forth.string_value(id));
        }
    }

    set_word({forth}) {
        return () => {
            const value = forth.parameter_stack.pop();
            // const array_id = forth.parameter_stack.pop();
            const array_id_id = forth.parameter_stack.pop();
            const array_id = forth.strings.get(array_id_id.value);
            const element_i = forth.parameter_stack.pop();


            const array_object = forth.objects.get(array_id);
            array_object.value.items[element_i.value] = value;
        }
    }

    get_word({forth}) {
        return () => {
            const array_id_id = forth.parameter_stack.pop();
            const array_id = forth.strings.get(array_id_id.value);
            const element_i = forth.parameter_stack.pop();

            const array_object = forth.objects.get(array_id);
            const value = array_object.value.items[element_i.value];
            forth.parameter_stack.push(value);
        }
    }

    length_word({forth}) {
        return () => {
            const array_id_id = forth.parameter_stack.pop();
            const array_id = forth.strings.get(array_id_id.value);
            const array_object = forth.objects.get(array_id);
            const length = array_object.value.items.length;
            forth.parameter_stack.push(forth.number_value(length));
        }
    }

}


let instance = null;

const ArrayVocabulary = (forth, options = {}) => {
    if (!instance || options.fresh) {
        instance = new ArrayVocabularyImplementation(forth, options);
    }

    return instance;
}

export default ArrayVocabulary;
