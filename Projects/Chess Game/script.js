const pieces = {
    r: '♜',
    n: '♞',
    b: '♝',
    q: '♛',
    k: '♚',
    p: '♟',
    R: '♖',
    N: '♘',
    B: '♗',
    Q: '♕',
    K: '♔',
    P: '♙'
};

let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let turn = 'white';
let selected = null;
let wCap = [];
let bCap = [];
let hist = [];

function render() {
    const b = document.getElementById('board');
    b.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `sq ${(r + c) % 2 === 0 ? 'l' : 'd'}`;
            if (selected && selected.r === r && selected.c === c) sq.classList.add('selected');
            sq.innerText = pieces[board[r][c]] || '';
            sq.onclick = () => handleClick(r, c);
            b.appendChild(sq);
        }
    }
}

function handleClick(r, c) {
    const piece = board[r][c];
    const isWhite = piece === piece.toUpperCase() && piece !== '';
    const isBlack = piece === piece.toLowerCase() && piece !== '';

    if (selected) {
        if ((isWhite && turn === 'white') || (isBlack && turn === 'black')) {
            selected = { r, c };
            render();
            return;
        }
        
        // Capture logic
        if (piece) {
            if (turn === 'white') wCap.push(piece);
            else bCap.push(piece);
        }
        
        // Move logic
        board[r][c] = board[selected.r][selected.c];
        board[selected.r][selected.c] = '';
        
        // Log history
        hist.push(`${pieces[board[r][c]]} ${String.fromCharCode(97 + selected.c)}${8 - selected.r} -> ${String.fromCharCode(97 + c)}${8 - r}`);
        
        // Switch turn
        turn = turn === 'white' ? 'black' : 'white';
        document.getElementById('turn').innerText = turn;
        document.getElementById('hist').innerText = hist.join('\n');
        document.getElementById('wCap').innerText = wCap.map(p => pieces[p]).join('');
        document.getElementById('bCap').innerText = bCap.map(p => pieces[p]).join('');
        
        selected = null;
        render();
    } else {
        if ((turn === 'white' && isWhite) || (turn === 'black' && isBlack)) {
            selected = { r, c };
            render();
        }
    }
}

render();