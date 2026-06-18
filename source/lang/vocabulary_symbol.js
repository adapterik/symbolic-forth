
function symbol_name_word({forth}) {
    return () => {
        const symbol = forth.pop_symbol();
        forth.parameter_stack.push(forth.string_value(symbol.name));
    };
}

const SymbolVocabulary = (forth, options = {}) => {
    forth.add_vocabulary('SYMBOL', 'Words to work with symbols');
    forth.add_word('SYMBOL', 'NAME', symbol_name_word);
}

export default SymbolVocabulary;
