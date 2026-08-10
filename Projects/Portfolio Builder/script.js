let isDark = localStorage.getItem('portDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('portDark', !isDark);
    isDark = !isDark;
}

function update() {
    const n = document.getElementById('name').value;
    const t = document.getElementById('title').value;
    const a = document.getElementById('about').value;
    const s = document.getElementById('skills').value.split(',').map(s => `<span class="skill">${s.trim()}</span>`).join('');
    const p1 = `
        <div class="project">
            <h3>${document.getElementById('p1n').value}</h3>
            <p>${document.getElementById('p1d').value}</p>
        </div>
    `;
    
    document.getElementById('preview').innerHTML = `
        <h1>${n}</h1>
        <p style="font-size:20px;margin-top:10px;color:#666">${t}</p>
        <section>
            <h2>About Me</h2>
            <p>${a}</p>
        </section>
        <section>
            <h2>Skills</h2>
            <div class="skills">${s}</div>
        </section>
        <section>
            <h2>Projects</h2>
            ${p1}
        </section>
    `;
}

function exportHTML() {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Portfolio</title>
            <style>
                body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
                h1 { color: #2d3436; border-bottom: 3px solid #6c5ce7; display: inline-block; padding-bottom: 10px; }
                h2 { color: #6c5ce7; margin: 30px 0 15px; }
                .skills { display: flex; gap: 10px; }
                .skill { background: #f0f0f0; padding: 5px 15px; border-radius: 20px; }
                .project { background: #fafafa; padding: 15px; border-radius: 10px; margin-bottom: 10px; border-left: 5px solid #6c5ce7; }
            </style>
        </head>
        <body>
            ${document.getElementById('preview').innerHTML}
        </body>
        </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.download = 'portfolio.html';
    link.href = URL.createObjectURL(blob);
    link.click();
}

update();