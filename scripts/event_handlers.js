import * as display from "./controllers.js";

// Keys that works as-is: You press, it shows up on the display
// The only exception here is the '(', which will also display a closing parentheses.
const ALLOWED_REGULAR_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '(', ')']
// Keys that will create a mathematical function. This includes basic arithmetic operators.
const ALLOWED_FUNC_KEYS = ['+', '-', '*', '/']
// Keys that will "do something" to the calculator itself.
const ALLOWED_OP_KEYS = ["=", "Enter", "Backspace", "ArrowLeft", "ArrowRight", "Escape"]

export function onClick(e) {
    const btn = e.target;
    handleValue(btn.innerText);
    
    // Without this, pressing Enter after clicking a button will repeat that number.
    btn.blur();
}

export function onFunctionClick(e) {
    const btn = e.target;
    handleFunction(btn.innerText);
    
    // Without this, pressing Enter after clicking a button will repeat that number.
    btn.blur();
}

export function onOperatorClick(e) {
    // TODO: Maybe make a callback mapping?
    const btn = e.target;
    console.log(btn.innerText);
    if (btn.innerText === "AC") {
        display.clearMainDisplay();
        display.clearResultDisplay();
    }
    else if (btn.innerText === "\u{25c1}") {
        console.log("Coming soon...");
    }
    else if (btn.innerText === "\u{25b7}") {
        console.log("I said coming soon...");
    }
    else if (btn.innerText === "CL") {
        // NOTE: Doesn't seem to register the KeyboardEvent so I can't really utilize backspace here.
        display.deleteBeforeCursor();
    }
    else if (btn.innerText === "=") {
        onEvalClick();
    }
}

export function onEvalClick() {
    const main_display = display.getMainDisplay();
    const expression = main_display.value;

    try {
        const result = eval(expression);
        console.log(result);
        display.writeResult(result);
    }
    catch {
        display.clearMainDisplay();
        display.writeResult("Error");
    }
}

function handleValue(value) {
    if (value !== '(') {
        display.insertAfterCursor(value);
    }
    else {
        // Put cursor in between.
        display.insertAfterCursor("()", 1);
    }    
}

function handleFunction(f) {
    display.insertAfterCursor(f);
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
        else if (key === "Escape") {
            display.clearMainDisplay();
            display.clearResultDisplay();
        }
        else if (key === "Backspace") {
            display.doIfResultPresent([
                display.clearResultDisplay,
                display.clearMainDisplay,
            ]);
        }
    }
    else {
        e.preventDefault();
    }
})
