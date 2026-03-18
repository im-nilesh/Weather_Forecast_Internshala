const apiKey = "b8f5c5684a89524b67418d88a6d5a8ee";
let isCelsius = true;
let currentTemp = 0;

// 🌈 Dynamic Theme
function setWeatherTheme(condition) {
  const body = document.body;
  const rain = document.getElementById("rainContainer");
  const sun = document.getElementById("sunGlow");
  const cloud = document.getElementById("cloudContainer");

  // Reset
  rain.classList.add("hidden");
  sun.classList.add("hidden");
  cloud.classList.add("hidden");

  if (condition === "Rain") {
    body.style.background =
      "linear-gradient(to bottom right, #4b6cb7, #182848)";

    rain.classList.remove("hidden");
    createRain();
  } else if (condition === "Clear") {
    body.style.background =
      "linear-gradient(to bottom right, #fceabb, #f8b500)";

    sun.classList.remove("hidden");
  } else if (condition === "Clouds") {
    body.style.background =
      "linear-gradient(to bottom right, #bdc3c7, #2c3e50)";

    cloud.classList.remove("hidden");
    createClouds();
  } else {
    body.style.background =
      "linear-gradient(to bottom right, #89f7fe, #66a6ff)";
  }
}

// ❌ Error UI
function showError(message) {
  const error = document.getElementById("errorMsg");
  error.innerText = message;
  error.classList.remove("hidden");

  setTimeout(() => {
    error.classList.add("hidden");
  }, 3000);
}

// 🔍 Search
function handleSearch() {
  const city = document.getElementById("searchInput").value.trim();

  if (!city) return showError("Enter a city");

  saveCity(city);
  getWeather(city);
  city = "";
}

// 🌍 Get Weather
async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    updateUI(data);
    getForecast(city);
  } catch (err) {
    showError(err.message);
  }
}

// 📊 Update UI
function updateUI(data) {
  currentTemp = Math.round(data.main.temp);

  document.getElementById("temperature").innerText = currentTemp + "°C";
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText =
    Math.round(data.main.temp) + "°C";
  document.getElementById("condition").innerText = data.weather[0].main;

  document.getElementById("humidity").innerText = data.main.humidity + "%";

  document.getElementById("wind").innerText = data.wind.speed + " km/h";

  document.getElementById("feelsLike").innerText =
    Math.round(data.main.feels_like) + "°C";

  document.getElementById("pressure").innerText = data.main.pressure + " hPa";

  setWeatherTheme(data.weather[0].main);

  if (data.main.temp > 40) {
    showError("🔥 Extreme Heat Warning!");
  }
}

//Temp C/F
function toggleTemp() {
  const tempEl = document.getElementById("temperature");
  const btn = event.target;

  if (isCelsius) {
    const f = ((currentTemp * 9) / 5 + 32).toFixed(1);
    tempEl.innerText = f + "°F";
    btn.innerText = "Switch to °C";
  } else {
    tempEl.innerText = currentTemp + "°C";
    btn.innerText = "Switch to °F";
  }

  isCelsius = !isCelsius;
}

// 📅 Forecast
async function getForecast(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`,
    );

    const data = await res.json();
    updateForecastUI(data);
  } catch {
    showError("Forecast error");
  }
}

function updateForecastUI(data) {
  const container = document.getElementById("forecastContainer");
  container.innerHTML = "";

  const daily = data.list.filter((item) => item.dt_txt.includes("12:00:00"));

  daily.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
      weekday: "short",
    });

    const temp = Math.round(day.main.temp);
    const humidity = day.main.humidity;
    const icon = day.weather[0].icon;

    container.innerHTML += `
  <div class="glass p-4 text-center hover:scale-105 transition glow">
    <p class="text-white/80">${date}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="mx-auto"/>
    <p class="text-xl font-bold">${temp}°C</p>
    <p class="text-sm text-white/70">${humidity}%</p>
  </div>
`;
  });
}

// 📍 Location
function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`,
    );

    const data = await res.json();

    updateUI(data);
    getForecast(data.name);
  });
}

// 🕓 Local Storage
function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];

  if (!cities.includes(city)) {
    cities.unshift(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  showRecentCities();
}

function showRecentCities() {
  const dropdown = document.getElementById("recentCities");
  const cities = JSON.parse(localStorage.getItem("cities")) || [];

  dropdown.innerHTML = `<option value="">Recent Searches</option>`;

  cities.forEach((city) => {
    dropdown.innerHTML += `<option value="${city}">${city}</option>`;
  });
}

function selectCity() {
  const city = document.getElementById("recentCities").value;
  if (city) getWeather(city);
}

//UI For Rain Effects
function createRain() {
  const container = document.getElementById("rainContainer");
  container.innerHTML = "";

  for (let i = 0; i < 100; i++) {
    const drop = document.createElement("div");
    drop.classList.add("rain-drop");

    drop.style.left = Math.random() * 100 + "vw";
    drop.style.animationDuration = Math.random() * 1 + 0.5 + "s";
    drop.style.opacity = Math.random();

    container.appendChild(drop);
  }
}

//UI for Clouds
function createClouds() {
  const container = document.getElementById("cloudContainer");
  container.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");

    const size = Math.random() * 100 + 80;

    cloud.style.width = size + "px";
    cloud.style.height = size / 2 + "px";
    cloud.style.top = Math.random() * 80 + "vh";
    cloud.style.left = Math.random() * 100 + "vw";
    cloud.style.animationDuration = Math.random() * 20 + 20 + "s";

    container.appendChild(cloud);
  }
}

window.onload = showRecentCities;
