// ==============
// IMPORTS
// ==============

import { weatherMap } from './weather-data.js';

// ===========================
// CONSTANTS & CONFIGURATION
// ===========================

const API_CONFIG = {
  baseUrl: 'https://api.open-meteo.com/v1/forecast',
  locationUrl: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
  units: 'metric',
  lang: 'ru',
  defaultLocation: { lat: 47.2678, lon: 29.1494 }, // Dubossary, Moldova
  metrics: {
    current: [
      'temperature_2m',
      'weather_code',
      'relative_humidity_2m',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(',')
  },
  timezone: 'auto',
  forecast_days: '8',
};

// =====================
// DOM ELEMENTS CACHE
// =====================

const elements = {
  refreshBtn: document.getElementById('refresh'),
  refreshIcon: document.querySelector('#refresh .wi-refresh'),
  city: document.getElementById('city'),
  date: document.getElementById('date'),
  temp: document.getElementById('temperature'),
  maxTemp: document.getElementById('maxTemp'),
  minTemp: document.getElementById('minTemp'),
  weatherIcon: document.getElementById('weatherIcon'),
  description: document.getElementById('description'),
  windSpeed: document.getElementById('wind'),
  windDetails: document.getElementById('wind-dir'),
  windArrow: document.getElementById('wind-arrow'),
  humidity: document.getElementById('humidity'),
  pressure: document.getElementById('pressure'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  uv: document.getElementById('uv'),
  uvText: document.getElementById('uv-text'),
  uvMarker: document.getElementById('uv-marker'),
  forecastContainer: document.getElementById('forecast-list'),
  widgetEl: document.getElementById('weather-widget'),
  errorBanner: document.getElementById('error-banner'),
  errorText: document.getElementById('error-text'),
  errorCloseBtn: document.getElementById('error-close'),
};

// ====================
// APPLICATION STATE
// ====================

const state = {
  location: { lat: null, lon: null },
  isGeolocationBlocked: localStorage.getItem('geolocation_blocked') === 'true',
  weather: null,
}

// ======================
// SERVICES & API LAYER
// ======================

async function getGeolocation() {
  if (state.isGeolocationBlocked) {
    return API_CONFIG.defaultLocation;
  }

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(API_CONFIG.defaultLocation);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          localStorage.setItem('geolocation_blocked', 'true');
          state.isGeolocationBlocked = true;
        }
        resolve(API_CONFIG.defaultLocation);
      }
    );
  });
}

async function fetchWeather(lat, lon) {
  const url =
    `${API_CONFIG.baseUrl}?latitude=${lat}&longitude=${lon}` +
    `&current=${API_CONFIG.metrics.current}` +
    `&daily=${API_CONFIG.metrics.daily}` +
    `&timezone=${API_CONFIG.timezone}` +
    `&forecast_days=${API_CONFIG.forecast_days}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return await response.json();
}

async function fetchLocationName(lat, lon) {
  const url =
    `${API_CONFIG.locationUrl}?latitude=${lat}&longitude=${lon}` +
    `&localityLanguage=${API_CONFIG.lang}`;
  
    const response = await fetch(url);
    if (!response.ok) return {city: 'Неизвестный город', countryName: '' };
    return await response.json();
}

// ==============================
// DATA TRANSFORMERS / ADAPTERS
// ==============================

function transformWeatherData(apiData) {
  return {
    temperature: Math.round(apiData.current.temperature_2m),
    weatherCode: apiData.current.weather_code,
    date: new Date(apiData.current.time),
    isDay: apiData.current.is_day,
    maxTemp: Math.round(apiData.daily.temperature_2m_max[0]),
    minTemp: Math.round(apiData.daily.temperature_2m_min[0]),
    windSpeed: Math.round(apiData.current.wind_speed_10m),
    windDirection: apiData.current.wind_direction_10m,
    humidity: apiData.current.relative_humidity_2m,
    pressure: apiData.current.surface_pressure,
    sunrise: new Date(apiData.daily.sunrise[0]),
    sunset: new Date(apiData.daily.sunset[0]),
    uvIndex: Math.round(apiData.daily.uv_index_max[0]),
    forecast: apiData.daily.time.map((time, index) => ({
      date: new Date(time),
      code: apiData.daily.weather_code[index],
      maxTemp: Math.round(apiData.daily.temperature_2m_max[index]),
      minTemp: Math.round(apiData.daily.temperature_2m_min[index]),
    }))
  };
}

function transformLocationData(locationData) {
  return {
    city: locationData.city || 'Неизвестный город',
    country: locationData.countryName || 'Unknown Country',
  }
}

function formatDateTime(date) {
  const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter.format(date);

  let fullDateTime = `${formattedDate}, ${formattedTime}`;

  fullDateTime = fullDateTime.charAt(0).toUpperCase() + fullDateTime.slice(1);

  return fullDateTime;
}

function getWeatherDetails(code, isDay) {
  const weatherInfo = weatherMap[code] || {
    icon: "wi-na",
    nightIcon: "wi-na",
    description: { ru: "Неизвестно", en: "Unknown" }
  }

  const iconClass = isDay === 1 ? weatherInfo.icon : weatherInfo.nightIcon;
  const description = weatherInfo.description[API_CONFIG.lang] || weatherInfo.description['en'];

  return { iconClass, description };
}

function getWindDetails(deg) {
  const directions = [
    { label: 'С',  iconClass: 'wi-from-n' },
    { label: 'СВ', iconClass: 'wi-from-ne' },
    { label: 'В',  iconClass: 'wi-from-e' },
    { label: 'ЮВ', iconClass: 'wi-from-se' },
    { label: 'Ю',  iconClass: 'wi-from-s' },
    { label: 'ЮЗ', iconClass: 'wi-from-sw' },
    { label: 'З',  iconClass: 'wi-from-w' },
    { label: 'СЗ', iconClass: 'wi-from-nw' }
  ];

  let index = Math.round(deg / 45) % 8;
  return directions[index];
}

function getUVDetails(uvIndex) {
  let uvDescription = '';
  if (uvIndex <= 2) {
    uvDescription = 'Низкий';
  } else if (uvIndex <= 5) {
    uvDescription = 'Умеренный';
  } else if (uvIndex <= 7) {
    uvDescription = 'Высокий';
  } else if (uvIndex <= 10) {
    uvDescription = 'Очень высокий';
  } else {
    uvDescription = 'Экстремальный';
  }

  let percent = (uvIndex / 12) * 100;
  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;
  
  return { uvDescription, percent };
}

// ======================
// UI & RENDERING LAYER
// ======================

function renderWeather(weather, location) {
  if (elements.city) elements.city.textContent = `${location.city}, ${location.country}`;
  if (elements.date) elements.date.textContent = formatDateTime(weather.date);
  if (elements.temp) elements.temp.textContent = weather.temperature;

  if (elements.weatherIcon && elements.description) {
    const { iconClass, description } = getWeatherDetails(weather.weatherCode, weather.isDay);

    elements.weatherIcon.className = `wi weather-icon-large`;
    elements.weatherIcon.classList.add(iconClass);

    elements.description.textContent = description;
  }

  if (elements.maxTemp) elements.maxTemp.textContent = weather.maxTemp;
  if (elements.minTemp) elements.minTemp.textContent = weather.minTemp;

  if (elements.windSpeed && elements.windDetails && elements.windArrow) {
    const windDetails = getWindDetails(weather.windDirection);

    elements.windSpeed.textContent = `${weather.windSpeed} м/с`;
    elements.windDetails.textContent = windDetails.label;
    elements.windArrow.className = 'wi wi-wind';
    elements.windArrow.classList.add(windDetails.iconClass);
  }
  
  if (elements.humidity) elements.humidity.textContent = `${weather.humidity} %`;
  if (elements.pressure) elements.pressure.textContent = `${weather.pressure} гПа`;
  
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  if (elements.sunrise) elements.sunrise.textContent = weather.sunrise.toLocaleTimeString('ru-RU', timeOptions);
  if (elements.sunset) elements.sunset.textContent = weather.sunset.toLocaleTimeString('ru-RU', timeOptions);

  if (elements.uv && elements.uvText && elements.uvMarker) {
    elements.uv.textContent = weather.uvIndex;

    const uvDetails = getUVDetails(weather.uvIndex);
    elements.uvText.textContent = uvDetails.uvDescription;
    elements.uvMarker.style.left = `${uvDetails.percent}%`;
  }

  renderForecast(weather.forecast);
}

function renderForecast(forecastItems) {
  if (!elements.forecastContainer) return;

  let html = '';
  forecastItems.slice(1).forEach((item) => {
    let dayName = item.date.toLocaleDateString('ru-RU', {weekday: 'long' });
    dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const dateFormatted = item.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');

    const weatherDetails = getWeatherDetails(item.code, 1);

    html += `
      <div class="forecast-item" role="listitem">
        <div class="forecast-day">
          <strong>${dayName}</strong>
          <span>${dateFormatted}</span>
        </div>
        
        <div class="forecast-icon-wrap">
          <i class="wi ${weatherDetails.iconClass}" title="${weatherDetails.description}" aria-hidden="true"></i>
        </div>

        <div class="forecast-temperature">
          <strong>${item.maxTemp}°</strong>
          <span>${item.minTemp}°</span>
        </div>
      </div>
    `;
  });

  elements.forecastContainer.innerHTML = html;
}

// =================
// EVENT HANDLERS
// =================

async function handleRefresh() {
  try {
    if (elements.refreshIcon) elements.refreshIcon.classList.add('spinning');
    if (elements.refreshBtn) {
      elements.refreshBtn.disabled = true;
      elements.refreshBtn.style.opacity = '0.5';
    }

    localStorage.removeItem('geolocation_blocked');
    state.isGeolocationBlocked = false;

    await loadData();
  } catch (error) {
    console.error('Refresh failed: ', error);
  } finally {
    setTimeout(() => {
        if (elements.refreshIcon) elements.refreshIcon.classList.remove('spinning');
        if (elements.refreshBtn) {
          elements.refreshBtn.disabled = false;
          elements.refreshBtn.style.opacity = '1';
        }
      }, 400);
  }
}

function showLoading() {
  if (elements.widgetEl) elements.widgetEl.classList.add('widget-loading');
  hideError();
}

function hideLoading() {
  if (elements.widgetEl) elements.widgetEl.classList.remove('widget-loading');
}

function showError(message) {
  if (elements.errorBanner && elements.errorText) {
    elements.errorText.textContent = message;
    elements.errorBanner.style.display = 'flex';
  }
}

function hideError() {
  if (elements.errorBanner) {
    elements.errorBanner.style.display = 'none';
  }
}

function bindEvents() {
  if (elements.refreshBtn) {
    elements.refreshBtn.addEventListener('click', handleRefresh);
  }

  if (elements.errorCloseBtn) {
    elements.errorCloseBtn.addEventListener('click', hideError);
  }
}

// =================
// INITIALIZATION
// =================

async function loadData() {
  showLoading();

  try {
    if (!navigator.onLine) {
      throw new Error('NETWORK_OFFLINE');
    }

    state.location = await getGeolocation();

    const [rawWeatherData, rawLocationData] = await Promise.all([
      fetchWeather(state.location.lat, state.location.lon),
      fetchLocationName(state.location.lat, state.location.lon)
    ]);

    const cleanWeather = transformWeatherData(rawWeatherData);
    const cleanLocation = transformLocationData(rawLocationData);

    state.weather = cleanWeather;
    renderWeather(cleanWeather, cleanLocation);
  } catch (error) {
    console.error('Error loading weather data:', error);
    if (error.message === 'NETWORK_OFFLINE') {
      showError('Отсутствует интернет-соединение. Проверьте подключение к сети.')
    } else if (error.message.includes('HTTP Error')) {
      showError('Сервер погоды временно недоступен. Попробуйте позже.');
    } else {
      showError('Не удалось загрузить актуальные данные о погоде.');
    }
  } finally {
    setTimeout(() => {
      hideLoading();
    }, 400);
  }
}

async function init() {
  bindEvents();
  await loadData();
}

document.addEventListener('DOMContentLoaded', init);
