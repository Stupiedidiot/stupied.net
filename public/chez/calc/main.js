const TOKEN = /(\d+(?:\.+\d+)+|\d+|[+\-*/^()])/g;

const SYMBOLS = {
  '+': { prec: 2, assoc: 'left' },
  '-': { prec: 2, assoc: 'left' },
  '*': { prec: 3, assoc: 'left' },
  '/': { prec: 3, assoc: 'left' },
  '^': { prec: 4, assoc: 'right' }
};

const OPPS = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '^': (a, b) => Math.pow(a, b)
}

class C_History extends Array {
    constructor() {
        super(...[].filter(x => x !== undefined));
        this.plus = false;
    }

    // Evaluate expression from letf to right
    get ansLefty() {
        let arr = this.filter(x => x !== '(' && x !== ')');
        if (isNaN(arr[arr.length - 1])) arr = arr.slice(0, arr.length - 1);
        if (!arr) return;

        let result = parseFloat(arr[0]);
        for (let i = 1; i < arr.length; i += 2) {
            const operator = arr[i];
            const nextValue = parseFloat(arr[i + 1]);

            switch (operator) {
                case '+': result += nextValue; break;
                case '-': result -= nextValue; break;
                case '*': result *= nextValue; break;
                case '/': result /= nextValue; break;
                case '^': result = Math.pow(result, nextValue); break;
            }
        }
        return result;
    }

    // Evaluate expression with MDAS
    // Using Shunting Yard Algorithm
    get ans() {
        let expr = this.expr;
        if (!expr) return;

        let stack = [];
        expr.forEach(e => {
        if (!isNaN(e)) stack.push(parseFloat(e));
        else {
            let b = stack.pop(), a = stack.pop();
            stack.push(OPPS[e](a, b));
        }
        });
        return stack[0];
    }

    get expr() {
        let queue = [],
            stack = [];
        
        this.forEach(e => {
            if (!isNaN(e)) {
                queue.push(e);
            } else if (e == '(') {
                stack.push(e);
            } else if (e == ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    queue.push(stack.pop());
                }
                stack.pop();
            } else { 
                while (stack.length) {
                    if (stack[stack.length - 1] === '(') break;

                    let p1 = SYMBOLS[e].prec;
                    let p2 = SYMBOLS[stack[stack.length - 1]].prec;
                    if (p2 > p1 || (p2 === p1 && SYMBOLS[e].assoc === 'left')) {
                        queue.push(stack.pop());
                    } else { 
                        break;
                    }
                }
                stack.push(e);
            }
        });
        return [...queue, ...stack.reverse()];
    }

    // Adds input to array
    // Breaks equations into tokens
    add(value) {
        if (value === undefined) return;

        let arr = value.match(TOKEN);
        if (!arr) return;
        arr.forEach(e => {
            let test = removeDecimals(e);
            let prev = this[this.add.length - 1]; 
            if (test) {
                this.push(test);
            } else if (
                isNaN(prev)
                && prev !== '(' && prev !== ')'
                && e !== '(' && e !== ')'
            ) {
                this.replaceLast(e);
            } else { 
                this.push(e);
            }
        });
    }

    clear() { this.length = 0; }

    get last() { return this[this.length - 1]; }
    replaceLast(e) { this[this.length - 1] = e; }
}

var c_history = new C_History();

const OUTPUT = document.getElementById('c_output');
const INPUT = document.getElementById('c_input');
const PREVIEW = document.getElementById('c_preview');
const MEMORY = document.getElementById('c_memory');
var c_memory = 0;

function updateDisplay(display, e) { 
    display.value = e;
}

function updatePreview() { 
    updateDisplay(PREVIEW, c_history.join(''));
    if (c_memory == 0) {
        MEMORY.classList.remove('w-value');
    } else {
        MEMORY.classList.add('w-value');
        updateDisplay(MEMORY, 'M = ' + c_memory);
    }
}

function addDigit(self) {
    updateDisplay(INPUT, INPUT.value + self);
}

function addToExpr() {
    c_history.add(INPUT.value);
    updateDisplay(INPUT, '');
}

function addOpp(self) {
    if (INPUT.value) addToExpr();

    if (isNaN(c_history.last)) {
        c_history.replaceLast(self);
    } else { 
        c_history.add(self);
    }

    updateDisplay(OUTPUT, c_history.ansLefty);
    updatePreview();
    clearField(1);
}

function addDecimal() {
    updateDisplay(INPUT, INPUT.value.replaceAll('.', '') + '.');
}

function removeDecimals(e) { 
    let split = e.split('.');
    if (split.length > 1) {
        let last = split.pop();
        split = split.join('') + '.' + last;
    }
    return parseFloat(split);
}

function evalField() { 
    if (INPUT.value) addToExpr();
    updateDisplay(OUTPUT, c_history.ans);
    updatePreview();
    clearField(1);
    updateDisplay(INPUT, c_history.ans);
    c_history.clear();
}

function clearField(e) { 
    switch (e) {
        case 0: // Backspace
            updateDisplay(INPUT, INPUT.value.slice(0, -1));
            break;
        
        case 1: // Clear input
            updateDisplay(INPUT, "");
            break;
    
        default: // Clears Everything
            updateDisplay(INPUT, "");
            updateDisplay(OUTPUT, "");
            updateDisplay(PREVIEW, "");
            c_history.clear();
            break;
    }
}

function mem(e) {
    switch (e) {
        case 0: // MR
            updateDisplay(INPUT, INPUT.value + c_memory);
            break;
        
        case 1: // M+
            if (INPUT.value == 0) return;
            c_memory += removeDecimals(INPUT.value);
            updatePreview();
            clearField(1);
            break;
        
        case 2: // M-
            if (INPUT.value == 0) return;
            c_memory -= removeDecimals(INPUT.value);
            updatePreview();
            clearField(1);
            break;
    
        default: // MC
            c_memory = 0;
            updatePreview();
            break;
    }
}