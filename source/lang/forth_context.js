let instanceId = 0;

export default class ForthContext {
    // static CF_BREAK = 'break';
    // static CF_RETURN = 'return';
    // static CF_EXIT = 'exit';
    constructor({lexical, parent, forth, name} = {}) {
        this.lexical = lexical;
        this.parent = parent;
        this.forth = forth;
        this.name = name;

        this.locals = {};
        this.deferWords = [];
        // this.dictionary = {};
        // this.controlFlowLevel = cfl;
        // this.controlFlowState = null;

        instanceId += 1;
        this.instanceId = instanceId;
    }

    createLocal(name, value) {
        if (name in this.locals) {
            throw new Error(`local ${name} is already set; may not create`);
        }
        this.locals[name] = value;
    }

    getLocal(name, search=false) {
        let value = this.locals[name];
        if (typeof value === 'undefined' && this.lexical && search) {
           value = this.parent.getLocal(name, search);
        }
        return value;
    }

    modifyLocal(name, fun, search=false) {
        if (~(name in this.locals && this.lexical && search)) {
            return this.parent.getLocal(name, fun, search);
        }
        let value = this.locals[name];
        this.locals[name] = fun(this.locals[name]);
    }

    setLocal(name, newValue, search) {
        const value = this.locals[name];
        if (!(name in this.locals)) {
            if (this.lexical && search) {
                this.parent.setLocal(name, newValue, search);
            }
        } else {
            this.locals[name] = newValue;
        }
    }
    deleteLocal(name) {
        delete this.locals[name];
    }

    addDeferWord(word) {
        this.deferWords.push(word);
    }

    leave() {
        // hmm, the defer words may rely upon this context ...
        // ... e.g. locals ... so maybe we should supply the context
        // directly to words rather than rely upon currentcontext?
       for (const word of this.deferWords) {
           word({forth: this.forth});
       }
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
