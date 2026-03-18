const apiKey = "b8f5c5684a89524b67418d88a6d5a8ee";

// 🌈 Dynamic Theme
function setWeatherTheme(condition) {
  const body = document.body;

  if (condition === "Rain") {
    body.style.background =
      "linear-gradient(to bottom right, #4b6cb7, #182848)";
  } else if (condition === "Clear") {
    body.style.background =
      "linear-gradient(to bottom right, #fceabb, #f8b500)";
  } else if (condition === "Clouds") {
    body.style.background =
      "linear-gradient(to bottom right, #d7d2cc, #304352)";
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
      <div class="bg-white/70 rounded-xl p-4 text-center shadow-md hover:scale-105 transition">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/>
        <p class="font-bold">${temp}°C</p>
        <p class="text-sm">${humidity}%</p>
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

window.onload = showRecentCities;
