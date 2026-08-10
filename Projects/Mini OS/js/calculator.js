export function openCalculator() {
    const winId = WM.create({ appId: 'calculator', title: 'Calculator', width: 300, height: 400 });
    const body = document.getElementById(winId + '_body');
    body.style.display = 'flex'; body.style.flexDirection = 'column';
    
    let display = '0';
    let expression = '';

    const buttons = ['C','CE','<','/','7','8','9','*','4','5','6','-','1','2','3','+','+/-','0','.','='];
    
    body.innerHTML = `
        <div style="padding:15px; text-align:right; border-bottom:1px solid var(--border-color);">
            <div id="${winId}_expr" style="height:20px; color:var(--text-secondary); font-size:14px;"></div>
            <div id="${winId}_disp" style="font-size:32px; font-weight:bold;">0</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:2px; padding:5px; flex:1;" id="${winId}_btns">
            ${buttons.map(b => `<button class="settings-btn" style="font-size:18px; height:100%; margin:0;" data-v="${b}">${b}</button>`).join('')}
        </div>`;

    document.getElementById(winId + '_btns').onclick = (e) => {
        const v = e.target.dataset.v; if (!v) return;
        const dispEl = document.getElementById(winId + '_disp');
        const exprEl = document.getElementById(winId + '_expr');

        if (v === 'C') { display = '0'; expression = ''; exprEl.innerText = ''; }
        else if (v === 'CE') { display = '0'; }
        else if (v === '<') { display = display.length > 1 ? display.slice(0, -1) : '0'; }
        else if (['+','-','*','/'].includes(v)) { expression = display + ' ' + v + ' '; exprEl.innerText = expression; display = '0'; return; }
        else if (v === '=') {
            if (expression) {
                try {
                    let res = Function('"use strict"; return (' + expression + display + ')')();
                    display = String(parseFloat(res.toFixed(10)) || 'Error');
                } catch { display = 'Error'; }
                exprEl.innerText = expression + display + ' =';
                expression = '';
            }
        }
        else if (v === '+/-') { display = display.startsWith('-') ? display.slice(1) : '-' + display; }
        else { display = (display === '0' && v !== '.') ? v : display + v; }
        
        dispEl.innerText = display;
    };

    // Keyboard support
    const handleKey = (e) => {
        if (!WM.windows[winId] || WM.activeId !== winId) return document.removeEventListener('keydown', handleKey);
        const k = e.key;
        if (k >= '0' && k <= '9') document.querySelector(`#${winId}_btns [data-v="${k}"]`)?.click();
        else if (k === '+' || k === '-' || k === '*' || k === '/') document.querySelector(`#${winId}_btns [data-v="${k}"]`)?.click();
        else if (k === 'Enter' || k === '=') document.querySelector(`#${winId}_btns [data-v="="]`)?.click();
        else if (k === 'Backspace') document.querySelector(`#${winId}_btns [data-v="<"]`)?.click();
        else if (k === 'Escape') document.querySelector(`#${winId}_btns [data-v="C"]`)?.click();
    };
    document.addEventListener('keydown', handleKey);
}