const c = document.getElementById('c');
const ctx = c.getContext('2d');

let bird, pipes, score, frames, gameOver, started;
const gravity = 0.5;
const jump = -8;

function reset() {
    bird = {
        x: 50,
        y: 250,
        v: 0,
        r: 15
    };
    pipes = [];
    score = 0;
    frames = 0;
    gameOver = false;
    started = false;
    loop();
}

function loop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(loop);
}

function update() {
    if (!started) return;
    
    bird.v += gravity;
    bird.y += bird.v;
    
    if (frames % 100 === 0) {
        pipes.push({
            x: c.width,
            y: Math.random() * (c.height - 150) + 50,
            w: 50,
            gap: 120
        });
    }
    
    pipes.forEach(p => {
        p.x -= 3;
        if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + p.w && (bird.y - bird.r < p.y || bird.y + bird.r > p.y + p.gap)) {
            gameOver = true;
        }
        if (p.x + p.w === bird.x) score++;
    });
    
    pipes = pipes.filter(p => p.x > -p.w);
    
    if (bird.y > c.height || bird.y < 0) {
        gameOver = true;
    }
    
    frames++;
}

function draw() {
    const cs = getComputedStyle(document.documentElement);
    
    // Sky
    ctx.fillStyle = cs.getPropertyValue('--sky');
    ctx.fillRect(0, 0, c.width, c.height);
    
    // Pipes
    ctx.fillStyle = cs.getPropertyValue('--pipe');
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, p.w, p.y);
        ctx.fillRect(p.x, p.y + p.gap, p.w, c.height - p.y - p.gap);
    });
    
    // Bird
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fill();
    
    // Score
    ctx.fillStyle = '#fff';
    ctx.font = '40px sans-serif';
    ctx.fillText(score, 10, 50);
    
    // Game Over Screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#fff';
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', c.width / 2, c.height / 2);
        ctx.font = '20px sans-serif';
        ctx.fillText('Click to Restart', c.width / 2, c.height / 2 + 40);
        ctx.textAlign = 'left';
    }
    
    // Start Screen
    if (!started) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#fff';
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Click to Start', c.width / 2, c.height / 2);
        ctx.textAlign = 'left';
    }
    
    // Ground
    ctx.fillStyle = cs.getPropertyValue('--ground');
    ctx.fillRect(0, c.height - 20, c.width, 20);
}

c.addEventListener('click', () => {
    if (gameOver) {
        reset();
        return;
    }
    if (!started) started = true;
    bird.v = jump;
});

reset();