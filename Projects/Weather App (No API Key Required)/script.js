// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('simWeatherDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip state first
    document.body.classList.toggle('dark');
    localStorage.setItem('simWeatherDark', isDark); // Save new state
}

const weathers = [
    { desc: 'Clear Sky', temp: 25, bg: '#74b9ff', hum: 40, wind: 10, icon: '🌤️' },
    { desc: 'Rainy', temp: 15, bg: '#636e72', hum: 90, wind: 25, icon: '🌧️' },
    { desc: 'Snowy', temp: -2, bg: '#dfe6e9', hum: 80, wind: 15, icon: '❄️' },
    { desc: 'Cloudy', temp: 18, bg: '#b2bec3', hum: 60, wind: 12, icon: '☁️' },
    { desc: 'Sunny', temp: 32, bg: '#ffeaa7', hum: 20, wind: 5, icon: '☀️' }
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const forecastIcons = ['🌤️', '🌧️', '❄️', '☁️', '☀️'];

function changeWeather() {
    const w = weathers[Math.floor(Math.random() * weathers.length)];
    
    // Update CSS variable instead of inline style so dark mode overlay works properly
    document.documentElement.style.setProperty('--weather-bg', w.bg);
    
    document.getElementById('temp').innerText = `${w.icon} ${w.temp}°C`;
    document.getElementById('desc').innerText = w.desc;
    document.getElementById('hum').innerText = w.hum + '%';
    document.getElementById('wind').innerText = w.wind + ' km/h';
    
    // Generate a realistic forecast based on the current temperature (±5 degrees)
    document.getElementById('forecast').innerHTML = days.map(d => {
        const randomVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const forecastTemp = w.temp + randomVariation;
        const randomIcon = forecastIcons[Math.floor(Math.random() * forecastIcons.length)];
        
        return `
            <div class="day">
                <h4>${d}</h4>
                <p>${randomIcon}</p>
                <p>${forecastTemp}°</p>
            </div>
        `;
    }).join('');
}

// Initialize weather on load
changeWeather();