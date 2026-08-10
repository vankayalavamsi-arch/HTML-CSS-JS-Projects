let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editIndex = -1;
let isDark = localStorage.getItem('notesDark') === 'true';

if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('notesDark', !isDark);
    isDark = !isDark;
}

function openModal(index = -1) {
    editIndex = index;
    if (index >= 0) {
        document.getElementById('noteTitle').value = notes[index].title;
        document.getElementById('noteBody').value = notes[index].body;
        document.getElementById('noteCat').value = notes[index].category;
    } else {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteBody').value = '';
        document.getElementById('noteCat').value = 'Work';
    }
    document.getElementById('noteModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
}

function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const body = document.getElementById('noteBody').value.trim();
    const category = document.getElementById('noteCat').value;
    
    if (!title || !body) return alert("Title and body are required!");

    const noteObj = {
        title,
        body,
        category,
        date: new Date().toLocaleDateString()
    };

    if (editIndex >= 0) {
        notes[editIndex] = noteObj;
    } else {
        notes.unshift(noteObj);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    closeModal();
    renderNotes();
}

function deleteNote(index) {
    if (confirm("Delete this note?")) {
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    }
}

function renderNotes() {
    const grid = document.getElementById('notesGrid');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const filter = document.getElementById('filterCat').value;

    let filtered = notes.filter(n => {
        const matchSearch = n.title.toLowerCase().includes(search) || n.body.toLowerCase().includes(search);
        const matchCat = filter === 'all' || n.category === filter;
        return matchSearch && matchCat;
    });

    grid.innerHTML = filtered.map((n) => {
        const realIndex = notes.indexOf(n);
        return `
            <div class="note">
                <div class="note-header">
                    <h3>${n.title}</h3>
                    <div class="actions">
                        <button onclick="openModal(${realIndex})">✏️</button>
                        <button onclick="deleteNote(${realIndex})">❌</button>
                    </div>
                </div>
                <p>${n.body}</p>
                <div class="note-footer">
                    <span>${n.date}</span>
                    <span class="tag">${n.category}</span>
                </div>
            </div>
        `;
    }).join('');
}

renderNotes();