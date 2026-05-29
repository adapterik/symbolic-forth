class ForthSymbol {
    constructor({name, id}) {
        this.name = name;
        this.id = id;
        this.properties = {};
    }

    setProp(propName, value) {
        this.properties[propName] = value;
    }

    getProp(name) {
        return this.properties[name];
    }

    hasProp(name) {
        return name in this.properties;
    }
}

export default class ForthSymbols {
    constructor() {
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

    create(name) {
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

    get(id) {
        return this.symbols[id];
    }

    getByName(name) {
        return this.symbols_map[name];
    }

}
