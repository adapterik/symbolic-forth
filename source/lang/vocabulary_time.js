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

const TimeVocabulary = (forth, options = {}) => {
    forth.add_vocabulary('TIME', 'Interface with time functionality of the system');
    forth.add_word('TIME', 'NOW', now_word);
    forth.add_word('TIME', 'DATE-PARTS', date_parts_word);
}

export default TimeVocabulary;

