function now_word({forth}) {
    return () => {
        forth.parameter_stack.push(forth.number_value(Date.now()));
    }
}

let run_count = 0;

const TimeVocabulary = (forth, options = {}) => {
    // if (run_count > 0 && !options.fresh) {
    //     return;
    // }
    run_count += 1;

    forth.add_word('', "now", now_word);
}

export default TimeVocabulary;

