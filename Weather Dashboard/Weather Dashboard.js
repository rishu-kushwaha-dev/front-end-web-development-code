const API_KEY = '90ae941d7198cc963f7a1ed08591495f';
const API_BASE = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geo-btn');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');
const recentSearchesDiv = document.getElementById('recent-searches');

const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const currentIconEl = document.getElementById('current-icon');
const currentTempEl = document.getElementById('current-temp');
const weatherDescEl = document.getElementById('weather-description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');
const forecastContainer = document.getElementById('forecast-container');

const RECENT_SEARCHES_KEY = 'weather_recent_searches';
const MAX_RECENT = 5;

function getRecentSearches() {
    try {
        const data = localStorage.getItem(RECENT_SEARCHES_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveRecentSearch(city) {
    const searches = getRecentSearches();
    const filtered = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    filtered.unshift(city);
    if (filtered.length > MAX_RECENT) {
        filtered.length = MAX_RECENT;
    }
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    renderRecentSearches();
}

function renderRecentSearches() {
    const searches = getRecentSearches();
    recentSearchesDiv.innerHTML = '';
    if (searches.length === 0) return;

    searches.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'recent-search';
        btn.textContent = city;
        btn.onclick = () => {
            cityInput.value = city;
            fetchWeather(city);
        };
        recentSearchesDiv.appendChild(btn);
    });
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatForecastDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

async function fetchWeather(city) {
    hideError();
    if (!city || city.trim() === '') {
        showError('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/weather?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please add your OpenWeatherMap API key.');
            }
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        await fetchForecast(data.coord.lat, data.coord.lon);
        displayWeather(data);
        saveRecentSearch(data.name);
    } catch (error) {
        showError(error.message);
    }
}

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Forecast error:', error);
    }
}

function displayWeather(data) {
    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    currentDateEl.textContent = formatDate(data.dt);
    currentIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentIconEl.alt = data.weather[0].description;
    currentTempEl.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescEl.textContent = data.weather[0].description;
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${data.wind.speed} m/s`;
    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;

    weatherDisplay.classList.remove('hidden');
}

function displayForecast(data) {
    forecastContainer.innerHTML = '';

    const dailyForecasts = [];
    const seenDates = new Set();

    for (const item of data.list) {
        const date = new Date(item.dt * 1000).toDateString();
        if (!seenDates.has(date) && dailyForecasts.length < 5) {
            seenDates.add(date);
            dailyForecasts.push(item);
        }
    }

    dailyForecasts.forEach(item => {
        const card = document.createElement('div');
        card.className = 'forecast-card';

        card.innerHTML = `
            <div class="forecast-date">${formatForecastDate(item.dt)}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
            <div class="forecast-desc">${item.weather[0].description}</div>
        `;

        forecastContainer.appendChild(card);
    });
}

function getCurrentLocation() {
    hideError();
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    geoBtn.disabled = true;
    geoBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`${API_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                if (!response.ok) throw new Error('Failed to fetch weather data');
                const data = await response.json();
                await fetchForecast(latitude, longitude);
                displayWeather(data);
                saveRecentSearch(data.name);
                cityInput.value = data.name;
            } catch (error) {
                showError(error.message);
            } finally {
                geoBtn.disabled = false;
                geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
            }
        },
        (error) => {
            geoBtn.disabled = false;
            geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
            if (error.code === error.PERMISSION_DENIED) {
                showError('Location permission denied. Please search by city name.');
            } else {
                showError('Unable to retrieve your location');
            }
        }
    );
}

searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

geoBtn.addEventListener('click', getCurrentLocation);

renderRecentSearches();
