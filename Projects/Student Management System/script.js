// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('stuDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('stuDark', isDark); // Save new state
}

// Load students from localStorage, provide a default fallback
let students = JSON.parse(localStorage.getItem('students')) || [
    { 
        id: '1', // Using strings for IDs prevents JS precision loss
        name: 'Alice Johnson', 
        age: 20, 
        course: 'Computer Science', 
        email: 'alice@mail.com' 
    }
];

let editId = null;

function submitStudent() {
    const obj = {
        // Convert to string to prevent integer precision loss in HTML onclick attributes
        id: editId || String(Date.now()), 
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        course: document.getElementById('course').value,
        email: document.getElementById('email').value
    };
    
    if (!obj.name || !obj.age || !obj.email) {
        return alert('Fill all fields');
    }
    
    if (editId) {
        students = students.map(s => s.id === editId ? obj : s);
        editId = null;
        document.getElementById('subBtn').innerText = 'Add Student';
    } else {
        students.push(obj);
    }
    
    saveAndRender();
    
    // Clear form
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('email').value = '';
}

function editStudent(id) {
    const s = students.find(s => s.id === id);
    if (!s) return; // Safety check
    
    editId = id;
    document.getElementById('name').value = s.name;
    document.getElementById('age').value = s.age;
    document.getElementById('course').value = s.course;
    document.getElementById('email').value = s.email;
    document.getElementById('subBtn').innerText = 'Update Student';
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteStudent(id) {
    if (confirm('Delete this student?')) {
        students = students.filter(s => s.id !== id);
        saveAndRender();
    }
}

function renderTable() {
    const q = document.getElementById('search').value.toLowerCase();
    let filtered = students.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.course.toLowerCase().includes(q)
    );
    
    document.getElementById('tbody').innerHTML = filtered.map(s => `
        <tr>
            <td class="student-name">${s.name}</td>
            <td>${s.age}</td>
            <td>${s.course}</td>
            <td>${s.email}</td>
            <td>
                <button class="edit-btn" onclick="editStudent('${s.id}')">✏️</button>
                <button class="edit-btn" onclick="deleteStudent('${s.id}')">❌</button>
            </td>
        </tr>
    `).join('');
}

// Helper to save data and update the table
function saveAndRender() {
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
}

// Initial render
renderTable();