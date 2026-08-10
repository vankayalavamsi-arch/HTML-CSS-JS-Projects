let txs = JSON.parse(localStorage.getItem('txs')) || [];
let isDark = localStorage.getItem('expDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('expDark', !isDark);
    isDark = !isDark;
}

function addTx(type) {
    const desc = document.getElementById('desc').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (!desc || !amount) return alert("Fill all fields");
    
    txs.push({
        desc,
        amount,
        type,
        id: Date.now()
    });
    
    localStorage.setItem('txs', JSON.stringify(txs));
    updateUI();
    
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
}

function updateUI() {
    const inc = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const exp = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    
    document.getElementById('balance').innerText = `$${inc - exp}`;
    document.getElementById('income').innerText = `$${inc}`;
    document.getElementById('expenses').innerText = `$${exp}`;
    
    const total = inc + exp;
    const expP = total === 0 ? 50 : (exp / total) * 100;
    document.getElementById('pie').style.background = `conic-gradient(var(--green) 0% ${100 - expP}%, var(--red) ${100 - expP}% 100%)`;
    
    document.getElementById('list').innerHTML = txs.map(t => `
        <div class="item">
            <span>${t.desc}</span>
            <span class="${t.type}">${t.type === 'income' ? '+' : '-'}$${t.amount}</span>
        </div>
    `).join('');
}

updateUI();