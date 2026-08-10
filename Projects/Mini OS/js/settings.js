import { Theme } from './theme.js';
import { Wallpaper } from './wallpaper.js';
import { Storage } from './storage.js';
import { Notify } from './utils.js';

export function openSettings() {
    const winId = WM.create({ appId: 'settings', title: 'Settings', width: 600, height: 400 });
    const body = document.getElementById(winId + '_body');
    let section = 'appearance';

    render();

    function render() {
        body.innerHTML = `<div class="settings-layout">
            <div class="settings-nav">
                <div class="settings-nav-item ${section==='appearance'?'active':''}" data-s="appearance">Appearance</div>
                <div class="settings-nav-item ${section==='wallpaper'?'active':''}" data-s="wallpaper">Wallpaper</div>
                <div class="settings-nav-item ${section==='storage'?'active':''}" data-s="storage">Storage</div>
                <div class="settings-nav-item ${section==='about'?'active':''}" data-s="about">About</div>
            </div>
            <div class="settings-content" id="${winId}_sec"></div>
        </div>`;

        body.querySelectorAll('.settings-nav-item').forEach(el => el.onclick = () => { section = el.dataset.s; render(); });
        
        const sec = document.getElementById(winId + '_sec');

        if (section === 'appearance') {
            sec.innerHTML = `
                <div class="settings-row"><label>Theme Mode</label><select id="${winId}_tm"><option value="dark" ${Theme.current==='dark'?'selected':''}>Dark</option><option value="light" ${Theme.current==='light'?'selected':''}>Light</option></select></div>
                <div class="settings-row"><label>Accent Color</label><div class="color-grid">${Theme.accents.map(c=>`<div class="color-dot" style="background:${c}" data-c="${c}"></div>`).join('')}</div></div>`;
            document.getElementById(winId+'_tm').onchange = (e) => { Theme.set(e.target.value); Notify.show('Theme changed','success'); };
            sec.querySelectorAll('.color-dot').forEach(d => d.onclick = () => { document.documentElement.style.setProperty('--accent', d.dataset.c); Notify.show('Color changed','success'); });
        }
        else if (section === 'wallpaper') {
            sec.innerHTML = `<h3>Wallpapers</h3><div class="wp-grid">${Wallpaper.list.map((w,i) => `<div class="wp-thumb" style="background:${w.bg}" data-i="${i}"></div>`).join('')}</div>
                <input type="file" id="${winId}_wpfile" style="display:none"><button class="settings-btn" id="${winId}_wpup" style="margin-top:10px;">Upload Image</button>`;
            sec.querySelectorAll('.wp-thumb').forEach(t => t.onclick = () => { Wallpaper.set(parseInt(t.dataset.i)); Notify.show('Wallpaper set','success'); render(); });
            document.getElementById(winId+'_wpup').onclick = () => document.getElementById(winId+'_wpfile').click();
            document.getElementById(winId+'_wpfile').onchange = (e) => { const r = new FileReader(); r.onload = () => { Wallpaper.setCustom(r.result); }; r.readAsDataURL(e.target.files[0]); };
        }
        else if (section === 'storage') {
            let size = 0; for(let i=0; i<localStorage.length; i++) size += localStorage.getItem(localStorage.key(i)).length;
            sec.innerHTML = `<div class="settings-row"><label>Storage Used</label><span>${(size/1024).toFixed(1)} KB</span></div>
                <button class="settings-btn danger" id="${winId}_reset">Reset All Data</button>`;
            document.getElementById(winId+'_reset').onclick = () => { if(confirm('Delete everything?')) { localStorage.clear(); location.reload(); } };
        }
        else if (section === 'about') {
            sec.innerHTML = `<h3>MiniOS v1.0</h3><p>Built with HTML, CSS, and Vanilla JS.</p><p>No frameworks used.</p>`;
        }
    }
}