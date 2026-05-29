function set_title_word({forth}) {
    return () => {
        const {type, value: title_string_id} = forth.parameter_stack.pop();
        const title_string = forth.strings.get(title_string_id);

        const title_element = document.getElementById('title');
        title_element.innerText = title_string;
    };
}

function set_alert_word({forth}) {
    return () => {
        const {type, value: string_id} = forth.parameter_stack.pop();

        const alert_content = forth.strings.get(string_id);

        const alert_element = document.getElementById('alert');
        alert_element.innerText = alert_content;
    }
}

let run_count = 0;

const UIVocabulary = (forth, options = {}) => {
    // if (run_count > 0 && !options.fresh) {
    //     return;
    // }
    run_count += 1;

    forth.add_word('ui', 'set_title', set_title_word);
    forth.add_word('ui', 'set_alert', set_alert_word);
}

export default UIVocabulary;

