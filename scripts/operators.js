import * as display from "./controllers.js";
import * as hist from "./history.js";

export function evaluate() {
    const main_display = display.getMainDisplay();
    const expression = main_display.value;

    try {
        const result = eval(expression);
        console.log(result);
        display.writeResult(result);
        hist.addHistory({expression: Array.from(display.getLogicalExpr()), result: result});
        
        main_display.blur();
    }
    catch {
        display.writeResult("Error");
    }
}

export function clearScreen() {
    display.clearLogicalExpr();
    display.clearResultDisplay();
    display.render();

    hist.toPresent();
}

export function del() {
    display.deleteBeforeCaret();
    display.render();

    hist.toPresent();
}

export function ans() {
    display.doIfResultPresent([display.clearLogicalExpr, display.clearResultDisplay]);
    
    hist.toPresent();
    const history = hist.getPreviousHistory();
    if (!history) {
        return;
    }

    const { result } = history;
    display.insert(`${result}`);
    display.render();
}

export function showLastHistory() {
    const history = hist.getPreviousHistory();
    if (!history) {
        return;
    }

    displayHistory(history);    
}

export function showNextHistory() {
    const history = hist.getNextHistory();
    if (!history) {
        return;
    }

    displayHistory(history);
}

export function moveCursorLeft() {
    display.moveCursor(-1);
    display.render();
}

export function moveCursorRight() {
    display.moveCursor(1);
    display.render();
}

function displayHistory(history) {
    const {expression, result} = history;
    display.clearLogicalExpr();
    for (const atom of expression) {
        display.insert(atom);
    }
    display.render();
    display.writeResult(result);
}
