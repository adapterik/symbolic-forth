
/**
 *
 **/

const TEST_1 = `
10 SYM myvar VAR

SYM myvar VAR@ 10 = test::assert_true

20 SYM myvar VAR!

SYM myvar VAR@ 20 = test::assert_true

test::assert_stack_empty
`;


const TEST_2 = `
10 " myvar" VAR

" myvar" VAR@ 10 = test::assert_true

20 " myvar" VAR!

" myvar" VAR@ 20 = test::assert_true

test::assert_stack_empty
`;

const TEST_3 = `
10 VARIABLE myvar

myvar TYPEOF " variable" S= test::assert_true

myvar @ 10 = test::assert_true

20 myvar !

myvar @ 20 = test::assert_true

test::assert_stack_empty
`;


const TEST_3a = `
10 VARIABLE myvar

myvar TYPEOF " variable" S= test::assert_true

myvar @ 10 = test::assert_true

SYM myvar VAR@ 10 = test::assert_true

20 myvar !

myvar @ 20 = test::assert_true

30 SYM myvar VAR!

myvar @ 30 = test::assert_true

test::assert_stack_empty
`;

// performance

const TEST_4 = `
10 SYM x VAR

time::now SYM t1 VAR

10000 0 DO
  20 SYM x VAR!
LOOP

{ time::now SYM t1 VAR@ - } SYM elapsed1 VAR

( ensure the setting worked )
SYM x VAR@ 20 = test::assert_true


10 VARIABLE y

time::now SYM t2 VAR

10000 0 DO
  20 y !
LOOP

{ time::now SYM t2 VAR@ - } SYM elapsed2 VAR

( ensure the setting worked )
y @ 20 = test::assert_true

(
" VAR vs VARIABLE" PRINTLN
SYM elapsed1 VAR@ PRINTLN
SYM elapsed2 VAR@ PRINTLN
)

( ensure that VAR is faster than VARIABLE )
SYM elapsed1 VAR@ SYM elapsed2 VAR@  > test::assert_true

`;


const TEST_4a = `
10 SYM x VAR

time::now SYM t1 VAR

10000 0 DO
  SYM x VAR@ DROP
LOOP

{ time::now SYM t1 VAR@ - } SYM elapsed1 VAR

( ensure the setting worked )
SYM  x VAR@ 20 = test::assert_true

10 VARIABLE y

time::now SYM t2 VAR

10000 0 DO
  20 y @ DROP
LOOP

{ time::now SYM t2 VAR@ - } SYM elapsed2 VAR

( ensure the setting worked )
y @ 20 = test::assert_true

(
" VAR vs VARIABLE" PRINTLN
SYM elapsed1 VAR@ PRINTLN
SYM elapsed2 VAR@ PRINTLN
)

( ensure that VAR is faster than VARIABLE )
SYM elapsed1 VAR@ SYM elapsed2 VAR@  > test::assert_true

`;

const TEST_5 = `
10 SYM x VAR

time::now SYM t1 VAR

10000 0 DO
  SYM x VAR@ DROP
LOOP

{ time::now SYM t1 VAR@ - } SYM elapsed1 VAR

( now time a const-style word )

: y 20 ;

time::now SYM t2 VAR

10000 0 DO
  y DROP
LOOP

{ time::now SYM t2 VAR@ - } SYM elapsed2 VAR


" VAR vs WORD" PRINTLN
SYM elapsed1 VAR@ PRINTLN
SYM elapsed2 VAR@ PRINTLN


SYM elapsed1 VAR@ SYM elapsed2 VAR@  > test::assert_true

test::assert_stack_empty

`;


const TEST_6 = `
10 VARIABLE x

time::now SYM t1 VAR

10000 0 DO
    x @ DROP
LOOP

{ time::now SYM t1 VAR@ - } SYM elapsed1 VAR

( now time a const-style word )

: y 20 ;

time::now SYM t2 VAR

10000 0 DO
  y DROP
LOOP

{ time::now SYM t2 VAR@ - } SYM elapsed2 VAR


    " VARIABLE vs WORD" PRINTLN
    SYM elapsed1 VAR@ PRINTLN
    SYM elapsed2 VAR@ PRINTLN


SYM elapsed1 VAR@ SYM elapsed2 VAR@  < test::assert_true

test::assert_stack_empty

`;

export default function AddVarTests(testing) {
    testing.add_test_set('var', 'Test all VAR operations');
    testing.add_test('var', 'var-with-symbol', 'Create, get, set a VAR with a symbol', TEST_1);
    testing.add_test('var', 'var-with-string', 'Create, get, set VAR with a string', TEST_2);
    testing.add_test('var', 'variable', 'Use good ol VARIABLE to do the same thing', TEST_3);
    testing.add_test('var', 'mix', 'Mix and match VAR and VARIABLE', TEST_3);
    // testing.add_test('var', 'perf_set', 'VAR is slower than VARIABLE at setting', TEST_4);
    // testing.add_test('var', 'perf_get', 'VAR is slower than VARIABLE at getting', TEST_4);
    // testing.add_test('var', 'perf2', 'WORD (const) is faster than VAR', TEST_5);
    // testing.add_test('var', 'perf3', 'VARIABLE is faster than WORD (const)', TEST_6);
    // testing.add_test('var', 'variable', 'Mix them together...', TEST_4);
}
