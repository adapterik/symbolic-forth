
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
        const canvas_id = forth.pop_string();

        // see https://web.dev/articles/canvas-hidipi for this technique.
        // without this dpr + scale hack, everything in the canvas will be
        // fuzzy - especially noticable with text.
        const canvas = document.getElementById(canvas_id);
        const dpr = window.devicePixelRatio || 1;
        // console.log('dpr is', dpr);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext("2d");
        context.scale(dpr, dpr);

        forth.parameter_stack.push(forth.object_value(context));
        // forth.constants.create('canvas', 'current_context', {type: 'object', value: id});
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
      const context = forth.pop_object();
      const color = forth.pop_string();
      context.fillStyle = color;
    }
}

function font_word({forth}) {
    return () => {
        const context = forth.pop_object();
        const font_string = forth.pop_string();
        context.font = font_string;
    }
}
/*
function set_font_word({forth}) {
    return () => {
        const font_string_id = forth.parameter_stack.pop();
        // const font_string = forth.strings.get(font_string_id.value);
        // const context_id = forth.parameter_stack.pop();
        // const context = forth.objects.get(context_id.value);

        // should be variable ... or just let the user set a variable.
        forth.constants.create('canvas', 'current_font', font_string_id);
    }
}*/
/*
function set_context_word({forth}) {
    return () => {
        const context_id = forth.parameter_stack.pop();
        forth.constants.create('canvas', 'current_context', context_id);
    }
}*/

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
        const context = forth.pop_object();
        const height = forth.pop_number();
        const width = forth.pop_number();
        const y = forth.pop_number();
        const x = forth.pop_number();

        context.fillRect(x, y, width, height);
    }
}

function fill_text_word ({forth}) {
    return () => {
        const context = forth.pop_object();
        const y = forth.pop_number();
        const x = forth.pop_number();
        const text = forth.pop_string();
/*
        const font = forth.constants.get('canvas', 'current_font');

        if (font) {
              context.font = forth.strings.get(font.value);
        }*/
        context.fillText(text, x, y);
    }
}

const CanvasVocabulary = (forth, options = {}) => {
    forth.add_vocabulary('CANVAS', 'Use the browser canvs');

    forth.add_word('canvas', "context", context_word);
    // forth.add_word('canvas', "set-context", set_context_word);
    forth.add_word('canvas', "fill_style", fill_style_word);
    forth.add_word('canvas', "fill_rect", fill_rect_word);
    forth.add_word('canvas', "font", font_word);
    // forth.add_word('canvas', "set_font", set_font_word);
    forth.add_word('canvas', "fill_text", fill_text_word);
}

export default  CanvasVocabulary;

