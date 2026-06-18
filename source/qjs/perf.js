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
import AddConstTests from '../tests/const_tests.js';
import AddMapTests from '../tests/map_tests.js';

class Perf {

    run_perf(name, iterations, code) {
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

        let totalTime = 0;
        for (let i = 0; i < iterations; i += 1) {
            const start = Date.now();
            forth.interpreter.add_code(code);
            forth.interpreter.run();
            const end = Date.now();
            const elapsed = end - start;
            totalTime += elapsed;
            // console.log('Time', end - start);
        }
        const average = totalTime / iterations;

        console.log('Average Time', average);

//         const [,successes] = forth.variables.getNamed('test', 'TEST_SUCCESSES');
//         const [,failures] = forth.variables.getNamed('test', 'TEST_FAILURES');
//
//         test.successes = successes;
//         test.failures = failures;
//
//         if (failures === 0 && successes > 0) {
//             this.test_data.test_sets.successes += 1;
//         }
//         if (failures > 0) {
//             this.test_data.test_sets.failures += 1;
//         }
//
//         this.test_data.tests.successes += successes;
//         this.test_data.tests.failures += failures;
//
//         this.render_test_status(testSet, test);
    }



}

function main() {
    const perf = new Perf();

    // perf.run_perf('simple math', 1000, `
    //     1 1 + DROP
    // `);

    perf.run_perf('simple math inner loop', 10, `
       : foo
        1000 0 DO
            1 1 + DROP
        LOOP
        ;
        foo
    `);

    // perf.run_perf('variable create and assign', 1000, `
    //     100 VARIABLE x
    // `);
    //
    // perf.run_perf('variable create and assign', 10, `
    //     100 VARIABLE x
    //     1000 0 DO
    //         200 x !
    //     LOOP
    // `);
    //
    // perf.run_perf('variable fetch and drop', 10, `
    // 100 VARIABLE x
    // 1000 0 DO
    //     x @ DROP
    // LOOP
    // `);
    // AddLocalTests(testing);
    // AddStringTests(testing);
    // AddDoLoopTests(testing);
    // AddBeginRepeatTests(testing);
    // AddArrayTests(testing);
    // AddColonTests(testing);
    // AddIFTests(testing);
    // AddCompileInterpTests(testing);
    // AddMathTests(testing);
    // AddSymbolTests(testing);
    // AddVarTests(testing);
    // AddConstTests(testing);
    // AddMapTests(testing);

    // testing.run_tests();
}

main();
