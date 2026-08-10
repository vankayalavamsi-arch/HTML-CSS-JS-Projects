// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('homeDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('homeDark', isDark); // Save new state
}

const data = {
    living: [
        { n: 'Light', i: '💡', on: true, type: 'toggle' },
        { n: 'AC', i: '❄️', on: false, type: 'toggle' },
        { n: 'TV', i: '📺', on: true, type: 'toggle' },
        { n: 'Speaker', i: '🔊', on: false, type: 'toggle' }
    ],
    bed: [
        { n: 'Light', i: '💡', on: false, type: 'toggle' },
        { n: 'Fan', i: '🌀', on: true, type: 'toggle' },
        { n: 'AC', i: '❄️', on: false, type: 'temp' }
    ],
    kitch: [
        { n: 'Light', i: '💡', on: true, type: 'toggle' },
        { n: 'Fridge', i: '🧊', on: true, type: 'toggle' },
        { n: 'Oven', i: '🍳', on: false, type: 'temp' }
    ]
};

let currentRoom = 'living';

function setRoom(room, btn) {
    currentRoom = room;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    render();
}

function toggleDevice(i) {
    data[currentRoom][i].on = !data[currentRoom][i].on;
    render();
}

// New function to handle temperature slider updates
function updateTemp(val, index) {
    const tempText = document.getElementById(`temp-${index}`);
    if (tempText) {
        tempText.innerText = `${val}°C`;
    }
}

function render() {
    document.getElementById('devices').innerHTML = data[currentRoom].map((d, i) => `
        <div class="device">
            <div class="device-icon">${d.i}</div>
            <h3>${d.n}</h3>
            <p>${d.on ? 'Active' : 'Inactive'}</p>
            <div class="toggle ${d.on ? 'on' : ''}" onclick="toggleDevice(${i})"></div>
            ${d.type === 'temp' 
                ? `<input type="range" class="slider" min="16" max="30" value="22" oninput="updateTemp(this.value, ${i})">
                   <p class="temp-text" id="temp-${i}">22°C</p>` 
                : ''}
        </div>
    `).join('');
}

// Initial render
render();