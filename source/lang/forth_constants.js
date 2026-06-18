export default class ForthConstants {
    constructor(forth) {
        this.forth = forth;
        this.initialize();
    }

    initialize() {
        this.last_id = 0;
        this.constants = {};
    }

    create(vocabulary, name, value) {

        // What is special about constants is that they may not be
        // rewritten.
        if (this.hasNamed(vocabulary, name)) {
            console.log('dict', this.forth.dictionary.dictionaries['']);
            throw new Error(`CONST: word already defined for '${vocabulary}::${name}'`);
            // this.forth.error(`Constant already defined for '${vocabulary}::${name}'`);
            // return;
        }

        this.last_id += 1;
        const constant_id = this.last_id;
        this.constants[constant_id] = {vocabulary, name, value };
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

    get(id) {
        return this.constants[id];
    }

    has(id) {
        return (id in this.constants);
    }

    hasNamed(vocabulary, name) {
        const entry = this.forth.dictionary.get(vocabulary, name);

        // console.log('huh?', entry);
        return !!entry;
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
