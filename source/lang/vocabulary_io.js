// import * as std from 'std';

// function log_word({forth}) {
//     return () => {
//         const {type, value} = forth.parameter_stack.pop();
//         switch (type) {
//             case 'string': forth.log(forth.string.get(value)); break;
//             case 'symbol': forth.log(value); break;
//             case 'number': forth.log('' + value); break;
//             case 'object': forth.log(`[object ${value}]`); break;
//             case 'null':  break;
//             case 'bool': forth.log(value ? 'true' : 'false'); break;
//         }
//     }
// }

function cr_word({forth}) {
    return () => {
        forth.ui.output_cr();
    }
}

function clear_word({forth}) {
    return () => {
        forth.ui.clear_output();
    }
}

function clear_console_word({forth}) {
    return () => {
        forth.ui.clear_console();
    }
}

// function space_word({forth}) {
//     return () => {
//         forth.output_text(' ');
//     };
// }
//
// function spaces_word({forth}) {
//     return () => {
//         const {type, value} = forth.parameter_stack.pop();
//         assert_type(type, 'number');
//         forth.output_text(' '.repeat(value));
//     }
// }

function to_string(forth, {type, value}) {
    switch (type) {
        case 'string': return forth.strings.get(value);
        case 'symbol': return forth.symbols.get(value).name;
        case 'number': return '' + value;
        case 'array': {
            return value.map((item) => {
                return to_string(forth, item);
            }).join(' ');
        }
        case 'map':
            const {map} = value;
            return Object.entries(value).map(([key, value]) => {
                return `${key}=>${to_string(forth, value)}`;
            }).join(' ');
        case 'null': return '';
        case 'bool': return value ? 'true' : 'false';
        case 'variable': return to_string(forth, forth.variables.get(value));
        default: return `[unknown type ${type}]`;
    }
}

function output_value(forth, {type, value}) {
    forth.ui.output_text(to_string(forth, {type, value}));
}

function dot_word({forth}) {
    return () => {
        output_value(forth, forth.parameter_stack.pop());
    };
}

function println_word({forth}) {
    return () => {
        const value = forth.parameter_stack.pop();
        output_value(forth, value);
        forth.ui.output_cr();
    };
}

function pop_until_stackmark(forth) {
    const items = [];
    for (;;) {
        const {type, value} = forth.parameter_stack.pop();
        if (type === 'symbol' && forth.symbols.get(value).hasProp('stackmark')) {
          break;
        } else {
          items.push({type, value});
        }
    }
    return items;
}

function printf_word({forth}) {
    return () => {
        const format = forth.pop_string();
        const items = pop_until_stackmark(forth);

        const params = [];
        for (const {type, value} of items) {
            switch (type) {
                case 'string': params.push(forth.strings.get(value)); break;
                case 'number': params.push(value); break;
                case 'bool': params.push(value); break;
                case 'symbol': params.push(forth.symbols.get(value).name); break;
                default: throw new Error(`PRINTF only supports string, number, boolean, and symbol, not '${type}'`);
            }
        }
        // const result = std.printf.apply(null, [format, ...params]);
        forth.ui.output_printf(format, params);
    };
}

function con_word({forth}) {
    return () => {
        const {type, value} = forth.parameter_stack.pop();
        switch (type) {
            case 'string': forth.ui.console(forth.strings.get(value)); break;
            case 'symbol': forth.ui.console(value); break;
            case 'number': forth.ui.console('' + value); break;
            case 'object': forth.ui.console(`[object ${value.type}, ${value.value}]`); break;
            case 'null':  break;
            case 'bool': forth.ui.console(value ? 'true' : 'false'); break;
        }
    };
}

// function dot_html(forth, message) {
//     // const dot_element = document.getElementById('output');
//     // dot_element.innerHTML = dot_element.innerHTML + message;
//
//     const selector = forth.constants.get('io', 'output_selector')
//     const dot_element = document.querySelector(selector);
//     if (!dot_element) {
//         throw new Error(`output element not found with selector '${selector}'`);
//     }
//     dot_element.innerText = dot_element.innerHTML + message;
// }
/*
 d *ot_html_word() {
 return (forth) => {
 const {type, value} = forth.parameter_stack.pop();
 switch (type) {
     case 'string': dot_html(forth, forth.string.get(value)); break;
     case 'symbol': dot_html(forth, value); break;
     case 'number': dot_html(forth, '' + value); break;
     case 'null':  break;
     case 'bool': dot_html(forth, value ? 'true' : 'false'); break;
     }
     };output_value
     }*/

function dot_stack_word({forth}) {
    const format_stack_item = (value) => {
        return to_string(forth, value);
    }
    const CR = () => {
        forth.ui.output_cr();
    }
    const OUT = (s) => {
        forth.ui.output_text(s);
    }
    return () => {
        CR();
        OUT('SIZE'); OUT(' ');
        OUT(`${forth.parameter_stack.size()}`); CR();
        OUT('TOP'); CR();
        for (let i = forth.parameter_stack.size() - 1; i >= 0; i -= 1) {
            const item = forth.parameter_stack.get(i);
            OUT('  ');
            OUT(`${format_stack_item(item)} (${item.type})`);
            CR();
        }
        OUT('BOTTOM'); CR();
    }
}

function to_string_word({forth}) {
    return () => {
        const item = forth.parameter_stack.pop();
        forth.parameter_stack.push(forth.string_value(to_string(forth, item)));
    };
}

let run_count = 0;

const IOVocabulary = (forth, options = {}) => {
    // if (run_count > 0 && !options.fresh) {
    //     return;
    // }
    run_count += 1;

    // forth.add_word('', "LOG", log_word);
    forth.add_word('', ".", dot_word);
    forth.add_word('', "PRINT", dot_word);
    forth.add_word('', 'PRINTLN', println_word);
    forth.add_word('', 'PRINTF', printf_word);
    forth.add_word('', "CON", con_word);
    // forth.add_wrd('', ".HTML", true, false, this.dot_html_word.bind(this));
    forth.add_word('', 'CR', cr_word);
    forth.add_word('', '.CR', cr_word);
    // forth.add_word('', 'SPACE', space_word);
    // forth.add_word('', 'SPACES', spaces_word);
    forth.add_word('', '.S', dot_stack_word);

    forth.add_word('', 'CLEAR', clear_word);
    forth.add_word('', 'CLEARCON', clear_console_word);

    forth.add_word('', 'TO-STRING', to_string_word);
};

export default IOVocabulary;


