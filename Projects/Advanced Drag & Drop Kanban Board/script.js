let isDark = localStorage.getItem('kanDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('kanDark', !isDark);
    isDark = !isDark;
}

let data = JSON.parse(localStorage.getItem('kanban')) || {
    todo: [
        { id: 1, text: 'Design UI', color: 'blue' },
        { id: 2, text: 'Setup DB', color: 'green' }
    ],
    progress: [
        { id: 3, text: 'Auth API', color: 'red' }
    ],
    done: [
        { id: 4, text: 'Requirements', color: 'blue' }
    ]
};

let draggedItem = null;

function render() {
    const cols = [
        { key: 'todo', title: 'To Do' },
        { key: 'progress', title: 'In Progress' },
        { key: 'done', title: 'Done' }
    ];

    document.getElementById('board').innerHTML = cols.map(col => `
        <div class="column"
            ondragover="event.preventDefault(); this.querySelector('.tasks').classList.add('over')"
            ondragleave="this.querySelector('.tasks').classList.remove('over')"
            ondrop="drop(event, '${col.key}'); this.querySelector('.tasks').classList.remove('over')">

            <div class="col-header">
                <span>${col.title} (${data[col.key].length})</span>
            </div>

            <div class="tasks">
                ${data[col.key].map(t => `
                    <div class="task"
                        draggable="true"
                        ondragstart="drag(event, '${col.key}', ${t.id})"
                        style="border-left-color: var(--${t.color})">
                        ${t.text}
                        <button class="del-task" onclick="delTask('${col.key}', ${t.id})">❌</button>
                    </div>
                `).join('')}
            </div>

            <input type="text"
                placeholder="+ Add task"
                id="input-${col.key}"
                onkeypress="if (event.key === 'Enter') addTask('${col.key}')">
        </div>
    `).join('');
}

function drag(e, col, id) {
    draggedItem = { col, id };
    e.dataTransfer.effectAllowed = 'move';
}

function drop(e, targetCol) {
    e.preventDefault();
    if (!draggedItem) return;

    let item = data[draggedItem.col].find(t => t.id === draggedItem.id);
    data[draggedItem.col] = data[draggedItem.col].filter(t => t.id !== draggedItem.id);
    data[targetCol].push(item);

    save();
    render();
}

function addTask(col) {
    const input = document.getElementById(`input-${col}`);
    if (!input.value) return;

    data[col].push({
        id: Date.now(),
        text: input.value,
        color: ['blue', 'green', 'red'][Math.floor(Math.random() * 3)]
    });

    input.value = '';
    save();
    render();
}

function delTask(col, id) {
    data[col] = data[col].filter(t => t.id !== id);
    save();
    render();
}

function save() {
    localStorage.setItem('kanban', JSON.stringify(data));
}

render();