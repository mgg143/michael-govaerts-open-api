const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const resultDiv = document.getElementById('result');
const errorMsg = document.getElementById('error');

const cityNameDisplay = document.getElementById('cityName');
const tempCDisplay = document.getElementById('tempC');
const tempFDisplay = document.getElementById('tempF');
const descDisplay = document.getElementById('description');

function getWeatherDescription(code) {
    const mapping = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        95: "Thunderstorm"
    };
    return mapping[code] || "Cloudy";
}

async function getBoxWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    errorMsg.textContent = "";
    resultDiv.className = "result-hidden";

    try {
        // 1. Get Coordinates
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error("City not found. Try another!");

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Get Weather (Celsius is default)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const celsius = weatherData.current.temperature_2m;
        // Calculation: (Celsius * 9/5) + 32
        const fahrenheit = (celsius * 9/5) + 32;

        // 3. Update UI
        cityNameDisplay.textContent = `${name}, ${country}`;
        tempCDisplay.textContent = Math.round(celsius);
        tempFDisplay.textContent = Math.round(fahrenheit);
        descDisplay.textContent = getWeatherDescription(weatherData.current.weather_code);
        
        resultDiv.className = "result-visible";

    } catch (err) {
        errorMsg.textContent = err.message;
    }
}

searchBtn.addEventListener('click', getBoxWeather);
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') getBoxWeather(); });