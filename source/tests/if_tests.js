const TEST_1 = `
1 IF true ELSE false THEN test::assert_true
`;

const TEST_2 =  `
1 IF true THEN test::assert_true
`


export default function AddIFTests(testing) {
    testing.add_test_set('if', 'Test all IF operations');
    testing.add_test('if', 'if_then_else', 'Basic if..then..else behavior', TEST_1);
    testing.add_test('if', 'word_with_empty_vocab', 'Basic if..then behavior', TEST_2);
}
