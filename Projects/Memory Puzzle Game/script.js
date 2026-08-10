let isDark = localStorage.getItem('memDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('memDark', !isDark);
    isDark = !isDark;
}

const emojis = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🥝', '🍌', '🍉', '🥭', '🍍', '🥥', '🥑', '🍆', '🥕', '🌽', '🌶️'];
let cards = [];
let flipped = [];
let moves = 0;
let matched = 0;
let timer;
let startInterval;

function initGame(size) {
    clearInterval(startInterval);
    moves = 0;
    matched = 0;
    flipped = [];
    document.getElementById('moves').innerText = 0;
    document.getElementById('time').innerText = 0;
    
    let pairs = (size * size) / 2;
    let selected = emojis.slice(0, pairs);
    cards = [...selected, ...selected].sort(() => Math.random() - 0.5);
    
    document.getElementById('grid').style.gridTemplateColumns = `repeat(${size}, 80px)`;
    render();
    
    let sec = 0;
    startInterval = setInterval(() => {
        sec++;
        document.getElementById('time').innerText = sec;
    }, 1000);
}

function render() {
    document.getElementById('grid').innerHTML = cards.map((c, i) => `
        <div class="card" onclick="flipCard(${i})">
            <div class="front">?</div>
            <div class="back">${c}</div>
        </div>
    `).join('');
}

function flipCard(i) {
    if (flipped.length >= 2 || flipped.includes(i) || cards[i] === '') return;
    
    document.querySelectorAll('.card')[i].classList.add('flipped');
    flipped.push(i);
    
    if (flipped.length === 2) {
        moves++;
        document.getElementById('moves').innerText = moves;
        
        let [a, b] = flipped;
        if (cards[a] === cards[b]) {
            matched++;
            cards[a] = '';
            cards[b] = '';
            flipped = [];
            if (matched === cards.length / 2) {
                setTimeout(() => alert('You Won!'), 500);
            }
        } else {
            setTimeout(() => {
                document.querySelectorAll('.card')[a].classList.remove('flipped');
                document.querySelectorAll('.card')[b].classList.remove('flipped');
                flipped = [];
            }, 800);
        }
    }
}

initGame(4);