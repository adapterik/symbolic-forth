

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

function output_value(forth, forthValue) {
    forth.ui.output_text(forth.to_string(forthValue));
}

function dot_word({forth}) {
    return () => {
        output_value(forth, forth.pop_any());
        forth.ui.output_text(' ');
    };
}

function print_word({forth}) {
    return () => {
        output_value(forth, forth.pop_any());
    };
}

function println_word({forth}) {
    return () => {
        const value = forth.pop_any();
        forth.ui.println(forth.to_string(value));
        // output_value(forth, value);
        // forth.ui.output_cr();
    };
}

function pop_until_stackmark(forth) {
    const items = [];
    for (;;) {
        const [type, value] = forth.pop_any();
        if (type === 'symbol' && forth.symbols.get(value).hasProp('stackmark')) {
          break;
        } else {
          items.push([type, value]);
        }
    }
    return items;
}

function printf_word({forth}) {
    return () => {
        const format = forth.pop_string();
        const items = pop_until_stackmark(forth);

        const params = [];
        for (const [type, value] of items) {
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
        const [type, value] = forth.pop_any();
        switch (type) {
            case 'string': forth.ui.print_console(forth.strings.get(value)); break;
            case 'symbol': forth.ui.print_console(value); break;
            case 'number': forth.ui.print_console('' + value); break;
            case 'object': forth.ui.print_console(`[object ${value[0]}, ${value[1]}]`); break;
            case 'null':  break;
            case 'bool': forth.ui.print_console(value ? 'true' : 'false'); break;
        }
    };
}

function dot_stack_word({forth}) {
    const format_stack_item = (value) => {
        return forth.to_string(value);
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
            OUT(`${format_stack_item(item)} (${item[0]})`);
            CR();
        }
        OUT('BOTTOM'); CR();
    }
}

const IOVocabulary = (forth, options = {}) => {
    // forth.add_word('', "LOG", log_word);
    forth.add_word('', ".", dot_word);
    forth.add_word('', "PRINT", print_word);
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
};

export default IOVocabulary;


