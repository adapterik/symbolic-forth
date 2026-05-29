import ForthStack from './forth_stack.js';

const stacks = {};

/**
 * Creates a new stack with a given name and capacity.
 *
 * <name> <size> stack::create
 *
 * where <name> is a symbol , and size is an integer
 **/
function create_word({forth}) {
    return () => {
        const capacity = forth.pop_number();
        const {id, name} = forth.pop_symbol();
        if (!(name in stacks)) {
            stacks[name] = new ForthStack({capacity});
        }
    };
}

/**
 * Push a value onto the named stack.
 *
 * <name> <value> stack::push
 *
 **/
function push_word({forth}) {
    return () => {
        const value = forth.parameter_stack.pop();
        const {id, name} = forth.pop_symbol();
        const stack = stacks[name];
        stack.push(value);
    }
}

function pop_word({forth}) {
    return () => {
        const {id, name} = forth.pop_symbol();
        const stack = stacks[name];
        forth.parameter_stack.push(stack.pop());
    }
}

function peek_word({forth}) {
    return () => {
        const {id, name} = forth.pop_symbol();
        const stack = stacks[name];
        forth.parameter_stack.push(stack.peek());
    }
}

function size_word({forth}) {
    return () => {
        const {id, name} = forth.pop_symbol();
        const stack = stacks[name];
        forth.parameter_stack.push(forth.number_value(stack.size()));
    }
}

function capacity_word({forth}) {
    return () => {
        const {id, name} = forth.pop_symbol();
        const stack = stacks[name];
        forth.parameter_stack.push(forth.number_value(stack.capacity()));
    }
}

function empty_word({forth}) {
    return () => {
        const {id, name} = forth.pop_symbol();
        const stack = stacks[name];
        stack.empty();
    }
}

const StackVocabulary = (forth, options = {}) => {
    forth.add_word('stack', 'create', create_word);
    forth.add_word('stack', 'push', push_word);
    forth.add_word('stack', 'pop', pop_word);
    forth.add_word('stack', 'peek', peek_word);
    forth.add_word('stack', 'size', size_word);
    forth.add_word('stack', 'capacity', capacity_word);
    forth.add_word('stack', 'empty', empty_word);
}

export default StackVocabulary;

