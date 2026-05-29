
/**
 * Basic arithmetic operations.
 **/

const TEST_1 = `
1 1 + 2 = test::assert_true

123 123 + 246 = test::assert_true

1.0 2.0 + 3.0 = test::assert_true

test::assert_stack_empty
`;

const TEST_2 = `
1 1 - 0 = test::assert_true

123 234 - -111 = test::assert_true

10.0 5.0 - 5.0 = test::assert_true

test::assert_stack_empty
`;

const TEST_3 = `
1 1 * 1 = test::assert_true

123 123 * 15129 = test::assert_true

10.0 5.0 * 50.0 = test::assert_true

10.123 5.123 * 51.860129 = test::assert_true

test::assert_stack_empty
`;

const TEST_4 = `
1 1 / 1 = test::assert_true

2 4 / 0.5 = test::assert_true

10.0 5.0 / 2.0 = test::assert_true
`;

const TEST_5 = `
1 1 = test::assert_true
1 2 = test::assert_false
0 0 = test::assert_true

1 2 != test::assert_true
1 2 ≠ test::assert_true

`;


export default function AddMathTests(testing) {
    testing.add_test_set('math', 'Test all Math operations');
    testing.add_test('math', 'addition', 'Basic addition operations', TEST_1);
    testing.add_test('math', 'subtraction', 'Basic subtraction operations', TEST_2);
    testing.add_test('math', 'multiplication', 'Basic multiplication operations', TEST_3);
    testing.add_test('math', 'division', 'Basic division operations', TEST_4);
    testing.add_test('math', 'comparison', 'Comparisons', TEST_5);
}
