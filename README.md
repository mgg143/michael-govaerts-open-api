Code the Dream's (CTD) Open API Project [Course: Intro to Programming]

# 🌍 Global Weather App (Multi-View Edition)
Welcome to Michael's Global Weather App! 

This application allows us to search for any city in the world and navigate between different weather data views using real-time API requests.

## 🛠️ Features
* **Smart Search:** Automatically finds coordinates (Latitude/Longitude) for any city name.

* **Optimized Navigation:** Features a "tabbed" interface to switch between views.

* **Efficient Data Loading:**

    * **Temperature View:** Issues a specific GET request for temperature data only.

    * **Conditions View:** Issues a separate GET request for weather descriptions only.

## 🚀 How to Run the App Locally

1. **Check your folder structure:**

    * 'index.html' (Main folder)

    * 'css/index.css'

    * 'js/index.js'

2. **Open the App:** Double-click 'index.html' to launch it in your browser.

3. **Search:** Enter a city name (e.g., "Paris") and click **Search**.

4. **Navigate:** Use the **Temperature** and **Conditions** buttons to switch views. 
    1. Each click triggers a new, targeted request to the Open-Meteo API.
    2. This allows the app to only download necessary data.

## 🧠 How it Works (For Technical Review)
We designed this app to demonstrate efficient API usage:

* **Endpoint 1:** 'current=temperature_2m' is called when the Temperature tab is active.

* **Endpoint 2:** 'current=weather_code' is called when the Conditions tab is active.

This separate approach ensures we never download more data than the user is currently viewing, fulfilling the project's requirements for separate GET requests.
