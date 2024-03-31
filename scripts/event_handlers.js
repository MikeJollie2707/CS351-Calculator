import * as display from "./controllers.js";
import * as ops from "./operators.js";

// Keys that works as-is: You press, it shows up on the display
// The only exception here is the '(', which will also display a closing parentheses.
const ALLOWED_REGULAR_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '(', ')']
// Keys that will create a mathematical function. This includes basic arithmetic operators.
const ALLOWED_FUNC_KEYS = ['+', '-', '*', '/', '^']
// Keys that will "do something" to the calculator itself.
const ALLOWED_OP_KEYS = ["=", "Enter", "Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Escape"]

export function onClick(e) {
    const btn = e.target;
    handleValue(btn.innerText);
}

export function onFunctionClick(e) {
    // This "btn" may not always be a button.
    // In log2 case, it can be the <sub> element, which will make
    // btn.innerText result to 2 and not log2.
    // A temporary fix is if the HTML is saying something special (via the id attr)
    // then we keep reassign btn to the parent element until we hit the <button>
    let btn = e.target;
    if (btn.id !== "" || btn?.nodeName !== "BUTTON") {
        while (btn !== null && btn?.nodeName !== "BUTTON") {
            btn = btn?.parentElement;
        }
    }
    // Clicked on something, parent lookup returns document instead.
    if (btn === null) {
        return;
    }

    handleFunction(btn.innerText);
}

export function onOperatorClick(e) {
    const btn = e.target;

    if (btn.innerText === "AC") {
        ops.clearScreen();
    }
    else if (btn.innerText === "\u{25c1}") {
        ops.moveCursorLeft();
    }
    else if (btn.innerText === "\u{25b7}") {
        ops.moveCursorRight();
    }
    else if (btn.innerText === "\u{25b3}") {
        ops.showLastHistory();
    }
    else if (btn.innerText === "\u{25bd}") {
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

function handleValue(value) {
    display.doIfResultPresent([display.clearResultDisplay, display.clearLogicalExpr]);
    
    if (value !== '(') {
        display.insert(value);
    }
    else {
        display.insert("(");
        display.insert(")");
        // Put cursor in between.
        display.moveCursor(-1);
    }

    display.render();
}

function handleFunction(f) {
    display.doIfResultPresent([display.clearResultDisplay, display.clearLogicalExpr]);
    
    switch (f) {
        case "\u{213c}": {
            display.insert("Math.PI");
            break;
        }
        case "e": {
            display.insert("Math.E");
            break;
        }
        case "^": {
            display.insert("**");
            break;
        }
        case "sin":
        case "cos":
        case "tan": 
        case "log2": {
            display.insert(`Math.${f}(`);
            // display.insert(")");
            // display.moveCursor(-1);
            break;
        }
        case "\u{221a}": {
            display.insert("Math.sqrt(");
            // display.insert(")");
            // display.moveCursor(-1);
            break;
        }
        case "\u{2223}x\u{2223}": {
            display.insert("Math.abs(");
            // display.insert(")");
            // display.moveCursor(-1);
            break;
        }
        default: {
            display.insert(f);
        }
    }
    display.render();
}

// Allow user keyboard input.
document.addEventListener("keydown", (e) => {
    const key = e.key;
    console.log("Key pressed: %s", key);
    
    // Since input field is writable, need to prevent
    // any input to be inserted to the field.
    // This is easy with preventDefault().
    if (ALLOWED_REGULAR_KEYS.includes(key)) {
        e.preventDefault();
        handleValue(key);
    }
    else if (ALLOWED_FUNC_KEYS.includes(key)) {
        e.preventDefault();
        handleFunction(key);
    }
    else if (ALLOWED_OP_KEYS.includes(key)) {
        e.preventDefault();

        if (key === "Enter" || key === "=") {
            ops.evaluate();
        }
        else if (key === "Escape") {
            ops.clearScreen();
        }
        else if (key === "Backspace") {
            ops.del();
        }
        else if (key === "ArrowUp") {
            ops.showLastHistory();
        }
        else if (key === "ArrowDown") {
            ops.showNextHistory();
        }
        else if (key === "ArrowLeft") {
            ops.moveCursorLeft();
        }
        else if (key === "ArrowRight") {
            ops.moveCursorRight();
        }
    }
    else {
        e.preventDefault();
    }
})
