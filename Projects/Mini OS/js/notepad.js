import { FS } from './filesystem.js';
import { Notify } from './utils.js';
import { Storage } from './storage.js';

export function openNotepad(filePath) {
    const name = filePath ? filePath.split('/').pop() : 'Untitled';
    const content = filePath ? (FS.read(filePath) || '') : '';
    const winId = WM.create({ appId: 'notepad', title: 'Notepad - ' + name, width: 600, height: 400 });
    const body = document.getElementById(winId + '_body');
    
    body.style.display = 'flex'; body.style.flexDirection = 'column';
    body.innerHTML = `
        <div style="padding:5px; border-bottom:1px solid var(--border-color); display:flex; gap:5px;">
            <button class="settings-btn" id="${winId}_save">Save</button>
            <button class="settings-btn" id="${winId}_saveas">Save As</button>
        </div>
        <textarea id="${winId}_text" style="flex:1; background:var(--bg-primary); color:var(--text-primary); border:none; padding:10px; resize:none; outline:none; font-family:monospace; font-size:14px;">${content}</textarea>
        <div id="${winId}_status" style="padding:4px 10px; border-top:1px solid var(--border-color); font-size:11px; color:var(--text-secondary);"></div>`;

    const ta = document.getElementById(winId + '_text');
    const status = document.getElementById(winId + '_status');
    let currentPath = filePath;

    function updateStatus() {
        const words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        status.textContent = `Words: ${words} | Chars: ${ta.value.length}`;
    }
    ta.oninput = updateStatus;
    updateStatus();

    document.getElementById(winId + '_save').onclick = () => {
        if (!currentPath) return saveAs();
        FS.write(currentPath, ta.value);
        Notify.show('Saved!', 'success');
        addRecent(currentPath);
    };

    document.getElementById(winId + '_saveas').onclick = saveAs;

    function saveAs() {
        const n = prompt('Save as (e.g. /Documents/file.txt):', currentPath || '/Documents/untitled.txt');
        if (n) {
            FS.write(n, ta.value);
            currentPath = n;
            WM.setTitle(winId, 'Notepad - ' + n.split('/').pop());
            Notify.show('Saved!', 'success');
            addRecent(n);
        }
    }

    ta.onkeydown = (e) => { if (e.ctrlKey && e.key === 's') { e.preventDefault(); document.getElementById(winId + '_save').click(); } };
}

function addRecent(path) {
    let recent = Storage.get('recent', []).filter(r => r.path !== path);
    recent.unshift({ name: path.split('/').pop(), path });
    Storage.set('recent', recent.slice(0, 5));
}