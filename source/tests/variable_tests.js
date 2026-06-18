

const TEST_1 = `
    123 VARIABLE x
    x @ 123 = test::assert_true
    test::assert_stack_empty
`;

const TEST_2 = `
    123 VARIABLE x
    456 x !
    x @ 456 = test::assert_true
    test::assert_stack_empty
`;

const TEST_3 = `
  123 VARIABLE X
  V@ X 123 = test::assert_true
  test::assert_stack_empty
`

const TEST_4 = `
    123 VARIABLE x
    456 V! x
    V@ x 456 = test::assert_true
    test::assert_stack_empty
`;

export default function AddVariableTests(testing) {
    testing.add_test_set('variable', 'Test all VARIABLE operations');
    testing.add_test('variable', 'create-fetch', 'Create, fetch variable for number', TEST_1);
    testing.add_test('variable', 'create-store-fetch', 'Create, store, fetch variable with number', TEST_2);
    testing.add_test('variable', 'parsing-fetch', 'Fetch variable by parsing the following token', TEST_3);
    testing.add_test('variable', 'parsing-store', 'Store variable by parsing the following token', TEST_4);
}
