function now_word({forth}) {
    return () => {
        forth.parameter_stack.push(forth.number_value(Date.now()));
    }
}

function date_parts_word({forth}) {
    return () => {
        const time = forth.pop_number();
        const date = new Date(time);
        forth.parameter_stack.push(forth.number_value(date.getSeconds()));
        forth.parameter_stack.push(forth.number_value(date.getMinutes()));
        forth.parameter_stack.push(forth.number_value(date.getHours()));
    }
}
let run_count = 0;

const TimeVocabulary = (forth, options = {}) => {
    forth.add_word('time', 'now', now_word);
    forth.add_word('time', 'date-parts', date_parts_word);
}

export default TimeVocabulary;

