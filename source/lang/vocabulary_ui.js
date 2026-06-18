function set_title_word({forth}) {
    return () => {
        const title_string = forth.pop_string();

        const title_element = document.getElementById('title');
        title_element.innerText = title_string;
    };
}

function set_alert_word({forth}) {
    return () => {
        const alert_content = forth.pop_string();

        const alert_element = document.getElementById('alert');
        alert_element.innerText = alert_content;
    }
}

const UIVocabulary = (forth, options = {}) => {
    forth.add_vocabulary('UI', 'User interface functionality');
    forth.add_word('UI', 'SET-TITLE', set_title_word);
    forth.add_word('UI', 'SET-ALERT', set_alert_word);
}

export default UIVocabulary;

