export default class ForthVariables {
    constructor(forth) {
        this.forth = forth;
        this.initialize();
    }

    initialize() {
        this.last_id = 0;
        this.variables = {};
        this.variables_by_name = {};
    }

    create(vocabulary, name, value) {
        if (vocabulary in this.variables_by_name) {
            if (name in this.variables_by_name[vocabulary]) {
                const id = this.variables_by_name[vocabulary][name];
                this.variables[id] = {vocabulary, name, value};
                return;
            }
        } else {
            this.variables_by_name[vocabulary] = {};
        }

        this.last_id += 1;
        const variable_id = this.last_id;
        const variable = {vocabulary, name, value }
        this.variables[variable_id] = variable;

        this.variables_by_name[vocabulary][name] = variable_id;
        this.forth.add_word(vocabulary, name, ({forth}) => {
            return () => {
                forth.parameter_stack.push({type: 'variable', value: variable_id});
            }
        });
        return variable_id;
    }

    set(id, value) {
        this.variables[id].value = value;
    }

    getNamed(vocabulary, name) {
        if (!(vocabulary in this.variables_by_name)) {
            throw new Error(`Sorry, no variables in vocabulary '${vocabulary}'`);
        }
        if (!(name in this.variables_by_name[vocabulary])) {
            throw new Error(`Sorry, no variable named '${name}' in vocabulary '${vocabulary}'`);
        }

        return this.get(this.variables_by_name[vocabulary][name]);
    }

    setNamed(vocabulary, name, value) {
        if (!(vocabulary in this.variables_by_name)) {
            throw new Error(`Sorry, no variables in vocabulary '${vocabulary}'`);
        }
        if (!(name in this.variables_by_name[vocabulary])) {
            throw new Error(`Sorry, no variable named '${name}' in vocabulary '${vocabulary}'`);
        }
        const id = this.variables_by_name[vocabulary][name];
        return this.set(id, value);
    }
    get(id) {
        return this.variables[id].value;
    }

    has(id) {
        return (id in this.variables);
    }

    hasNamed(vocabulary, name) {
        const variable = this.forth.dictionary.get(vocabulary, name);
        return !!variable;
    }

    delete(id) {
        const {vocabulary, name} = this.variables[id];
        this.forth.dictionary.delete(vocabulary, name);
        delete this.variables[id];
        delete this.variables_by_name[name];
    }
    forEach(fun) {
        let i = 0;
        Object.entries(this.variables).forEach(([id, item]) => {
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
