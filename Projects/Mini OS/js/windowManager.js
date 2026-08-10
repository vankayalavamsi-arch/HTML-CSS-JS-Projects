import { Storage } from './storage.js';
import { Sound } from './utils.js';

export const WM = {
    windows: {},
    zTop: 100,
    activeId: null,
    dragState: null,
    resizeState: null,

    create(opts) {
        const id = 'win_' + Date.now();
        const el = document.createElement('div');
        el.className = 'app-window focused';
        el.id = id;
        
        // Get saved size/pos or use defaults
        const saved = Storage.get('winpos_' + opts.appId, {});
        const w = opts.width || saved.w || 600;
        const h = opts.height || saved.h || 400;
        const x = saved.x || (window.innerWidth / 2 - w / 2);
        const y = saved.y || (window.innerHeight / 2 - h / 2 - 20);

        el.style.cssText = `left:${x}px; top:${y}px; width:${w}px; height:${h}px; z-index:${++this.zTop};`;
        
        el.innerHTML = `
            <div class="win-header" data-wid="${id}">
                <span class="win-title">${opts.title}</span>
                <div class="win-controls">
                    <button class="min-btn" title="Minimize">_</button>
                    <button class="max-btn" title="Maximize">O</button>
                    <button class="close-btn" title="Close">X</button>
                </div>
            </div>
            <div class="win-body" id="${id}_body"></div>
            <div class="win-resize win-resize-r"></div>
            <div class="win-resize win-resize-b"></div>
            <div class="win-resize win-resize-br"></div>
        `;

        document.getElementById('windows-container').appendChild(el);
        
        this.windows[id] = { id, appId: opts.appId, title: opts.title, el, maximized: false, minimized: false, prevRect: null };
        this.focus(id);
        this.updateTaskbar();
        Sound.play('click');
        return id;
    },

    focus(id) {
        if (!this.windows[id]) return;
        document.querySelectorAll('.app-window').forEach(w => w.classList.remove('focused'));
        this.windows[id].el.classList.add('focused');
        this.windows[id].el.style.zIndex = ++this.zTop;
        this.activeId = id;
        this.updateTaskbar();
    },

    close(id) {
        const win = this.windows[id];
        if (!win) return;
        // Save position
        if (!win.maximized) {
            Storage.set('winpos_' + win.appId, { x: win.el.offsetLeft, y: win.el.offsetTop, w: win.el.offsetWidth, h: win.el.offsetHeight });
        }
        win.el.remove();
        delete this.windows[id];
        this.updateTaskbar();
    },

    minimize(id) {
        const win = this.windows[id];
        if (!win) return;
        win.minimized = true;
        win.el.style.display = 'none';
        this.updateTaskbar();
    },

    restore(id) {
        const win = this.windows[id];
        if (!win) return;
        win.minimized = false;
        win.el.style.display = 'flex';
        this.focus(id);
        this.updateTaskbar();
    },

    toggleMax(id) {
        const win = this.windows[id];
        if (!win) return;
        if (win.maximized) {
            if (win.prevRect) {
                win.el.style.left = win.prevRect.x + 'px';
                win.el.style.top = win.prevRect.y + 'px';
                win.el.style.width = win.prevRect.w + 'px';
                win.el.style.height = win.prevRect.h + 'px';
            }
            win.el.classList.remove('maximized');
            win.maximized = false;
        } else {
            win.prevRect = { x: win.el.offsetLeft, y: win.el.offsetTop, w: win.el.offsetWidth, h: win.el.offsetHeight };
            win.el.classList.add('maximized');
            win.maximized = true;
        }
        this.focus(id);
    },

    setTitle(id, title) {
        if (this.windows[id]) {
            this.windows[id].title = title;
            this.windows[id].el.querySelector('.win-title').textContent = title;
            this.updateTaskbar();
        }
    },

    updateTaskbar() {
        const bar = document.getElementById('taskbar-apps');
        bar.innerHTML = '';
        Object.values(this.windows).forEach(w => {
            const btn = document.createElement('button');
            btn.className = 'taskbar-app' + (this.activeId === w.id && !w.minimized ? ' active' : '');
            btn.textContent = w.title;
            btn.onclick = () => {
                if (w.minimized) this.restore(w.id);
                else if (this.activeId === w.id) this.minimize(w.id);
                else this.focus(w.id);
            };
            bar.appendChild(btn);
        });
    },

    closeAll() { Object.keys(this.windows).forEach(id => this.close(id)); }
};

// Global Mouse Events for Drag & Resize
document.addEventListener('mousemove', (e) => {
    if (WM.dragState) {
        const d = WM.dragState;
        d.el.style.left = (d.startX + e.clientX - d.mouseX) + 'px';
        d.el.style.top = Math.max(0, d.startY + e.clientY - d.mouseY) + 'px';
    }
    if (WM.resizeState) {
        const r = WM.resizeState;
        r.el.style.width = Math.max(300, r.startW + e.clientX - r.mouseX) + 'px';
        r.el.style.height = Math.max(200, r.startH + e.clientY - r.mouseY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    WM.dragState = null;
    WM.resizeState = null;
});

// Delegation for window controls, drag, and resize
document.addEventListener('mousedown', (e) => {
    // Controls
    if (e.target.classList.contains('close-btn')) { WM.close(e.target.closest('.app-window').id); return; }
    if (e.target.classList.contains('min-btn')) { WM.minimize(e.target.closest('.app-window').id); return; }
    if (e.target.classList.contains('max-btn')) { WM.toggleMax(e.target.closest('.app-window').id); return; }
    
    // Drag
    if (e.target.closest('.win-header') && !e.target.closest('.win-controls')) {
        const el = e.target.closest('.app-window');
        const win = WM.windows[el.id];
        if (win && !win.maximized) {
            WM.dragState = { el, startX: el.offsetLeft, startY: el.offsetTop, mouseX: e.clientX, mouseY: e.clientY };
            WM.focus(el.id);
        }
        return;
    }

    // Resize
    if (e.target.classList.contains('win-resize')) {
        const el = e.target.closest('.app-window');
        WM.resizeState = { el, startW: el.offsetWidth, startH: el.offsetHeight, mouseX: e.clientX, mouseY: e.clientY };
        WM.focus(el.id);
        return;
    }

    // Focus
    if (e.target.closest('.app-window')) WM.focus(e.target.closest('.app-window').id);
});

// Double click to maximize
document.addEventListener('dblclick', (e) => {
    if (e.target.closest('.win-header') && !e.target.closest('.win-controls')) {
        WM.toggleMax(e.target.closest('.app-window').id);
    }
});