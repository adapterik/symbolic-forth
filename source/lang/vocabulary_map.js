function getMapKeyFromValue(forth, forthValue) {
    const [type, value] = forthValue;
    let key;
    switch (type) {
        case 'symbol':
            key = forth.symbols.get(value).name;
            break;
        case 'string':
            // TODO: strings should be wrapped so we can count their accesses, etc.
            key = forth.strings.get(value);
            break;
        default:
            throw new Error(`[map_get_word] expected 'symbol' or 'string', but got a '${type}'`);
    }

    return key;
}

function getMapAndKeyFromStack(forth) {
    const mapValue = forth.pop_map();

    const [type, value] = forth.pop_any();

    let key;
    switch (type) {
        case 'symbol':
            key = forth.symbols.get(value).name;
            break;
        case 'string':
            key = forth.strings.get(value);
            break;
        default:
            throw new Error(`[map_get_word] expected 'symbol' or 'string', but got a '${type}'`);

            // return forth.error(`[map_get_word] expected 'symbol' or 'string', but got a '${type}'`);
    }

    return [mapValue, key];
}

function map_brace_word({interpreter, forth}) {
    const [, word_list] = interpreter.compile_until(['}']);

    return () => {
        forth.parameter_stack.set_bookmark();

        // Generally we don't need to handle control flow within a map
        // construction word list... doesn't make a lot of sense.
        // However, exit is always honored!
        interpreter.run_word_list(word_list);

        switch(forth.controlFlowState) {
            case null:
                break;
            case 'break':
                console.warn('break detected in map brace word; ignored, reset');
                forth.resetControlFlowState();
                break;
            case 'continue':
                console.warn('continue detected in map brace word; ignored, reset');
                forth.resetControlFlowState();
                break;
            case 'return':
                console.warn('return detected in map brace word; ignored, reset');
                forth.resetControlFlowState();
                break;
            case 'exit':
                return;
                break;
        }

        const elements_count = forth.parameter_stack.size_to_bookmark();
        const items = forth.pop_n(elements_count);

        // Map items are alternating key value key value etc.

        const mapValue = {};
        for (;;) {
            const forthValue = items.shift();
            if (!forthValue) {
                break;
            }
            const key = getMapKeyFromValue(forth, forthValue);

            const value = items.shift();
            if (!value) {
                throw new Error('Unbalanced map literal');
            }
            mapValue[key] = value;
        }

        forth.parameter_stack.push(forth.map_value(mapValue));
    }
}

/**
 * (<id> <i> -- <valu>)
 **/
function map_get_word({forth}) {
    return () => {
        const [mapValue, key] = getMapAndKeyFromStack(forth);

        let value = mapValue[key];
        if (typeof value === 'undefined') {
            value = forth.null_value();
        }

        forth.parameter_stack.push(value);
    }
}

/**
 * ( <value> <index> <map> -- )
 **/
function map_set_word({forth}) {
    return () => {
        const [mapValue, key] = getMapAndKeyFromStack(forth);
        const value = forth.pop_any();
        mapValue[key] = value;
    }
}

function map_size_word({forth}) {
    return () => {
        const mapValue = forth.pop_map();
        const size = Object.keys(mapValue).length;
        forth.parameter_stack.push(forth.number_value(size));
    }
}

function map_keys_word({forth}) {
    return () => {
        const mapValue = forth.pop_map();
        const keys = Object.keys(mapValue).forEach((key) => {
            // return forth.string_value(key);
            forth.parameter_stack.push(forth.symbol_value(key));
        });
        // forth.parameter_stack.push(forth.array_value(keys));
    }
}

const MapVocabulary = (forth, options = {}) => {
    forth.add_word('', 'M{', map_brace_word);
    forth.add_word('', 'M@', map_get_word);
    forth.add_word('', 'M!', map_set_word);

    // forth.add_word('map', 'create', map_word);
    forth.add_vocabulary('MAP', 'Work with maps');
    forth.add_word('MAP', '!', map_set_word);
    forth.add_word('MAP', 'SET', map_set_word);
    forth.add_word('MAP', '@', map_get_word);
    forth.add_word('MAP', 'GET', map_get_word);
    forth.add_word('MAP', 'SIZE', map_size_word);
    forth.add_word('MAP', 'KEYS', map_keys_word);
}

export default MapVocabulary;
