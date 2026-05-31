import * as Recognizers from './forth_recognizers.js';

const INTERP_TIME = 1;
const COMPILE_TIME = 2;

export default class ForthInterpreter {
    constructor(forth, {onInterp} = {}) {
        this.forth = forth;
        this.onInterp = onInterp;
        this.state = null;
        this.initialize();
        this.state = 'initialized';
    }

    initialize() {
        this.input_code = '';

        // These are the built-in things we can recognize as we straight-up
        // parse the program text. If we want to recognize additional forms
        // (e.g. a date, array, object, url, etc.) we can place them here, or
        // add a method to add a recognizer.
        this.recognizers = [
            {
                name: 'Word',
                recognizer: Recognizers.forth_recognizer_word
            },
            {
                name: 'Number',
                recognizer: Recognizers.forth_recognizer_number
            },
            {
                name: 'Bool',
                recognizer: Recognizers.forth_recognizer_bool
            },
            {
                name: 'Null',
                recognizer: Recognizers.forth_recognizer_null
            },
            {
                name: 'Symbol',
                recognizer: Recognizers.forth_recognizer_symbol
            }
        ]
    }

    add_code(code_text) {
        this.input_code += ' ' + code_text;
    }

    add_code_line(code_string) {
    }

    error(message) {
            // TODO: make this configurable at the system level.
            // The program mode 'normal' is the classic FORTH behavior - reset the
            // system and print the error message.
            // In 'debug' mode, though, we leave everything alone so the programmer
            // can inspect the state of the system.
            // const dot_element = document.getElementById('info');
            this.forth.ui.console(message);
            this.forth.ui.console('Re-initializing system to the starting state.');
            this.forth.ui.console(`If you wish to inspect the system post-error, set the global state variable "MODE" to the symbol 'debug`);
            // dot_element.innerHTML += `<div class="error">Error: ${message}</div>`;
            // this.initialize();
            this.state = 'error';
    }

    // top level intrepreter. see run_word_list for inner loops, words, and such.
    interpret(code_text) {
        if (code_text) {
            this.add_code(code_text);
        }
        const context = this.forth.new_context({cfl: 'exit'});


        let token;
        for (;;) {
            token = this.next_input_token();
            if (token === null) {
                return;
            }

            const word = this.find_recognizer(token);

            if (!word) {
                // throw new Error(`No recognizer fo '${token}'`);
                console.log(`No recognizer for '${token}'`, this.input_code);
                this.error(`No recognizer for '${token}'`);
                return;
            }

            let runtime_word;
            try {
                runtime_word = word({interpreter: this, forth: this.forth});
            } catch (ex) {
                this.error(`Compilation exception: ${ex.message}`);
                this.error(ex.stack);
                return;
            }

            // TODO: should the outer word be breakable?

            // It is possible that there is no action for this
            // recognizer to take
            if (runtime_word) {
                try {
                    runtime_word({interpreter: this, forth: this.forth});
                } catch (ex) {
                    this.error(`Runtime exception: ${ex.message}, ${ex.stack},`);
                }
            }

            // The outer interpreteu is always in 'exit' control flow state ...
            // for now.

            if (this.forth.isControlFlowExit()) {
                break;
            } else {
                this.forth.resetControlFlowState();
            }

            if (this.state === 'error') {
                return;
            }

            if (this.onInterp) {
                this.onInterp(this.forth);
            }
        }
    }

    run(code_text) {
        this.interpret(code_text);
    }

    next_input_token() {
        if (this.input_code.length === 0) {
            return null;
        }

        // skip any blanks // skip any blanks
        let skipped = 0;
        while (/\s/.test(this.input_code[skipped])) {
            // console.log('-skipping', this.input_code[skipped].charCodeAt(0));
            skipped += 1;
            if (skipped >= this.input_code.length) {
                // console.log('-skipping-done', skipped);
                // all blanks?
                return null;
            }
        }

        // console.log('-skipping-complete', skipped, "'", this.input_code[skipped], "'", this.input_code[skipped].charCodeAt(0));

        // if (this.input_code.length === 1) {
            // console.log('hmm', this.input_code.charCodeAt(0));
        // }
        // console.log('*** next input token...', skipped, this.input_code.length, this.input_code.charCodeAt(0));

        // get the next upcoming blank, if any
        let token_end = skipped;
        while (/\S/.test(this.input_code[token_end])) {
            token_end += 1;
            if (token_end >= this.input_code.length) {
                token_end = -1;
                break;
            }
        }

        // if none, the rest of the string is the token
        let token;
        if (token_end === -1) {
            token = this.input_code.substring(skipped);
            this.input_code = '';
        } else {
            token = this.input_code.substring(skipped, token_end);
            this.input_code = this.input_code.substring(token_end);
        }
        return token;
    }

    get_next_input_until(until) {
        if (this.input_code.length === 0) {
            return null;
        }

        // get the first upcoming blank, if any
        let string_end = this.input_code.indexOf(until);

        // if none, the rest of the string is the token
        let string;
        if (string_end === -1) {
            string = this.input_code;
            this.input_code = '';
        } else {
            string = this.input_code.substring(0, string_end);
            this.input_code = this.input_code.substring(string_end + 1);
        }
        return string;
    }

    get_next_input_char(until) {
        if (this.input_code.length === 0) {
            return null;
        }

        // get the first upcoming blank, if any
        const next_char = this.input_code.slice(0,1);
        this.input_code = this.input_code.slice(1);
        return next_char;
    }

    skip_input_whitespace() {
        if (this.input_code.length === 0) {
            return null;
        }
        let skipped = 0;
        while (/\s/.test(this.input_code[skipped])) {
            skipped += 1;
            if (skipped >= this.input_code.length) {
                return null;
            }
        }
        if (skipped > 0) {
            this.input_code = this.input_code.substring(skipped);
        }
        return skipped;
    }

    read_code_until(stop_string) {
        if (this.input_code.length === 0) {
            return;
        }

        const stop_pos = this.input_code.indexOf(stop_string);
        // console.log('vvvvvvvvv');
        // console.log('read code until', stop_string, stop_pos, this.input_code.substring(0, stop_pos + stop_string.length));
        // console.log('^^^^^^^^^');
        if (stop_pos >= 0) {
            // replace input code with everything after the stop string.
            this.input_code = this.input_code.substring(stop_pos + stop_string.length);
        } else {
            // TODO: what to do?
            throw new Error(`Stop string not detected: '${stop_string}'`);
        }
    }

    find_recognizer(token) {
        for (const {name, recognizer} of this.recognizers) {
            const item = recognizer(this.forth, token);
            if (item) {
                return item;
            }
        }
    }

    compile_and_run_token(token) {
        const word = this.find_recognizer(token);
        if (!word) {
            console.log('no recognizer', this.input_code);
            throw new Error(`No recognizer for ${token}.`);
        }

        const runtime_word = word({interpreter: this, forth: this.forth});

        if (runtime_word) {
            runtime_word({forth: this.forth, interpreter: this});
        }

        // DO WE NEED THIS?
        if (this.onInterp) {
            this.onInterp(this.forth);
        }
    }

    compile_until(until_tokens) {
        let compiled_words = [];
        let token;

        for (;;) {
            token = this.next_input_token();
            // console.log('compile_until: token:', token);
            if (token === null) {
                return;
            }

        // for (token = this.next_input_token(); token != null; token = this.next_input_token()) {
            if (until_tokens.includes(token.toUpperCase())) {
                break;
            }

            const word = this.find_recognizer(token);

            if (!word) {
                console.log('no recognizer', this.input_code);
                throw new Error(`No recognizer for ${token}.`);
            }

            const runtime_word = word({interpreter: this, forth: this.forth});
            if (runtime_word) {
                compiled_words.push(runtime_word);
            }

        }
        return [token, compiled_words];
    }

    // collect_values_until(until_tokens, context) {
    //     let compiled_words = [];
    //     let token;
    //
    //     for (token = this.next_input_token(); token != null; token = this.next_input_token()) {
    //         if (until_tokens.includes(token.toUpperCase())) {
    //             break;
    //         }
    //
    //         // TODO: exec seems to be obsolete...
    //         const word = this.find_recognizer(token, COMPILE_TIME, context);
    //
    //         if (!word) {
    //             throw new Error(`No recognizer for ${token}.`);
    //         }
    //
    //         // const {exec, action} = recognizer;
    //
    //         // execute it at interp / compile time
    //         const runtime_word = word(context);
    //
    //         // if the word has a run time action, add it
    //         // to the xt list.
    //         if (runtime_word) {
    //             compiled_words.push(runtime_word);
    //         }
    //
    //     }
    //     return [token, compiled_words];
    // }

    run_word_list(word_list, controlFlowLevel) {

        const context = this.forth.currentContext();

        // TODO: not sure about this.
        // context.exit = false;
        // context.recurse = false;
        // context.break = false;

        do {
            context.exit = false;
            for (let word of word_list) {

                word({forth: this.forth, interpreter: this});


                // DO WE NEED THIS?
                if (this.onInterp) {
                    this.onInterp(this.forth);
                }

                if (this.forth.controlFlowState !== null) {
                    break;
                }
            }
        } while (context.recurse);
    }
}
