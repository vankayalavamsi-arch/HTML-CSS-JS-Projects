// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('whiteDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('whiteDark', isDark); // Save new state
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let eraser = false;

function resize() {
    // FIX: Save the current drawing before resizing so we don't lose the artwork
    const tempImage = new Image();
    const dataUrl = canvas.toDataURL();
    
    // Resize canvas (this clears it)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70;
    
    // Fill background with current theme color
    ctx.fillStyle = isDark ? '#121212' : '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restore the previous drawing
    tempImage.onload = () => {
        ctx.drawImage(tempImage, 0, 0);
    };
    tempImage.src = dataUrl;
}

window.addEventListener('resize', resize);
resize();

// Mouse Events
canvas.addEventListener('mousedown', startPaint);
canvas.addEventListener('mouseup', stopPaint);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', stopPaint);

// Touch Events
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    startPaint(e.touches[0]);
});
canvas.addEventListener('touchend', stopPaint);
canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    draw(e.touches[0]);
});

function startPaint(e) {
    painting = true;
    draw(e);
}

function stopPaint() {
    painting = false;
    ctx.beginPath(); // Reset the drawing path
}

function draw(e) {
    if (!painting) return;
    
    ctx.lineWidth = document.getElementById('size').value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // If eraser is on, draw with the background color
    if (eraser) {
        ctx.strokeStyle = isDark ? '#121212' : '#fff';
    } else {
        ctx.strokeStyle = document.getElementById('color').value;
    }
    
    ctx.lineTo(e.clientX, e.clientY - canvas.getBoundingClientRect().top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY - canvas.getBoundingClientRect().top);
}

function toggleEraser() {
    eraser = !eraser;
    const btn = document.getElementById('eraserBtn');
    
    // Visual feedback for button
    btn.style.background = eraser ? 'var(--accent)' : 'var(--border)';
    btn.style.color = eraser ? '#fff' : 'var(--text)';
    
    // Visual feedback for cursor
    if (eraser) {
        canvas.classList.add('eraser-active');
    } else {
        canvas.classList.remove('eraser-active');
    }
}

function clearCanvas() {
    ctx.fillStyle = isDark ? '#121212' : '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
}