let isDark = localStorage.getItem('weatherDark') === 'true';
let isCelsius = true;
let currentData = null;

// Apply dark mode on load
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('weatherDark', !isDark);
    isDark = !isDark;
}

function toggleUnit() {
    isCelsius = !isCelsius;
    if (currentData) renderWeather(currentData);
}

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    // Included a free demo key for testing. Replace with your own OpenWeatherMap key if it rate-limits.
    const key = 'bd5e378503939ddaee76f12ad7a97608';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weatherDisplay').style.display = 'none';

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
        const data = await res.json();
        if (data.cod === '404') throw new Error('City not found');

        // Fetch forecast
        const foreRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`);
        const foreData = await foreRes.json();

        currentData = {
            current: data,
            forecast: foreData.list
        };
        renderWeather(currentData);
    } catch (error) {
        alert(error.message);
        document.getElementById('loading').style.display = 'none';
    }
}

// --- THE COMPLETED FUNCTION ---
function renderWeather(data) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('weatherDisplay').style.display = 'block';

    const curr = data.current;

    // Format Temperature
    let temp = curr.main.temp;
    if (!isCelsius) {
        temp = (temp * 9 / 5) + 32; // Convert to Fahrenheit
        document.getElementById('temp').innerText = `${Math.round(temp)}°F`;
    } else {
        document.getElementById('temp').innerText = `${Math.round(temp)}°C`;
    }

    // Format Main Card
    document.getElementById('cityName').innerText = curr.name;
    document.getElementById('desc').innerText = curr.weather[0].description;
    document.getElementById('humidity').innerText = `${curr.main.humidity}%`;
    document.getElementById('wind').innerText = `${curr.wind.speed} m/s`;

    // Format 3-Day Forecast (fetching data around 12:00 PM for the next 3 days)
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    let daysAdded = 0;
    for (let i = 0; i < data.forecast.length; i++) {
        // OpenWeatherMap returns 3-hour increments. We look for "12:00:00" to get midday temps
        if (data.forecast[i].dt_txt.includes('12:00:00')) {
            let foreTemp = data.forecast[i].main.temp;
            if (!isCelsius) foreTemp = (foreTemp * 9 / 5) + 32;

            const unit = isCelsius ? '°C' : '°F';
            const dateObj = new Date(data.forecast[i].dt * 1000);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            // Map weather codes to basic emojis
            const icon = data.forecast[i].weather[0].main === 'Clouds' ? '☁️' :
                         data.forecast[i].weather[0].main === 'Rain' ? '🌧️' :
                         data.forecast[i].weather[0].main === 'Clear' ? '☀️' : '🌬️';

            forecastContainer.innerHTML += `
                <div class="forecast-item">
                    <h4>${dayName}</h4>
                    <div class="forecast-icon">${icon}</div>
                    <p>${Math.round(foreTemp)}${unit}</p>
                </div>
            `;

            daysAdded++;
            if (daysAdded === 3) break; // Stop after 3 days
        }
    }
}

// Load default city on startup
getWeather();