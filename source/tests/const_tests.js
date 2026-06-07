
/**
 *
 **/

const TEST_1 = `
10 CONST foo

10 foo = test::assert_true

test::assert_stack_empty
`;

// we can also just use a word, but it is a bit slower.
const TEST_2 = `
: bar 20 ;

20 bar = test::assert_true

test::assert_stack_empty
`;

const TEST_3x = `
10 CONST x

time::now VARIABLE t1

10000 0 DO
  x DROP
LOOP

{ time::now t1 @ - } VARIABLE elapsed1

( now time a const-style word )

: y 20 ;

time::now VARIABLE t2

10000 0 DO
  y DROP
LOOP

{ time::now t2 @ - } VARIABLE elapsed2

(
    " CONST vs WORD" PRINTLN
    elapsed1 @ PRINTLN
    elapsed2 @ PRINTLN
)

elapsed1 @ elapsed2 @  < test::assert_true

test::assert_stack_empty

`;

const TEST_3 = `
10 CONST x

time::now VARIABLE t1

10000 0 DO
x DROP
LOOP



`;
export default function AddConstTests(testing) {
    testing.add_test_set('const', 'Test all CONST operations');
    testing.add_test('const', 'create', 'Create a CONST and ensure it has the same value', TEST_1);
    testing.add_test('const', 'word', 'Create a word that is just like a CONST and ensure it has the same value', TEST_2);
    testing.add_test('const', 'compared-to-word', 'A CONST should be faster than the equivalent word, as it is defined in JS', TEST_3);
}
