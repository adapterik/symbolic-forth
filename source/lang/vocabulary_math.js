import { assert_type } from "./vocabulary_utils.js";

function plus_word() {
    return ({forth}) => {
        const num2 = forth.pop_number();
        const num1 = forth.pop_number();

        forth.parameter_stack.push(forth.number_value(num1 + num2));
    }
}

function minus_word() {
    return ({forth}) => {
        const num2 = forth.pop_number();
        const num1 = forth.pop_number();

        const value = num1 - num2;

        forth.parameter_stack.push(forth.number_value(value));
    }
}

function multiply_word() {
    return ({forth}) => {
        const num2 = forth.pop_number();
        const num1 = forth.pop_number();

        const value = num1 * num2;

        forth.parameter_stack.push(forth.number_value(value));
    }
}

function divide_word() {
    return ({forth}) => {
        const num2 = forth.pop_number();
        const num1 = forth.pop_number();

        const value = num1 / num2;

        forth.parameter_stack.push(forth.number_value(value));
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
    forth.add_word('' ,"-",  minus_word);
    forth.add_word('' ,"*", multiply_word);
    forth.add_word('' ,"/", divide_word);
    forth.add_word('' ,"MAX", max_word);
}

export default MathVocabulary;
