import * as listener from "./scripts/event_handlers.js";

const normal_btns = document.getElementsByClassName("normal-btn");
const function_btns = document.getElementsByClassName("func-btn");
const op_btns = document.getElementsByClassName("op-btn");

for (const btn of normal_btns) {
    btn.addEventListener("click", (e) => listener.onClick(e));
}
for (const btn of function_btns) {
    btn.addEventListener("click", (e) => listener.onFunctionClick(e));
}
for (const btn of op_btns) {
    btn.addEventListener("click", (e) => listener.onOperatorClick(e));
}
