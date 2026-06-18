

function string_equal_word({forth}) {
    return () => {
        const string_a = forth.pop_string();
        const string_b = forth.pop_string();

        forth.parameter_stack.push(forth.bool_value(string_a === string_b));
    };
}

function string_compare_word({forth}) {
    return () => {
        const string_b = forth.pop_string();
        const string_a = forth.pop_string();

        forth.parameter_stack.push(forth.number_value(string_a.localeCompare(string_b)));
    };
}

function string_length_word({forth}) {
    return () => {
        const string = forth.pop_string();
        forth.parameter_stack.push(forth.number_value(string.length));
    };
}

function string_char_code_word({forth}) {
    return () => {
        const value = forth.pop_string();
        const code = value.charCodeAt(0);
        forth.parameter_stack.push(forth.number_value(code));
    }
}

function string_code_char_word({forth}) {
    return () => {
        const value = forth.pop_number();
        forth.parameter_stack.push(forth.string_value(String.fromCharCode(value)));
    }
}

function pop_string_or_char(forth) {
    const [type, value] = forth.pop_any();
    switch (type) {
        case 'string': return forth.strings.get(value);
        case 'number': return String.fromCharCode(value);
        default: throw new Error(`Value to append to must be a string or integer char code, is '${type}'`);
    }
}

// ( s1/string s2/string -- s1s2/string )
function string_concat_word({forth}) {
    return () => {
        const string_b = pop_string_or_char(forth);
        const string_a = pop_string_or_char(forth);

        forth.parameter_stack.push(forth.string_value(string_a.concat(string_b)));
    };
}

function string_interpolate_word({forth}) {
    return () => {
        const interpolator = forth.pop_string();
        const strings = _string_array_from_stack(forth);

        const result = strings.join(interpolator);
        forth.parameter_stack.push(forth.string_value(result));
    };
}

function string_interpolate_array_word({forth}) {
    return () => {
        const interpolator = forth.pop_string();
        const interpolatee = forth.pop_array();

        const result = interpolatee.map(([type, value]) => {
            if (type !== 'string') {
                throw new Error(`Sorry, can only interpolate with strings, not '${type}'`);
            }
            return forth.strings.get(value);
        }).join(interpolator);

        forth.parameter_stack.push(forth.string_value(result));
    };
}


function string_contains_word({forth}) {
    return () => {
        const subjectString = forth.pop_string();
        const containsString = forth.pop_string();

        const result = subjectString.includes(containsString);
        forth.parameter_stack.push(forth.bool_value(result));
    };
}

function string_join_word_paired_symbols({forth}) {
    return () => {
        const stopper = forth.pop_symbol().id;

        let result = '';

        for (;;) {
            const [type, value] = forth.pop_any();
            if (type === 'string') {
                result += value;
            } else if (type === 'symbol') {
                if (value === stopper) {
                    break;
                } else {
                    result += value;
                }
            }
        }

        forth.parameter_stack.push(forth.string_value(result))
    }
}

function _string_array_from_stack(forth) {
    let strings = [];
    for (;;) {
        const [type, value] = forth.pop_any();
        if (type === 'string') {
            strings.push(forth.strings.get(value));
        } else if (type === 'number') {
            strings.push('' + value);
            // strings.push(String.fromCharCode(value));
        } else if (type === 'symbol') {
            const symbol = forth.symbols.get(value);
            if (symbol.hasProp('stackmark')) {
                break;
            } else {
                // we can also use the symbol name
                strings.push(symbol.name);
            }
        }
    }
    return strings;
}

function string_join_word({forth}) {
    return () => {
        const strings = _string_array_from_stack(forth);
        const result = strings.reverse().reduce((res, s) => {
            return res + s;
        }, '');

        forth.parameter_stack.push(forth.string_value(result))
    }
}

function string_join_array_word({forth}) {
    return () => {
        const values = forth.pop_array();
        let result = '';
        for (let value of values) {
            const string = forth.to_string(value);
            result += string;
        }
        forth.parameter_stack.push(forth.string_value(result))
    }
}

function string_split_word({forth}) {
    return () => {
        const subject = forth.pop_string();
        const splitter = forth.pop_string();

        const result = subject.split(splitter);
        forth.parameter_stack.push(forth.array_value(result.map((element) => {
            return forth.string_value(element);
        })));
    };
}

function string_to_num_word({forth}) {
    return () => {
        const possibleNum = forth.pop_string();
        const num = new Number(possibleNum);

        if (isNaN(num)) {
            return forth.parameter_stack.push(forth.null_value());
        }
        return forth.parameter_stack.push(forth.number_value(num));
    };
}

// < string-pos/number > <text/string > STRING::CHAR-AT
function string_char_at_word({forth}) {
    return () => {
        const text = forth.pop_string();
        const pos = forth.pop_number();

        forth.parameter_stack.push(forth.string_value(text.charAt(pos)));
    };
}

function string_lpad_word({forth}) {
    return () => {
        const text = forth.pop_string();
        const padding = forth.pop_string();
        const padLength = forth.pop_number();

        if (padLength >= text.length) {
            forth.parameter_stack.push(forth.string_value(text))
        } else {
            let result = '';
            for (let i = text.length - padLength; i < text.length; i += 1) {
               result += padding;
            }
            result += text;
            forth.parameter_stack.push(forth.string_value(result))
        }

    }
}

function string_replace_word({forth}) {
    return () => {
        const subjectString = forth.pop_string();
        const replacementPattern = forth.pop_string();
        const replacement = forth.pop_string();

        const result = subjectString.replace(replacementPattern, replacement);
        forth.parameter_stack.push(forth.string_value(result));
    }
}

const StringVocabulary = (forth, options = {}) => {
    forth.add_word('', 'S=', string_equal_word);

    forth.add_vocabulary('STRING', 'Extended string capabilities');
    forth.add_word('string', '=', string_equal_word);
    forth.add_word('string', 'compare', string_compare_word);
    forth.add_word('string', 'length', string_length_word);
    forth.add_word('string', 'char-code', string_char_code_word);
    forth.add_word('string', 'code-char', string_code_char_word);
    forth.add_word('string', 'concat', string_concat_word);
    forth.add_word('string', 'interpolate', string_interpolate_word);
    forth.add_word('string', 'interpolate-array', string_interpolate_array_word);
    forth.add_word('string', 'contains', string_contains_word);
    forth.add_word('string', 'join', string_join_word);
    forth.add_word('string', 'join-array', string_join_array_word);
    forth.add_word('string', 'split', string_split_word);
    forth.add_word('string', 'to-num', string_to_num_word);
    forth.add_word('string', 'char-at', string_char_at_word);
    forth.add_word('string', 'lpad', string_lpad_word);
    forth.add_word('string', 'replace', string_replace_word);
}

export default StringVocabulary;

