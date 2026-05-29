// import {forth_new, forth_input_code, forth_compile_tokens, forth_run_programx} from "./forth.js";
import * as F from '/lang/forth.js';
import CoreVocabulary from "/lang/vocabulary_core.js";
// import {init as init_io} from "/lang/vocabulary_io.js";
import IOVocabulary from '/lang/vocabulary_io.js';
import MathVocabulary from "/lang/vocabulary_math.js";
import TimeVocabulary from "/lang/vocabulary_time.js";
// import {init as init_exp} from "/lang/vocabulary_exp.js";
import UIVocabulary from "/lang/vocabulary_ui.js";
// import {vocabulary_canvas_add_all} from "./vocabulary_canvas.js";
// import {vocabulary_ui_add_all} from './vocabulary_ui.js';
import ArrayVocabary from '/lang/vocabulary_array.js';
import TestVocabulary from '/lang/vocabulary_test.js';

function test_canvas(f) {
    F.forth_input_code(f, `
    " starting..." set_alert
    `);

    F.forth_input_code(f, `
    " WForth Demo - Canvas" set_title
    `);

    // Canvas test...
    F.forth_input_code(f, `
    " Get canvas context" . cr .
    " canvas" canvas::context
    " Set fill style" . cr .
    ( we dup because we need to use the context id again below )
    dup " green" canvas::fill_style
    " Create filled rectangle" . cr .
    10 10 150 150 canvas::fill_rect
    `);

    // Canvas test...
    F.forth_input_code(f, `
    VARIABLE ctx
    " canvas" canvas::context
    ctx !
    ctx @ " red" canvas::fill_style
    ctx @ 200 200 150 150 canvas::fill_rect
    `);

    // Canvas test...
    F.forth_input_code(f, `
    " canvas" canvas::context
    ctx !
    ctx @ " blue" canvas::fill_style
    ctx @ 200 10 150 150 canvas::fill_rect
    `);

    // Canvas test...
    F.forth_input_code(f, `
    " canvas" canvas::context
    ctx !
    ctx @ " gray" canvas::fill_style
    ctx @ 10 200 150 150 canvas::fill_rect
    `);

    F.forth_input_code(f, `
    " Finished!" set_alert
    `);
}

/**
 * Basic arithmetic operations.
 **/

const TEST_MATH_1 = `
" Math Test 1 - addition: " . CR
1 1 + 2 = test::assert_true
123 123 + 246 = test::assert_true
1.0 2.0 + 3.0 = test::assert_true
CR
`;

const TEST_MATH_2 = `
" Math Test 2 - subtraction: " . CR
1 1 - 0 = test::assert_true
1 2 - 1 = test::assert_true
10.0 5.0 - -5 = test::assert_true
CR
`;

const TEST_MATH_3 = `
" Math Test 2 - multiplication: " . CR
1 1 * 1 = test::assert_true
2 2 * 4 = test::assert_true
10.0 5.0 * 50.0 = test::assert_true
CR
`;

const TEST_MATH_4 = `
" Math Test 2 - division: " . CR
1 1 / 1 = test::assert_true
2 4 / 2 = test::assert_true
10.0 5.0 / 0.5 = test::assert_true
CR
`;



function test_perf1(f) {
    // F.forth_add_code(f, `
    //     now var start
    //     .s
    //     0 var temp
    //     1000 0 DO
    //        // temp @ 1 + temp !
    //        I .
    //     LOOP
    //     (now var end
    //     start @ . CR
    //     end @ . CR
    //     start @ end @ - var elapsed
    //     elapsed @ . CR
    //     temp @ . CR)
    //     `);
    F.forth_add_code(f, `
    now VAR start
    0 VAR iters
    1000000 0 DO
    iters 1+
    LOOP
    CR
    " Iters = " . iters @ .
    CR
    now VAR end
    start @ end @ - VAR elapsed
    CR
    " Started at " . start @ . CR
    " Ended at " . end @ . CR
    " Elapsed = " . elapsed @ . CR

    `);

    // LEFT OFF HERE TOO
    /*
     * For the loop variable to work (best, without one-off hacks),
     * we should store it in the local variables of the DO...LOOP
     * also, to support a sub-word-list accessing variables in an
     * outer word list, we _could_ support nesting of word_list
     * contexts, and allow the search for variables up through the
     * nested contexts...
     */
    // F.forth_add_code(f, `
    // " DO ... LOOP anyone?" . CR
    // 5 0 DO I . CR LOOP
    // QUIT
    // `);
}


const TEST_STRING_1 = `
" String Test 1 - equality: " .
" VALUE1" " VALUE1" = test::assert_true

\\  just print this out for the test user to enjoy
" String Test 2 - type: " .

\\ define the variable 's'
" foo" VAR s

\\ Wait, is it really a string?
s @ typeof " string" = test::assert_true

\\ Now try a string inside a colon-defined word
" String Test 3 - string in def: " .
: scol " In a definition" ; scol typeof  " string" = test::assert_true
`;

const TEST_STRING_2 = `
: scol " In a definition" ;
scol typeof " string" = test::assert_true
DROP
DEPTH 0 = test::assert_true
`;

function test_exp(f) {
    F.forth_input_code(f, `
    s @ typeof " string" = test::assert_true
    0 var a
    3 0 x::do
    1 +
    dup
    " [" .
    .
    " ]" .
    dup
    a !
    loop
    a @ 3 = test::assert_true
    `);


    // F.forth_run(f, `
    // 1 . cr .
    // " foo" . cr .
    // true . cr .
    // false . cr .
    // asymbol . cr .
    // sym DO . cr .
    // " DONE" . cr .
    // `);
}

const TEST_DO_LOOP_1 = `
" DO..LOOP Test 1 - one level loop: " .
0 VAR x
10 0 DO
I x !
LOOP
x @ 9 = test::assert_true
test::assert_stack_empty
`;


// function test_do_loop(f) {
//     // DO .. LOOP test
//     F.forth_add_code(f, `
//     " DO..LOOP Test 1 - one level loop: " .
//     0 VAR x
//     10 0 DO
//     I x !
//     LOOP
//     x @ 10 = test::assert_true
//     `);
//
//     // F.forth_run(f, `
//     // " LOOP Test 1 - two level loop: " .
//     // VARIABLE x
//     // VARIABLE y
//     // VARIABLE z
//     // VARIABLE zz
//     // 0 x !
//     // 0 y !
//     // 0 z !
//     // 10 0 DO
//     //   I @ y @ + y !
//     //   0 zz !
//     //   " (i=" . I . " )" .
//     //   10 0 DO
//     //     x @ 1 + x !
//     //     zz @ 1 + zz !
//     //   " zz:" . I @ . " ," .
//     //     ( J @ zz @ + zz ! )
//     //   LOOP
//     //   zz @ z @ + z !
//     // LOOP
//     // x @ . ", " .
//     // x @ 100 = test::assert_true
//     //  y @ . ", " .
//     // ( y @ 3628800 = test::assert_true
//     // z @ . ", " .
//     // z @ 36288000 = test::assert_true )
//     // `);
//
//
//     // F.forth_run(f, `
//     // " TESTING" log
//     // (
//     //   classic chuck moore do loop
//     //   really makes the most sense for a
//     //   stack language - who needs a
//     //   variable here?
//     //   <stop value> <initial and counting value> --
//     //   Implicit is that the DO will first inspect the
//     //   counting value, and if it is equal to the stop
//     //   value will not even enter the loop.
//     //   The LOOP will inspect the counting value and if
//     //   less than the stop value, will repeat the loop
//     //   body.
//     //   We can increment the counting value at the beginning
//     //   or ending of the DO loop.
//     //   The only trick is that the body of DO..LOOP must
//     //   leave the stack as it found it by the end of the
//     //   code (aka "word list").
//     // )
//     // 1 0 DO
//     //   ( we have the 1 and 0 on the stack still )
//     // 1 +
//     // LOOP
//     // `);
//     //     F.forth_run(flog will be displayed here when the forth is strong enough to do so! , `
//     //     " TESTING" log
//     //
//     //     ( set up the variable we'll track in the loop )
//     //     VARIABLE x
//     //
//     //     ( initialize to 0 )
//     //     0 x !
//     //
//     //     ( our loop begins with the generic code block word )
//     //     BEGIN
//     //
//     //     ( do stuff )
//     //
//     //     x @ .
//     //     x @ 1 + x !
//     //
//     //     ( test our conditional variable )
//     //     x @ 10 <
//     //     REPEAT_IF
//     //     `);
//     //     F.forth_run(f, `
//     //         " Loop Test 2 - two level loop: "
//     //         VARIABLE j
//     //         0 j !
//     //         10 0 DO
//     //         j @ .
//     //         cr .
//     //         j @ 1 + j !
//     //         LOOP
//     //     `);
// }


const TEST_DEFINE_WORD_1 = `
: test::plusone 1 + ;
1 test::plusone 2 = test::assert_true
test::assert_stack_empty
`;

const TEST_DEFINE_WORD_2 = `
: ::plusone 1 + ;
1 ::plusone 2 = test::assert_true
test::assert_stack_empty
`;

const TEST_DEFINE_WORD_3 = `
: plusone 1 + ;
1 plusone 2 = test::assert_true
test::assert_stack_empty
`;

// const TEST_DEFINE_WORD_2 =
//
// function test_define_word(f) {
//     F.forth_add_code(f, `
//     : test::plusone " Plussing!" log 1 + ;
//     1 test::plusone 2 = IF " works" . ELSE " works not" . THEN cr .
//     `);
//
//     F.forth_add_code(f, `
//     : ::plusone " Plussing!" log 1 + ;
//     1 ::plusone 2 = IF " works" . ELSE " works not" . THEN cr .
//     `);
//
//     F.forth_add_code(f, `
//     : plusone " Plussing!" log 1 + ;
//     1 plusone 2 = IF " works" . ELSE " works not" . THEN cr .
//     `);
// }


function test_if(f) {
    // IF tests
    F.forth_add_code(f, `
    " IF Test 1: " .
    1 IF true ELSE false THEN test::assert_true
    `);
    F.forth_add_code(f, `
    " IF Test 2: " .
    1 IF true THEN test::assert_true
    `);
    F.forth_add_code_line(f, `" IF Test 3: " . 0 IF false ELSE true THEN test::assert_true `);
    F.forth_add_code_line(f, `" IF Test 4: " . 1 IF true ELSE false THEN test::assert_true`);
}

function test_symbol(f) {
    F.forth_add_code(f, `" Symbol Test 1: " . asymbol typeof " symbol" = test::assert_true`);
    F.forth_add_code(f, `" Symbol Test 2: " . x typeof " symbol" = test::assert_true`);
    // F.forth_input_code(f, `~asymbol typeof .`);
}

function test_array(f) {
    // F.forth_run(f, `
    //
    // `);
    //
    // F.forth_run(f, `
    // : test::assert_true IF " Success" . ELSE " Fail" . THEN cr . ;
    // `);

    // F.forth_run(f, `true test::assert_true`);

    // F.forth_run(f, 'true IF " TRUE" . ELSE " FALSE" . THEN cr .');
    // F.forth_input_code(f, `
    //  " Test: Create array 'literal' array and access: " .
    //  [ 1 2 3 ]
    //  0 a@ 1 =
    //  IF
    //     " Yes!" .
    //  ELSE
    //     " No :(" .
    //  NEXT
    //  cr .
    // `);
    //
    // F.forth_input_code(f, `
    //  [ " hi" " hello" true false ]
    //     1 a@ " hello" =
    //     IF
    //     " Yes!" .
    //     ELSE
    //     " No :(" .
    //     NEXT
    //     cr .
    //  `);

    // manual array / list buildint
    // F.forth_add_code(f, `
    //    " Array Test 1 - Create, set, read array manually with arr:array: " . CR
    //     0 VAR A
    //     123 234 345 456 4 arr::array A !
    //     1 A arr::@ 345 = test::assert_true
    //     `);
    //
    // F.forth_add_code(f, `
    // " Array Test 1 - Create, set, read array manually with a@: " . CR
    // 0 VAR A
    // 123 234 345 456 4 arr::array A !
    // 2 A @a 234 = test::assert_true
    // `);

    F.forth_add_code(f, `
    " Array Test 1 - Create, set, read array manually with [..]: " . CR
    0 VAR A
    [ 123 234 345 456 ] A !
    A arr::length 4 = test::assert_true "  <- Size should be 4" . CR
    0 A @a 123 = test::assert_true "  <- Fetch an element" . CR
    `);

    // F.forth_run(f, `
    // " Array Test 2 - Create, set, read array manually: " .
    // 0 var A
    // null null null null 4 arr::array A !
    // 0 A @ 123 arr::!
    // 1 A @ 234 arr::!
    // 2 A @ 345 arr::!
    // 3 A @ 456 arr::!
    // 1 A arr::@ 234 = test::assert_true
    // `);
    //
    // F.forth_run(f, `
    // " Array Test 3 = Create, set, read array from stack: " .
    // VARIABLE A
    // 123 456 true false null
    // 5 arr::array
    // A !
    // A @ 4 a@ 123 = test::assert_true
    // `);

    // F.forth_input_code(f, `
    // [ 1 2 3 ]
    // 0 a@
    // .
    // cr .
    // `);
}

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


function test_variable1(f) {
    F.forth_add_code(f, `
    " Variables Test 1 - create, fetch:  " .
    123 VAR x
    x @ 123 = test::assert_true
    `);
}
function test_variable2(f) {
    F.forth_add_code(f, `
    " Variables Test 2 - create, set, fetch:  " .
    123 VAR x
    456 x !
    x @ 456 = test::assert_true
    `);
}

function test_base(f) {
    test_string(f);
}

const TEST_EXIT_1 = `
" Exit Test 1 - normal full loop " . CR

"     should loop 5 times: " .
0 VAR x
5 0 DO I x ! LOOP
x @ 4 = test::assert_true

"     stack should be empty: " .
test::assert_stack_empty
`;

const TEST_EXIT_2 = `
" Exit Test 1 - normal EXIT loop " . CR
"     should exit on loop iteration 3: " . CR

0 VAR x
0 VAR y
5 0 DO
x @ 1 + x !
I 2 = IF EXIT THEN
y @ 1 + y !
LOOP
x @ 3 = test::assert_true "  <- loop exited when expected" . CR
y @ 2 = test::assert_true "  <- loop exited when expected" . CR
0 test::assert_stack_size "  <- stack empty when done" . CR
`;

const TEST_CONTINUE_1 = `
CR
" Exit Test 1 - CONTINUE within loop " . CR

0 VAR x
0 VAR y
5 0 DO
x @ 1 + x !
2 I > IF CONTINUE THEN
y @ 1 + y !
LOOP
x @ 5 = test::assert_true "  <- loop completed" . CR
y @ 3 = test::assert_true "  <- loop continued as expected" . CR
0 test::assert_stack_size "  <- stack empty when done" . CR
`;

function run_test_2(test_set, test_name) {
    const {code} = get_test(test_set, test_name);

    const forth = new F.Forth();

    CoreVocabulary(forth);
    IOVocabulary(forth);
    UIVocabulary(forth);
    MathVocabulary(forth);
    TimeVocabulary(forth);
    TestVocabulary(forth);
    // init_array(f);
    // TODO: add ability for a test to initialize a module...

    forth.add_code(code);

    forth.run();

    const successes = forth.variables.get_from_symbol('test', 'TEST_SUCCESSES');
    const failures = forth.variables.get_from_symbol('test', 'TEST_FAILURES');

    if (failures.value.value > 0) {
        set_test_status(test_set, test_name, 'Failed', '');
    } else if (successes.value.value > 0) {
        set_test_status(test_set, test_name, 'Success', '');
    } else {
        set_test_status(test_set, test_name, 'none', '');
    }
}

const TESTS = {};

const CHECKMARK = '✓';
const CROSS = '✗';


function check_all_tests(el) {
    const is_enabled = !(el.getAttribute('is_checked') === 't');
    el.setAttribute('is_checked', is_enabled ? 't' : 'f');
    if (is_enabled) {
        el.innerText = CROSS;
    } else {
        el.innerText = CHECKMARK;
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

function enable_test_set(name, enabled) {
    const test_set_rows = document.querySelectorAll(`[test-set="${name}"]`);
    test_set_rows.forEach((row_el) => {
        const button_el = row_el.querySelector('input[type="checkbox"]');
        button_el.checked = enabled;
    });
}

function checkall_test_set(el, name) {
    const is_checked = !(el.getAttribute('is_checked') === 't');
    el.setAttribute('is_checked', is_checked ? 't' : 'f');
    if (is_checked) {
        el.innerText = CROSS;
    } else {
        el.innerText = CHECKMARK;
    }

    const test_set_rows = document.querySelectorAll(`[test-set="${name}"]`);
    test_set_rows.forEach((row_el) => {
        const button_el = row_el.querySelector('input[type="checkbox"]');
        button_el.checked = is_checked;
    });
}

function add_test_set(name, title) {
    TESTS[name] = {
        title,
        tests: {}
    };const TEST_DEFINE_WORD_2 =

    function test_define_word(f) {
        F.forth_add_code(f, `
        : test::plusone " Plussing!" log 1 + ;
        1 test::plusone 2 = IF " works" . ELSE " works not" . THEN cr .
        `);

        F.forth_add_code(f, `
        : ::plusone " Plussing!" log 1 + ;
        1 ::plusone 2 = IF " works" . ELSE " works not" . THEN cr .
        `);

        F.forth_add_code(f, `
        : plusone " Plussing!" log 1 + ;
        1 plusone 2 = IF " works" . ELSE " works not" . THEN cr .
        `);
    }

    const test_table_el = document.querySelector('.results-table > .body');

    const test_set_el = document.createElement('div');
    // row_el.classList.add('row');
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
    checkall_button_el.addEventListener('click', () => {checkall_test_set(checkall_button_el, name);});

    checkbox_field_el.appendChild(checkall_button_el);

    row_el.appendChild(checkbox_field_el);
    /*
     *   const checkbox_el = document.createElement('input');
     *   checkbox_el.setAttribute('type', 'checkbox'); *
     *   checkbox_field_el.appendChild(checkbox_el);*/

    const title_el = document.createElement('div');
    title_el.classList.add('col');
    title_el.classList.add('title');
    title_el.innerText = title;

    row_el.appendChild(title_el);
    test_set_el.appendChild(row_el);

    test_table_el.appendChild(test_set_el);
}

function add_test(test_set_id, name, title, code) {
    const test_set = TESTS[test_set_id];
    test_set.tests[name] = {
        name, title, code, status: ''
    };

    const test_table_el = document.querySelector(`.results-table > .body > [test-set="${test_set_id}"]`);

    const row_el = document.createElement('div');
    row_el.classList.add('row');
    row_el.classList.add('test');
    row_el.setAttribute('test-set', test_set_id);
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

function get_test(test_set, name) {
    const test = TESTS[test_set].tests[name];
    return test;
}

// function set_test_stats(test_set, test_name, successes, failures) {
//     const test = TESTS[test_set].tests[name].successes += successes;
//     const test = TESTS[test_set].tests[name].failures += failures;
//
// }

function set_test_status(test_set, name, status, message) {
    const test_row_el = document.querySelector(`.row.test[test-set="${test_set}"][test-name="${name}"]`);
    const status_el = test_row_el.querySelector('.col.status');
    const message_el = test_row_el.querySelector('.col.message');
    status_el.innerText = status;
    message_el.innerText = message;
}

function run_selected_tests() {
    // get list of selected tests...
    const test_rows = document.querySelectorAll('.row.test');
    test_rows.forEach((test_row) => {
        const checkbox = test_row.querySelector('.test-checkbox input[type="checkbox"]');
        if (!checkbox.checked) {
            return;
        }
        const test_set = test_row.getAttribute('test-set');
        const test_name = test_row.getAttribute('test-name');
        set_test_status(test_set, test_name, 'Running...', '');

        // set test status and message variables...
        run_test_2(test_set, test_name);
        // update the ui with the new value of status and message variables.
    });

    // then run them, updating the ui ...
}

function update_display(forth) {

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

// function run() {
//     const forth = new F.Forth({
//         onInterp: update_display(),
//         outputSelector: '',
//         consoleSelector: ''
//     });
//
//     init_core(forth);
//
//     const io = new IO(forth);
//
//     // init_io(forth);
//     init_ui(forth);
//     init_math(forth);
//     init_time(forth);
//     init_test(forth);
//
//     // init_array(f);
//     // TODO: add ability for a test to initialize a module...
//
//     forth.add_code(code);
//
//     forth.run();
//
//     const successes = forth.variables.get_from_symbol('test', 'TEST_SUCCESSES');
//     const failures = forth.variables.get_from_symbol('test', 'TEST_FAILURES');
//
//     if (failures.value.value > 0) {
//         set_test_status(test_set, test_name, 'Failed', '');
//     } else if (successes.value.value > 0) {
//         set_test_status(test_set, test_name, 'Success', '');
//     } else {
//         set_test_status(test_set, test_name, 'none', '');
//     }
// }


function main() {
    const forth = new F.Forth({
        onInterp: update_display,
        outputSelector: '#output',
        consoleSelector: '#console'
    });

    CoreVocabulary(forth);
    IOVocabulary(forth)
    UIVocabulary(forth)
    MathVocabulary(forth);
    TimeVocabulary(forth);

    const history = [];
    let history_pos = 0;

    const history_pos_el = document.getElementById('code_input_history_pos');

    function handle_code_input() {
        const code_field = document.getElementById('code_input_field');
        let code_text = code_field.value;
        if (code_text === '') {
            return;
        }
        code_text += ' ';

        forth.add_code(code_text);
        try {
            forth.run();
            forth.console('Ok.');
            // console.info('Ok.');
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
                // console.log('key not handled', e.key);
            }
        }
    });

    update_display(forth);
    code_field.focus();
}


main();
