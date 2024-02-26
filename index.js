function getMainDisplay() {
    return document.getElementById("main-display");
}

function insertAfterCursor(content) {
    const main_display = getMainDisplay();

    const cursor_startpos = main_display.selectionStart;
    const cursor_endpos = main_display.selectionEnd;
    if (cursor_startpos !== cursor_endpos) {
        // TODO: Do something about this.
        return;
    }

    main_display.value = main_display.value.substring(0, cursor_startpos) + content + main_display.value.substring(cursor_startpos);
}

function onClick(e) {
    insertAfterCursor(e.target.innerHTML);
}

function onOperatorClick(e) {
    insertAfterCursor(e.target.innerHTML);
}

function onEvalClick() {
    const main_display = getMainDisplay();
    const expression = main_display.value;

    const result = eval(expression);
    console.log(result);
}
