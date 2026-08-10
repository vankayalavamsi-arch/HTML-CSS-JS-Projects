let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let isDark = localStorage.getItem('todoDark') === 'true';

if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('todoDark', !isDark);
    isDark = !isDark;
}

function render() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    
    let filtered = tasks;
    if (currentFilter === 'active') filtered = tasks.filter(t => !t.done);
    if (currentFilter === 'done') filtered = tasks.filter(t => t.done);

    filtered.forEach((task) => {
        const realIndex = tasks.indexOf(task);
        list.innerHTML += `
            <li class="${task.done ? 'done' : ''}">
                <span onclick="toggleDone(${realIndex})">${task.text}</span>
                <div class="actions">
                    <button onclick="editTask(${realIndex})">✏️</button>
                    <button onclick="deleteTask(${realIndex})">❌</button>
                </div>
            </li>`;
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById('taskInput');
    if (input.value.trim() === '') return;
    
    tasks.push({
        text: input.value,
        done: false
    });
    
    input.value = '';
    render();
}

function toggleDone(i) {
    tasks[i].done = !tasks[i].done;
    render();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    render();
}

function editTask(i) {
    const newText = prompt("Edit task:", tasks[i].text);
    if (newText !== null && newText.trim() !== '') {
        tasks[i].text = newText;
    }
    render();
}

function setFilter(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

render();