

function test_variable1(f) {
    F.forth_add_code(f, `
    " Variables Test 1 - create, fetch:  " .
    123 VAR x
    x @ 123 = test::assert_true
    `);
}
function test_variable2(f) {
    F.forth_add_code(f, `
    " Variables Test 2 - create, set, fetch:  " .
    123 VAR x
    456 x !
    x @ 456 = test::assert_true
    `);
}
