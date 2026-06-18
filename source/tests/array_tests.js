const TEST_1 = `
0 VARIABLE A
A[ 123 234 345 456 ] A !

A @ array::length 4 = test::assert_true

0 A @ a@ 123 = test::assert_true
test::assert_stack_empty
`

const TEST_2  = `
( create an array and store the id in A )
null 4 array::ncreate VARIABLE A


0 A @ array::@ is-null test::assert_true
1 A @ array::@ is-null test::assert_true
2 A @ array::@ is-null test::assert_true
3 A @ array::@ is-null test::assert_true

( populate array elements )
123 0 A @ array::!
234 1 A @ array::set
345 2 A @ array::!
456 3 A @ array::set


( Now assert the value of each element )
0 A @ array::@ 123 = test::assert_true
1 A @ array::@ 234 = test::assert_true
2 A @ array::@ 345 = test::assert_true
3 A @ array::@ 456 = test::assert_true

test::assert_stack_empty
`;

const TEST_3 = `
( create 5 element array with values of different types )
123 456 true false null 5 array::narray VARIABLE an_array

4 an_array @ A@ 123 = test::assert_true
`;

// LEFT OFF HERE
const TEST_4 = `
0 VARIABLE A
A[ 1 1 + 2 2 + 3 3 + ] A !

A @ array::length 3 = test::assert_true

0 A @ a@ 2 = test::assert_true

test::assert_stack_empty
`;


export default function AddArrayTests(testing) {
    testing.add_test_set('array', 'Test all array operations');
    testing.add_test('array', 'create_braces', 'Create, set, read array with [..]', TEST_1);
    testing.add_test('array', 'create_manually', 'Create empty array of specified length, manually set', TEST_2);
    testing.add_test('array', 'create_stack', 'Create array of fixed length from the stack', TEST_3);
    testing.add_test('array', 'computed', 'Create array of which includes computed elements', TEST_4);
}
