
let UUID4_COUNTER = 0;

export function uuid4() {
    // rough TODO: improve!
    const serial_component = ++UUID4_COUNTER;
    const time_component = Date.now();
    const random_component = Math.floor(Math.random() * 1000000000);
    return `${serial_component}-${time_component}-${random_component}`;
}
