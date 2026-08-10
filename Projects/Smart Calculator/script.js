const display = document.getElementById('display');
const history = document.getElementById('history');

// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('calcDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark;
    document.body.classList.toggle('dark');
    localStorage.setItem('calcDark', isDark);
}

function appendChar(char) {
    // Prevent multiple dots in the same number
    if (char === '.') {
        const parts = display.value.split(/[\+\-\*\/\%]/);
        const currentPart = parts[parts.length - 1];
        if (currentPart.includes('.')) return;
    }
    display.value += char;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function formatResult(num) {
    // Fix floating point precision issues (e.g., 0.1 + 0.2 = 0.30000000000000004)
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return parseFloat(num.toFixed(10)).toString();
}

function calculate() {
    if (display.value === '') return;
    
    // Security: Only allow numbers, math operators, spaces, and decimals
    if (!/^[\d\+\-\*\/\%\.\s]+$/.test(display.value)) {
        display.value = 'Error';
        return;
    }

    try {
        // Safer alternative to eval()
        let result = new Function('return ' + display.value)();
        
        if (typeof result !== 'number' || !isFinite(result)) {
            display.value = 'Error';
            return;
        }

        history.innerHTML += `<div>${display.value} = ${formatResult(result)}</div>`;
        display.value = formatResult(result);
        
        // Auto-scroll history to the bottom
        history.scrollTop = history.scrollHeight;
    } catch (error) {
        display.value = 'Error';
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Prevent default behavior for keys we want to handle (like '/' which focuses browser search)
    if (['+', '-', '*', '/', '%', '.', 'Enter', 'Backspace', 'Escape'].includes(e.key) || 
        (e.key >= '0' && e.key <= '9')) {
        e.preventDefault();
    }

    if (e.key >= '0' && e.key <= '9') appendChar(e.key);
    else if (['+', '-', '*', '/', '%', '.'].includes(e.key)) appendChar(e.key);
    else if (e.key === 'Enter') calculate();
    else if (e.key === 'Backspace') deleteLast();
    else if (e.key === 'Escape') clearDisplay();
});