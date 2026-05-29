

const TEST_1 = `
: MY_WORD
  LOCAL FOO ( consumes the top stack item )
  LOCAL BAR ( consumes the next stack item )

  LOCAL@ FOO 456 = test::assert_true
  LOCAL@ BAR 123 = test::assert_true

  test::assert_stack_empty
;

123 456 MY_WORD

test::assert_stack_empty
`;


const TEST_2 = `
: MY_WORD2
  123 LOCAL FOO ( consumes the top stack item )
  L@ FOO 123 = test::assert_true

  test::assert_stack_empty
;

MY_WORD2

test::assert_stack_empty
`;

const TEST_3 = `
: MY_WORD3
  123 LOCAL FOO

  L@ FOO 123 = test::assert_true

  456 L! FOO
  L@ FOO 456 = test::assert_true

  test::assert_stack_empty
;

MY_WORD3

test::assert_stack_empty
`;

export default function AddIFTests(testing) {
    testing.add_test_set('local', 'Test LOCAL functionality');
    testing.add_test('local', 'set_local_from_stack', 'Set local variable from stack', TEST_1);
    testing.add_test('local', 'initialize_local', 'initialize local variable ', TEST_2);
    testing.add_test('local', 'set_local', 'set local variable ', TEST_3);
}
