
/**
 * (<element id> -- <canvas object id>)
 *
 * Creates a canvas context object for a give canvas
 * DOM element identified by its id.
 *
 * It places the context object into the object area, and pushes
 * the object's id onto the stack
 *
 **/
function context_word ({forth}) {
    return () => {
        const {type, value} = forth.parameter_stack.pop();

        if (type !== 'string') {
            throw new Error('Sorry, canvas_context must be given a string');
        }

        const canvas_id = forth.strings.get(value);

        // see https://web.dev/articles/canvas-hidipi for this technique.
        // without this dpr + scale hack, everything in the canvas will be
        // fuzzy - especially noticable with text.
        const canvas = document.getElementById(canvas_id);
        const dpr = window.devicePixelRatio || 1;
        console.log('dpr is', dpr);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext("2d");
        context.scale(dpr, dpr);

        const id = forth.objects.create('dom', context);
        // forth.parameter_stack.push({type: 'object', value: id});
        forth.constants.create('canvas', 'current_context', {type: 'object', value: id});
    }
}

/**
 * (<canvas context> <style string> -- )
 *
 * Sets the fill style for the given canvas context.
 *
 * E.g.
 * <canvas_context> " green" canvas_fill_style
 **/
function fill_style_word ({forth}) {
    return () => {
    const {value: string_id} = forth.parameter_stack.pop();
    const color = forth.strings.get(string_id);
    // const {value: context_id} = forth.parameter_stack.pop();
    // const {value: context} = forth.objects.get(context_id);
        const context_id = forth.constants.get('canvas', 'current_context');
        if (!context_id) {
        }
       const context = forth.objects.get(context_id.value).value;

    context.fillStyle = color;
    }
}

function font_word({forth}) {
    return () => {
        const font_string_id = forth.parameter_stack.pop();
        const font_string = forth.strings.get(font_string_id.value);
        // const context_id = forth.parameter_stack.pop();
        // const context = forth.objects.get(context_id.value);
        const context_id = forth.constants.get('canvas', 'current_context');
        if (!context_id) {
        }
        const    context = forth.objects.get(context_id.value).value;

        context.font = font_string;
    }
}

function set_font_word({forth}) {
    return () => {
        const font_string_id = forth.parameter_stack.pop();
        // const font_string = forth.strings.get(font_string_id.value);
        // const context_id = forth.parameter_stack.pop();
        // const context = forth.objects.get(context_id.value);

        forth.constants.create('canvas', 'current_font', font_string_id);
    }
}

function set_context_word({forth}) {
    return () => {
        const context_id = forth.parameter_stack.pop();
        forth.constants.create('canvas', 'current_context', context_id);
    }
}

/**
 * (<canvas_context> <x pos> <y pos> <width> <height> -- )
 *
 * Creates and renders a green rectagle in the given canvas context.
 *
 * E.g.
 * <canvas_context> 10 10 150 150 canvas_fill_rect
 **/
function fill_rect_word ({forth}) {
    return () => {
        const height = forth.parameter_stack.pop();
        const width = forth.parameter_stack.pop();
        const y = forth.parameter_stack.pop();
        const x = forth.parameter_stack.pop();
        // const context_id = forth.parameter_stack.pop();

        // const {value: context} = forth.objects.get(context_id.value);
        const context_id = forth.constants.get('canvas', 'current_context');
        if (!context_id) {
        }
        const    context = forth.objects.get(context_id.value).value;
        context.fillRect(x.value, y.value, width.value, height.value);
    }
}

function fill_text_word ({forth}) {
    return () => {
        const y = forth.parameter_stack.pop();
        const x = forth.parameter_stack.pop();
        const text_id = forth.parameter_stack.pop();
        const text = forth.strings.get(text_id.value);
        // const context_id = forth.parameter_stack.pop();
        // const {value: context} = forth.objects.get(context_id.value);

        // It is weird, but the canvas does not remember the font when set
        // separately, using canvas::font. So we use this technique to
        // set a constant with the font, and set it immediately before
        // drawing the text.
        const context_id = forth.constants.get('canvas', 'current_context');
        if (!context_id) {
        }
        const    context = forth.objects.get(context_id.value).value;
        const font = forth.constants.get('canvas', 'current_font');
        if (font) {
              context.font = forth.strings.get(font.value);
        }
        context.fillText(text, x.value, y.value);
    }
}

let run_count = 0;

const CanvasVocabulary = (forth, options = {}) => {
    // if (run_count > 0 && !options.fresh) {
    //     return;
    // }
    run_count += 1;
    forth.add_word('canvas', "context", context_word);
    forth.add_word('canvas', "set-context", set_context_word);
    forth.add_word('canvas', "fill_style", fill_style_word);
    forth.add_word('canvas', "fill_rect", fill_rect_word);
    forth.add_word('canvas', "font", font_word);
    forth.add_word('canvas', "set_font", set_font_word);
    forth.add_word('canvas', "fill_text", fill_text_word);
}

export default  CanvasVocabulary;

