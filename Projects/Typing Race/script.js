// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('typeDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark;
    document.body.classList.toggle('dark');
    localStorage.setItem('typeDark', isDark);
}

const texts = [
    "The quick brown fox jumps over the lazy dog near the riverbank.", 
    "Programming is the art of telling a computer what to do.", 
    "Every great developer you know got there by solving problems they were unqualified to solve.", 
    "Code is like humor. When you have to explain it, it is bad."
];

let text;
let charIndex = 0;
let mistakes = 0;
let startTime;
let timerInterval;
let isPlaying = false;

// Track which specific indices have already been counted as mistakes
let mistakeIndices = new Set();

function resetGame() {
    text = texts[Math.floor(Math.random() * texts.length)];
    charIndex = 0;
    mistakes = 0;
    isPlaying = false;
    mistakeIndices.clear(); // Reset mistake tracker
    
    const input = document.getElementById('typeInput');
    input.value = '';
    input.disabled = false;
    input.focus();
    
    document.getElementById('wpm').innerText = '0';
    document.getElementById('acc').innerText = '100';
    document.getElementById('time').innerText = '60';
    
    clearInterval(timerInterval);
    renderText();
}

function renderText() {
    const inputValue = document.getElementById('typeInput').value;
    let html = '';
    
    for (let i = 0; i < text.length; i++) {
        if (i < charIndex) {
            // Check if the typed character matches the text
            const isCorrect = inputValue[i] === text[i];
            html += `<span class="${isCorrect ? 'correct' : 'wrong'}">${text[i]}</span>`;
        } else if (i === charIndex) {
            html += `<span class="current">${text[i]}</span>`;
        } else {
            html += text[i];
        }
    }
    
    document.getElementById('textBox').innerHTML = html;
}

document.getElementById('typeInput').addEventListener('input', e => {
    if (!isPlaying) {
        isPlaying = true;
        startTime = Date.now();
        timerInterval = setInterval(() => {
            let t = 60 - Math.floor((Date.now() - startTime) / 1000);
            document.getElementById('time').innerText = t;
            if (t <= 0) endGame();
        }, 1000);
    }
    
    const inputValue = e.target.value;
    charIndex = inputValue.length;
    
    // Only count a mistake once per index to prevent infinite mistake counting
    if (charIndex > 0 && inputValue[charIndex - 1] !== text[charIndex - 1]) {
        if (!mistakeIndices.has(charIndex - 1)) {
            mistakeIndices.add(charIndex - 1);
            mistakes++;
        }
    }
    
    // Calculate Time Elapsed safely (prevent division by zero)
    const timeElapsedMs = Date.now() - startTime;
    const timeElapsedMin = timeElapsedMs > 0 ? timeElapsedMs / 60000 : 0.001; 
    
    // Calculate WPM (standard: 1 word = 5 characters)
    let wpm = Math.round((charIndex / 5) / timeElapsedMin);
    
    // Calculate Accuracy (handles backspacing correctly because mistakeIndices is a Set)
    let acc = charIndex === 0 ? 100 : Math.round(((charIndex - mistakes) / charIndex) * 100);
    
    document.getElementById('wpm').innerText = Math.max(0, wpm);
    document.getElementById('acc').innerText = Math.max(0, acc);
    
    renderText();
    
    // Check if typing is finished
    if (charIndex === text.length) {
        endGame();
    }
});

function endGame() {
    document.getElementById('typeInput').disabled = true;
    clearInterval(timerInterval);
    alert(`Done! WPM: ${document.getElementById('wpm').innerText} | Accuracy: ${document.getElementById('acc').innerText}%`);
}

// Start initial game
resetGame();