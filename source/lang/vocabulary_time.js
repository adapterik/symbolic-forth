function now_word({forth}) {
    return () => {
        forth.parameter_stack.push(forth.number_value(Date.now()));
    }
}

let run_count = 0;

const TimeVocabulary = (forth, options = {}) => {
    forth.add_word('time', "now", now_word);
}

export default TimeVocabulary;

