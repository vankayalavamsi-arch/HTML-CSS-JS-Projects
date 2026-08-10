// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('vkDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('vkDark', isDark); // Save new state
}

let caps = false;
let shift = false;

const rows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Space']
];

function render() {
    const keyboardEl = document.getElementById('keyboard');
    
    keyboardEl.innerHTML = rows.map(row => {
        const keysHtml = row.map(k => {
            let label = k;
            let cls = 'key';
            
            // Set specific labels and widths for special keys
            if (k === 'Backspace') { label = '⌫'; cls += ' wide'; }
            if (k === 'Tab' || k === 'Enter') { cls += ' wide'; }
            if (k === 'Caps') { label = caps ? '⬆️ ON' : '⬆️ Caps'; cls += ' wider'; }
            if (k === 'Shift') { label = '⇧ Shift'; cls += ' wider'; }
            if (k === 'Space') { label = ''; cls += ' space'; }
            
            // Handle uppercase/lowercase logic cleanly
            if (k.length === 1) {
                if (caps || shift) {
                    label = k.toUpperCase();
                } else {
                    label = k.toLowerCase();
                }
            }
            
            // Return properly formatted, valid HTML string
            return `<button class="${cls}" data-key="${k}">${label}</button>`;
        }).join('');
        
        return `<div class="row">${keysHtml}</div>`;
    }).join('');

    // Re-attach event listeners after rendering new DOM elements
    document.querySelectorAll('.key').forEach(btn => {
        btn.addEventListener('click', () => handleKey(btn.dataset.key));
    });
}

function handleKey(k) {
    const screen = document.getElementById('screen');
    
    if (k === 'Backspace') {
        screen.value = screen.value.slice(0, -1);
    } else if (k === 'Space') {
        screen.value += ' ';
    } else if (k === 'Enter') {
        screen.value += '\n';
    } else if (k === 'Tab') {
        screen.value += '    ';
    } else if (k === 'Caps') {
        caps = !caps;
        render();
    } else if (k === 'Shift') {
        shift = !shift;
        render();
    } else {
        screen.value += shift ? k.toUpperCase() : k.toLowerCase();
        if (shift) {
            shift = false;
            render(); // Turn off shift visual after one press
        }
    }
}

// Physical keyboard support & visual highlighting
document.addEventListener('keydown', e => {
    // Prevent default for Tab so it doesn't jump out of the textarea
    if (e.key === 'Tab') e.preventDefault();

    let k = e.key;
    if (k === ' ') k = 'Space';
    
    const btn = document.querySelector(`[data-key="${k}"]`);
    if (btn) {
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 100);
    }
    
    // Trigger virtual key logic
    if (k.length === 1) handleKey(k);
    else if (k === 'Backspace') handleKey('Backspace');
    else if (k === 'Enter') handleKey('Enter');
    else if (k === 'Tab') handleKey('Tab');
});

// Initial render
render();