import * as F from "../lang/forth.js";
import WebUI from "../lang/forth-browser.js";
import CoreVocabulary from "../lang/vocabulary_core.js";
import MathVocabulary from "../lang/vocabulary_math.js";
import IOVocabulary from '../lang/vocabulary_io.js';
import CanvasVocabulary from '../lang/vocabulary_canvas.js';
import DOMVocabulary from '../lang/vocabulary_dom.js';
import StringVocabulary from "/lang/vocabulary_string.js";
import ArrayVocabulary from "/lang/vocabulary_array.js";
import MapVocabulary from "/lang/vocabulary_map.js";
import TimeVocabulary from "/lang/vocabulary_time.js";
// import UIVocabulary from "/lang/vocabulary_ui.js";
// import ArrayVocabary from '/lang/vocabulary_array.js';
// import TestVocabulary from '/lang/vocabulary_test.js';


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
            const elapsed = Date.now() - start;
            console.log('elapsed', elapsed);
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
            }
        }
    });

    // update_display(forth);
    code_field.focus();
}

function setup_screen(forth) {
    const width = 640;
    const height = 480;
    const cellWidth = 8;
    const cellHeight = 16;
    const cellWidthStyle = `${cellWidth}px`;
    const cellHeightStyle = `${cellHeight}px`;
    const cols = width / cellWidth;
    const rows = height / cellHeight;
    const screen = document.getElementById('screen');

    for (let col = 0; col < cols; col += 1) {
        for (let row = 0; row < rows; row += 1) {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = cellWidthStyle;
            div.style.height = cellHeightStyle;
            const leftPos = `${col * cellWidth}px`;
            const topPos = `${row * cellHeight}px`;
            div.style.left = leftPos;
            div.style.top = topPos;
            div.id = `cell_${row}_${col}`;
            screen.appendChild(div);
        }
    }
}

async function fetchForth(name) {
    const response = await fetch(name);
    const result = await response.text();
    return result;
}

function run (code) {
    const forth = new F.Forth({
        ui: new WebUI(),
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
    DOMVocabulary(forth);
    StringVocabulary(forth)
    // UIVocabulary(forth)
    MathVocabulary(forth);
    ArrayVocabulary(forth);
    MapVocabulary(forth);
    TimeVocabulary(forth);

    setup_screen(forth);
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

    forth.interpreter.run(code);
}

async function main() {
    const forth = await fetchForth('screen.sforth');
    run(forth);
}

main();
