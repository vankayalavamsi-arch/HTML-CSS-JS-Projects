let isDark = false;

function toggleDark() {
    isDark = !isDark;
    document.body.style.filter = isDark ? 'invert(1) hue-rotate(180deg)' : 'none';
}

function switchTab(type, el) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('html').style.display = type === 'html' ? 'block' : 'none';
    document.getElementById('css').style.display = type === 'css' ? 'block' : 'none';
    document.getElementById('js').style.display = type === 'js' ? 'block' : 'none';
}

function runCode() {
    const html = document.getElementById('html').value;
    const css = document.getElementById('css').value;
    const js = document.getElementById('js').value;
    
    const doc = `<html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
    document.getElementById('preview').srcdoc = doc;
}

runCode();