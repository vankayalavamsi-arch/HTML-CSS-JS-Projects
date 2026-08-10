let isDark = localStorage.getItem('cssDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('cssDark', !isDark);
    isDark = !isDark;
}

// Inject Keyframes
const keyframes = `
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-100px); }
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.5); }
}
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-50px); }
    75% { transform: translateX(50px); }
}
@keyframes fade {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}`;

const style = document.createElement('style');
style.innerText = keyframes;
document.head.appendChild(style);

function update() {
    const a = document.getElementById('anim').value;
    const d = document.getElementById('dur').value;
    const de = document.getElementById('del').value;
    const i = document.getElementById('iter').value;
    
    document.getElementById('durVal').innerText = d + 's';
    document.getElementById('delVal').innerText = de + 's';
    
    const css = `animation: ${a} ${d}s ease ${de}s ${i};`;
    document.getElementById('box').style.cssText = css;
    document.getElementById('codeBox').innerText = css;
}

function copyCss() {
    navigator.clipboard.writeText(document.getElementById('codeBox').innerText);
}

update();