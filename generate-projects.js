/**
 * Project Scanner & JSON Generator
 * Run: node generate-projects.js
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, 'Projects');
const OUTPUT_FILE = path.join(__dirname, 'projects.json');

function getProjectIcon(folderName) {
  const icons = {
    calculator: '🧮', login: '🔐', weather: '🌦️', todo: '✅',
    timer: '⏱️', clock: '🕐', stopwatch: '⏱️', converter: '🔄',
    generator: '⚙️', game: '🎮', chat: '💬', gallery: '🖼️',
    portfolio: '👨‍💼', blog: '📝', notes: '📋', music: '🎵',
    video: '🎬', editor: '✏️', paint: '🎨', drawing: '✏️',
    filter: '🎭', animation: '🎞️', animated: '✨', form: '📋',
    input: '⌨️', map: '🗺️', gps: '📍', expense: '💰',
    budget: '💵', tracker: '📊', analytics: '📈', dashboard: '📊',
    chart: '📉', quiz: '❓', trivia: '🧠', memory: '🧩',
    snake: '🐍', tetris: '🟦', flappy: '🐦', pong: '🏓',
    tic: '⭕', tictactoe: '⭕', hangman: '🎯', search: '🔍',
    sort: '🔀', list: '📋', table: '📊', card: '🃏',
    modal: '📦', popup: '💬', notification: '🔔', alert: '⚠️',
    validate: '✔️', validation: '✔️', auth: '🔑', sign: '✍️',
    register: '📝', dropdown: '▼', menu: '☰', nav: '🧭',
    header: '📌', footer: '📍', button: '🔘', toggle: '⚙️',
    switch: '🔀', slider: '🎚️', carousel: '🎠', lightbox: '💡',
    pagination: '📄', breadcrumb: '🔗', tabs: '📑', accordion: '📂',
    tree: '🌳', progress: '⏳', loading: '⌛', skeleton: '👻',
    placeholder: '📝', icon: '🎨', svg: '🎨',
  };

  const lowerName = folderName.toLowerCase();

  for (const [keyword, icon] of Object.entries(icons)) {
    if (lowerName.includes(keyword)) {
      return icon;
    }
  }

  return '📁';
}

function scanProjects() {
  try {
    if (!fs.existsSync(PROJECTS_DIR)) {
      console.log('Projects directory not found at: ' + PROJECTS_DIR);
      console.log('Please create a "Projects" folder.');
      return;
    }

    const folders = fs.readdirSync(PROJECTS_DIR).filter(function (file) {
      return fs.statSync(path.join(PROJECTS_DIR, file)).isDirectory();
    });

    if (folders.length === 0) {
      console.log('No project folders found in Projects directory');
      return;
    }

    const projects = folders.map(function (folder, index) {
      var folderPath = path.join(PROJECTS_DIR, folder);
      var indexPath = path.join(folderPath, 'index.html');
      var hasIndex = fs.existsSync(indexPath);
      var category = 'Tool';

      if (folder.toLowerCase().includes('game')) {
        category = 'Game';
      } else if (folder.toLowerCase().includes('app')) {
        category = 'App';
      }

      return {
        id: index + 1,
        name: folder,
        path: 'Projects/' + folder + '/index.html',
        icon: getProjectIcon(folder),
        hasProject: hasIndex,
        category: category,
        createdAt: new Date(fs.statSync(folderPath).birthtime).toISOString()
      };
    });

    projects.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));

    console.log('Generated projects.json with ' + projects.length + ' projects:');
    projects.forEach(function (p) {
      var status = p.hasProject ? '[OK]' : '[--]';
      console.log('  ' + status + ' ' + p.icon + ' ' + p.name);
    });

  } catch (error) {
    console.log('Error scanning projects: ' + error.message);
  }
}

scanProjects();