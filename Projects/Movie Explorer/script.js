let isDark = localStorage.getItem('movieDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('movieDark', !isDark);
    isDark = !isDark;
}

let page = 1;
let isLoading = false;

async function getMovies() {
    if (isLoading) return;
    isLoading = true;
    
    const query = document.getElementById('search').value || 'batman';
    document.getElementById('loading').style.display = 'block';
    
    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=2b31e31e`);
        const data = await res.json();
        document.getElementById('loading').style.display = 'none';
        
        if (data.Search) {
            document.getElementById('grid').innerHTML += data.Search.map(m => `
                <div class="card">
                    <img src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${m.Title}">
                    <div class="info">
                        <h3>${m.Title}</h3>
                        <p>${m.Year}</p>
                    </div>
                </div>
            `).join('');
            page++;
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        document.getElementById('loading').style.display = 'none';
    }
    
    isLoading = false;
}

function resetAndSearch() {
    page = 1;
    document.getElementById('grid').innerHTML = '';
    getMovies();
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        getMovies();
    }
});

getMovies();