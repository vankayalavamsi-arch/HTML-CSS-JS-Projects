// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('stockDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('stockDark', isDark); // Save new state
}

const stocks = [
    { n: 'Apple', p: 178.2, c: 1.5, v: 85 },
    { n: 'Tesla', p: 245.5, c: -2.1, v: 120 },
    { n: 'Microsoft', p: 378.9, c: 0.8, v: 60 },
    { n: 'Amazon', p: 145.2, c: -0.5, v: 90 },
    { n: 'Google', p: 141.8, c: 2.3, v: 70 },
    { n: 'Meta', p: 505.1, c: -1.2, v: 110 }
];

let currentFilter = 'all';

function filter(f, btn) {
    currentFilter = f;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    render();
}

function toggleStar(btn) {
    btn.innerText = btn.innerText === '☆' ? '★' : '☆';
}

function render() {
    let data = stocks;
    if (currentFilter === 'gainers') data = stocks.filter(s => s.c > 0);
    if (currentFilter === 'losers') data = stocks.filter(s => s.c < 0);
    
    document.getElementById('tbody').innerHTML = data.map(s => `
        <tr>
            <td class="company-name">${s.n}</td>
            <td>$${s.p}</td>
            <td style="color: var('${s.c > 0 ? '--green' : '--red'}')">${s.c > 0 ? '+' : ''}${s.c}%</td>
            <td class="vol-cell">
                <div class="vol-bar" style="width: ${s.v}%"></div>
            </td>
            <td>
                <button class="btn-star" onclick="toggleStar(this)">☆</button>
            </td>
        </tr>
    `).join('');
}

// Initial render
render();