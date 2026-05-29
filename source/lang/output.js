export function write(message) {
    const dot_element = document.getElementById('output');
    dot_element.innerText = dot_element.innerText + message;
}


export function writeln(message) {
    write(message);
    write('\n');
}

