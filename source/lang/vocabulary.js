import * as F from "./forth.js";
import { assert_type } from "./vocabulary_utils.js";


export default class Vocabulary {
    constructor(forth, options = {}) {
        this.forth = forth;
        this.options = options;
        this.vocabulary = options.vocabulary || '';
        // if (options.VOCABULARY_NAME) {
        //     this.VOCABULARY_NAME = options.VOCABULARY_NAME;
        // }
    }
/*
    add_word(name, method, vocabulary = null) {
        this.forth.add_word(vocabulary === null ? this.vocabulary : vocabulary, name, method);
    }*/
}
