// import {forth_new, forth_input_code, forth_compile_tokens, forth_run_programx} from "./forth.js";
import * as F from '../lang/forth-qjs.js';
// import {init as init_exp} from "/lang/vocabulary_exp.js";

import CoreVocabulary from "../lang/vocabulary_core.js";
// import {IOVocabulary, GetIOVocabularyInstance} from '/lang/vocabulary_io.js';
import IOVocabulary from '../lang/vocabulary_io.js';
import MathVocabulary from "../lang/vocabulary_math.js";
import TimeVocabulary from "../lang/vocabulary_time.js";
import UIVocabulary from "../lang/vocabulary_ui.js";
import ArrayVocabulary from '../lang/vocabulary_array.js';
import TestVocabulary from '../lang/vocabulary_test.js';
import StringVocabulary from '../lang/vocabulary_string.js';
import SymbolVocabulary from '../lang/vocabulary_symbol.js';
import MapVocabulary from '../lang/vocabulary_map.js';

import AddStringTests from '../tests/string_tests.js';
import AddDoLoopTests from '../tests/do_loop_tests.js';
import AddBeginRepeatTests from '../tests/begin_repeat_tests.js';
import AddArrayTests from '../tests/array_tests.js';
import AddColonTests from '../tests/colon_tests.js';
import AddIFTests from '../tests/if_tests.js';
import AddCompileInterpTests from '../tests/compile_interp_tests.js';
import AddMathTests from '../tests/math_tests.js';
import AddLocalTests from '../tests/local_tests.js';
import AddSymbolTests from '../tests/symbol_tests.js';
import AddVarTests from '../tests/var_tests.js';
import AddVariableTests from '../tests/variable_tests.js';
import AddConstTests from '../tests/const_tests.js';
import AddMapTests from '../tests/map_tests.js';

class Testing {
    constructor() {
        this.TESTS = {};
        this.CHECKMARK = '✓';
        this.CROSS = '✗';
        this.test_data = null;
    }

    add_test_set(name, title) {
        this.TESTS[name] = {
            name,
            title,
            tests: {}
        };
    }

    add_test(id, name, title, code) {
        const test_set = this.TESTS[id];
        test_set.tests[name] = {
            id, name, title, code, status: '',
            successes: 0, failures: 0
        };
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
    }

    run_test(testSet, test) {
        const forth = new F.Forth({
            // onInterp: update_display,
            // outputSelector: '#feedback #output',
            // consoleSelector: '#feedback #console'
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

        forth.interpreter.add_code(test.code);

        forth.interpreter.run();

        const [,successes] = forth.variables.getNamed('test', 'TEST_SUCCESSES');
        const [,failures] = forth.variables.getNamed('test', 'TEST_FAILURES');

        test.successes = successes;
        test.failures = failures;

        if (failures === 0 && successes > 0) {
            this.test_data.test_sets.successes += 1;
        }
        if (failures > 0) {
            this.test_data.test_sets.failures += 1;
        }

        this.test_data.tests.successes += successes;
        this.test_data.tests.failures += failures;

        this.render_test_status(testSet, test);
    }

    get_test(test_set, name) {
        const test = this.TESTS[test_set].tests[name];
        return test;
    }

    render_test_status(testSet, test) {
        let testResolution;
        if (test.failures > 0) {
            testResolution = 'Failed';
        } else if (test.successes > 0) {
            testResolution = 'Succeeeded';
        } else {
            testResolution = 'NONE';
        }
        const message = `${testResolution} (successes: ${test.successes}, failures: ${test.failures}`;
        console.log(`        ${message}`);
    }

    display_test_set({name, title}) {
        console.log('---------------------------------------------------------');
        console.log('Test Set: ', `${title} (${name})`);
        console.log('---------------------------------------------------------');
    }

    display_test(index, {name, title}) {
        console.log(`    Running test ${index + 1}: `, `${name} (${title})`);
    }

    display_test_result(test) {
    }

    run_tests() {
        console.log('Running tests...');
        this.reset_tests();
        Object.entries(this.TESTS).forEach(([testSetName, testSet]) => {
            this.display_test_set(testSet);
            Object.entries(testSet.tests).forEach(([key, test], index) => {
                this.display_test(index, test);
                this.run_test(testSet, test);
            });
            console.log('---------------------------------------------------------');
        });

        console.log('TOTALS');
        console.log('Successes: ', this.test_data.tests.successes);
        console.log('Failures: ', this.test_data.tests.failures);
    }
}

function main() {
    const testing = new Testing();

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
    AddVariableTests(testing);
    AddConstTests(testing);
    AddMapTests(testing);

    testing.run_tests();
}

main();
