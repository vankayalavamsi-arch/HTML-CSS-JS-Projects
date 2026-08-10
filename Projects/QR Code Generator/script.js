let isDark = localStorage.getItem('qrDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('qrDark', !isDark);
    isDark = !isDark;
}

let qr = null;

function generateQR() {
    const text = document.getElementById('text').value;
    const color = document.getElementById('color').value;
    const size = parseInt(document.getElementById('size').value);
    const qrDiv = document.getElementById('qrcode');

    qrDiv.innerHTML = '';
    if (text.trim() === '') return;

    qr = new QRCode(qrDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: color,
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function downloadQR() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) return alert('Generate a QR code first');
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = canvas.toDataURL();
    link.click();
}

generateQR();