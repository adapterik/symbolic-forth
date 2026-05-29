

const TEST_1 = `
( we will count down from 5 to 0 )
5 VAR countdown

( we'll also use a loop counter to test for afterwards )
0 VAR loop_count

( here is how we begin our repeating section )
BEGIN

  countdown @ 0 = IF BREAK THEN

  ( here we increment our loop counter )
  countdown DEC!

  loop_count INC!

  ( the repeat keyword just marks the end of the repeating code, it doesn't
    have any special meaning )
REPEAT

( did we actually repeat 5 times? )
countdown @ 0 = test::assert_true

test::assert_stack_empty
`;



const TEST_2 = `
( we will count down from 5 to 0 )
5 VAR countdown

( we'll also use a loop counter to test for afterwards )
0 VAR loop_count

false VAR finished_word

: looptest
  ( here is how we begin our repeating section )
  BEGIN
    countdown @ 0 = IF BREAK THEN

    ( here we increment our loop counter )
    countdown DEC!

    loop_count INC!

    ( the repeat keyword just marks the end of the repeating code, it doesn't
    have any special meaning )
  REPEAT
  true finished_word !
;

looptest

( did we actually repeat 5 times? )
countdown @ 0 = test::assert_true

finished_word @ test::assert_true

test::assert_stack_empty
`;


const TEST_3 = `
( we will count down from 5 to 0 )
5 VAR countdown

( we'll also use a loop counter to test for afterwards )
0 VAR loop_count

false VAR finished_word

: looptest
( here is how we begin our repeating section )
BEGIN
countdown @ 0 = IF RETURN THEN

( here we increment our loop counter )
countdown DEC!

loop_count INC!

( the repeat keyword just marks the end of the repeating code, it doesn't
have any special meaning )
REPEAT
true finished_word !
;

looptest

( did we actually repeat 5 times? )
countdown @ 0 = test::assert_true

finished_word @ test::assert_false

test::assert_stack_empty
`;


export default function BeginRepeatTests(testing) {
    testing.add_test_set('begin_repeat', 'BEGIN..REPEAT tests');
    testing.add_test('begin_repeat', 'normal', 'plain BEGIN_REPEAT', TEST_1);
    testing.add_test('begin_repeat', 'within word', 'Break within word must finish word', TEST_2);
    testing.add_test('begin_repeat', 'return within word', 'Return within word must finish word', TEST_3);
}
