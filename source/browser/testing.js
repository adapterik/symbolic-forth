// import {forth_new, forth_input_code, forth_compile_tokens, forth_run_programx} from "./forth.js";
import * as F from '/lang/forth.js';
import WebUI from '/lang/forth-browser.js';
// import {init as init_exp} from "/lang/vocabulary_exp.js";

import CoreVocabulary from "/lang/vocabulary_core.js";
// import {IOVocabulary, GetIOVocabularyInstance} from '/lang/vocabulary_io.js';
import IOVocabulary from '/lang/vocabulary_io.js';
import MathVocabulary from "/lang/vocabulary_math.js";
import TimeVocabulary from "/lang/vocabulary_time.js";
import UIVocabulary from "/lang/vocabulary_ui.js";
import ArrayVocabulary from '/lang/vocabulary_array.js';
import TestVocabulary from '/lang/vocabulary_test.js';
import StringVocabulary from '/lang/vocabulary_string.js';
import SymbolVocabulary from '/lang/vocabulary_symbol.js';
import MapVocabulary from '/lang/vocabulary_map.js';

import AddStringTests from '/tests/string_tests.js';
import AddDoLoopTests from '/tests/do_loop_tests.js';
import AddBeginRepeatTests from '/tests/begin_repeat_tests.js';
import AddArrayTests from '/tests/array_tests.js';
import AddColonTests from '/tests/colon_tests.js';
import AddIFTests from '/tests/if_tests.js';
import AddCompileInterpTests from '/tests/compile_interp_tests.js';
import AddMathTests from '/tests/math_tests.js';
import AddLocalTests from '/tests/local_tests.js';
import AddSymbolTests from '/tests/symbol_tests.js';
import AddVarTests from '../tests/var_tests.js';
import AddConstTests from '../tests/const_tests.js';
import AddMapTests from '../tests/map_tests.js';

/*
 * function test_string(f) {
 *    forth_input_code(f, `" Hello, I'm a string!" .`);
 *    forth_input_code(f, `
 *        cr .
 *        " This is a test of string variable:" .
 *        VARIABLE s
 *        " foo" s !
 *        s @ .
 *        `);
 * }*/

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

class Testing {
    constructor() {
        this.TESTS = {};
        this.CHECKMARK = '✓';
        this.CROSS = '✗';
        this.test_data = null;
        this.ui = new WebUI();
    }

    render_test_set_row(name) {
        const {title} = this.TESTS[name];
        const test_table_el = document.querySelector('.results-table > .body');

        const test_set_el = document.createElement('div');
        test_set_el.classList.add('test-set');
        test_set_el.setAttribute('test-set', name);

        const row_el = document.createElement('div');
        row_el.classList.add('row');

        const checkbox_field_el = document.createElement('div');
        checkbox_field_el.classList.add('col');
        checkbox_field_el.classList.add('test-set-checkbox');

        const checkall_button_el = document.createElement('button');
        checkall_button_el.setAttribute('type', 'button');
        checkall_button_el.innerText = '✓';
        checkall_button_el.setAttribute('is_checked', 'f');
        checkall_button_el.addEventListener('click', () => {this.checkall_test_set(checkall_button_el, name);});

        checkbox_field_el.appendChild(checkall_button_el);

        row_el.appendChild(checkbox_field_el);

        const title_el = document.createElement('div');
        title_el.classList.add('col');
        title_el.classList.add('title');
        title_el.innerText = title;

        row_el.appendChild(title_el);
        test_set_el.appendChild(row_el);

        test_table_el.appendChild(test_set_el);
    }

    add_test_set(name, title) {
        this.TESTS[name] = {
            title,
            tests: {}
        };
        this.render_test_set_row(name);
    }

    render_test_row(test_set_name, test_name) {
        const {name, title, code, status} = this.TESTS[test_set_name].tests[test_name];

        const test_table_el = document.querySelector(`.results-table > .body > [test-set="${test_set_name}"]`);

        const row_el = document.createElement('div');
        row_el.classList.add('row');
        row_el.classList.add('test');
        row_el.setAttribute('test-set', test_set_name);
        row_el.setAttribute('test-name', name);

        const checkbox_field_el = document.createElement('div');
        checkbox_field_el.classList.add('col');
        checkbox_field_el.classList.add('test-checkbox');
        const checkbox_el = document.createElement('input');
        checkbox_el.setAttribute('type', 'checkbox');
        checkbox_field_el.appendChild(checkbox_el);

        const test_title_el = document.createElement('div');
        test_title_el.classList.add('col');
        test_title_el.classList.add('test');
        test_title_el.innerText = title;

        const status_el = document.createElement('div');
        status_el.classList.add('col');
        status_el.classList.add('status');

        const message_el = document.createElement('div');
        message_el.classList.add('col');
        message_el.classList.add('message');


        row_el.appendChild(checkbox_field_el);
        row_el.appendChild(test_title_el);
        row_el.appendChild(status_el);
        row_el.appendChild(message_el);

        test_table_el.appendChild(row_el);
    }

    add_test(test_set_id, name, title, code) {
        const test_set = this.TESTS[test_set_id];
        test_set.tests[name] = {
            name, title, code, status: ''
        };
        this.render_test_row(test_set_id, name);
    }

    reset_tests() {
        this.test_data = {
            test_sets: {
                successes: 0,
                failures: 0
            },
            tests: {
                successes: 0,
                failures: 0
            }
        };
        document.querySelector('#feedback #output').innerText = '';
        document.querySelector('#feedback #console').innerText = '';
    }

    run_test(test_set, test_name) {
        const forth = new F.Forth({
             // onInterp: update_display,
            // outputSelector: '#feedback #output',
            // consoleSelector: '#feedback #console'
            ui: this.ui
        });

        // TODO: this should be a method to reset all vocabularies, so that we
        // only have to set this up in one place; otherwise, it is easy to
        // leave one out as we add more vocabularies to test...
        CoreVocabulary(forth, {fresh: true});
        IOVocabulary(forth, {fresh: true})
        UIVocabulary(forth, {fresh: true})
        MathVocabulary(forth, {fresh: true});
        TimeVocabulary(forth, {fresh: true});
        TestVocabulary(forth, {fresh: true});
        ArrayVocabulary(forth, {fresh: true});
        StringVocabulary(forth, {fresh: true});
        TimeVocabulary(forth, {fresh: true});
        SymbolVocabulary(forth, {fresh: true});
        MapVocabulary(forth, {fresh: true});

        const {code} = this.get_test(test_set, test_name);

        // TODO: add ability for a test to initialize a module...

        forth.interpreter.add_code(code);

        forth.interpreter.run();

        const [,successes] = forth.variables.getNamed('test', 'TEST_SUCCESSES');
        const [,failures] = forth.variables.getNamed('test', 'TEST_FAILURES');

        if (failures === 0 && successes > 0) {
            this.test_data.test_sets.successes += 1;
        }
        if (failures > 0) {
            this.test_data.test_sets.failures += 1;
        }

        this.test_data.tests.successes += successes;
        this.test_data.tests.failures += failures;

        if (failures > 0) {
            this.render_test_status(test_set, test_name, 'Failed', this.test_data.tests.successes, this.test_data.tests.failures, '');
        } else if (successes > 0) {
            this.render_test_status(test_set, test_name, 'Success', this.test_data.tests.successes, this.test_data.tests.failures, '');
        } else {
            this.render_test_status(test_set, test_name, 'none',  this.test_data.tests.successes, this.test_data.tests.failures, '');
        }
    }


    check_all_tests(el) {
        const is_enabled = !(el.getAttribute('is_checked') === 't');
        el.setAttribute('is_checked', is_enabled ? 't' : 'f');
        if (is_enabled) {
            el.innerText = this.CROSS;
        } else {
            el.innerText = this.CHECKMARK;
        }

        const test_sets = document.querySelectorAll(`.test-set[test-set]`);
        test_sets.forEach((test_set_el) => {
            const checkbox = test_set_el.querySelector('.test-set-checkbox > button');
            const is_checked = checkbox.getAttribute('is_checked') === 't';
            if (is_checked === is_enabled) {
                return;
            }
            const test_set_name = test_set_el.getAttribute('test-set');
            const test_set_button_el = test_set_el.querySelector('.test-set-checkbox button');
            test_set_button_el.click();
        });
    }
    // set_test_status
    enable_test_set(name, enabled) {
        const test_set_rows = document.querySelectorAll(`[test-set="${name}"]`);
        test_set_rows.forEach((row_el) => {
            const button_el = row_el.querySelector('input[type="checkbox"]');
            button_el.checked = enabled;
        });
    }

    checkall_test_set(el, name) {
        const is_checked = !(el.getAttribute('is_checked') === 't');
        el.setAttribute('is_checked', is_checked ? 't' : 'f');
        if (is_checked) {
            el.innerText = this.CROSS;
        } else {
            el.innerText = this.CHECKMARK;
        }

        const test_set_rows = document.querySelectorAll(`[test-set="${name}"]`);
        test_set_rows.forEach((row_el) => {
            const button_el = row_el.querySelector('input[type="checkbox"]');
            button_el.checked = is_checked;
        });
    }

    get_test(test_set, name) {
        const test = this.TESTS[test_set].tests[name];
        return test;
    }

    render_test_status(test_set, name, status, successes, failures, message) {
        const test_row_el = document.querySelector(`.row.test[test-set="${test_set}"][test-name="${name}"]`);
        const status_el = test_row_el.querySelector('.col.status');
        const message_el = test_row_el.querySelector('.col.message');
        status_el.innerText = status;
        message_el.innerText = message;

        const successes_el = document.querySelector('#successes');
        const failures_el = document.querySelector('#failures');
        successes_el.innerText = `${successes}`;
        failures_el.innerText = `${failures}`;
    }

    run_selected_tests() {
        this.ui.println('RUNNING tests...');
        this.reset_tests();
        const test_rows = document.querySelectorAll('.row.test');
        test_rows.forEach((test_row) => {
            const checkbox = test_row.querySelector('.test-checkbox input[type="checkbox"]');
            if (!checkbox.checked) {
                return;
            }
            const test_set = test_row.getAttribute('test-set');
            const test_name = test_row.getAttribute('test-name');
            this.render_test_status(test_set, test_name, 'Running...', 0, 0, '');

            // set test status and message variables...
            this.run_test(test_set, test_name);
            // update the ui with the new value of status and message variables.
        });
    }

    wire_up() {
        const check_all_tests_button_el = document.querySelector('.header > .test-checkbox > button');
        check_all_tests_button_el.addEventListener('click', () => {
            this.check_all_tests(check_all_tests_button_el);
        });

        const run_tests_button_el = document.getElementById('run-button');
        run_tests_button_el.addEventListener('click', () => {
            this.run_selected_tests();
        });
    }

}

function main() {
    const testing = new Testing();
    testing.wire_up();

    AddLocalTests(testing);
    AddStringTests(testing);
    AddDoLoopTests(testing);
    AddBeginRepeatTests(testing);
    AddArrayTests(testing);
    AddColonTests(testing);
    AddIFTests(testing);
    AddCompileInterpTests(testing);
    AddMathTests(testing);
    AddSymbolTests(testing);
    AddVarTests(testing);
    AddConstTests(testing);
    AddMapTests(testing);
}

main();
