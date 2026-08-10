import { FS } from './filesystem.js';
import { Theme } from './theme.js';
import { Wallpaper } from './wallpaper.js';
import { Notify } from './utils.js';

export function openTerminal() {
    const winId = WM.create({ appId: 'terminal', title: 'Terminal', width: 600, height: 400 });
    const body = document.getElementById(winId + '_body');
    body.style.background = '#0a0a0a'; body.style.color = '#0f0'; body.style.fontFamily = 'monospace'; body.style.padding = '10px'; body.style.overflowY = 'auto';
    
    let cwd = '/';
    
    body.innerHTML = `<div id="${winId}_out">Welcome to MiniOS Terminal\nType 'help' for commands.\n\n</div>
        <div style="display:flex;"><span id="${winId}_prompt">admin@mini:$ </span><input id="${winId}_in" style="flex:1;background:none;border:none;color:#0f0;outline:none;font-family:monospace;"></div>`;

    const input = document.getElementById(winId + '_in');
    input.focus();
    body.onclick = () => input.focus();

    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            addOut(`admin@mini:${cwd}$ ${cmd}\n`);
            if (cmd) runCmd(cmd);
            input.value = '';
        }
    };

    function addOut(text) {
        document.getElementById(winId + '_out').innerText += text;
        body.scrollTop = body.scrollHeight;
    }

    function runCmd(cmd) {
        const parts = cmd.split(' ');
        const c = parts[0].toLowerCase();
        const arg = parts[1];

        if (c === 'help') addOut('help, clear, ls, cd, mkdir, touch, cat, echo, rm, pwd, theme, wallpaper, about\n');
        else if (c === 'clear') document.getElementById(winId + '_out').innerText = '';
        else if (c === 'pwd') addOut(cwd + '\n');
        else if (c === 'ls') {
            const path = arg ? (arg.startsWith('/') ? arg : cwd + '/' + arg) : cwd;
            const items = FS.list(path);
            addOut(items.length ? items.map(i => i.name + (i.isDir ? '/' : '')).join('  ') + '\n' : 'Empty\n');
        }
        else if (c === 'cd') {
            if (!arg || arg === '/') { cwd = '/'; }
            else {
                const np = arg.startsWith('/') ? arg : cwd + '/' + arg;
                if (FS.get(np)?.type === 'dir') cwd = np; else addOut('Not a directory\n');
            }
            document.getElementById(winId + '_prompt').textContent = `admin@mini:${cwd}$ `;
        }
        else if (c === 'mkdir') { if(arg) { FS.create(cwd + '/' + arg, 'dir'); addOut('Created\n'); } }
        else if (c === 'touch') { if(arg) { FS.create(cwd + '/' + arg, 'file', ''); addOut('Created\n'); } }
        else if (c === 'cat') { if(arg) addOut(FS.read(cwd + '/' + arg) || 'File not found\n'); }
        else if (c === 'echo') addOut(parts.slice(1).join(' ') + '\n');
        else if (c === 'rm') { if(arg) { FS.remove(cwd + '/' + arg); addOut('Removed\n'); } }
        else if (c === 'theme') { if(arg === 'light' || arg === 'dark') { Theme.set(arg); addOut('Theme set\n'); } }
        else if (c === 'wallpaper') { if(!isNaN(arg)) { Wallpaper.set(parseInt(arg)); addOut('Wallpaper set\n'); } }
        else if (c === 'about') addOut('MiniOS v1.0 - Vanilla JS OS\n');
        else addOut('Command not found\n');
    }
}