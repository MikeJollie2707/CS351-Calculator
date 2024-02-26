// Keys that works as-is: You press, it shows up on the display
// The only exception here is the '(', which will also display a closing parentheses.
const ALLOWED_REGULAR_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '(', ')']
// Keys that will create a mathematical function. This includes basic arithmetic operators.
const ALLOWED_FUNC_KEYS = ['+', '-', '*', '/']
// Keys that will "do something" to the calculator itself.
const ALLOWED_OP_KEYS = ["=", "Enter", "Backspace", "ArrowLeft", "ArrowRight", "Escape"]

let is_showing_result = false;

function getMainDisplay() {
    return document.getElementById("main-display");
}

function insertAfterCursor(content, cursor_offset=null) {
    const main_display = getMainDisplay();
    // Make sure the cursor is visible.
    main_display.focus();

    if (is_showing_result) {
        clearDisplay();
        is_showing_result = false;
    }

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

function clearDisplay() {
    const main_display = getMainDisplay();
    main_display.value = "";
}

function onClick(e) {
    const btn = e.target;
    handleValue(btn.innerText);
    
    // Without this, pressing Enter after clicking a button will repeat that number.
    btn.blur();
}
function handleValue(value) {
    if (value !== '(') {
        insertAfterCursor(value);
    }
    else {
        // Put cursor in between.
        insertAfterCursor("()", 1);
    }    
}

function onFunctionClick(e) {
    const btn = e.target;
    handleFunction(btn.innerText);
    
    // Without this, pressing Enter after clicking a button will repeat that number.
    btn.blur();
}
function handleFunction(f) {
    insertAfterCursor(f);
}

function onOperatorClick(e) {
    // TODO: Maybe make a callback mapping?
    const btn = e.target;
    if (btn.innerText === "AC") {
        clearDisplay();
    }
}

function onEvalClick() {
    const main_display = getMainDisplay();
    const expression = main_display.value;

    try {
        const result = eval(expression);
        console.log(result);
        clearDisplay();
        insertAfterCursor(result);
    }
    catch {
        clearDisplay();
        insertAfterCursor("Error.");
    }
    is_showing_result = true;
}

// Allow user keyboard input.
document.addEventListener("keydown", (e) => {
    const key = e.key;
    console.log("Key pressed: %s", key);
    
    // Since input field is writable, need to prevent
    // any input to be inserted to the field.
    // This is easy with preventDefault().
    // However, we still want to move the cursor with arrows,
    // backspace to delete, and more movement related if any.
    if (ALLOWED_REGULAR_KEYS.includes(key)) {
        e.preventDefault();
        handleValue(key);
    }
    else if (ALLOWED_FUNC_KEYS.includes(key)) {
        e.preventDefault();
        handleFunction(key);
    }
    else if (ALLOWED_OP_KEYS.includes(key)) {
        if (key === "Enter" || key === "=") {
            e.preventDefault(); // Prevent the = key from showing up, even if for a moment.
            onEvalClick();
        }
        if (key === "Escape") {
            clearDisplay();
        }
    }
    else {
        e.preventDefault();
    }
})
