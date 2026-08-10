let isDark = localStorage.getItem('pollDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('pollDark', !isDark);
    isDark = !isDark;
}

let polls = JSON.parse(localStorage.getItem('polls')) || [
    {
        q: "Best Framework?",
        opts: [{ t: "React", v: 12 }, { t: "Angular", v: 5 }, { t: "Vue", v: 8 }],
        voted: false
    }
];

let votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];

function render() {
    document.getElementById('polls').innerHTML = polls.map((p, pi) => {
        const total = p.opts.reduce((a, b) => a + b.v, 0);
        const isVoted = votedPolls.includes(pi);
        return `
            <div class="poll ${isVoted ? 'voted' : ''}">
                <h2>${p.q}</h2>
                ${p.opts.map((o, oi) => `
                    <div class="option" onclick="vote(${pi}, ${oi})">
                        <div class="option-text">
                            <span>${o.t}</span>
                            <span>${total ? Math.round((o.v / total) * 100) : 0}% (${o.v} votes)</span>
                        </div>
                        <div class="bar-bg">
                            <div class="bar-fill" style="width:${total ? Math.round((o.v / total) * 100) : 0}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

function vote(pi, oi) {
    if (votedPolls.includes(pi)) return;
    polls[pi].opts[oi].v++;
    votedPolls.push(pi);
    localStorage.setItem('polls', JSON.stringify(polls));
    localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
    render();
}

function addOpt() {
    const d = document.createElement('input');
    d.className = 'opt';
    d.placeholder = `Option ${document.querySelectorAll('.opt').length + 1}`;
    document.getElementById('opts').appendChild(d);
}

function createPoll() {
    const q = document.getElementById('q').value;
    if (!q) return alert('Enter question');
    
    const opts = Array.from(document.querySelectorAll('.opt')).map(i => i.value).filter(v => v);
    if (opts.length < 2) return alert('Add at least 2 options');
    
    polls.unshift({
        q,
        opts: opts.map(t => ({ t, v: 0 })),
        voted: false
    });
    
    localStorage.setItem('polls', JSON.stringify(polls));
    document.getElementById('q').value = '';
    document.getElementById('opts').innerHTML = `
        <input type="text" class="opt" placeholder="Option 1">
        <input type="text" class="opt" placeholder="Option 2">
    `;
    render();
}

render();