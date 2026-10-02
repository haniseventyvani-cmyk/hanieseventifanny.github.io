const menuIcon = document.getElementById("menu-icon");
const navMenu = document.getElementById("nav-menu");

menuIcon.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("active"));
});

// KALKULATOR
const display = document.getElementById("calc-display");
const historyDisplay = document.getElementById("calc-history");
const buttons = document.querySelectorAll(".calc-buttons button");

let expression = "";
let justCalculated = false;

function show(value) {
    display.value = value || "0";
}

function formatResult(value) {
    if (!Number.isFinite(value)) throw new Error();
    return String(Math.round((value + Number.EPSILON) * 1e12) / 1e12);
}

function calculate() {
    if (!expression) return;

    let safeExpression = expression.replace(/×/g, "*").replace(/÷/g, "/");

    if (!/^[0-9+\-*/.%() ]+$/.test(safeExpression)) {
        show("Error");
        expression = "";
        return;
    }

    try {
        const result = Function('"use strict"; return (' + safeExpression + ')')();
        const answer = formatResult(result);

        historyDisplay.textContent = expression + " =";
        expression = answer;
        show(answer);
        justCalculated = true;
    } catch {
        show("Error");
        expression = "";
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            expression = "";
            historyDisplay.textContent = "";
            justCalculated = false;
            show("0");
            return;
        }

        if (action === "delete") {
            if (justCalculated) {
                expression = "";
                justCalculated = false;
            } else {
                expression = expression.slice(0, -1);
            }
            show(expression);
            return;
        }

        if (action === "equals") {
            calculate();
            return;
        }

        if (!value) return;

        const isOperator = ["+", "-", "*", "/", "%"].includes(value);

        if (justCalculated && !isOperator) {
            expression = "";
            historyDisplay.textContent = "";
        }
        justCalculated = false;

        if (display.value === "Error") expression = "";

        const last = expression.slice(-1);

        if (isOperator) {
            if (!expression && value !== "-") return;
            if (["+", "-", "*", "/", "%"].includes(last)) {
                expression = expression.slice(0, -1) + value;
            } else {
                expression += value;
            }
        } else if (value === ".") {
            const currentNumber = expression.split(/[+\-*/%]/).pop();
            if (currentNumber.includes(".")) return;
            expression += currentNumber ? "." : "0.";
        } else {
            expression += value;
        }

        show(expression);
    });
});

// Keyboard support
document.addEventListener("keydown", event => {
    const key = event.key;

    if (/^[0-9]$/.test(key) || ["+", "-", "*", "/", ".", "%"].includes(key)) {
        const button = [...buttons].find(btn => btn.dataset.value === key);
        if (button) button.click();
    } else if (key === "Enter" || key === "=") {
        document.querySelector('[data-action="equals"]').click();
    } else if (key === "Escape") {
        document.querySelector('[data-action="clear"]').click();
    } else if (key === "Backspace") {
        document.querySelector('[data-action="delete"]').click();
    }
});
