
// const TEST_DO_LOOP_1 = `
// " DO..LOOP Test 1 - one level loop: " . CR
// " ----------------------------------" . CR
// 0 VAR x
// 10 0 DO
// I x !
// LOOP
// x @ 9 = test::assert_true
// test::assert_stack_empty
// `;


const TEST_1 = `
0 VAR x
5 0 DO x inc! LOOP

x @ 5 = test::assert_true

test::assert_stack_empty
`;

const TEST_2 = `
0 VAR x
5 0 DO
  x inc!
  x @ 3 = IF BREAK THEN
LOOP

x @ 3 = test::assert_true

test::assert_stack_empty
`;


const TEST_3 = `
0 VAR x
0 VAR y
5 0
DO
  x @ 1 + x !
  2 I > IF CONTINUE THEN
  y @ 1 + y !
LOOP

x @ 5 = test::assert_true
y @ 3 = test::assert_true

test::assert_stack_empty
`;


// function test_perf1(f) {
//     // F.forth_add_code(f, `
//     //     now var start
//     //     .s
//     //     0 var temp
//     //     1000 0 DO
//     //        // temp @ 1 + temp !
//     //        I .
//     //     LOOP
//     //     (now var end
//     //     start @ . CR
//     //     end @ . CR
//     //     start @ end @ - var elapsed
//     //     elapsed @ . CR
//     //     temp @ . CR)
//     //     `);
//     F.forth_add_code(f, `
//     now VAR start
//     0 VAR iters
//     1000000 0 DO
//     iters 1+
//     LOOP
//     CR
//     " Iters = " . iters @ .
//     CR
//     now VAR end
//     start @ end @ - VAR elapsed
//     CR
//     " Started at " . start @ . CR
//     " Ended at " . end @ . CR
//     " Elapsed = " . elapsed @ . CR
//
//     `);
//
//     // LEFT OFF HERE TOO
//     /*
//      * For the loop variable to work (best, without one-off hacks),
//      * we should store it in the local variables of the DO...LOOP
//      * also, to support a sub-word-list accessing variables in an
//      * outer word list, we _could_ support nesting of word_list
//      * contexts, and allow the search for variables up through the
//      * nested contexts...
//      */
//     // F.forth_add_code(f, `
//     // " DO ... LOOP anyone?" . CR
//     // 5 0 DO I . CR LOOP
//     // QUIT
//     // `);
// }

export default function AddDoLoopTests(testing) {
    testing.add_test_set('doloop', 'Exit from loop tests');
    testing.add_test('doloop', 'normal', 'plain DO..LOOP', TEST_1);
    testing.add_test('doloop', 'exit', 'BREAK out of plain DO..LOOP', TEST_2);
}
