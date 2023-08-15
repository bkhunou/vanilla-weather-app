// Function for getting the current day, date and time
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
let currentDay = days[now.getDay()];
let currentHour = now.getHours();
if (currentHour < 10) {
  currentHour = `0${currentHour}`;
}
let currentMinute = now.getMinutes();
if (currentMinute < 10) {
  currentMinute = `0${currentMinute}`;
}

let currentDateTime = document.querySelector("#currentDateTime");
currentDateTime.innerHTML = `${currentDay}, ${currentHour}:${currentMinute}`;

// Function to get the day of the week
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

// Function to display the forecast for the week using string concatenation
function displayForecast(response) {
  let weeklyForecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  // string concatenation of forecast written in HTML
  let forecastHTML = `<div class="row">`;
  // loop of each day of the week from above function
  weeklyForecast.forEach(function (forecastDay, index) {
    // Creates an index for only the first six days in the forecast
    if (index < 6) {
      forecastHTML += `<div class="col-2">
        <div class="forecast-date">${formatDay(forecastDay.time)}</div>
        <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
          forecastDay.condition.icon
        }.png" alt="" width="56" />
        <div class="forecast-temp">
          <span class="max-temp">H:${Math.round(
            forecastDay.temperature.maximum
          )}°</span> <span class="min-temp"> L:${Math.round(
        forecastDay.temperature.minimum
      )}°</span>
        </div>
      </div>`;
    }
  });

  forecastHTML += `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

// Function to get the forecast from api
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "bt404e491af877ff83o4902d86d401be";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

// Function to find and display the temperature
function displayTemp(response) {
  console.log(response);
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
    );
  celsiusTemperature = response.data.temperature.current;

  getForecast(response.data.coordinates);
}

//Function to search for the city input using axios and api info
function search(city) {
  let apiKey = "bt404e491af877ff83o4902d86d401be";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemp);
}

// Function to call the city search input submitted by the user
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#searchCity").value;
  search(city);
}

let searchForm = document.querySelector("#search");
searchForm.addEventListener("submit", handleSubmit);

// Function to convert celsius and fahrenheit buttons when user clicks them
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheiTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

// Default city called when the application page is loaded
search("Cape Town");
