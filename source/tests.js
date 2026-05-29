


// function test_do_loop(f) {
//     // DO .. LOOP test
//     F.forth_add_code(f, `
//     " DO..LOOP Test 1 - one level loop: " .
//     0 VAR x
//     10 0 DO
//     I x !
//     LOOP
//     x @ 10 = test::assert_true
//     `);
//
//     // F.forth_run(f, `
//     // " LOOP Test 1 - two level loop: " .
//     // VARIABLE x
//     // VARIABLE y
//     // VARIABLE z
//     // VARIABLE zz
//     // 0 x !
//     // 0 y !
//     // 0 z !
//     // 10 0 DO
//     //   I @ y @ + y !
//     //   0 zz !
//     //   " (i=" . I . " )" .
//     //   10 0 DO
//     //     x @ 1 + x !
//     //     zz @ 1 + zz !
//     //   " zz:" . I @ . " ," .
//     //     ( J @ zz @ + zz ! )
//     //   LOOP
//     //   zz @ z @ + z !
//     // LOOP
//     // x @ . ", " .
//     // x @ 100 = test::assert_true
//     //  y @ . ", " .
//     // ( y @ 3628800 = test::assert_true
//     // z @ . ", " .
//     // z @ 36288000 = test::assert_true )
//     // `);
//
//
//     // F.forth_run(f, `
//     // " TESTING" log
//     // (
//     //   classic chuck moore do loop
//     //   really makes the most sense for a
//     //   stack language - who needs a
//     //   variable here?
//     //   <stop value> <initial and counting value> --
//     //   Implicit is that the DO will first inspect the
//     //   counting value, and if it is equal to the stop
//     //   value will not even enter the loop.
//     //   The LOOP will inspect the counting value and if
//     //   less than the stop value, will repeat the loop
//     //   body.
//     //   We can increment the counting value at the beginning
//     //   or ending of the DO loop.
//     //   The only trick is that the body of DO..LOOP must
//     //   leave the stack as it found it by the end of the
//     //   code (aka "word list").
//     // )
//     // 1 0 DO
//     //   ( we have the 1 and 0 on the stack still )
//     // 1 +
//     // LOOP
//     // `);
//     //     F.forth_run(flog will be displayed here when the forth is strong enough to do so! , `
//     //     " TESTING" log
//     //
//     //     ( set up the variable we'll track in the loop )
//     //     VARIABLE x
//     //
//     //     ( initialize to 0 )
//     //     0 x !
//     //
//     //     ( our loop begins with the generic code block word )
//     //     BEGIN
//     //
//     //     ( do stuff )
//     //
//     //     x @ .
//     //     x @ 1 + x !
//     //
//     //     ( test our conditional variable )
//     //     x @ 10 <
//     //     REPEAT_IF
//     //     `);
//     //     F.forth_run(f, `
//     //         " Loop Test 2 - two level loop: "
//     //         VARIABLE j
//     //         0 j !
//     //         10 0 DO
//     //         j @ .
//     //         cr .
//     //         j @ 1 + j !
//     //         LOOP
//     //     `);
// }



// const TEST_DEFINE_WORD_2 =
//
// function test_define_word(f) {
//     F.forth_add_code(f, `
//     : test::plusone " Plussing!" log 1 + ;
//     1 test::plusone 2 = IF " works" . ELSE " works not" . THEN cr .
//     `);
//
//     F.forth_add_code(f, `
//     : ::plusone " Plussing!" log 1 + ;
//     1 ::plusone 2 = IF " works" . ELSE " works not" . THEN cr .
//     `);
//
//     F.forth_add_code(f, `
//     : plusone " Plussing!" log 1 + ;
//     1 plusone 2 = IF " works" . ELSE " works not" . THEN cr .
//     `);
// }



function test_base(f) {
    test_string(f);
}

const TEST_DEFINE_WORD_2 =
