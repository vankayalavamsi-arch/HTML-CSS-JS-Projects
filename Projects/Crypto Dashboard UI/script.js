let isDark = localStorage.getItem('cryptoDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('cryptoDark', !isDark);
    isDark = !isDark;
}

const cryptos = [
    { name: 'Bitcoin', sym: 'BTC', price: 43250, change: 2.4, fav: false },
    { name: 'Ethereum', sym: 'ETH', price: 2280, change: -1.2, fav: true },
    { name: 'Solana', sym: 'SOL', price: 98.5, change: 5.1, fav: false },
    { name: 'Cardano', sym: 'ADA', price: 0.45, change: -0.8, fav: false },
    { name: 'Polkadot', sym: 'DOT', price: 7.2, change: 1.1, fav: true },
    { name: 'Avalanche', sym: 'AVAX', price: 35.4, change: 3.2, fav: false }
];

function render() {
    document.getElementById('grid').innerHTML = cryptos.map((c, i) => {
        let bars = '';
        for (let j = 0; j < 10; j++) {
            bars += `<div class="bar" style="height:${Math.random() * 100}%;background:var(${c.change > 0 ? '--green' : '--red'})"></div>`;
        }
        return `
            <div class="card">
                <div class="icon">${c.sym.charAt(0)}</div>
                <div class="info">
                    <h3>${c.name} (${c.sym})</h3>
                    <h2>$${c.price.toLocaleString()}</h2>
                </div>
                <div class="sparkline">${bars}</div>
                <span class="change ${c.change > 0 ? 'up' : 'down'}">${c.change > 0 ? '+' : ''}${c.change}%</span>
                <button class="heart" onclick="cryptos[${i}].fav=!cryptos[${i}].fav;render()">${c.fav ? '❤️' : '🤍'}</button>
            </div>
        `;
    }).join('');
}

render();