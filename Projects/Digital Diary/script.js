let isDark = localStorage.getItem('diaryDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('diaryDark', !isDark);
    isDark = !isDark;
}

let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
let activeId = null;
let currentMood = 'happy';

document.getElementById('date').valueAsDate = new Date();

function newEntry() {
    activeId = null;
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('text').value = '';
    setMood('happy');
    renderList();
}

function setMood(m) {
    currentMood = m;
    document.querySelectorAll('.mood').forEach(el => el.classList.toggle('active', el.dataset.m === m));
}

function renderList() {
    const moodEmojis = {
        happy: '😊',
        sad: '😢',
        angry: '🤬',
        love: '🥰'
    };

    document.getElementById('list').innerHTML = entries.map(e => `
        <div class="entry ${e.id === activeId ? 'active' : ''}" onclick="loadEntry('${e.id}')">
            <h3>${e.date} ${moodEmojis[e.mood] || '😊'}</h3>
            <p>${e.text.substring(0, 50)}...</p>
        </div>
    `).join('');
}

function loadEntry(id) {
    const e = entries.find(e => e.id === id);
    if (!e) return;
    activeId = id;
    document.getElementById('date').value = e.date;
    document.getElementById('text').value = e.text;
    setMood(e.mood);
    renderList();
}

function saveEntry() {
    const date = document.getElementById('date').value;
    const text = document.getElementById('text').value;
    if (!text) return alert("Write something!");

    if (activeId) {
        const e = entries.find(e => e.id === activeId);
        e.date = date;
        e.text = text;
        e.mood = currentMood;
    } else {
        entries.unshift({
            id: Date.now().toString(),
            date,
            text,
            mood: currentMood
        });
        activeId = entries[0].id;
    }
    
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
    renderList();
}

function deleteEntry() {
    if (!activeId) return;
    if (confirm('Delete?')) {
        entries = entries.filter(e => e.id !== activeId);
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        newEntry();
    }
}

renderList();
if (entries.length) loadEntry(entries[0].id);