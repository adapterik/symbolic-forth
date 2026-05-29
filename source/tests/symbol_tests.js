

const SYMBOL_TEST_1 = `
    ~symbol1  typeof " symbol" s= test::assert_true

    test::assert_stack_empty
`;

const SYMBOL_TEST_2 = `
~symbol1 ~symbol1 eq test::assert_true

test::assert_stack_empty
`;

export default function AddSymbolTests(testing) {
    testing.add_test_set('symbol', 'Symbol Tests');
    testing.add_test('symbol', 'type', 'Symbol Test 1 - is correct type:', SYMBOL_TEST_1);
    testing.add_test('symbol', 'equality', 'Symbol Test 2 - equality:', SYMBOL_TEST_2);
}
