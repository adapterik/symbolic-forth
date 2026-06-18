/**
 * This is a minimal Symbolic FORTH runner which runs in quickjs, and probably
 * other Javascript runtimes
 **/
import * as F from "./lang/forth-qjs.js";
import CoreVocabulary from "./lang/vocabulary_core.js";
import SymbolVocabulary from "./lang/vocabulary_symbol.js";
import IOVocabulary from "./lang/vocabulary_io.js";
import MathVocabulary from "./lang/vocabulary_math.js";
import TimeVocabulary from "./lang/vocabulary_time.js";
import UIVocabulary from "./lang/vocabulary_ui.js";
import ArrayVocabulary from "./lang/vocabulary_array.js";
import TestVocabulary from "./lang/vocabulary_test.js";
import FileVocabulary from './lang/vocabulary_file.js';
import StringVocabulary from './lang/vocabulary_string.js';
import StackVocabulary from './lang/vocabulary_stack.js';
import MapVocabulary from './lang/vocabulary_map.js';

import * as os from "os";

function noop(message) {
    console.log(`NOOP: ${message}`);
}

const READ_LENGTH = 1024;
const BUFFER_LENGTH = 100*READ_LENGTH;

function run() {
    const setupForth = (forth) => {
        CoreVocabulary(forth);
        IOVocabulary(forth);
        UIVocabulary(forth);
        MathVocabulary(forth);
        TimeVocabulary(forth);
        ArrayVocabulary(forth);
        FileVocabulary(forth);
        StringVocabulary(forth);
        StackVocabulary(forth);
        MapVocabulary(forth);
    };

    const forth = new F.Forth({
        onInterp: null,
        onCompileWord: null,
        onRunWord: null,
        onInitialize: setupForth
    });

    // get filename from args
    const source = scriptArgs[1];

    // read filename
    const fd = os.open(source, os.O_RDONLY);

    const buffer = new ArrayBuffer(BUFFER_LENGTH);
    const textInput = new Uint8Array(buffer);

    let total_len = 0;
    let read_len;
    for (;;) {
        read_len =  os.read(fd, buffer, total_len, READ_LENGTH);
        total_len += read_len;
        if (read_len < READ_LENGTH) {
            break;
        }
    }

    let result = "";
    for (let i = 0; i < total_len; i += 1) {
        result += String.fromCharCode(textInput[i]);
    }

    os.close(fd);

    // console.log('input program size: ', result.length);
    // console.log('-----');
    // console.log(result);
    // console.log('-----');

    // Put rest of script args onto stack.
    for (let i = 0; i < scriptArgs.length - 2; i += 1) {
        forth.parameter_stack.push(forth.string_value(scriptArgs[i + 2]));
    }

    // console.log('main: about to run', result);
    // console.log('-----');
    forth.interpreter.run(result);
}

function main() {
    try {
        run();
    } catch (ex) {
        console.log(ex);
        console.error('Error in main:', ex.message, ex.stack);
    }
}

main();
