let habits = JSON.parse(localStorage.getItem('habits')) || [];
let isDark = localStorage.getItem('habitDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('habitDark', !isDark);
    isDark = !isDark;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function addHabit() {
    const n = document.getElementById('habitInput').value;
    if (!n) return;
    
    habits.push({
        name: n,
        days: Array(7).fill(false)
    });
    
    localStorage.setItem('habits', JSON.stringify(habits));
    document.getElementById('habitInput').value = '';
    render();
}

function toggleDay(h, d) {
    habits[h].days[d] = !habits[h].days[d];
    localStorage.setItem('habits', JSON.stringify(habits));
    render();
}

function deleteH(h) {
    habits.splice(h, 1);
    localStorage.setItem('habits', JSON.stringify(habits));
    render();
}

function render() {
    document.getElementById('habits').innerHTML = habits.map((h, hi) => {
        const done = h.days.filter(Boolean).length;
        let streak = 0;
        for (let i = 0; i < 7; i++) {
            if (h.days[i]) streak++;
            else break;
        }
        
        return `
            <div class="habit">
                <div class="habit-header">
                    <h3>${h.name}</h3>
                    <button class="delete" onclick="deleteH(${hi})">❌</button>
                </div>
                <div class="days">
                    ${days.map((d, di) => `
                        <div class="day">
                            <p>${d}</p>
                            <div class="check ${h.days[di] ? 'checked' : ''}" onclick="toggleDay(${hi}, ${di})"></div>
                        </div>
                    `).join('')}
                </div>
                <div class="stats">
                    <span>Streak: ${streak} days</span>
                    <span>${Math.round((done / 7) * 100)}%</span>
                </div>
            </div>
        `;
    }).join('');
}

render();