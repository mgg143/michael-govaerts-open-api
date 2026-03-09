const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const resultDiv = document.getElementById('result');
const errorMsg = document.getElementById('error');

const cityNameDisplay = document.getElementById('cityName');
const tempCDisplay = document.getElementById('tempC');
const tempFDisplay = document.getElementById('tempF');
const descDisplay = document.getElementById('description');

const navTabs = document.getElementById('navTabs');
const tempTab = document.getElementById('tempTab');
const condTab = document.getElementById('condTab');
const temperatureView = document.getElementById('temperatureView');
const conditionsView = document.getElementById('conditionsView');

// Allow the application to remember the city's coordinates so that
// if the user switches between tabs, they don't have to submit the city again
let currentLat = null;
let currentLon = null;

// Translating the weather code from the API to a human-readable description
function getWeatherDescription(code) {
    const mapping = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        95: "Thunderstorm"
    };
    return mapping[code] || "Cloudy";
}

// Find the coordinates of a city, which happens when the user clicks the search button or presses Enter in the input field
async function findCity() {
    const city = cityInput.value.trim();
    if (!city) return;
    
    errorMsg.textContent = "";
    resultDiv.className = "result-hidden"; // Hide previous results while fetching new data

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        
        if (!geoData.results) throw new Error("City not found. Try another!");

        // Save the coordinates into the variables we already created, so that we can use them when the user switches tabs
        currentLat = geoData.results[0].latitude;
        currentLon = geoData.results[0].longitude;

        // Display the city name and country in the UI
        cityNameDisplay.textContent = `${geoData.results[0].name}, ${geoData.results[0].country}`;

        // Display the layout for the weather information, which is hidden by default
        resultDiv.className = "result-visible";
        navTabs.className = "result-visible";

        // Fetch the temperature data immediately after finding the city, so that the user doesn't have to click again to see the weather
        getTemperature();

    } catch (err) {
        errorMsg.textContent = err.message;
    }
}

// Fetch the Temperature (GET Request #1)
// This function is called when the user clicks the "Temperature" tab, and it uses the coordinates we already have to fetch the weather data without needing to find the city again
async function getTemperature() {
    try {
        // Get the Temperature Data only
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current=temperature_2m`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const celsius = weatherData.current.temperature_2m;
        // Calculation: (Celsius * 9/5) + 32
        const fahrenheit = (celsius * 9/5) + 32;

        // Update the screen
        tempCDisplay.textContent = Math.round(celsius);
        tempFDisplay.textContent = Math.round(fahrenheit);
       
        // Display the Temp view, hide the Conditions view
        temperatureView.style.display = "flex";
        conditionsView.style.display = "none";

        // Highlight the active button
        tempTab.style.backgroundColor = "#2a5298";
        condTab.style.backgroundColor = "#555";

    } catch (err) {
        errorMsg.textContent = "Error loading temperature data.";
    }
}

// Fetch the Weather Conditions (GET Request #2)
// This function is called when the user clicks the "Conditions" tab, and it uses the coordinates we already have to fetch the weather data without needing to find the city again
async function getConditions() {
    try {
        // Get the Weather Conditions only
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current=weather_code`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        // Update the screen using our helper function to translate the weather code into a human-readable description
        const description = getWeatherDescription(weatherData.current.weather_code);
        descDisplay.textContent = description;

        // Display the Conditions view, hide the Temp view
        conditionsView.style.display = "block";
        temperatureView.style.display = "none";

        // Highlight the active button
        condTab.style.backgroundColor = "#2a5298";
        tempTab.style.backgroundColor = "#555";

    } catch (err) {
        errorMsg.textContent = "Error loading weather conditions.";
    }
}

// Waiting for the user to click the search button or press Enter in the input field to start the process of finding the city and fetching the weather data
searchBtn.addEventListener('click', findCity);
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') findCity(); });

// Waiting for the user to click the tabs to fetch and display the corresponding weather data
tempTab.addEventListener('click', getTemperature);
condTab.addEventListener('click', getConditions);