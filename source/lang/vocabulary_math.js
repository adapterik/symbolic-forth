import { assert_type } from "./vocabulary_utils.js";
// import Vocabulary from '/lang/vocabulary.js'
//
//
// class Math extends Vocabulary {
//     constructor(forth, options = {}) {
//         super(forth, options);
//
//         forth.add_word('' ,"+", this.plus_word);
//         forth.add_word('' ,"1+", this.one_plus_word);
//         forth.add_word('' ,"-",  this.minus_word);
//         forth.add_word('' ,"*", this.multiply_word);
//         forth.add_word('' ,"/", this.divide_word);
//     }
//
//     plus_word() {
//         return ({forth}) => {
//             const word1 = forth.parameter_stack.pop();
//             const word2 = forth.parameter_stack.pop();
//
//             assert_type(word1.type, ['number']);
//             assert_type(word2.type, ['number']);
//
//             const value = word1.value + word2.value;
//
//             forth.parameter_stack.push({type: 'number', value});
//         }
//     }
//
//     one_plus_word() {
//         return ({forth}) => {
//             let {type, value} = forth.parameter_stack.peek();
//             value += 1;
//         }
//     }
//
//     minus_word() {
//         return ({forth}) => {
//             const word2 = forth.parameter_stack.pop();
//             const word1 = forth.parameter_stack.pop();
//
//             assert_type(word1.type, ['number']);
//             assert_type(word2.type, ['number']);
//
//             const value = word1.value - word2.value;
//
//             forth.parameter_stack.push({type: 'number', value});
//         }
//     }
//
//     multiply_word() {
//         return ({forth}) => {
//             const word1 = forth.parameter_stack.pop();
//             const word2 = forth.parameter_stack.pop();
//
//             assert_type(word1.type, ['number']);
//             assert_type(word2.type, ['number']);
//
//             const value = word1.value * word2.value;
//
//             forth.parameter_stack.push({type: 'number', value});
//         }
//     }
//     divide_word() {
//         return ({forth}) => {
//             const word2 = forth.parameter_stack.pop();
//             const word1 = forth.parameter_stack.pop();
//
//             assert_type(word1.type, ['number']);
//             assert_type(word2.type, ['number']);
//
//             const value = word1.value / word2.value;
//
//             forth.parameter_stack.push({type: 'number', value});
//         }
//     }
// }

function plus_word() {
    return ({forth}) => {
        const num1 = forth.pop_number();
        const num2 = forth.pop_number();

        forth.parameter_stack.push(forth.number_value(num1 + num2));
    }
}

function one_plus_word() {
    return ({forth}) => {
        let {type, value} = forth.parameter_stack.peek();
        value += 1;
    }
}

function minus_word() {
    return ({forth}) => {
        const word2 = forth.parameter_stack.pop();
        const word1 = forth.parameter_stack.pop();

        assert_type(word1.type, ['number']);
        assert_type(word2.type, ['number']);

        const value = word1.value - word2.value;

        forth.parameter_stack.push({type: 'number', value});
    }
}

function multiply_word() {
    return ({forth}) => {
        const word1 = forth.parameter_stack.pop();
        const word2 = forth.parameter_stack.pop();

        assert_type(word1.type, ['number']);
        assert_type(word2.type, ['number']);

        const value = word1.value * word2.value;

        forth.parameter_stack.push({type: 'number', value});
    }
}

function divide_word() {
    return ({forth}) => {
        const word2 = forth.parameter_stack.pop();
        const word1 = forth.parameter_stack.pop();

        assert_type(word1.type, ['number']);
        assert_type(word2.type, ['number']);

        const value = word1.value / word2.value;

        forth.parameter_stack.push({type: 'number', value});
    }
}

function max_word() {
    return ({forth}) => {
        const num2 = forth.pop_number();
        const num1 = forth.pop_number();

        forth.parameter_stack.push(forth.number_value(Math.max(num1, num2)));
    }
}

const MathVocabulary = (forth, options = {}) => {
    forth.add_word('' ,"+", plus_word);
    forth.add_word('' ,"1+", one_plus_word);
    forth.add_word('' ,"-",  minus_word);
    forth.add_word('' ,"*", multiply_word);
    forth.add_word('' ,"/", divide_word);
    forth.add_word('' ,"MAX", max_word);
}

export default MathVocabulary;
