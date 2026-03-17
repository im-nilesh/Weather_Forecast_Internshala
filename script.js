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

function updateUI(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText =
    Math.round(data.main.temp) + "°C";
  document.getElementById("condition").innerText =
    data.weather[0].main;

  setWeatherTheme(data.weather[0].main);
}

const apiKey = "b8f5c5684a89524b67418d88a6d5a8ee";

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
  const city = document.getElementById("searchInput").value;

  if (city.trim() === "") {
    alert("Please enter a city");
    return;
  }

  getWeather(city);
}
