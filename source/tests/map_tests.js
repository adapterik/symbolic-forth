const TEST_1 = `
0 VARIABLE a_map
M{ SYM foo 123 SYM bar " baz" } a_map !

a_map @ map::size 2 = test::assert_true

SYM foo a_map @ M@ 123 = test::assert_true
SYM bar a_map @ M@ " baz" S= test::assert_true
test::assert_stack_empty
`


export default function AddMapTests(testing) {
    testing.add_test_set('map', 'Test all map operations');
    testing.add_test('map', 'create_braces', 'Create, set, read map with M{ .. }', TEST_1);

}
