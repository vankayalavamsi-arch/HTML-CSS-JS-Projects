let isDark = localStorage.getItem('fileDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('fileDark', !isDark);
    isDark = !isDark;
}

let fs = {
    root: [
        {
            name: 'Documents',
            type: 'folder',
            children: [
                { name: 'resume.pdf', type: 'file' },
                { name: 'notes.txt', type: 'file' }
            ]
        },
        {
            name: 'Pictures',
            type: 'folder',
            children: [
                { name: 'pic.png', type: 'file' }
            ]
        },
        { name: 'index.html', type: 'file' },
        { name: 'music.mp3', type: 'file' }
    ]
};

let currentPath = ['root'];

function getIcon(type, name) {
    if (type === 'folder') return '📁';
    if (name.endsWith('.pdf')) return '📕';
    if (name.endsWith('.html')) return '🌐';
    if (name.endsWith('.js')) return '📜';
    if (name.endsWith('.png') || name.endsWith('.jpg')) return '🖼️';
    if (name.endsWith('.mp3')) return '🎵';
    return '📄';
}

function navigate(path) {
    currentPath = path === 'root' ? ['root'] : [...currentPath.slice(0, currentPath.indexOf(path) + 1)];
    render();
}

function render() {
    let current = fs;
    currentPath.forEach(p => current = Array.isArray(current) ? current.find(i => i.name === p) : current.children);
    
    const items = Array.isArray(current) ? current : current.children;

    document.getElementById('breadcrumbs').innerHTML = currentPath.map((p, i) =>
        `<span onclick="navigate('${p}')">${p}</span>${i < currentPath.length - 1 ? '/' : ''}`
    ).join('');

    if (!items) return;
    
    document.getElementById('grid').innerHTML = items.map((item, i) => `
        <div class="item" ondblclick="${item.type === 'folder' ? `openFolder('${item.name}')` : ''}">
            <div class="icon">${getIcon(item.type, item.name)}</div>
            <div class="name">${item.name}</div>
            <button class="del" onclick="event.stopPropagation();deleteItem(${i})">❌</button>
        </div>
    `).join('');
}

function openFolder(name) {
    currentPath.push(name);
    render();
}

function createItem(type) {
    const name = document.getElementById('newItem').value;
    if (!name) return;
    
    let current = fs;
    currentPath.forEach(p => current = Array.isArray(current) ? current.find(i => i.name === p) : current.children);
    
    const arr = Array.isArray(current) ? current : current.children;
    
    if (type === 'folder') {
        arr.push({ name, type: 'folder', children: [] });
    } else {
        arr.push({ name, type: 'file' });
    }
    
    document.getElementById('newItem').value = '';
    render();
}

function deleteItem(index) {
    let current = fs;
    currentPath.forEach(p => current = Array.isArray(current) ? current.find(i => i.name === p) : current.children);
    
    const arr = Array.isArray(current) ? current : current.children;
    arr.splice(index, 1);
    render();
}

render();