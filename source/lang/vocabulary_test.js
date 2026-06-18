let run_count = 0;

const TestVocabulary = (forth, options = {}) => {
  // if (run_count > 0 && !options.fresh) {
  //   return;
  // }
  run_count += 1;

  forth.interpreter.run( `
  " TEST" " A vocabulary for testing" VOCABULARY

  0 VARIABLE test::TEST_SUCCESSES
  0 VARIABLE test::TEST_FAILURES

  : test::assert_true
  IF
  test::TEST_SUCCESSES !INC
  ELSE
  test::TEST_FAILURES !INC
  THEN
  ;


  : test::assert_false
  FALSEY IF
  test::TEST_SUCCESSES !INC
  ELSE
  test::TEST_FAILURES !INC
  THEN
  ;

  ( LEFT OFF HERE
  Note that we need to add "local".
  This is a variable active only for the definition
  we could fold it into the concept of word_list - so that
  any context in which we have a defined set of words we can
  also have local variables.
  This makes sense, as the bit of code contained in a word list
  may want to do some processing that does not affect the world
  outside of the list.)

  : test::assert_stack_size
  DEPTH 1 - = test::assert_true
  ;

  : test::assert_stack_empty
  DEPTH 0 = test::assert_true
  ;
  `);
}


export default TestVocabulary;


