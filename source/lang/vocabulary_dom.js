
/**
 *   < query/string > DOM::QUERY-ELEMENT
 **/
function select_word({forth}) {
    return () => {
        const selectorQuery = forth.pop_string_or_symbol_name();
        const element = document.querySelector(selectorQuery);

        if (element === null) {
            forth.parameter_stack.push(forth.null_value());
        } else {
            forth.parameter_stack.push(forth.object_value(element));
        }
    }
}

// function query_wordn({forth}) {
//     return () => {
//         const querySelector = forth.pop_string();
//         const elements = document.queryElementAll(querySelector);
//
//         if (element === null) {
//             forth.parameter_stack.push(forth.null_value());
//         } else {
//             forth.parameter_stack.push(forth.object_value(element));
//         }
//     }
// }


/**
 *   < style/string > < element/Element > DOM::STYLE
 **/
function style_word({forth}) {
    return () => {
        const element = forth.pop_object();
        const styleValue = forth.pop_string_or_symbol_name();
        const styleName = forth.pop_string_or_symbol_name();

        element.style[styleName] = styleValue;
    }
}

/**
 *   < text/string > < element/Element > DOM::TEXT
 **/
function text_word({forth}) {
    return () => {
        const element = forth.pop_object();
        const textValue = forth.pop_string();

        element.innerText = textValue;
    }
}
const DOMVocabulary = (forth) => {
    forth.add_vocabulary('DOM', 'Words to work with the browser Document Object Model (DOM) API');
    forth.add_word('dom', "select", select_word);
    // forth.add_word('dom', "queryn", query_elements_word);
    forth.add_word('dom', "style", style_word);
    forth.add_word('dom', "text", text_word);
}

export default  DOMVocabulary;

