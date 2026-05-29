

function test_canvas(f) {
    F.forth_input_code(f, `
    " starting..." set_alert
    `);

    F.forth_input_code(f, `
    " WForth Demo - Canvas" set_title
    `);

    // Canvas test...
    F.forth_input_code(f, `
    " Get canvas context" . cr .
    " canvas" canvas::context
    " Set fill style" . cr .
    ( we dup because we need to use the context id again below )
    dup " green" canvas::fill_style
    " Create filled rectangle" . cr .
    10 10 150 150 canvas::fill_rect
    `);

    // Canvas test...
    F.forth_input_code(f, `
    VARIABLE ctx
    " canvas" canvas::context
    ctx !
    ctx @ " red" canvas::fill_style
    ctx @ 200 200 150 150 canvas::fill_rect
    `);

    // Canvas test...
    F.forth_input_code(f, `
    " canvas" canvas::context
    ctx !
    ctx @ " blue" canvas::fill_style
    ctx @ 200 10 150 150 canvas::fill_rect
    `);

    // Canvas test...
    F.forth_input_code(f, `
    " canvas" canvas::context
    ctx !
    ctx @ " gray" canvas::fill_style
    ctx @ 10 200 150 150 canvas::fill_rect
    `);

    F.forth_input_code(f, `
    " Finished!" set_alert
    `);
}

