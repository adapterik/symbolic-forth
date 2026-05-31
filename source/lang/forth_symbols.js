class ForthSymbol {
    constructor({vocabulary, name, id}) {
        this.vocabulary = vocabulary;
        this.name = name;
        this.id = id;
        this.properties = {};
    }

    setProp(propName, value) {
        this.properties[propName] = value;
    }

    getProp(propName) {
        return this.properties[propName];
    }

    hasProp(name) {
        return name in this.properties;
    }
}

export default class ForthSymbols {
    constructor(forth) {
        this.forth = forth;

        this.initialize();
    }

    initialize() {
        this.last_id = 0;
        this.symbols = {};
        this.symbols_map = {};
    }

    reset() {
        this.initialize();
    }
/*
    create(vocabulary, name) {
        const existing = this.symbols_map[name];
        if (existing) {
            return existing;
        }
        this.last_id += 1;
        const symbol = new ForthSymbol({name, id: this.last_id});
        this.symbols[symbol.id] = symbol;
        this.symbols_map[name] = symbol;
        return symbol;
    }
    */

    make(vocabulary, name) {
        if (!(vocabulary in this.symbols_map)) {
            this.symbols_map[vocabulary] = {};
        }

        this.last_id += 1;
        const symbol = new ForthSymbol({vocabulary, name, id: this.last_id});
        this.symbols[symbol.id] = symbol;

        this.symbols_map[vocabulary][name] = symbol.id;
        return symbol
    }

    use_or_create(vocabulary, name) {
        if (vocabulary in this.symbols_map) {
            if (name in this.symbols_map[vocabulary]) {
                return this.get(this.symbols_map[vocabulary][name]);
            }
        }
        return this.make(vocabulary, name);
    }

    create(vocabulary, name) {
        if (vocabulary in this.symbols_map) {
            if (name in this.symbols_map[vocabulary]) {
                throw new Error(`symbol '${vocabulary}::${name}' already exists'`);
            }
        }

        return this.make(vocabulary, name);
    }

    get(id) {
        return this.symbols[id];
    }

    getByName(vocabulary, name) {
        if (!(vocabulary in this.symbols_map)) {
            throw new Error(`no symbols in vocabulary '${vocabulary}'`);
        }
        if (!(name in this.symbols_map[vocabulary])) {
            throw new Error(`no symbol named '${name}' in vocabulary '${vocabulary}'`);
        }

        return this.get(this.symbols[vocabulary][name]);
    }

}
