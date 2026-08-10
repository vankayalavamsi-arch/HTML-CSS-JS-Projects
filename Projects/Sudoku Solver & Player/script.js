// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('sudDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('sudDark', isDark); // Save new state
}

// Simple starting puzzle (0 represents empty cells)
const initialPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Deep copy the puzzle to the active grid
let grid = initialPuzzle.map(r => [...r]);
let selectedCell = null;

function render() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = grid.map((row, i) => 
        row.map((cellVal, j) => {
            // Check if this cell was part of the original starting puzzle
            const isLocked = initialPuzzle[i][j] !== 0;
            const isSelected = selectedCell && selectedCell.r === i && selectedCell.c === j;
            
            let classes = 'cell';
            if (isLocked) classes += ' locked';
            if (isSelected) classes += ' selected';
            
            return `<div class="${classes}" onclick="selectCell(${i}, ${j})">${cellVal || ''}</div>`;
        }).join('')
    ).join('');

    // Render Numpad
    document.getElementById('numpad').innerHTML = Array.from({ length: 9 }, (_, i) => 
        `<button class="num" onclick="placeNum(${i + 1})">${i + 1}</button>`
    ).join('');
}

function selectCell(r, c) {
    const isLocked = initialPuzzle[r][c] !== 0;
    // Don't allow selecting locked cells
    if (isLocked) return;
    
    // Toggle selection if clicking the same cell again
    if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
        selectedCell = null;
    } else {
        selectedCell = { r, c };
    }
    render();
}

function placeNum(n) {
    if (!selectedCell) return;
    
    const { r, c } = selectedCell;
    // Prevent overriding locked cells just in case
    if (initialPuzzle[r][c] !== 0) return; 
    
    grid[r][c] = n;
    render();
}

function resetBoard() {
    // Reset to the original puzzle instead of a completely blank board
    grid = initialPuzzle.map(r => [...r]);
    selectedCell = null;
    render();
}

function isValid(b, r, c, n) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (b[r][i] === n || b[i][c] === n) return false;
    }
    
    // Check 3x3 box (Fixed the Mathc syntax error from original code)
    let br = Math.floor(r / 3) * 3;
    let bc = Math.floor(c / 3) * 3;
    
    for (let i = br; i < br + 3; i++) {
        for (let j = bc; j < bc + 3; j++) {
            if (b[i][j] === n) return false;
        }
    }
    return true;
}

function solve(b) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (b[r][c] === 0) {
                for (let n = 1; n <= 9; n++) {
                    if (isValid(b, r, c, n)) {
                        b[r][c] = n;
                        if (solve(b)) return true;
                        b[r][c] = 0; // Backtrack
                    }
                }
                return false; // Trigger backtracking
            }
        }
    }
    return true; // Solved successfully
}

function solveSudoku() {
    if (solve(grid)) {
        selectedCell = null;
        render();
    } else {
        alert("No solution exists!");
    }
}

// Initial render
render();