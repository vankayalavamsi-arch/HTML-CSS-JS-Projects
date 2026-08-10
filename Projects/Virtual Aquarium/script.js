const types = [
    { emoji: '🐠', name: 'Clownfish', age: '2 years' },
    { emoji: '🐟', name: 'Goldfish', age: '1 year' },
    { emoji: '🐡', name: 'Pufferfish', age: '3 years' },
    { emoji: '🦈', name: 'Shark', age: '5 years' }
];

let isNight = false;
let detailsTimeout; // Track the timeout so we can clear it if clicking rapidly

function toggleTime(e) {
    isNight = !isNight;
    document.getElementById('tank').classList.toggle('night');
    // Explicitly use the passed event object instead of the implicit global `event`
    e.target.innerText = isNight ? '☀️ Day' : '🌙 Night';
}

function createBubbles() {
    for (let i = 0; i < 15; i++) {
        const b = document.createElement('div');
        b.className = 'bubble';
        b.style.left = Math.random() * 100 + '%';
        b.style.animationDuration = (Math.random() * 5 + 5) + 's';
        b.style.animationDelay = (Math.random() * 5) + 's';
        document.getElementById('tank').appendChild(b);
    }
}

function addFish() {
    const f = types[Math.floor(Math.random() * types.length)];
    const fish = document.createElement('div');
    fish.className = 'fish';
    
    // Wrap emoji in a span so we can scale it on hover without breaking the left-animation
    const isRight = Math.random() > 0.5;
    fish.innerHTML = `<span style="display:inline-block; transform: scaleX(${isRight ? 1 : -1})">${f.emoji}</span>`;
    
    fish.style.top = (Math.random() * 70 + 5) + '%';
    fish.style.animationDuration = (Math.random() * 10 + 5) + 's';
    
    fish.onclick = (e) => {
        e.stopPropagation();
        
        // Clear existing timeout so popup doesn't disappear instantly on multi-click
        clearTimeout(detailsTimeout);
        
        const detailsEl = document.getElementById('details');
        detailsEl.style.display = 'block';
        document.getElementById('dName').innerText = f.name;
        document.getElementById('dAge').innerText = f.age;
        
        // Set new timeout
        detailsTimeout = setTimeout(() => {
            detailsEl.style.display = 'none';
        }, 3000); // Increased to 3 seconds for better readability
    };
    
    document.getElementById('tank').appendChild(fish);
}

// Initialize aquarium
createBubbles();
for (let i = 0; i < 5; i++) addFish();