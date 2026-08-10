let isDark = localStorage.getItem('gitDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('gitDark', !isDark);
    isDark = !isDark;
}

async function getUser() {
    const u = document.getElementById('username').value;
    document.getElementById('error').style.display = 'none';
    document.getElementById('ui').style.display = 'block';
    
    try {
        const res = await fetch(`https://api.github.com/users/${u}`);
        const data = await res.json();
        
        if (data.message === 'Not Found') throw new Error();
        
        document.getElementById('profile').innerHTML = `
            <img src="${data.avatar_url}">
            <h1>${data.name || u}</h1>
            <p class="bio">${data.bio || 'No bio available'}</p>
            <div class="stats">
                <div><h3>${data.followers}</h3><p>Followers</p></div>
                <div><h3>${data.following}</h3><p>Following</p></div>
                <div><h3>${data.public_repos}</h3><p>Repos</p></div>
            </div>
        `;
        
        const repRes = await fetch(`https://api.github.com/users/${u}/repos?per_page=5`);
        const reps = await repRes.json();
        
        document.getElementById('repos').innerHTML = reps.map(r => `
            <div class="repo">
                <h3>${r.name}</h3>
                <p style="font-size:14px;opacity:0.7">${r.description || 'No description'}</p>
                <div style="margin-top:10px">
                    ${r.language ? `<span><span class="lang" style="background:${r.language === 'JavaScript' ? '#f1e05a' : '#333'}"></span>${r.language}</span>` : ''}
                </div>
            </div>
        `).join('');
    } catch (e) {
        document.getElementById('error').style.display = 'block';
        document.getElementById('ui').style.display = 'none';
    }
}

getUser();