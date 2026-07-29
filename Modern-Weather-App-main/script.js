// ===============================
// Weather App - Part 1
// ===============================

// Your WeatherAPI Key
const apiKey = "a663899c5726470fbae54846262507";

// Weather icon mapping (optional emoji fallback)
const weatherIcons = {
    Sunny: "☀️",
    Clear: "🌙",
    Cloudy: "☁️",
    "Partly cloudy": "⛅",
    Mist: "🌫️",
    Fog: "🌫️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Snow: "❄️",
    Thunder: "⛈️"
};

// DOM Elements
const cityInput = document.getElementById("city");
const weatherCard = document.getElementById("weather");

const locationEl = document.getElementById("location");
const tempEl = document.getElementById("temp");
const conditionEl = document.getElementById("condition");
const iconEl = document.getElementById("icon");

const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const timeEl = document.getElementById("time");

const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");

const feelsLikeEl = document.getElementById("feelsLike");
const pressureEl = document.getElementById("pressure");
const visibilityEl = document.getElementById("visibility");
const uvEl = document.getElementById("uv");

const moonPhaseEl = document.getElementById("moonPhase");
const airQualityEl = document.getElementById("airQuality");


// ===============================
// Search Weather
// ===============================

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    const url =
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=yes&alerts=no`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            alert(data.error.message);
            return;
        }

        displayCurrentWeather(data);

        displayForecast(data);

    } catch (error) {

        console.error(error);

        alert("Unable to fetch weather.");

    }

}
// ===============================
// Display Current Weather
// ===============================

function displayCurrentWeather(data) {

    weatherCard.style.display = "block";

    // Location
    locationEl.textContent =
        `${data.location.name}, ${data.location.country}`;

    // Temperature
    tempEl.textContent =
        `${Math.round(data.current.temp_c)}°C`;

    // Weather Condition
    conditionEl.textContent =
        data.current.condition.text;

    // Weather Icon
    iconEl.src =
        "https:" + data.current.condition.icon;

    iconEl.alt =
        data.current.condition.text;

    // Weather Details
    humidityEl.textContent =
        `${data.current.humidity}%`;

    windEl.textContent =
        `${data.current.wind_kph} km/h`;

    timeEl.textContent =
        data.location.localtime;

    // Astronomy
    sunriseEl.textContent =
        data.forecast.forecastday[0].astro.sunrise;

    sunsetEl.textContent =
        data.forecast.forecastday[0].astro.sunset;

    moonPhaseEl.textContent =
        data.forecast.forecastday[0].astro.moon_phase;

    // Extra Weather
    feelsLikeEl.textContent =
        `${data.current.feelslike_c}°C`;

    pressureEl.textContent =
        `${data.current.pressure_mb} hPa`;

    visibilityEl.textContent =
        `${data.current.vis_km} km`;

    uvEl.textContent =
        data.current.uv;

    // Air Quality
    if (data.current.air_quality) {

        airQualityEl.textContent =
            Math.round(data.current.air_quality["us-epa-index"]);

    }

    updateBackground(
        data.current.condition.text
    );

}


// ===============================
// Dynamic Background
// ===============================

function updateBackground(condition) {

    const body = document.body;

    condition = condition.toLowerCase();

    if (condition.includes("sun")) {

        body.style.background =
        "linear-gradient(135deg,#FDB813,#FF9800)";

    }

    else if (condition.includes("cloud")) {

        body.style.background =
        "linear-gradient(135deg,#6D83F2,#9BB8FF)";

    }

    else if (condition.includes("rain")) {

        body.style.background =
        "linear-gradient(135deg,#1D4350,#A43931)";

    }

    else if (condition.includes("mist") ||
             condition.includes("fog")) {

        body.style.background =
        "linear-gradient(135deg,#757F9A,#D7DDE8)";

    }

    else if (condition.includes("snow")) {

        body.style.background =
        "linear-gradient(135deg,#E6DADA,#274046)";

    }

    else if (condition.includes("thunder")) {

        body.style.background =
        "linear-gradient(135deg,#141E30,#243B55)";

    }

    else {

        body.style.background =
        "linear-gradient(135deg,#4facfe,#00f2fe)";

    }

}


// ===============================
// Enter Key Support
// ===============================

cityInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        getWeather();

    }

});
// ===============================
// Display 5-Day Forecast
// ===============================

function displayForecast(data) {

    const forecastContainer =
        document.getElementById("forecast");

    if (!forecastContainer) return;

    forecastContainer.innerHTML = "";

    data.forecast.forecastday.forEach((day, index) => {

        if (index === 0) return;

        const date = new Date(day.date);

        const weekday = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const card = document.createElement("div");

        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${weekday}</h3>

            <img src="https:${day.day.condition.icon}">

            <p>${Math.round(day.day.maxtemp_c)}° /
               ${Math.round(day.day.mintemp_c)}°</p>

            <small>${day.day.condition.text}</small>
        `;

        forecastContainer.appendChild(card);

    });

}



// ===============================
// Use Current Location
// ===============================

function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    showLoading();

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const lat = position.coords.latitude;

            const lon = position.coords.longitude;

            const url =
`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=yes&alerts=no`;

            try{

                const response = await fetch(url);

                const data = await response.json();

                displayCurrentWeather(data);

                displayForecast(data);

            }

            catch(err){

                console.log(err);

                alert("Unable to fetch location weather.");

            }

            hideLoading();

        },

        ()=>{

            hideLoading();

            alert("Location permission denied.");

        }

    );

}



// ===============================
// Loading Animation
// ===============================

function showLoading(){

    const loader =
        document.getElementById("loader");

    if(loader){

        loader.style.display="flex";

    }

}

function hideLoading(){

    const loader =
        document.getElementById("loader");

    if(loader){

        loader.style.display="none";

    }

}



// ===============================
// Better Error Display
// ===============================

function showError(message){

    const error =
        document.getElementById("error");

    if(!error) return;

    error.innerText = message;

    error.style.display = "block";

    setTimeout(()=>{

        error.style.display="none";

    },3000);

}



// ===============================
// Button Events
// ===============================

const searchBtn =
document.getElementById("searchBtn");

if(searchBtn){

    searchBtn.addEventListener("click",()=>{

        showLoading();

        getWeather().finally(()=>{

            hideLoading();

        });

    });

}



const locationBtn =
document.getElementById("locationBtn");

if(locationBtn){

    locationBtn.addEventListener("click",()=>{

        getCurrentLocation();

    });

}



// ===============================
// Auto Load Default City
// ===============================

window.onload = ()=>{

    cityInput.value="London";

    getWeather();

};