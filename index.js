function getMainDisplay() {
    return document.getElementById("main-display");
}

function onClick(e) {
    const main_display = getMainDisplay();
    main_display.value += e.target.innerHTML;
}

function onEvalClick() {
    const main_display = getMainDisplay();
    const expression = main_display.value;

    const result = eval(expression);
    console.log(result);
}
