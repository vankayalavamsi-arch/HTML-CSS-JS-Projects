let isDark = localStorage.getItem('tlDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('tlDark', !isDark);
    isDark = !isDark;
}

let events = JSON.parse(localStorage.getItem('tlEvents')) || [
    { id: 1, date: '2022-01-15', title: 'Started New Job', cat: 'work', desc: 'Joined a tech startup.' },
    { id: 2, date: '2022-06-20', title: 'Summer Vacation', cat: 'personal', desc: 'Traveled to Japan.' }
];

let filter = 'all';

function setFilter(f, btn) {
    filter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

function addEvent() {
    const t = document.getElementById('title').value;
    if (!t) return alert('Enter title');
    
    events.push({
        id: Date.now(),
        date: document.getElementById('date').value,
        title: t,
        cat: document.getElementById('cat').value,
        desc: ''
    });
    
    localStorage.setItem('tlEvents', JSON.stringify(events));
    document.getElementById('title').value = '';
    render();
}

function deleteEvent(id) {
    events = events.filter(e => e.id !== id);
    localStorage.setItem('tlEvents', JSON.stringify(events));
    render();
}

function render() {
    let filtered = filter === 'all' ? events : events.filter(e => e.cat === filter);
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    document.getElementById('timeline').innerHTML = filtered.map((e, i) => {
        let side = i % 2 === 0 ? 'left' : 'right';
        let color = e.cat === 'work' ? 'var(--work)' : 'var(--personal)';
        return `
            <div class="event ${side}">
                <div class="card" style="border-top:5px solid ${color}">
                    <button class="del-btn" onclick="deleteEvent(${e.id})">❌</button>
                    <div class="date">${e.date}</div>
                    <h3>${e.title}</h3>
                    <p>${e.desc || 'No description'}</p>
                </div>
            </div>
        `;
    }).join('');
}

render();