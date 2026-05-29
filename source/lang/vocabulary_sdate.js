function split_word({forth}) {
    return () => {
        forth.parameter_stack.push(forth.number_value(Date.now()));
    }
}

let run_count = 0;

const SDateVocabulary = (forth, options = {}) => {
    run_count += 1;

    forth.add_word('', "now", now_word);
}

export default SDateVocabulary;

