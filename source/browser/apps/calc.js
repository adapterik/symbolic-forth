import * as F from "./lang/forth.js";
import CoreVocabulary from "./lang/vocabulary_core.js";
import IOVocabulary from './lang/vocabulary_io.js';
import CanvasVocabulary from './lang/vocabulary_canvas.js';
import MathVocabulary from "./lang/vocabulary_math.js";

// import TimeVocabulary from "/lang/vocabulary_time.js";
// import UIVocabulary from "/lang/vocabulary_ui.js";
// import ArrayVocabary from '/lang/vocabulary_array.js';
// import TestVocabulary from '/lang/vocabulary_test.js';

const code_history = [];
function add_to_code_history(code) {
    code_history.push(code);
    const code_history_el = document.getElementById('code_history');
    const code_entry = document.createElement('div');
    code_entry.innerText = code;
    code_history_el.append(code_entry);
}


function setup_code_input(forth) {
    const history = [];
    let history_pos = 0;

    const history_pos_el = document.getElementById('code_input_history_pos');

    const handle_code_input = () => {
        const code_field = document.getElementById('code_input_field');
        let code_text = code_field.value;
        if (code_text === '') {
            return;
        }
        code_text += ' ';

        try {
            const start = Date.now();
            forth.interpreter.run(code_text);
            add_to_code_history(code_text);
            const elapsed = Date.now() - start;
            forth.ui.console('Ok.');
        } catch (ex) {
            forth.ui.console(`Error! ${ex.message}`);
            // console.error(`Error! ${ex.message}`);
        }

        history.push(code_text);
        history_pos_el.innerText = `(${history.length + 1})`;
        history_pos = null;
        code_field.value = '';
    }

    const button = document.getElementById('code_input_button');
    button.addEventListener('click', () => {
        handle_code_input();
    });

    const form = document.getElementById('code_input_form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handle_code_input();
    });

    const update_history = (new_history_pos) => {
        history_pos = new_history_pos;
        code_field.value = history[history_pos];
        history_pos_el.innerText = `${history_pos + 1} / ${history.length}`;
    }

    const code_field = document.getElementById('code_input_field');
    code_field.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowUp': {
                if (history_pos === 0) {
                    console.warn('Already at top of history');
                    return;
                }
                if (history_pos === null) {
                    history_pos = history.length;
                }
                update_history(history_pos - 1);
                break;
            }
            case 'ArrowDown': {
                if (history_pos === null) {
                    return;
                }
                if (history_pos === history.length - 1) {
                    // console.warn('Already at bottom of history');
                    const code_field = document.getElementById('code_input_field');
                    code_field.value = '';
                    history_pos = null;
                    history_pos_el.innerText = `(${history.length + 1})`;
                    return;
                }
                update_history(history_pos + 1);
                break;
            }
            case 'Home':
                if (history_pos === 0) {
                    console.warn('Already at top of history');
                    return;
                }
                update_history(0);
                break;
            case 'End':
                if (history_pos === null) {
                    return;
                }
                update_history(history.length - 1);
                break;
            default: {
                console.log('other key', e.key);
            }
        }
    });

    // update_display(forth);
    code_field.focus();
}

function setup_calculator_input(forth) {
    const input_control = document.getElementById('code_input_field');
    const code_input_button = document.getElementById('code_input_button');
    const buffer_control = document.getElementById('buffer');
    const display_buffer_el = document.querySelector('#display > [field="buffer"]');

    // all number keys simply add a number to the input area?
    const keys = document.querySelectorAll('.key.number');
    keys.forEach((key) => {
        key.addEventListener('click', (event) => {
            const key = event.target.getAttribute('key');
             // input_control.value += key;
             buffer_control.value += key;
             display_buffer_el.innerText = display_buffer_el.innerText + key;
        });
    });

    const enter_key = document.querySelector('[key="enter"]');
    enter_key.addEventListener('click', (event) => {
        input_control.value = buffer_control.value;
        buffer_control.value = '';
        display_buffer_el.innerText = '';
        code_input_button.click();
    });

    const clear_key = document.querySelector('[key="clear"]');
    clear_key.addEventListener('click', (event) => {
        const buffer = buffer_control.value;
        if (buffer.length === 0) {
            return;
        }
        buffer_control.value = buffer.slice(0, -1);
        display_buffer_el.innerText = buffer.slice(0, -1);
        // buffer_control.value = '';
        // diisplay_buffer_el.innerText = '';
    });

    // const clear_key = document.querySelector('[key="clear"]');
    // clear_key.addEventListener('click', (event) => {
    //     buffer_control.value = '';
    //     display_buffer_el.innerText = '';
    // });

    const divide_key = document.querySelector('[key="divide"]');
    divide_key.addEventListener('click', (event) => {
        input_control.value = '/';
        code_input_button.click();
    });

    const multiply_key = document.querySelector('[key="multiply"]');
    multiply_key.addEventListener('click', ( event) => {
        input_control.value = '*';
        code_input_button.click();
    });

    const subtract_key = document.querySelector('[key="subtract"]');
    subtract_key.addEventListener('click', (event) => {
        input_control.value = '-';
        code_input_button.click();
    });

    const add_key = document.querySelector('[key="add"]');
    add_key.addEventListener('click', (event) => {
        input_control.value = '+';
        code_input_button.click();
    });
}

function el(name) {
    return document.createElement(name);
}

function update_display(forth) {
    const stack_el = document.getElementById('stack');
    const count_el = document.querySelector('#stack > .header > .count');
    const items_el = document.querySelector('#stack > .items');

    count_el.innerText = forth.parameter_stack.size();

    if (forth.parameter_stack.size() === 0) {
        items_el.innerText = 'none';
        return;
    }

    items_el.innerHTML = '';

    const render_stack_item = ([type, value]) => {
        const item_el = el('div');
        item_el.classList = 'item';
        const type_el = el('div');
        type_el.classList = 'type';
        const value_el = el('div');
        item_el.appendChild(type_el);
        item_el.appendChild(value_el);

        value_el.classList = 'value';
        type_el.innerText = type;
        value_el.innerText = forth.value_to_string([type, value]);

        items_el.appendChild(item_el);
    };


    forth.parameter_stack.forEach((item) => {
        render_stack_item(item);
    });
}

function main () {
    const forth = new F.Forth({
        onInterp: update_display,
        // TODO: implement this
        // onCompileWord: update_display,
        // onRunWord: update_display,
        outputSelector: '#output',
        consoleSelector: '#console'
    });

    CoreVocabulary(forth);
    IOVocabulary(forth);
    // CanvasVocabulary(forth);
    // UIVocabulary(forth)
    MathVocabulary(forth);
    // TimeVocabulary(forth);

    setup_code_input(forth);
    setup_calculator_input(forth);


    forth.interpreter.run(`
        clear
      " Hello!" . cr
        `);
}

main();
