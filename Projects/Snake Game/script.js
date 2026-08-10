// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('snkDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('snkDark', isDark); // Save new state
}

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let snake, food, dx, dy, score, gameLoop, speed;

document.getElementById('high').innerText = localStorage.getItem('snakeHigh') || 0;

function startGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    speed = 100; // Reset speed on new game
    document.getElementById('score').innerText = score;
    document.getElementById('overlay').style.display = 'none';
    
    placeFood();
    clearInterval(gameLoop);
    gameLoop = setInterval(update, speed);
}

function placeFood() {
    let newFood;
    let isOnSnake;
    
    // Keep generating coordinates until the food is NOT on the snake
    do {
        newFood = {
            x: Math.floor(Math.random() * grid),
            y: Math.floor(Math.random() * grid)
        };
        isOnSnake = snake.some(s => s.x === newFood.x && s.y === newFood.y);
    } while (isOnSnake);
    
    food = newFood;
}

function setDir(x, y) {
    // Prevent reversing directly into yourself
    if (dx === -x && dy === -y) return;
    dx = x;
    dy = y;
}

function update() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // Check wall collisions
    if (head.x < 0 || head.x >= grid || head.y < 0 || head.y >= grid) {
        return gameOver();
    }

    // Check self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        return gameOver();
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        placeFood();
        
        clearInterval(gameLoop);
        // Prevent speed from going below 30ms (which freezes/crashes the browser)
        speed = Math.max(30, speed - 2); 
        gameLoop = setInterval(update, speed);
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
    
    draw();
}

function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('overlay').style.display = 'flex';
    
    if (score > (parseInt(localStorage.getItem('snakeHigh')) || 0)) {
        localStorage.setItem('snakeHigh', score);
        document.getElementById('high').innerText = score;
    }
}

function draw() {
    // Clear canvas with background color
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card').trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    snake.forEach(s => ctx.fillRect(s.x * grid, s.y * grid, grid - 2, grid - 2));
    
    // Draw food
    ctx.fillStyle = '#d63031';
    ctx.fillRect(food.x * grid, food.y * grid, grid - 2, grid - 2);
}

// Keyboard controls
document.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent page scrolling while playing
    }

    if (e.key === 'ArrowUp') setDir(0, -1);
    if (e.key === 'ArrowDown') setDir(0, 1);
    if (e.key === 'ArrowLeft') setDir(-1, 0);
    if (e.key === 'ArrowRight') setDir(1, 0);
});

// Start initial game
startGame();