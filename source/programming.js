// import {forth_new, forth_input_code, forth_compile_tokens, forth_run_programx} from "./forth.js";
import * as F from '/lang/forth.js';
import CoreVocabulary from "/lang/vocabulary_core.js";
// import {init as init_io} from "/lang/vocabulary_io.js";
import IOVocabulary from '/lang/vocabulary_io.js';
import MathVocabulary from "/lang/vocabulary_math.js";
import TimeVocabulary from "/lang/vocabulary_time.js";
import UIVocabulary from "/lang/vocabulary_ui.js";
import ArrayVocabulary from '/lang/vocabulary_array.js';
import TestVocabulary from '/lang/vocabulary_test.js';

function setup_canvas() {

    const resize_canvas = () => {
        const display_element = document.getElementById('display');
        const canvas_element = document.getElementById('canvas');

        const w = display_element.clientWidth;
        const h = display_element.clientHeight;

        canvas_element.width = w;
        canvas_element.height = h;
    }

    resize_canvas();

    let last_resize = Date.now();
    const resize_debounce = 100;

    window.addEventListener('resize', () => {
        if ((Date.now() - last_resize) < resize_debounce) {
            return;
        }
        last_resize = Date.now();
        resize_canvas();
    })
}

function update_display(forth) {

    console.log('[update_display]');

    // update data stack display
    const data_stack_el = document.querySelector('#stacks > #data');
    const data_stack_table_body_el = data_stack_el.querySelector('.table .body');
    // TODO: for now we rerender the entire table body every time,
    // but when/if we get stack item ids, we can use these to selectively
    // update the display... maybe

    // empty the body
    data_stack_table_body_el.innerHTML = '';
    forth.parameter_stack.forEach(({type, value}, stack_counter) => {
        data_stack_table_body_el.innerHTML += `
        <div class="row">
        <div class="cell index">
        ${stack_counter + 1}
        </div>
        <div class="cell type">
        ${type}
        </div>
        <div class="cell value">
        ${value}
        </div>
        </div>
        `;
    });

    //

    const return_stack_el = document.querySelector('#stacks > #return');
    const return_stack_table_body_el = return_stack_el.querySelector('.table .body');
    return_stack_table_body_el.innerHTML = '';
    forth.return_stack.forEach(({type, value}, stack_counter) => {
        return_stack_table_body_el.innerHTML += `
        <div class="row">
        <div class="cell index">
        ${stack_counter + 1}
        </div>
        <div class="cell type">
        ${type}
        </div>
        <div class="cell value">
        ${value}
        </div>
        </div>
        `;
    });

    // update variables
    const variables_el = document.querySelector('#store > #variables');
    const variables_table_body_el = variables_el.querySelector('.body > .table > .body');
    variables_table_body_el.innerHTML = '';
    forth.variables.forEach(({vocabulary, name, value: {type, value}}) => {
        // get the value for the variable...
       variables_table_body_el.innerHTML += `
         <div class="row">
            <div class="cell">${vocabulary === '' ? '' : vocabulary}</div>
            <div class="cell">${name}</div>
            <div class="cell">${type}</div>
        </div>
       `;
    });

    // update constants
    const constants_el = document.querySelector('#store > #constants');
    const constants_table_body_el = constants_el.querySelector('.body > .table > .body');
    constants_table_body_el.innerHTML = '';
    forth.constants.forEach(({vocabulary, name, value: {type, value}}) => {
        // get the value for the variable...
        constants_table_body_el.innerHTML += `
        <div class="row">
        <div class="cell">${vocabulary === '' ? '-' : vocabulary}</div>
        <div class="cell">${name}</div>
        <div class="cell">${type}</div>
        </div>
        `;
    });

    // update strings

    // update objects


    // whew!
}


function main() {

    const setupForth = (forth) => {
        console.log('setting up forth for programming...');
        CoreVocabulary(forth);
        IOVocabulary(forth);
        UIVocabulary(forth);
        MathVocabulary(forth);
        TimeVocabulary(forth);
        ArrayVocabulary(forth);
    };

    const forth = new F.Forth({
        onInterp: update_display,
        // TODO: implement this
        onCompileWord: update_display,
        onRunWord: update_display,
        outputSelector: '#output',
        consoleSelector: '#console',
        onInitialize: setupForth
    });


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
            const elapsed = Date.now() - start;
            console.log('elapsed', elapsed);
            forth.ui.console('Ok.');
        } catch (ex) {
            forth.ui.console(`Error! ${ex.message}`);
            // console.error(`Error! ${ex.message}`);
            forth.reset();
            update_display(forth);
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
            }
        }
    });

    update_display(forth);
    code_field.focus();
}


main();
