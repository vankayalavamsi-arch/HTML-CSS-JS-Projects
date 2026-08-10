import { Storage } from './storage.js';
import { Notify } from './utils.js';

export function openCalendar() {
    let date = new Date();
    let events = Storage.get('events', []);
    const winId = WM.create({ appId: 'calendar', title: 'Calendar', width: 500, height: 450 });
    
    render();

    function render() {
        const body = document.getElementById(winId + '_body');
        const y = date.getFullYear(), m = date.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const today = new Date();
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        
        let cells = '';
        for(let i=0; i<firstDay; i++) cells += `<div class="cal-cell other">${new Date(y, m, -i).getDate()}</div>`;
        for(let i=1; i<=daysInMonth; i++) {
            const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
            const isToday = i===today.getDate() && m===today.getMonth() && y===today.getFullYear();
            const ev = events.find(e => e.date === dateStr);
            cells += `<div class="cal-cell ${isToday?'today':''}" data-date="${dateStr}">${i}${ev ? `<div class="cal-event">${ev.title}</div>` : ''}</div>`;
        }

        body.innerHTML = `<div class="cal-app">
            <div class="cal-header">
                <h3>${months[m]} ${y}</h3>
                <div><button id="${winId}_prev"><</button> <button id="${winId}_next">></button> <button id="${winId}_add">+ Event</button></div>
            </div>
            <div class="cal-grid">${cells}</div>
        </div>`;

        document.getElementById(winId+'_prev').onclick = () => { date.setMonth(date.getMonth()-1); render(); };
        document.getElementById(winId+'_next').onclick = () => { date.setMonth(date.getMonth()+1); render(); };
        document.getElementById(winId+'_add').onclick = () => {
            const d = prompt("Enter date (YYYY-MM-DD):");
            if(d) {
                const t = prompt("Event title:");
                if(t) { events.push({date: d, title: t}); Storage.set('events', events); render(); Notify.show('Event added','success'); }
            }
        };
    }
}