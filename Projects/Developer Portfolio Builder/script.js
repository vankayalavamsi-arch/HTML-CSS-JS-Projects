let isDark = localStorage.getItem('portBuildDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('portBuildDark', !isDark);
    isDark = !isDark;
}

function parse() {
    let md = document.getElementById('md').value;
    let html = md
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^\- (.*$)/gm, '<li style="margin-left:20px;margin-bottom:5px;">$1</li>')
        .replace(/\[(.*?)\]/g, '<span class="skill">$1</span>')
        .replace(/(<li.*<\/li>)/s, '<ul>$1</ul>'); // Simple list wrap

    // Clean up multiple ul tags if needed, basic approach:
    html = html.replace(/<\/ul>\s*<li>/g, '<li>').replace(/<\/li>\s*<ul>/g, '</li>');

    document.getElementById('preview').innerHTML = html;
}

parse();