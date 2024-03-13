// NOTE: Maybe use class?

const history_stack = [];
let history_ptr = -1;

export function getPreviousHistory() {
    if (history_ptr <= 0) {
        return null;
    }
    --history_ptr;
    return history_stack[history_ptr];
}

export function getNextHistory() {
    if (history_ptr >= history_stack.length - 1) {
        return null;
    }
    ++history_ptr;
    return history_stack[history_ptr];
}

export function addHistory(state) {
    const {expression, result} = state;
    if (result === "Error") {
        return;
    }

    history_ptr = history_stack.push(state) - 1;
    console.log(history_stack);
    console.log("H Ptr: %d", history_ptr);
}

/**
 * Force the history pointer to point pass the last history.
 * 
 * This is useful to temporarily represent user inputting state (history is being created!)
 */
export function toPresent() {
    history_ptr = history_stack.length;
}
