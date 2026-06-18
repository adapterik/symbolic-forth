export default class ForthDictionary {
    constructor() {
        this.vocabularies = {};
        this.dictionaries = {};
    }

    add_vocabulary(name, description) {
       name = name.toUpperCase();
       this.vocabularies[name] = {name, description};
    }

    add(vocabulary, name, type, value) {
        vocabulary = vocabulary.toUpperCase();
        if (!(vocabulary in this.vocabularies)) {
            throw new Error(`vocabulary '${vocabulary}' has not yet been defined`);
        }
        name = name.toUpperCase();
        if (!(vocabulary in this.dictionaries)) {
            this.dictionaries[vocabulary] = {};
        }
        this.dictionaries[vocabulary][name] = [type, value];
    }


    get( vocabulary, name) {
        vocabulary = vocabulary.toUpperCase();
        name = name.toUpperCase();
        if (!(vocabulary in this.dictionaries)) {
            return;
        }
        return this.dictionaries[vocabulary][name];
    }

    delete(vocabulary, name) {
        vocabulary = vocabulary.toUpperCase();
        name = name.toUpperCase();
        delete this.dictionaries[vocabulary][name];
    }

    parse_token(token) {
        const vocab_pos = token.indexOf('::');
        let vocabulary, name;
        if (vocab_pos >= 0) {
            vocabulary = token.substring(0, vocab_pos);
            name = token.substring(vocab_pos + 2);
        } else {
            vocabulary = '';
            name = token;
        }
        return {vocabulary, name};
    }
}
