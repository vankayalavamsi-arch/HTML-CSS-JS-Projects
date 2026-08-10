let isDark = true;

function toggleTheme(btn) {
    isDark = !isDark;
    document.body.className = isDark ? '' : 'light';
    btn.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

const planets = [
    { name: 'Mercury', color: '#bdc3c7', size: 10, fact: 'Closest to the Sun' },
    { name: 'Venus', color: '#f39c12', size: 15, fact: 'Hottest planet' },
    { name: 'Earth', color: '#3498db', size: 16, fact: 'Our home' },
    { name: 'Mars', color: '#e74c3c', size: 12, fact: 'The Red Planet' },
    { name: 'Jupiter', color: '#e67e22', size: 40, fact: 'Largest planet' },
    { name: 'Saturn', color: '#f1c40f', size: 35, fact: 'Famous for rings' },
    { name: 'Uranus', color: '#1abc9c', size: 25, fact: 'Rotates on its side' },
    { name: 'Neptune', color: '#2980b9', size: 24, fact: 'Farthest planet' }
];

const maxSize = 40;

document.getElementById('system').innerHTML = planets.map((p, i) => `
    <div class="planet" style="background:${p.color};width:${p.size * 2}px;height:${p.size * 2}px;animation-delay:${i * 0.2}s" title="${p.name}"></div>
`).join('');

document.getElementById('grid').innerHTML = planets.map(p => `
    <div class="card">
        <h3><span class="dot" style="background:${p.color}"></span>${p.name}</h3>
        <p style="opacity:0.7">${p.fact}</p>
        <p style="margin-top:10px;font-size:14px;">Relative Size</p>
        <div class="chart">
            <div class="fill" style="width:${(p.size / maxSize) * 100}%;background:${p.color}"></div>
        </div>
    </div>
`).join('');