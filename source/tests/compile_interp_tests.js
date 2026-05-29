
const TEST_1 = `
: test::t1 [ 123 456 ] ;
2 test::assert_stack_size

`;


export default function AddCompileInterpTests(testing) {
    testing.add_test_set('compile_interp', 'Ensure that the [ word inside a word def, works');
    testing.add_test('compile_interp', 'basic', 'ensure it works', TEST_1);
}
