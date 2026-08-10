let isDark = localStorage.getItem('finDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('finDark', !isDark);
    isDark = !isDark;
}

const data = [
    { n: 'Freelance', c: 'Income', d: 'Oct 12', a: 1500, t: 'inc' },
    { n: 'Rent', c: 'Housing', d: 'Oct 1', a: 800, t: 'exp' },
    { n: 'Groceries', c: 'Food', d: 'Oct 5', a: 120, t: 'exp' },
    { n: 'Stocks', c: 'Investment', d: 'Oct 10', a: 300, t: 'exp' }
];

document.getElementById('tbody').innerHTML = data.map(d => `
    <tr>
        <td>${d.n}</td>
        <td>${d.c}</td>
        <td>${d.d}</td>
        <td class="${d.t}">${d.t === 'inc' ? '+' : '-'}$${d.a}</td>
    </tr>
`).join('');

function animate(id, target) {
    let el = document.getElementById(id);
    let start = 0;
    let inc = target / 50;
    let timer = setInterval(() => {
        start += inc;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.innerText = `$${Math.floor(start)}`;
    }, 30);
}

animate('c1', 12400);
animate('c2', 5200);
animate('c3', 3800);

setTimeout(() => document.getElementById('goal').style.width = '68%', 100);