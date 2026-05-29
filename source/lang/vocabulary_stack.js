import ForthStack from './forth_stack.js';


/**
 * Creates a new stack with a given name and capacity.
 *
 * <size> stack::create
 *
 * where size is an integer
 **/
function create_word({forth}) {
    return () => {
        const capacity = forth.pop_number();
        const stack = new ForthStack({capacity});
        const stackId = forth.current_stack_id += 1;
        forth.stacks[stackId] = stack;
        forth.parameter_stack.push(forth.stack_value(stackId));
    };
}

/**
 * Push a value onto a stack.
 *
 * <value> <stack-value> stack::push
 *
 **/
function push_word({forth}) {
    return () => {
        const stack = forth.pop_stack();
        const value = forth.parameter_stack.pop();
        stack.push(value);
    }
}

function pop_word({forth}) {
    return () => {
        const stack = forth.pop_stack();
        forth.parameter_stack.push(stack.pop());
    }
}

function peek_word({forth}) {
    return () => {
        const stack = forth.pop_stack();
        forth.parameter_stack.push(stack.peek());
    }
}

function size_word({forth}) {
    return () => {
        const stack = forth.pop_stack();
        forth.parameter_stack.push(forth.number_value(stack.size()));
    }
}

function capacity_word({forth}) {
    return () => {
        const stack = forth.pop_stack();
        forth.parameter_stack.push(forth.number_value(stack.capacity()));
    }
}

function empty_word({forth}) {
    return () => {
        const stack = forth.pop_stack();
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

