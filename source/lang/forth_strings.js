export default class ForthStrings {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.last_id = 0;
        this.strings = {};
        this.strings_map = {};
    }

    reset() {
        this.initialize();
    }

    create(value) {
        const existing = this.strings_map[value];
        if (existing) {
            return existing;
        }
        this.last_id += 1;
        this.strings[this.last_id] = value;
        this.strings_map[value] = this.last_id;
        return this.last_id;
    }

    get(id) {
        return this.strings[id];
    }

}
