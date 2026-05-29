
// WORD HELPERS

export function log(message) {
    // const root = document.getElementById('output');
    // const line = document.createElement('div');
    // line.innerText = message;
    // root.appendChild(line);
    console.log(message);
}

export function assert_type(type, available) {
    return available.includes(type);
}


// export function assert_type(type_to_test, type) {
//     if (type_to_test !== type) {
//         throw new Error(`Sorry, expected a ${type}, got a ${type_to_test}`);
//     }
// }
