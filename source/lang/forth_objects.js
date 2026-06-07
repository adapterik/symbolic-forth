import {uuid4} from './utils.js';

export default class ForthObjects {
    constructor() {
        this.next_id = 0;
        this.objects = {};
    }

    create(value) {
        const id = this.next_id;
        this.objects[id] = value;
        this.next_id += 1;
        return id;
    }

    get(id) {
        return this.objects[id];
    }

    set(id, value) {
        this.objects[id] = value;
    }

    delete(id) {
        delete this.objects[id];
    }
}

