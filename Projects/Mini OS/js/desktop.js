import { FS } from './filesystem.js';
import { Notify } from './utils.js';
import { Storage } from './storage.js';

// Context Menu Logic
export const ContextMenu = {
    show(x, y, items) {
        const menu = document.getElementById('context-menu');
        menu.innerHTML = items.map(i => `<div class="ctx-item" style="padding:8px 12px; font-size:13px; cursor:pointer; border-radius:4px;">${i.label}</div>`).join('');
        menu.style.left = x + 'px'; menu.style.top = y + 'px'; menu.style.display = 'block';
        menu.querySelectorAll('.ctx-item').forEach((el, idx) => {
            el.onmouseover = () => el.style.background = 'var(--hover-bg)';
            el.onmouseout = () => el.style.background = 'none';
            el.onclick = () => { menu.style.display = 'none'; items[idx].action(); };
        });
    },
    hide() { document.getElementById('context-menu').style.display = 'none'; }
};

export function initDesktop() {
    const container = document.getElementById('desktop-icons');
    const icons = [
        { name: 'Explorer', icon: '📁', app: 'explorer' },
        { name: 'Notepad', icon: '📝', app: 'notepad' },
        { name: 'Calculator', icon: '🔢', app: 'calculator' },
        { name: 'Calendar', icon: '📅', app: 'calendar' },
        { name: 'Terminal', icon: '>_', app: 'terminal' },
        { name: 'Settings', icon: '⚙️', app: 'settings' },
        { name: 'Recycle Bin', icon: '🗑️', app: 'recycle' }
    ];

    function renderIcons() {
        container.innerHTML = '';
        // Add static apps
        icons.forEach(ic => {
            const el = createIconEl(ic.name, ic.icon, () => launchApp(ic.app));
            container.appendChild(el);
        });
        // Add files from Desktop folder
        FS.list('/Desktop').forEach(f => {
            const icon = f.isDir ? '📁' : '📄';
            const action = f.isDir ? () => launchApp('explorer', f.path) : () => launchApp('notepad', f.path);
            container.appendChild(createIconEl(f.name, icon, action, f.path));
        });
    }

    function createIconEl(name, icon, onClick, filePath) {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        el.innerHTML = `<span class="desktop-icon-img">${icon}</span><span class="desktop-icon-name">${name}</span>`;
        el.ondblclick = onClick;
        el.onclick = (e) => {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            el.classList.add('selected');
            e.stopPropagation();
        };
        el.oncontextmenu = (e) => {
            e.preventDefault(); e.stopPropagation();
            el.click();
            ContextMenu.show(e.clientX, e.clientY, [
                { label: 'Open', action: onClick },
                { label: 'Delete', action: () => { if(filePath) { FS.move(filePath, '/Recycle Bin'); renderIcons(); Notify.show('Deleted','success'); } } }
            ]);
        };
        return el;
    }

    renderIcons();

    // Desktop right click
    document.getElementById('desktop-wallpaper').oncontextmenu = (e) => {
        e.preventDefault();
        ContextMenu.show(e.clientX, e.clientY, [
            { label: 'New Folder', action: () => { FS.create('/Desktop/New Folder', 'dir'); renderIcons(); Notify.show('Created','success'); } },
            { label: 'New Text File', action: () => { FS.create('/Desktop/New File.txt', 'file', ''); renderIcons(); Notify.show('Created','success'); } },
            { label: 'Refresh', action: renderIcons }
        ]);
    };

    // Deselect icons
    document.getElementById('desktop').onclick = (e) => {
        if (e.target.id === 'desktop-wallpaper' || e.target.id === 'desktop-icons') {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            ContextMenu.hide();
        }
    };
}