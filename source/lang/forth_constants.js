export default class ForthConstants {
    constructor(forth) {
        this.forth = forth;
        this.initialize();
    }

    initialize() {
        this.last_id = 0;
        this.constants = {};
        // this.constants_by_name = {};
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
        // if (!(vocabulary in this.constants_by_name)) {
        //     this.constants_by_name[vocabulary] = {};
        // }
        // this.constants_by_name[vocabulary][name] = constant_id;
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

    // get_from_symbol(vocabulary, name) {
    //     if (!(vocabulary in this.constants_by_name)) {
    //         throw new Error(`Sorry, no constants in vocabulary '${vocabulary}'`);
    //     }
    //     if (!(name in this.constants_by_name[vocabulary])) {
    //         throw new Error(`Sorry, no constant named '${name}' in vocabulary '${vocabulary}'`);
    //     }
    //
    //     return this.get(this.constants_by_name[vocabulary][name]);
    // }
    //
    // set_from_symbol(vocabulary, name, value) {
    //     const entry = this.dictionary_get(vocabulary, name);
    //     if (!entry) {
    //         throw new Error(`Sorry, no constant named '${name}' in vocabulary '${vocabulary}'`);
    //     }
    //     if (entry.type !== 'constant') {
    //         throw new Error(`Sorry, that isn't a constant: '${name}':'${entry.type}'`);
    //     }
    //     return this.set(entry.value, value);
    // }

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
