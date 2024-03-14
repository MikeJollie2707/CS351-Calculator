import * as display from "./controllers.js";
import * as hist from "./history.js";
import * as ops from "./operators.js";

// Keys that works as-is: You press, it shows up on the display
// The only exception here is the '(', which will also display a closing parentheses.
const ALLOWED_REGULAR_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '(', ')']
// Keys that will create a mathematical function. This includes basic arithmetic operators.
const ALLOWED_FUNC_KEYS = ['+', '-', '*', '/']
// Keys that will "do something" to the calculator itself.
const ALLOWED_OP_KEYS = ["=", "Enter", "Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Escape"]

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
        ops.clearScreen();
    }
    else if (btn.innerText === "\u{25c1}") {
        ops.moveCursorLeft();
    }
    else if (btn.innerText === "\u{25b7}") {
        ops.moveCursorRight();
    }
    else if (btn.innerText === "Up") {
        ops.showLastHistory();
    }
    else if (btn.innerText === "Down") {
        ops.showNextHistory();
    }
    else if (btn.innerText === "Ans") {
        ops.ans();
    }
    else if (btn.innerText === "DEL") {
        ops.del();
    }
    else if (btn.innerText === "=") {
        ops.evaluate();
    }
}

export function onEvalClick() {
}

function handleValue(value) {
    if (value !== '(') {
        display.insert(value);
    }
    else {
        // Put cursor in between.
        display.insert("(");
        display.insert(")");
        display.moveCursor(-1);
    }

    display.render();
}

function handleFunction(f) {
    // display.insertAfterCursor(f);
    display.insert(f);
    display.render();
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
            // onEvalClick();
            ops.evaluate();
        }
        else if (key === "Escape") {
            ops.clearScreen();
        }
        else if (key === "Backspace") {
            e.preventDefault();
            ops.del();
        }
        else if (key === "ArrowUp") {
            e.preventDefault();
            ops.showLastHistory();
        }
        else if (key === "ArrowDown") {
            e.preventDefault();
            ops.showNextHistory();
        }
        else if (key === "ArrowLeft") {
            e.preventDefault();
            ops.moveCursorLeft();
        }
        else if (key === "ArrowRight") {
            e.preventDefault();
            ops.moveCursorRight();
        }
    }
    else {
        e.preventDefault();
    }
})
