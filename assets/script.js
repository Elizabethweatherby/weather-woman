$(document).ready(function () {

});
// Displays today's date
function displayDate() {
    var currentDate = dayjs().format('dddd, MMMM DD, YYYY');
    var header = document.querySelector('#currentDate');
    header.innerText = currentDate;
}

displayDate();


function getForecast() {
    var apiKey = "2fb741816a067a27d0300c6b4d43a620";
    var city = document.getElementById("city-text").value;
    var forecastContainer = document.getElementById("forecast");
    var currentDateElement = document.getElementById("currentDate");
    var temperatureElement = document.getElementById("temperature");
    var windElement = document.getElementById("wind");
    var humidityElement = document.getElementById("humidity");
    // Saves the entered city to local storage
    saveCity(city);

    //API request
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            forecastContainer.innerHTML = "";

            // Displays the current forecast
            var currentDay = data.list[0];
            var currentDate = currentDay.dt_txt.split(" ")[0];
            currentDateElement.textContent = currentDate;


            // Displays the forecast for each day
            for (let i = 0; i < data.list.length; i += 8) {
                var forecast = data.list[i];

                var date = forecast.dt_txt.split(" ")[0];

                var card = document.createElement("div");
                card.classList.add("card");

                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                var dateElement = document.createElement("h3");
                dateElement.textContent = date;
                cardBody.appendChild(dateElement);

                var temperatureElement = document.createElement("p");
                temperatureElement.textContent = `TEMP: ${forecast.main.temp}°F`;
                cardBody.appendChild(temperatureElement);

                var windElement = document.createElement("p");
                windElement.textContent = `WIND: ${forecast.wind.speed} mph`;
                cardBody.appendChild(windElement);

                var humidityElement = document.createElement("p");
                humidityElement.textContent = `HUMIDITY: ${forecast.main.humidity}%`;
                cardBody.appendChild(humidityElement);
                card.appendChild(cardBody);

                forecastContainer.appendChild(card);
            }
        })
        .catch(error => {
            console.log("An error occurred:", error);
        });
}

// Function to save the entered city to local storage
function saveCity(city) {
    let cities = localStorage.getItem("cities");

    if (cities) {
        cities = JSON.parse(cities);
        cities.push(city);
    } else {
        cities = [city];
    }

    localStorage.setItem("cities", JSON.stringify(cities));
    displaySavedCity();
}

function displaySavedCity() {
    var citiesContainer = document.getElementById("saved-city");
    var cities = JSON.parse(localStorage.getItem("cities"));
    citiesContainer.innerHTML = "";

    if (cities && cities.length > 0) {
        for (let i = 0; i < cities.length; i++) {
            var cityElement = document.createElement("div");
            cityElement.textContent = cities[i];
            cityElement.classList.add("saved-city");
            cityElement.addEventListener("click", () => {
                document.getElementById("city-text").value = cities[i];
                getForecast();
            });
            citiesContainer.appendChild(cityElement);
        }
    } else {
        var noCitiesElement = document.createElement("p");
        noCitiesElement.textContent = "No saved cities";
        citiesContainer.appendChild(noCitiesElement);
    }
}