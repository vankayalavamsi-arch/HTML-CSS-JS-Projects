const c = document.getElementById('c');
const ctx = c.getContext('2d');

let ship = {
    x: 300,
    y: 350,
    w: 40,
    h: 20,
    hp: 100
};

let lasers = [];
let enemies = [];
let particles = [];
let score = 0;
let keys = {};
let gameOver = false;
let shootCooldown = 0; // Added proper cooldown timer

document.addEventListener('keydown', e => {
    keys[e.key] = true;
    
    // Prevent default for game keys to stop page scrolling
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', e => {
    keys[e.key] = false;
});

function spawnEnemy() {
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * 560 + 20,
            y: -20,
            w: 30,
            h: 20,
            speed: Math.random() * 2 + 1,
            hit: false // Flag to mark enemies hit by lasers
        });
    }
}

function update() {
    if (gameOver) return;

    // Handle Movement
    if (keys['ArrowLeft'] && ship.x > 20) ship.x -= 5;
    if (keys['ArrowRight'] && ship.x < 580) ship.x += 5;

    // Handle Shooting with proper cooldown
    if (shootCooldown > 0) shootCooldown--;
    if (keys[' '] && shootCooldown === 0) {
        lasers.push({
            x: ship.x,
            y: ship.y - 15,
            w: 4,
            h: 10,
            hit: false // Flag to mark lasers that hit something
        });
        shootCooldown = 15; // Set cooldown frames (approx 4 shots per second at 60fps)
    }

    // Move Lasers
    lasers.forEach(l => l.y -= 7);
    lasers = lasers.filter(l => l.y > 0 && !l.hit);

    // Move Enemies
    enemies.forEach(e => e.y += e.speed);

    // Collision Detection: Lasers vs Enemies (Safe filter method)
    enemies.forEach(e => {
        lasers.forEach(l => {
            if (!l.hit && !e.hit) {
                if (l.x > e.x - e.w / 2 && l.x < e.x + e.w / 2 && 
                    l.y < e.y + e.h / 2 && l.y > e.y - e.h / 2) {
                    
                    e.hit = true; // Mark enemy for removal
                    l.hit = true; // Mark laser for removal
                    score += 10;
                    
                    // Spawn particles
                    for (let i = 0; i < 10; i++) {
                        particles.push({
                            x: e.x,
                            y: e.y,
                            vx: (Math.random() - 0.5) * 6,
                            vy: (Math.random() - 0.5) * 6,
                            life: 30
                        });
                    }
                }
            }
        });
    });

    // Collision Detection: Enemies vs Ship
    enemies.forEach(e => {
        if (!e.hit && e.y > ship.y - 10 && e.x > ship.x - 20 && e.x < ship.x + 20) {
            ship.hp -= 20;
            e.hit = true; // Mark enemy for removal
            if (ship.hp <= 0) {
                ship.hp = 0;
                gameOver = true;
            }
        }
    });

    // Remove hit enemies and enemies that passed the screen
    enemies = enemies.filter(e => !e.hit && e.y < 420);

    // Update Particles
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
    });
    particles = particles.filter(p => p.life > 0);

    spawnEnemy();

    // Update DOM
    document.getElementById('score').innerText = score;
    
    // Add a minimum width of 5% so the health bar doesn't completely disappear at 0
    document.getElementById('hp').style.width = Math.max(ship.hp, 5) + '%';
    
    if (ship.hp > 50) {
        document.getElementById('hp').style.background = '#00ff88';
    } else if (ship.hp > 20) {
        document.getElementById('hp').style.background = '#f1c40f';
    } else {
        document.getElementById('hp').style.background = '#ff4444';
    }
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    // Draw Ship
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y - 15);
    ctx.lineTo(ship.x - 20, ship.y + 10);
    ctx.lineTo(ship.x + 20, ship.y + 10);
    ctx.fill();

    // Draw Lasers
    ctx.fillStyle = '#fff';
    lasers.forEach(l => ctx.fillRect(l.x - l.w / 2, l.y, l.w, l.h));

    // Draw Enemies
    ctx.fillStyle = '#ff4444';
    enemies.forEach(e => {
        ctx.fillRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h);
    });

    // Draw Particles
    ctx.fillStyle = '#f1c40f';
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Draw Game Over Screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#ff4444';
        ctx.font = '40px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', c.width / 2, c.height / 2);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();