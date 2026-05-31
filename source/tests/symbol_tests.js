

const SYMBOL_TEST_1 = `
    ~symbol1  typeof " symbol" s= test::assert_true

    test::assert_stack_empty
`;

const SYMBOL_TEST_1a = `
SYM symbol1 typeof " symbol" s= test::assert_true

test::assert_stack_empty
`;

const SYMBOL_TEST_2 = `
~symbol1 ~symbol1 eq test::assert_true

test::assert_stack_empty
`;

const SYMBOL_TEST_3 = `
10 ~symbol1 SVALUE!
~symbol1 SVALUE@ 10 = test::assert_true

test::assert_stack_empty
`;

export default function AddSymbolTests(testing) {
    testing.add_test_set('symbol', 'Symbol Tests');
    testing.add_test('symbol', 'type', 'Creating a symbol with ~ is of the correct type', SYMBOL_TEST_1);
    testing.add_test('symbol', 'sym_type', 'Creating a symbol with SYM is of the correct type', SYMBOL_TEST_1a);
    testing.add_test('symbol', 'equality', 'Two symbols of the same name are identical', SYMBOL_TEST_2);
    testing.add_test('symbol', 'set_and_get', 'Set and get the symbol value', SYMBOL_TEST_2);
}
