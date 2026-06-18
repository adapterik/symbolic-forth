export function forth_recognizer_number(forth, token) {
    const numberish = Number(token);
    if (isNaN(numberish)) {
        return;
    }
    return () => {
        return () => {
            forth.parameter_stack.push(forth.number_value( numberish));
        };
    };
}
/*
export function forth_recognizer_bool(forth, token) {
    if (token === 'true') {
        return () => {
            return () => {
                forth.parameter_stack.push(forth.bool_value(true));
            };
        }
    } else if (token === 'false') {
        return () => {
            return () => {
                forth.parameter_stack.push(forth.bool_value(false));
            };
        }
    } else {
        return;
    }
}*/

// export function forth_recognizer_null(forth, token) {
//     if (token !== 'null') {
//         return;
//     }
//     return () => {
//         return () => {
//             forth.parameter_stack.push(forth.null_value(null));
//         };
//     }
// }

// export function forth_recognizer_symbol(forth, token) {
//     if (token.length < 2) {
//         return;
//     }
//     const symbolPrefix = token.substr(0,1);
//     if (symbolPrefix !== '~') {
//         return;
//     }
//     const symbolName = token.substr(1);
//     // TODO: use the symbol vocabulary to create the symbol and get the
//     // symbol id.
//     return () => {
//         return () => {
//             forth.parameter_stack.push(forth.symbol_value(symbolName));
//         };
//     }
// }

export function forth_recognizer_word(forth, token) {
    const {vocabulary, name} = forth.dictionary.parse_token(token);
    const dict_entry = forth.dictionary.get(vocabulary, name);

    if (!dict_entry) {
        return;
    }
    const [type, value] = dict_entry;
    if (type !== 'word') {
        return null;
    }

    return value.func;
}
