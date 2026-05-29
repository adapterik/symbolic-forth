import {uuid4} from './utils.js';

export default class ForthObjects {
    constructor() {
        this.object_count = 0;
        this.objects = {};
    }

    create(type, value) {
        const object_id = uuid4();
        this.objects[object_id] = {type,value};
        this.object_count += 1;
        return object_id;
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

