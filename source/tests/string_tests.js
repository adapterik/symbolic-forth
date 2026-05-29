
const TEST_STRING_1 = `
" VALUE1" " VALUE1" S= test::assert_true
" VALUE1" " VALUE2" S= test::assert_false

( define the variable 's' )
" foo" VAR foo_string

( Wait, is it really a string? )
foo_string @ TYPEOF " string" S= test::assert_true

( Now try a string inside a colon-defined word )
: scol " In a definition" ;
scol TYPEOF " string" S= test::assert_true

test::assert_stack_empty
`;

const TEST_STRING_2 = `
: scol " In a definition" ;
scol typeof " string" S= test::assert_true

DEPTH 0 = test::assert_true
`;


const TEST_STRING_3 = `
" my string" string::length 9 = test::assert_true
`;

const TEST_STRING_4 = `
" A" " B" string::compare 0 < test::assert_true
`;

export default function AddStringTests(testing) {
    testing.add_test_set('string', 'String Tests');
    testing.add_test('string', 'equality', 'String Test 1 - equality:', TEST_STRING_1);
    testing.add_test('string', 'equality_from_word', 'Set string from word, test for equality from outside', TEST_STRING_2);
    testing.add_test('string', 'string_length', 'String length', TEST_STRING_3);
    testing.add_test('string', 'string_compare', 'String comparison', TEST_STRING_4);
}
