// Main Application Entry Point
import { Storage } from './storage.js';
import { FS } from './filesystem.js';
import { Theme } from './theme.js';
import { Wallpaper } from './wallpaper.js';
import { Notify, Sound } from './utils.js';
import { WM } from './windowManager.js';
import { initDesktop, ContextMenu } from './desktop.js';
import { openExplorer } from './explorer.js';
import { openNotepad } from './notepad.js';
import { openCalculator } from './calculator.js';
import { openCalendar } from './calendar.js';
import { openSettings } from './settings.js';
import { openTerminal } from './terminal.js';

// App Launcher Router
function launchApp(id, opts) {
    if (id === 'explorer') openExplorer(opts);
    else if (id === 'notepad') openNotepad(opts);
    else if (id === 'calculator') openCalculator();
    else if (id === 'calendar') openCalendar();
    else if (id === 'settings') openSettings();
    else if (id === 'terminal') openTerminal();
    else if (id === 'recycle') openExplorer('/Recycle Bin');
}

// Make available globally for cross-module calls (like explorer opening notepad)
window.launchApp = launchApp;
window.WM = WM;

// --- Boot Sequence ---
function boot() {
    const progress = document.getElementById('boot-progress');
    const msg = document.getElementById('boot-msg');
    const steps = ['Loading kernel...', 'Mounting disk...', 'Starting UI...'];
    let i = 0;
    
    const interval = setInterval(() => {
        if (i < steps.length) {
            msg.textContent = steps[i];
            progress.style.width = ((i + 1) / steps.length * 100) + '%';
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                Sound.play('startup');
                document.getElementById('boot-screen').classList.add('hidden');
                setTimeout(() => {
                    document.getElementById('boot-screen').style.display = 'none';
                    checkLogin();
                }, 800);
            }, 300);
        }
    }, 400);
}

// --- Login Logic ---
function checkLogin() {
    if (Storage.get('remember', false)) return enterDesktop();
    showLogin();
}

function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-error').textContent = '';
    document.getElementById('login-pass').focus();
}

function attemptLogin() {
    const pass = document.getElementById('login-pass').value;
    const realPass = Storage.get('password', '1234');
    if (pass === realPass) {
        if (document.getElementById('login-remember').checked) Storage.set('remember', true);
        Sound.play('click');
        document.getElementById('login-screen').classList.add('hidden');
        setTimeout(() => {
            document.getElementById('login-screen').style.display = 'none';
            enterDesktop();
        }, 500);
    } else {
        document.getElementById('login-error').textContent = 'Wrong password';
        Sound.play('error');
    }
}

function enterDesktop() {
    document.getElementById('desktop').classList.add('active');
    initDesktop();
    initTaskbar();
    initClock();
}

// --- Taskbar & Start Menu ---
function initTaskbar() {
    // Start Menu App Grid
    const apps = [
        { id: 'explorer', name: 'Explorer', icon: '📁' },
        { id: 'notepad', name: 'Notepad', icon: '📝' },
        { id: 'calculator', name: 'Calculator', icon: '🔢' },
        { id: 'calendar', name: 'Calendar', icon: '📅' },
        { id: 'terminal', name: 'Terminal', icon: '>_' },
        { id: 'settings', name: 'Settings', icon: '⚙️' }
    ];
    
    const pinned = document.getElementById('start-pinned');
    pinned.innerHTML = apps.map(a => `<div class="start-app-item" data-id="${a.id}"><span class="start-app-icon">${a.icon}</span>${a.name}</div>`).join('');
    pinned.onclick = (e) => { const item = e.target.closest('.start-app-item'); if(item) { launchApp(item.dataset.id); document.getElementById('start-menu').classList.remove('visible'); } };

    // Recent Files
    updateRecent();

    // Start Toggle
    document.getElementById('start-btn').onclick = (e) => { e.stopPropagation(); document.getElementById('start-menu').classList.toggle('visible'); };
    
    // Search
    document.getElementById('search-bar').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        if (!q) return;
        const results = FS.search(q);
        if (results.length > 0) {
            ContextMenu.show(e.target.getBoundingClientRect().left, e.target.getBoundingClientRect().bottom + 5, 
                results.slice(0, 5).map(r => ({ label: r.name, action: () => launchApp(r.isDir ? 'explorer' : 'notepad', r.path) }))
            );
        }
    };

    // System Tray
    document.getElementById('theme-toggle-btn').onclick = () => Theme.toggle();
    document.getElementById('clock-btn').onclick = (e) => { e.stopPropagation(); document.getElementById('calendar-popup').classList.toggle('visible'); renderCalendarPopup(); };

    // Start Menu Footer
    document.getElementById('start-lock').onclick = () => { document.getElementById('start-menu').classList.remove('visible'); OS.lock(); };
    document.getElementById('start-logout').onclick = () => { document.getElementById('start-menu').classList.remove('visible'); OS.logout(); };
    document.getElementById('start-shutdown').onclick = () => { document.getElementById('start-menu').classList.remove('visible'); OS.shutdown(); };

    // Close menus on outside click
    document.getElementById('desktop').onclick = (e) => {
        if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) document.getElementById('start-menu').classList.remove('visible');
        if (!e.target.closest('#calendar-popup') && !e.target.closest('#clock-btn')) document.getElementById('calendar-popup').classList.remove('visible');
        if (!e.target.closest('#context-menu')) ContextMenu.hide();
    };
}

function updateRecent() {
    const recent = Storage.get('recent', []);
    const list = document.getElementById('start-recent-list');
    list.innerHTML = recent.length ? recent.map(r => `<div style="padding:6px; font-size:12px; cursor:pointer; border-radius:4px; margin-bottom:2px;" data-p="${r.path}">📄 ${r.name}</div>`).join('') : '<div style="font-size:12px;color:var(--text-secondary);padding:5px;">No recent files</div>';
    list.querySelectorAll('[data-p]').forEach(el => el.onclick = () => { launchApp('notepad', el.dataset.p); document.getElementById('start-menu').classList.remove('visible'); });
}

// --- Clock ---
function initClock() {
    function update() {
        const now = new Date();
        document.getElementById('taskbar-time').textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        document.getElementById('taskbar-date').textContent = now.toLocaleDateString([], {month:'short', day:'numeric'});
        document.getElementById('login-time').textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
        document.getElementById('login-date').textContent = now.toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric'});
    }
    update();
    setInterval(update, 1000);
}

// --- Calendar Popup ---
function renderCalendarPopup() {
    const pop = document.getElementById('calendar-popup');
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m+1, 0).getDate();
    let html = `<div class="cal-pop-header"><span>${now.toLocaleDateString('en-US', {month:'long', year:'numeric'})}</span></div><div class="cal-pop-grid">`;
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => html += `<div class="cal-pop-day" style="font-weight:bold;font-size:10px;">${d}</div>`);
    for(let i=0; i<first; i++) html += `<div class="cal-pop-day other">${new Date(y, m, -i).getDate()}</div>`;
    for(let i=1; i<=days; i++) {
        const isToday = i === now.getDate();
        html += `<div class="cal-pop-day ${isToday?'today':''}">${i}</div>`;
    }
    html += '</div>';
    pop.innerHTML = html;
}

// --- OS Controls ---
const OS = {
    lock() { WM.closeAll(); document.getElementById('desktop').classList.remove('active'); Storage.set('remember', false); showLogin(); Notify.show('Locked', 'info'); },
    logout() { WM.closeAll(); document.getElementById('desktop').classList.remove('active'); Storage.set('remember', false); showLogin(); Notify.show('Logged out', 'info'); },
    shutdown() {
        Sound.play('startup'); // low freq buzz simulating shutdown
        WM.closeAll();
        document.getElementById('desktop').style.transition = 'opacity 1s';
        document.getElementById('desktop').style.opacity = '0';
        setTimeout(() => { document.getElementById('desktop').classList.remove('active'); document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#888;font-family:sans-serif;">System is off. Refresh to restart.</div>'; }, 1000);
    }
};
window.OS = OS;

// --- Event Bindings ---
document.getElementById('login-btn').onclick = attemptLogin;
document.getElementById('login-pass').onkeydown = (e) => { if(e.key === 'Enter') attemptLogin(); };
document.getElementById('login-shutdown').onclick = OS.shutdown;
document.getElementById('login-restart').onclick = () => location.reload();

// --- Init on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    FS.init();
    Theme.init();
    Wallpaper.init();
    boot();
});