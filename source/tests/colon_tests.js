/*



function test_define_word(f) {
    F.forth_add_code(f, `
    : test::plusone " Plussing!" log 1 + ;
    1 test::plusone 2 = IF " works" . ELSE " works not" . THEN cr .
    `);

    F.forth_add_code(f, `
    : ::plusone " Plussing!" log 1 + ;
    1 ::plusone 2 = IF " works" . ELSE " works not" . THEN cr .
    `);

    F.forth_add_code(f, `
    : plusone " Plussing!" log 1 + ;
    1 plusone 2 = IF " works" . ELSE " works not" . THEN cr .
    `);
}*/



const TEST_1 = `
: test::plusone 1 + ;

1 test::plusone 2 = test::assert_true

test::assert_stack_empty
`;

const TEST_2 = `
: ::plusone 1 + ;

1 ::plusone 2 = test::assert_true

test::assert_stack_empty
`;

const TEST_3 = `
: plusone 1 + ;

1 plusone 2 = test::assert_true

`;


export default function AddColonTests(testing) {
    testing.add_test_set('colon', 'Test all colon operations');
    testing.add_test('colon', 'word_with_vocab', 'Define and use a word in a vocabulary', TEST_1);
    testing.add_test('colon', 'word_with_empty_vocab', 'define and use an empty vocab  word', TEST_2);
    testing.add_test('colon', 'word_with_no_vocab', 'define and use a global word', TEST_3);
}
