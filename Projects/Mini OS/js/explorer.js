import { FS } from './filesystem.js';
import { Notify } from './utils.js';
import { ContextMenu } from './desktop.js'; // Import context menu

export function openExplorer(startPath) {
    let currentPath = startPath || '/Desktop';
    const winId = WM.create({ appId: 'explorer', title: 'Explorer - ' + currentPath, width: 700, height: 450 });
    render();

    function render() {
        WM.setTitle(winId, 'Explorer - ' + currentPath);
        const body = document.getElementById(winId + '_body');
        const items = FS.list(currentPath);
        
        let filesHtml = items.length === 0 ? '<div class="explorer-empty">Folder is empty</div>' : 
            items.map(i => `<div class="explorer-file" data-path="${i.path}" data-isdir="${i.isDir}">
                <span class="explorer-file-icon">${i.isDir ? '📁' : '📄'}</span>
                <span class="explorer-file-name">${i.name}</span>
            </div>`).join('');

        body.innerHTML = `
            <div class="explorer-toolbar">
                <button id="${winId}_up">Up</button>
                <input class="explorer-path" id="${winId}_path" value="${currentPath}">
                <button id="${winId}_newf">New Folder</button>
                <button id="${winId}_newt">New File</button>
            </div>
            <div class="explorer-main">
                <div class="explorer-sidebar">
                    <div class="explorer-side-item ${currentPath==='/'?'active':''}" data-p="/">/ Root</div>
                    <div class="explorer-side-item ${currentPath==='/Desktop'?'active':''}" data-p="/Desktop">Desktop</div>
                    <div class="explorer-side-item ${currentPath==='/Documents'?'active':''}" data-p="/Documents">Documents</div>
                    <div class="explorer-side-item ${currentPath==='/Recycle Bin'?'active':''}" data-p="/Recycle Bin">Recycle Bin</div>
                </div>
                <div class="explorer-files" id="${winId}_files">${filesHtml}</div>
            </div>`;

        // Events
        document.getElementById(winId + '_up').onclick = () => { currentPath = currentPath.includes('/') ? currentPath.substring(0, currentPath.lastIndexOf('/')) || '/' : '/'; render(); };
        document.getElementById(winId + '_path').onchange = (e) => { if(FS.get(e.target.value)?.type === 'dir') { currentPath = e.target.value; render(); } };
        document.getElementById(winId + '_newf').onclick = () => { let n='New Folder'; let i=1; while(FS.get(currentPath+'/'+n)) { n=`New Folder (${i++})`; } FS.create(currentPath+'/'+n, 'dir'); render(); Notify.show('Folder created','success'); };
        document.getElementById(winId + '_newt').onclick = () => { let n='New File.txt'; let i=1; while(FS.get(currentPath+'/'+n)) { n=`New File (${i++}).txt`; } FS.create(currentPath+'/'+n, 'file', ''); render(); Notify.show('File created','success'); };

        body.querySelectorAll('.explorer-side-item').forEach(el => {
            el.onclick = () => { currentPath = el.dataset.p; render(); };
        });

        document.getElementById(winId + '_files').onclick = (e) => {
            const file = e.target.closest('.explorer-file');
            if (!file) return;
            if (file.dataset.isdir === 'true') { currentPath = file.dataset.path; render(); }
            else { openNotepad(file.dataset.path); } // Launch notepad for files
        };

        document.getElementById(winId + '_files').oncontextmenu = (e) => {
            const file = e.target.closest('.explorer-file');
            e.preventDefault();
            if (file) {
                ContextMenu.show(e.clientX, e.clientY, [
                    { label: 'Delete', action: () => { FS.move(file.dataset.path, '/Recycle Bin'); render(); Notify.show('Moved to Recycle Bin','success'); } },
                    { label: 'Rename', action: () => { const nn = prompt('New name:', file.dataset.path.split('/').pop()); if(nn) { FS.remove(file.dataset.path); FS.create(currentPath+'/'+nn, file.dataset.isdir==='true'?'dir':'file', file.dataset.isdir==='true'?'':FS.read(file.dataset.path)||''); render(); } } }
                ]);
            }
        };
    }
}