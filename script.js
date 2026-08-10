// ===== State =====
var state = {
    projects: [],
    currentFilter: 'all',
    searchQuery: '',
    isDark: localStorage.getItem('theme') === 'dark'
};

// ===== DOM References =====
var grid = document.getElementById('projectsGrid');
var noResults = document.getElementById('noResults');
var searchInput = document.getElementById('searchInput');
var themeToggle = document.getElementById('themeToggle');
var filterBtns = document.querySelectorAll('.filter-btn');
var scrollToTopBtn = document.getElementById('scrollToTop');
var loadingSpinner = document.getElementById('loadingSpinner');
var totalEl = document.getElementById('totalProjects');
var showingEl = document.getElementById('showingProjects');

// ===== Init =====
function init() {
    applyTheme();
    showLoading(true);

    fetch('projects.json')
        .then(function (res) {
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        })
        .then(function (data) {
            state.projects = data;
            totalEl.textContent = data.length;
            render();
        })
        .catch(function (err) {
            console.log('Error: ' + err.message);
            grid.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Failed to load projects.</p>';
        })
        .finally(function () {
            showLoading(false);
        });

    setupEvents();
}

// ===== Theme =====
function applyTheme() {
    if (state.isDark) {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark');
        themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    state.isDark = !state.isDark;
    localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
    applyTheme();
}

// ===== Filter & Render =====
function getFiltered() {
    var list = state.projects.slice();

    if (state.currentFilter !== 'all') {
        list = list.filter(function (p) {
            return p.category.toLowerCase() === state.currentFilter;
        });
    }

    if (state.searchQuery.trim()) {
        var q = state.searchQuery.toLowerCase();
        list = list.filter(function (p) {
            return p.name.toLowerCase().indexOf(q) !== -1 ||
                   (p.category && p.category.toLowerCase().indexOf(q) !== -1);
        });
    }

    return list;
}

function render() {
    var filtered = getFiltered();
    showingEl.textContent = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        html += buildCard(filtered[i]);
    }
    grid.innerHTML = html;

    // Attach button clicks
    var btns = grid.querySelectorAll('.card-btn');
    for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function () {
            window.open(this.getAttribute('data-path'), '_blank');
        });
    }
}

function buildCard(project) {
    var date = new Date(project.createdAt);
    var dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    var statusText = project.hasProject ? 'Ready' : 'Pending';

    return '<div class="card">' +
        '<div class="card-top">' +
            '<div class="card-icon">' + (project.icon || '📁') + '</div>' +
            '<div class="card-info">' +
                '<div class="card-title" title="' + project.name + '">' + project.name + '</div>' +
                '<div class="card-cat">' + (project.category || 'Tool') + '</div>' +
            '</div>' +
        '</div>' +
        '<p class="card-desc">Click below to open this project.</p>' +
        '<div class="card-meta">' +
            '<span>' + dateStr + '</span>' +
            '<span>' + statusText + '</span>' +
        '</div>' +
        '<button class="card-btn" data-path="' + project.path + '">Open Project</button>' +
    '</div>';
}

// ===== Events =====
function setupEvents() {
    searchInput.addEventListener('input', function () {
        state.searchQuery = this.value;
        render();
    });

    themeToggle.addEventListener('click', toggleTheme);

    for (var i = 0; i < filterBtns.length; i++) {
        filterBtns[i].addEventListener('click', function () {
            for (var j = 0; j < filterBtns.length; j++) {
                filterBtns[j].classList.remove('active');
            }
            this.classList.add('active');
            state.currentFilter = this.getAttribute('data-filter');
            render();
        });
    }

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Keyboard: Ctrl+K focuses search, Escape clears it
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            state.searchQuery = '';
            render();
        }
    });
}

// ===== Loading =====
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

// ===== Start =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}