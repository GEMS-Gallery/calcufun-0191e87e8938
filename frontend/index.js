import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentValue = '';
let operator = '';
let previousValue = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value >= '0' && value <= '9' || value === '.') {
            currentValue += value;
            updateDisplay();
        } else if (['+', '-', '*', '/'].includes(value)) {
            if (currentValue !== '') {
                if (previousValue !== '') {
                    calculate();
                }
                previousValue = currentValue;
                currentValue = '';
                operator = value;
            }
        } else if (value === '=') {
            if (currentValue !== '' && previousValue !== '') {
                calculate();
            }
        } else if (value === 'C') {
            clear();
        }
    });
});

function updateDisplay() {
    display.value = currentValue;
}

async function calculate() {
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result;

    try {
        switch (operator) {
            case '+':
                result = await backend.add(prev, current);
                break;
            case '-':
                result = await backend.subtract(prev, current);
                break;
            case '*':
                result = await backend.multiply(prev, current);
                break;
            case '/':
                const divisionResult = await backend.divide(prev, current);
                if (divisionResult === null) {
                    throw new Error('Division by zero');
                }
                result = divisionResult;
                break;
        }

        currentValue = result.toString();
        previousValue = '';
        operator = '';
        updateDisplay();
    } catch (error) {
        currentValue = 'Error';
        updateDisplay();
        console.error('Calculation error:', error);
    }
}

function clear() {
    currentValue = '';
    previousValue = '';
    operator = '';
    updateDisplay();
}

updateDisplay();