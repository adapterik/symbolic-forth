let instanceId = 0;

export default class ForthContext {
    // static CF_BREAK = 'break';
    // static CF_RETURN = 'return';
    // static CF_EXIT = 'exit';
    constructor({lexical, parent} = {}) {
        this.lexical = lexical;
        this.parent = parent;
        this.locals = {};
        // this.dictionary = {};
        // this.controlFlowLevel = cfl;
        // this.controlFlowState = null;

        instanceId += 1;
        this.instanceId = instanceId;
    }

    setLocal(name, value) {
        this.locals[name] = value;
    }

    getLocal(name) {
        let value = this.locals[name];
        if (typeof value === 'undefined' && this.lexical) {
           value = this.parent.getLocal(name);
        }
        return value;
    }

    deleteLocal(name) {
        delete this.locals[name];
    }

    // getControlFlowLevel() {
    //     return this.controlFlowLevel;
    // }
    //
    // setControlFlowState(newState) {
    //     this.controlFlowState = newState;
    // }
    //
    // isControlFlowState(stateToTest) {
    //     return this.controlFlowState === stateToTest;
    // }
    //
    // resetControlFlowState() {
    //     this.controlFlowState = null;
    // }
}
/*
class InterpreterContext extends ForthContext {
    exit() {
    }
}

class WordContext extends ForthContext {
    exit() {
    }

    return() {
    }
}

class LoopContext extends ForthContext {
    exit() {
    }

    return() {
    }

    break() {
    }

    continue() {
    }

    isContinue() {
    }

    isBreak() {
    }

    isReturn() {
    }

    isExit() {
    }
}

export {InterpreterContext, WordContext, LoopContext};*/
