let isDark = localStorage.getItem('pixDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('pixDark', !isDark);
    isDark = !isDark;
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gridSize = 16;
let cellSize = canvas.width / gridSize;
let tool = 'draw';
let showGrid = true;
let pixels = Array(gridSize).fill().map(() => Array(gridSize).fill('#ffffff'));

function createGrid() {
    gridSize = parseInt(document.getElementById('size').value) || 16;
    cellSize = canvas.width / gridSize;
    pixels = Array(gridSize).fill().map(() => Array(gridSize).fill('#ffffff'));
    drawPixels();
}

function drawPixels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle = pixels[y][x];
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            if (showGrid) {
                ctx.strokeStyle = '#ccc';
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function setTool(t) {
    tool = t;
}

function toggleGrid() {
    showGrid = !showGrid;
    drawPixels();
}

function clearCanvas() {
    pixels = Array(gridSize).fill().map(() => Array(gridSize).fill('#ffffff'));
    drawPixels();
}

canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    paint(x, y);
});

canvas.addEventListener('mousemove', e => {
    if (e.buttons !== 1) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    if (tool !== 'fill') paint(x, y);
});

function paint(x, y) {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    if (tool === 'fill') {
        floodFill(x, y, pixels[y][x], document.getElementById('color').value);
        drawPixels();
        return;
    }
    pixels[y][x] = tool === 'erase' ? '#ffffff' : document.getElementById('color').value;
    drawPixels();
}

function floodFill(x, y, target, replacement) {
    if (target === replacement) return;
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    if (pixels[y][x] !== target) return;
    pixels[y][x] = replacement;
    floodFill(x + 1, y, target, replacement);
    floodFill(x - 1, y, target, replacement);
    floodFill(x, y + 1, target, replacement);
    floodFill(x, y - 1, target, replacement);
}

function downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();
    link.click();
}

createGrid();