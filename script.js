const menuIcon = document.getElementById("menu-icon");
const navMenu = document.getElementById("nav-menu");

menuIcon.addEventListener("click", function () {
    navMenu.classList.toggle("active");
});

const navLinks = document.querySelectorAll("#nav-menu a");

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navMenu.classList.remove("active");
    });
});


// KALKULATOR

const calcDisplay = document.getElementById("calc-display");
const calcButtons = document.querySelectorAll(".calc-buttons button");

let calcExpression = "";

function updateCalcDisplay(value) {
    calcDisplay.value = value || "0";
}

function calculateExpression() {

    if (!calcExpression) return;

    if (!/^[0-9+\-*/.() ]+$/.test(calcExpression)) {
        updateCalcDisplay("Error");
        calcExpression = "";
        return;
    }

    try {

        const result = Function("return " + calcExpression)();

        if (!Number.isFinite(result)) {
            throw new Error();
        }

        calcExpression = String(result);
        updateCalcDisplay(calcExpression);

    } catch (error) {

        calcExpression = "";
        updateCalcDisplay("Error");
    }
}

calcButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {

            calcExpression = "";
            updateCalcDisplay("0");

            return;
        }

        if (action === "equals") {

            calculateExpression();

            return;
        }

        if (value) {

            if (calcDisplay.value === "Error") {
                calcExpression = "";
            }

            calcExpression += value;

            updateCalcDisplay(calcExpression);
        }
    });
});
