let isDark = localStorage.getItem('pwdDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('pwdDark', !isDark);
    isDark = !isDark;
}

let history = JSON.parse(localStorage.getItem('pwdHistory')) || [];

function generatePwd() {
    let len = document.getElementById('length').value;
    let chars = '';
    
    if (document.getElementById('upper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('lower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('numbers').checked) chars += '0123456789';
    if (document.getElementById('symbols').checked) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (chars === '') return alert('Please select at least one option.');

    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById('password').value = pwd;

    // Strength Calc
    let strength = 0;
    if (len >= 8) strength++;
    if (len >= 12) strength++;
    if (len >= 20) strength++;
    if (document.getElementById('upper').checked) strength++;
    if (document.getElementById('symbols').checked) strength++;

    let fill = document.getElementById('strength-fill');
    if (strength <= 2) {
        fill.style.width = '33%';
        fill.style.background = 'var(--danger)';
    } else if (strength <= 4) {
        fill.style.width = '66%';
        fill.style.background = 'var(--warning)';
    } else {
        fill.style.width = '100%';
        fill.style.background = 'var(--success)';
    }

    history.unshift(pwd);
    if (history.length > 5) history.pop();
    localStorage.setItem('pwdHistory', JSON.stringify(history));
    renderHistory();
}

function copyPwd() {
    navigator.clipboard.writeText(document.getElementById('password').value);
    alert('Copied to clipboard!');
}

function renderHistory() {
    document.getElementById('history-list').innerHTML = history.map(p => 
        `<div class="history-item" onclick="navigator.clipboard.writeText('${p}')">
            <span>${p}</span><span>📋</span>
        </div>`
    ).join('');
}

renderHistory();
generatePwd();