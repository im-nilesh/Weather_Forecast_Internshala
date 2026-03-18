const apiKey = "b8f5c5684a89524b67418d88a6d5a8ee";

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

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    showError("Geolocation not supported");
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );

    const data = await res.json();
    updateUI(data);
  } catch {
    showError("Failed to fetch location weather");
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  getWeatherByCoords(lat, lon);
}

function error() {
  showError("Location access denied");
}

function updateUI(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText =
    Math.round(data.main.temp) + "°C";
  document.getElementById("condition").innerText = data.weather[0].main;

  setWeatherTheme(data.weather[0].main);
}

async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );

    if (!res.ok) {
      throw new Error("City not found");
    }

    const data = await res.json();

    console.log(data);
    updateUI(data);
  } catch (error) {
    alert(error.message);
  }
}

function handleSearch() {
  const city = document.getElementById("searchInput").value.trim();

  if (city === "") {
    showError("Please enter a city");
    return;
  }

  saveCity(city);
  getWeather(city);
}

function showRecentCities() {
  const dropdown = document.getElementById("recentCities");
  const cities = JSON.parse(localStorage.getItem("cities")) || [];

  dropdown.innerHTML = `<option value = "">Recent Searches</option>`;

  cities.forEach((city) => {
    dropdown.innerHTML += `<option value="${city}">${city}</option>`;
  });
}

function selectCity() {
  const city = document.getElementById("recentCities").value;

  if (city) {
    getWeather(city);
  }
}

window.onload = showRecentCities;
