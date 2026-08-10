let tasks = JSON.parse(localStorage.getItem('pTasks')) || [];
let isDark = localStorage.getItem('prodDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('prodDark', !isDark);
    isDark = !isDark;
}

let time = 1500;
let interval;
let running = false;
const circ = 691.15;

function updateUI() {
    document.getElementById('time').innerText = `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
    document.getElementById('prog').style.strokeDashoffset = circ - (time / 1500) * circ;
}

function startTimer() {
    if (running) return;
    running = true;
    interval = setInterval(() => {
        if (time <= 0) {
            clearInterval(interval);
            running = false;
            alert('Break time!');
            return;
        }
        time--;
        updateUI();
    }, 1000);
}

function resetTimer() {
    clearInterval(interval);
    running = false;
    time = 1500;
    updateUI();
}

function addTask() {
    const t = document.getElementById('taskIn').value;
    if (!t) return;
    tasks.push({ text: t, done: false });
    localStorage.setItem('pTasks', JSON.stringify(tasks));
    document.getElementById('taskIn').value = '';
    renderTasks();
}

function toggleTask(i) {
    tasks[i].done = !tasks[i].done;
    localStorage.setItem('pTasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    document.getElementById('tasks').innerHTML = tasks.map((t, i) => `
        <div class="task">
            <span class="${t.done ? 'done' : ''}" onclick="toggleTask(${i})">${t.text}</span>
        </div>
    `).join('');
}

renderTasks();
updateUI();