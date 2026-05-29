
export default class ForthStack {
    constructor({capacity} = {}) {
        this.capacity = capacity || 100;
        this.initialize();
    }
    initialize() {
        this.stack = new Array(this.capacity);
        // This is the pointer to the current stack position;
        // use -1 to indicate an empty stack.
        this.stack_pointer = -1;
        this.bookmark = this.stack_pointer;
    }
    pop() {
        if (this.stack_pointer === -1) {
            throw new Error("stack empty");
        }
        this.stack_pointer -= 1;
        return this.stack[this.stack_pointer + 1];
    }
    popn(n) {
        if (this.stack.length < n) {
            throw new Error(`stack too small (${this.stack.length}) for request of ${n} items.`);
        }
        this.stack_pointer -= n;
        return this.stack.slice(this.stack_pointer + 1, this.stack_pointer + n + 1);
    }
    push(value) {
        if (this.stack_pointer === this.capacity - 1) {
            throw new Error(`stack capacity (${this.capacity}) would be exceeded`);
        }
        this.stack_pointer += 1;
        this.stack[this.stack_pointer] = value;
    }
    peek() {
        if (this.stack_pointer === -1) {
            throw new Error("stack empty");
        }
        return this.stack[this.stack_pointer];
    }
    swap() {
        if (this.stack_pointer === -1) {
            throw new Error("stack empty");
        }
        if (this.stack_pointer < 1) {
            throw new Error("stack must have at least 2 elements for swap");
        }
        const temp = this.stack[this.stack_pointer];
        this.stack[this.stack_pointer] = this.stack[this.stack_pointer - 1];
        this.stack[this.stack_pointer - 1] = temp;
    }
    // Moves the nth item down the stack to the top.
    move(n) {
        if (this.stack_pointer === -1) {
            throw new Error("stack empty");
        }
        if (this.stack_pointer < 1) {
            throw new Error("stack must have at least 2 elements for move");
        }
        if (this.stack_pointer < n) {
            throw new Error(`stack must have at least ${n} elements for this move`);
        }
        const stackPosition = this.stack_pointer - n;
        const itemToMove = this.stack[stackPosition];
        this.stack.splice(stackPosition, 1);
        this.stack[this.stack_pointer] = itemToMove
    }
    get(i) {
        if (i > this.capacity - 1) {
            throw new Error(`stack capacity (${this.capacity}) would be exceeded`);
        }
        return this.stack[i];
    }
    dup() {
        this.push(this.peek());
    }
    size() {
        return this.stack_pointer + 1;
    }
    capacity() {
        return this.capacity
    }
    forEach(fun) {
        let i = 0;
        this.stack.slice(0, this.stack_pointer + 1).forEach((item) => {
            fun(item, i);
            i += 1;
        });
    }
    find(fun) {
        for (let i = this.stack_pointer; i >= 0; i += 1) {
            const item = this.stack[i];
            const result = fun(item);
            if (result) {
                return result;
            }
        }
        return null;
    }
    doOnce(fun) {
        for (let i = this.stack_pointer; i >= 0; i += 1) {
            const item = this.stack[i];
            const result = fun(item);
            if (result) {
                return true;
            }
        }
        return false;
    }
    empty() {
        this.initialize();
    }
    set_bookmark() {
        this.bookmark = this.stack_pointer;
        return this.stack_pointer;
    }
    stackmark() {
        return this.stack_pointer;
    }
    size_to_bookmark() {
        if (this.bookmark === -1) {
            if (this.stack_pointer === -1) {
                return 0;
            } else {
                return this.stack_pointer + 1;
            }
        } else {
            if (this.stack_pointer === -1) {
                return -(this.bookmark + 1);
            } else {
                return this.stack_pointer - this.bookmark;
            }
        }
    }
    dump() {
        console.log('STACK DUMP BEGIN');
        console.log('Size', this.size());
        this.forEach(({type, value}, i) => {
            console.log(i, 'type: ', type, 'value: ', value);
        });
        console.log('STACK DUMP END');
    }
}


class ForthStackSlow {
    constructor() {
        this.stack = [];
    }
    pop() {
        if (this.stack.length == 0) {
            throw new Error("stack empty");
        }
        return this.stack.pop();
    }
    popn(n) {
        if (this.stack.length < n) {
            throw new Error(`stack too small (${stack.length}) for request of ${n} items.`);
        }
        return this.stack.splice(this.stack.length - n, n);
    }
    push(value) {
        this.stack.push(value);
    }
    peek() {
        if (this.stack.length == 0) {
            throw new Error("stack empty");
        }
        return this.stack[this.stack.length - 1];
    }
    get(i) {
        return this.stack[i];
    }
    dup() {
        this.push(this.peek());
    }
    size() {
        return this.stack.length;
    }
    forEach(fun) {
        let i = 0;
        this.stack.forEach((item) => {
            fun(item, i);
            i += 1;
        });
    }
}
