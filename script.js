const apiKey = "15b9635e47b19e04fb4cd8cc786da5d6";

const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let marker;

map.on("click", function (e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lon]).addTo(map);

  fetchWeather(lat, lon);
});

async function fetchWeather(lat, lon) {
  const weatherData = document.getElementById("weatherData");
  weatherData.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );

    if (!response.ok) throw new Error("Weather not found");

    const data = await response.json();

    weatherData.innerHTML = `
      <h4>${data.name || "Selected Location"}</h4>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
      <p><strong>${data.main.temp}°C</strong></p>
      <p>${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    weatherData.innerHTML = "Error fetching weather.";
  }
}
