export default class ForthConstants {
    constructor(forth) {
        this.forth = forth;
        this.initialize();
    }

    initialize() {
        this.last_id = 0;
        this.constants = {};
        this.constants_by_name = {};
    }

    create(vocabulary, name, value) {
        // What is special about constants is that they may not be
        // rewritten.
        if (this.hasNamed(vocabulary, name)) {
            throw new Error(`Constant already defined for '${vocabulary}::${name}'`);
            // this.forth.error(`Constant already defined for '${vocabulary}::${name}'`);
            return;
        }

        this.last_id += 1;
        const constant_id = this.last_id;
        this.constants[constant_id] = {vocabulary, name, value };
        if (!(vocabulary in this.constants_by_name)) {
            this.constants_by_name[vocabulary] = {};
        }
        this.constants_by_name[vocabulary][name] = constant_id;
        this.forth.add_word(vocabulary, name, ({forth}) => {
            return () => {
                forth.parameter_stack.push(this.constants[constant_id].value);
            }
        });
        return constant_id;
    }

    set(id, value) {
        this.constants[id].value = value;
    }

    has(id) {
        return (id in this.constants);
    }

    hasNamed(vocabulary, name) {
        const variable = this.forth.dictionary.get(vocabulary, name);
        return !!variable;
    }

    delete(id) {
        const {vocabulary, name} = this.constants[id];
        this.forth.dictionary.delete(vocabulary, name);
        delete this.constants[id];
        delete this.constants_by_name[name];
    }

    forEach(fun) {
        let i = 0;
        Object.entries(this.constants).forEach(([id, item]) => {
            fun(item, i);
            i += 1;
        });
    }

    empty() {
        const vocabularies = Object.keys(this.constants);
        for (const vocabulary of vocabularies) {
            const names = Object.keys(vocabulary);
            for (const name of names) {
                this.constants[vocabulary][name];
                this.forth.remove_word(vocabulary, name);
            }
        }
    }
}
