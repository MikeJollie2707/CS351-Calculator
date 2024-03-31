/**
 * 2 displays: main display (where user input happens) and result display (only show result)
 * result display is very simple, it has almost no abstraction.
 * main display has an abstraction layer (logical_expr acts as a buffer).
 */

const logical_expr = [];
let cursor_ptr = -1;

export function getMainDisplay() {
    return document.getElementById("main-display");
}
export function getResultDisplay() {
    return document.getElementById("result-display");
}

/**
 * Write `result` to the result display. This is immediately visible.
 * @param {string | number} result Content to write.
 */
export function writeResult(result) {
    const res_display = getResultDisplay();
    res_display.value = result;
}
/**
 * Clear result display. This is immediately visible.
 */
export function clearResultDisplay() {
    writeResult("");
}

/**
 * Display the content of the expression "buffer" to the calculator display.
 * More importantly, it'll set caret to the correct position.
 */
export function render() {
    const main_display = getMainDisplay();

    const expr = logical_expr.join('');

    let cursor_pos = 0;
    for (let i = 0; i <= cursor_ptr; ++i) {
        cursor_pos += logical_expr[i].length;
    }
    
    main_display.value = expr;
    
    // Fix https://github.com/MikeJollie2707/CS351-Calculator/issues/1
    main_display.blur();
    main_display.focus();
    main_display.setSelectionRange(cursor_pos, cursor_pos);
}

/**
 * Move the expression buffer caret by an offset.
 * 
 * If the offset causes out of bound, caret will be moved to the extreme ends.
 * @param {number} offset How much to the right to move the caret. Negative numbers to move to the left.
 */
export function moveCursor(offset) {
    cursor_ptr += offset;
    
    if (cursor_ptr >= logical_expr.length - 1) {
        cursor_ptr = logical_expr.length - 1;
    }
    else if (cursor_ptr < -1) {
        cursor_ptr = -1;
    }
}

/**
 * Insert `content` to the expression buffer.
 * 
 * Note that this change will not be visible until `render()` is called.
 */
export function insert(content) {
    logical_expr.splice(cursor_ptr + 1, 0, content);
    moveCursor(1);

    console.log(logical_expr);
}
/**
 * Delete the element at the caret in the expression buffer.
 * 
 * Note that this change will not be visible until `render()` is called.
 */
export function deleteBeforeCaret() {
    if (cursor_ptr < 0) {
        return;
    }
    logical_expr.splice(cursor_ptr, 1);
    moveCursor(-1);

    console.log(logical_expr);
}
/**
 * Empty the expression buffer.
 * 
 * Note that this change will not be visible until `render()` is called.
 */
export function clearLogicalExpr() {
    logical_expr.splice(0, logical_expr.length);
    cursor_ptr = -1;
}
/**
 * Get the expression buffer.
 * @returns {Array<string>} The expression buffer.
 */
export function getLogicalExpr() {
    return logical_expr;
}

/**
 * Invoke `callbacks` sequentially if result display is not empty.
 * 
 * @param {Array} callbacks Array of functions (with no parameters).
 */
export function doIfResultPresent(callbacks) {
    const res_display = getResultDisplay();
    if (res_display.value !== "") {
        for (const callback of callbacks) {
            callback();
        }
    }
}
