// OpenWeatherMap API Configuration
const API_KEY = '18e2d37ea1e5beb76ac41e84d375be8e'; // Get free key from https://openweathermap.org/api
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastDiv = document.getElementById('forecast');
const errorMessageDiv = document.getElementById('errorMessage');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Weather Icon Mapping
const weatherIcons = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌧️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
};

// Main search handler
async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    clearError();
    try {
        // Fetch current weather
        const currentWeather = await fetchCurrentWeather(city);
        displayCurrentWeather(currentWeather);

        // Fetch 5-day forecast
        const forecast = await fetchForecast(currentWeather.coord.lat, currentWeather.coord.lon);
        displayForecast(forecast);

        // Update background theme based on weather
        updateTheme(currentWeather.weather[0].main);

        searchInput.value = '';
    } catch (error) {
        showError(error.message);
    }
}

// Fetch current weather data
async function fetchCurrentWeather(city) {
    const url = `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please try again.');
        }
        throw new Error('Failed to fetch weather data');
    }

    return await response.json();
}

// Fetch 5-day forecast
async function fetchForecast(lat, lon) {
    const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
    }

    return await response.json();
}

// Display current weather
function displayCurrentWeather(data) {
    const { name, sys, main, weather, wind, clouds } = data;
    const icon = weatherIcons[weather[0].icon] || '🌤️';

    currentWeatherDiv.innerHTML = `
        <div class="city-name">${name}, ${sys.country}</div>
        <div class="temperature">${icon} ${Math.round(main.temp)}°C</div>
        <div class="weather-description">${weather[0].description}</div>
        <div class="weather-details">
            <div class="detail-item">
                <div class="detail-label">Feels Like</div>
                <div class="detail-value">${Math.round(main.feels_like)}°C</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Humidity</div>
                <div class="detail-value">${main.humidity}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Wind Speed</div>
                <div class="detail-value">${wind.speed.toFixed(1)} m/s</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Pressure</div>
                <div class="detail-value">${main.pressure} mb</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Cloudiness</div>
                <div class="detail-value">${clouds.all}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Max Temp</div>
                <div class="detail-value">${Math.round(main.temp_max)}°C</div>
            </div>
        </div>
    `;
}

// Display 5-day forecast
function displayForecast(data) {
    // Group forecast by day
    const dailyForecasts = {};

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });

    // Get one forecast per day (midday)
    forecastDiv.innerHTML = '';
    Object.entries(dailyForecasts).slice(0, 5).forEach(([date, forecasts]) => {
        const midday = forecasts.reduce((prev, current) =>
            Math.abs(current.dt % 86400 - 43200) < Math.abs(prev.dt % 86400 - 43200) ? current : prev
        );

        const icon = weatherIcons[midday.weather[0].icon] || '🌤️';
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${new Date(midday.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-temp">
                <strong>${Math.round(midday.main.temp_max)}°C</strong> / ${Math.round(midday.main.temp_min)}°C
            </div>
            <div class="forecast-desc">${midday.weather[0].description}</div>
        `;
        forecastDiv.appendChild(card);
    });
}

// Update background theme based on weather
function updateTheme(weatherMain) {
    document.body.className = '';
    
    switch (weatherMain.toLowerCase()) {
        case 'rain':
        case 'drizzle':
            document.body.classList.add('rainy');
            break;
        case 'clear':
            document.body.classList.add('sunny');
            break;
        case 'clouds':
            document.body.classList.add('cloudy');
            break;
        case 'snow':
            document.body.classList.add('snowy');
            break;
        default:
            break;
    }
}

// Error handling
function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.add('show');
}

function clearError() {
    errorMessageDiv.classList.remove('show');
    errorMessageDiv.textContent = '';
}

// Initialize with a default city
window.addEventListener('load', () => {
    searchInput.value = 'Proddatur';
    handleSearch();
});