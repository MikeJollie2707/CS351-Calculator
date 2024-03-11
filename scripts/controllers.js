/**
 * NOTE:
 * Before implementing functions, there are some things to consider:
 * 1. How cursor movement will be decided.
 * - For now, the cursor treat each character as a separate atom. So something like "**" is considered as 2 multiplications by the cursor.
 * - In that sense, for the sake of correctness, the cursor should NOT be able to be placed in between the exponent.
 * - Same reasoning for function. It should NOT be possible to place cursor anywhere in between Math.sin( for example. Either at the start or the end.
 * => A potential solution is to separate the display expr from the inner expr. Let's call this the "logical" expr.
 * For example, the expression 5-(3+6) will be stored in logical expr as ['5', '-', '(', '3', '+', '6', ')']
 * Another example, the expr 5+Math.sin(0.5) is stored as ['5', '+', 'Math.sin(', '0', '.', '5', ')']
 * The "logical" cursor is therefore an index pointing to this logical expr. Wherever it is pointing, the display cursor will be right after it.
 * For example, the expr 5-|(3+6) with vertical bar as cursor will correspond to logical cursor being 1, pointing to the '-'.
 * Ofc we'll need to translate the logical cursor and expr into display cursor and expr. There will be functions for that.
 * This will ensure that when we backspace a function, we'll delete the entire function in one go.
 * 
 * 2. Should exponent be ** or Math.pow()
 * - ** is only recommended after implementing point 1.
 * 
 * 3. Ans
 * - Currently there are no defined behavior for cases like AnsAns+Ans3. However, Ans itself is an atom in logical expr.
 * 
 */

export function getMainDisplay() {
    return document.getElementById("main-display");
}
export function getResultDisplay() {
    return document.getElementById("result-display");
}

/**
 * Insert content in main display after wherever the cursor is.
 * 
 * @param {string} content Content to insert in main display.
 * @param {number | null} cursor_offset How much distance from where the cursor was to move. Default to the length of `content`.
 */
export function insertAfterCursor(content, cursor_offset=null) {
    const main_display = getMainDisplay();
    // Make sure the cursor is visible.
    main_display.focus();
    doIfResultPresent([clearMainDisplay, clearResultDisplay]);
    
    const cursor_startpos = main_display.selectionStart;
    const cursor_endpos = main_display.selectionEnd;
    // if start == end, then we simply insert in between left of cursor and right of cursor, which is [0, i) and [i, ...]
    // if start != end, selectionEnd is pass the last selected character, so we can also use [0, i) and [i, ...] to ignore selected characters.
    main_display.value = main_display.value.substring(0, cursor_startpos) + content + main_display.value.substring(cursor_endpos);
    
    // Move the cursor by a distance from its current position.
    // By default we want to move it to the length of the content
    // so it'll appear after the newly inserted content.
    const cursor_dist = cursor_offset !== null ? cursor_offset : content.length;
    const new_cursor_pos = cursor_startpos + cursor_dist;
    main_display.setSelectionRange(new_cursor_pos, new_cursor_pos);
}

export function deleteBeforeCursor(range=1) {
    const main_display = getMainDisplay();
    main_display.focus();
    doIfResultPresent([clearMainDisplay, clearResultDisplay]);

    const cursor_startpos = main_display.selectionStart;
    const cursor_endpos = main_display.selectionEnd;

    if (cursor_endpos !== cursor_startpos) {
        // TODO: Handle this case.
        return;
    }

    main_display.value = main_display.value.substring(0, cursor_startpos - range) + main_display.value.substring(cursor_endpos);
    
    let new_cursor_pos = cursor_startpos - range;
    if (new_cursor_pos < 0) {
        new_cursor_pos = 0;
    }
    main_display.setSelectionRange(new_cursor_pos, new_cursor_pos);
}

export function writeResult(result) {
    const res_display = getResultDisplay();
    res_display.value = result;
}

export function clearMainDisplay() {
    const main_display = getMainDisplay();
    main_display.value = "";
}

export function clearResultDisplay() {
    const res_display = getResultDisplay();
    res_display.value = "";
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
