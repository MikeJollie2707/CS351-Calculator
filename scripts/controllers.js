/**
 * 2 displays: main display (where user input happens) and result display (only show result)
 * result display is very simple, it has almost no abstraction.
 * main display has an abstraction layer.
 */

/**
 * 2. Should exponent be ** or Math.pow()
 * - ** is only recommended after implementing point 1.
 * 
 * 3. Ans
 * - Ans will act like MR in old calculator: It'll inject the value upon press. The difference is it'll inject previous result. It is an op btn.
 * 
 */

const logical_expr = [];
let cursor_ptr = -1;

export function getMainDisplay() {
    return document.getElementById("main-display");
}
export function getResultDisplay() {
    return document.getElementById("result-display");
}

export function writeResult(result) {
    const res_display = getResultDisplay();
    res_display.value = result;
}

export function clearResultDisplay() {
    writeResult("");
}

export function render() {
    const main_display = getMainDisplay();

    const expr = logical_expr.join('');

    let cursor_pos = 0;
    for (let i = 0; i <= cursor_ptr; ++i) {
        cursor_pos += logical_expr[i].length;
    }
    
    main_display.value = expr;
    
    main_display.blur();
    main_display.focus();
    main_display.setSelectionRange(cursor_pos, cursor_pos);
}

export function moveCursor(offset) {
    // TODO: Reorganize this code.
    if (cursor_ptr + offset >= logical_expr.length - 1) {
        cursor_ptr = logical_expr.length - 1;
        return;
    }
    if (cursor_ptr + offset < -1) {
        cursor_ptr = -1;
        return;
    }
    cursor_ptr += offset;
}

export function insert(content) {
    logical_expr.splice(cursor_ptr + 1, 0, content);
    moveCursor(1);

    console.log(logical_expr);
}
export function deleteBeforeCaret() {
    if (cursor_ptr < 0) {
        return;
    }
    logical_expr.splice(cursor_ptr, 1);
    moveCursor(-1);

    console.log(logical_expr);
}
export function clearLogicalExpr() {
    logical_expr.splice(0, logical_expr.length);
    cursor_ptr = -1;
}
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
