import * as F from "/lang/forth.js";
import CoreVocabulary from "/lang/vocabulary_core.js";
import IOVocabulary from '/lang/vocabulary_io.js';
import CanvasVocabulary from '/lang/vocabulary_canvas.js';
// import MathVocabulary from "/lang/vocabulary_math.js";
// import TimeVocabulary from "/lang/vocabulary_time.js";
// import UIVocabulary from "/lang/vocabulary_ui.js";
// import ArrayVocabary from '/lang/vocabulary_array.js';
// import TestVocabulary from '/lang/vocabulary_test.js';


function setup_code_input() {
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
            forth.console('Ok.');
        } catch (ex) {
            forth.console(`Error! ${ex.message}`);
            console.error(`Error! ${ex.message}`);
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

    // update_display(forth);
    code_field.focus();
}

function main () {
    const forth = new F.Forth({
        // onInterp: update_display,
        // TODO: implement this
        // onCompileWord: update_display,
        // onRunWord: update_display,
        outputSelector: '#output',
        consoleSelector: '#console'
    });

    CoreVocabulary(forth);
    IOVocabulary(forth);
    CanvasVocabulary(forth);
    // UIVocabulary(forth)
    // MathVocabulary(forth);
    // TimeVocabulary(forth);

    setup_code_input(forth);


    // Canvas test...
//     forth.interpreter.run(`
//     " Get canvas context" . cr
//     " canvas" canvas::context var test_canvas
//
//     " Create green filled rectangle" . cr
//     test_canvas @ " green" canvas::fill_style
//     test_canvas @ 10 10 50 50 canvas::fill_rect
//
//     " Create a red filled rectangle" . cr
//     test_canvas @ " red" canvas::fill_style
//     test_canvas @ 60 60 40 40 canvas::fill_rect
//
//     " Create some blue text" . cr
//     test_canvas @ " orange" canvas::fill_style
//     test_canvas @ " bold 100px courier" canvas::font
//     test_canvas @ " bold 50px courier" canvas::set_font
//     test_canvas @ " Hello!" 100 50 canvas::fill_text
//
//     `);

    forth.interpreter.run(`
        " Get canvas context" . cr
        " canvas" canvas::context
        // canvas::set-context

        " Create green filled rectangle" . cr
        " green" canvas::fill_style
        10 10 50 50 canvas::fill_rect

        " Create a red filled rectangle" . cr
        " red" canvas::fill_style
        60 60 40 40 canvas::fill_rect

        " Create some blue text" . cr
        " orange" canvas::fill_style
        " bold 100px courier" canvas::font
        " bold 50px courier" canvas::set_font
        " Hello!" 100 50 canvas::fill_text

        `);
}

main();
