// Keys that works as-is: You press, it shows up on the display
const ALLOWED_REGULAR_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
// Keys that will create a mathematical function. This includes basic arithmetic operators.
const ALLOWED_FUNC_KEYS = ['+', '-', '*', '/']
// Keys that will "do something" to the calculator itself.
const ALLOWED_OP_KEYS = ["=", "Enter", "Backspace", "ArrowLeft", "ArrowRight"]

function getMainDisplay() {
    return document.getElementById("main-display");
}

function insertAfterCursor(content) {
    const main_display = getMainDisplay();
    // Make sure the cursor is visible.
    main_display.focus();

    const cursor_startpos = main_display.selectionStart;
    const cursor_endpos = main_display.selectionEnd;
    if (cursor_startpos !== cursor_endpos) {
        // TODO: Do something about this.
        return;
    }

    main_display.value = main_display.value.substring(0, cursor_startpos) + content + main_display.value.substring(cursor_startpos);
    
    main_display.selectionStart = main_display.selectionEnd = cursor_startpos + content.length;
}

function clearDisplay() {
    const main_display = getMainDisplay();
    main_display.value = "";
}

function onClick(e) {
    const btn = e.target;
    handleValue(e.target.innerText);
    
    // Without this, pressing Enter after clicking a button will repeat that number.
    btn.blur();
}
function handleValue(value) {
    insertAfterCursor(value);    
}

function onFunctionClick(e) {
    const btn = e.target;
    handleFunction(e.target.innerText);
    
    // Without this, pressing Enter after clicking a button will repeat that number.
    btn.blur();
}
function handleFunction(f) {
    insertAfterCursor(f);
}

function onOperatorClick(e) {
    // TODO: Maybe make a callback mapping?
    if (e.target.innerText === "AC") {
        clearDisplay();
    }
}

function onEvalClick() {
    const main_display = getMainDisplay();
    const expression = main_display.value;

    const result = eval(expression);
    console.log(result);
    clearDisplay();
    insertAfterCursor(result);
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
            e.preventDefault();
            onEvalClick();
        }
    }
    else {
        e.preventDefault();
    }
})
