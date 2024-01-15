const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apikey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);
        this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${this.apikey}&units=metric&lang=pl`;
        this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${this.apikey}&units=metric&lang=pl`;
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url,true);
        req.addEventListener("load",()=>{
            console.log(req.responseText);
            this.currentWeather = JSON.parse(req.responseText);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.forecast = data.list;
                this.drawWeather();
            })
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        this.resultsBlock.innerHTML = '';

        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const temp = this.currentWeather.main.temp;
            const tempFeels = this.currentWeather.main.feels_like;
            const weatherIcon = this.currentWeather.weather[0].icon;
            const weatherDescription = this.currentWeather.weather[0].description;
            const weatherBlock = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                `${temp} &deg;C`,
                `Odczuwalna ${tempFeels} &deg;C`,
                `${weatherIcon}`,
                weatherDescription
            );
            this.resultsBlock.appendChild(weatherBlock);
        }
        if (this.forecast) {
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];

                const date = new Date(weather.dt * 1000);
                const weatherBlock = this.createWeatherBlock(
                    `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                    `${weather.main.temp} &deg;C`,
                    `Odczuwalna ${weather.main.feels_like} &deg;C`,
                    weather.weather[0].icon,
                    weather.weather[0].description
                );
                this.resultsBlock.appendChild(weatherBlock);
            }
        }
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        const dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerHTML = dateString;

        const weatherTemperature= document.createElement("div");
        weatherTemperature.className = "weather-temperature";
        weatherTemperature.innerHTML = temperature;

        const weatherTemperatureFeels = document.createElement("div");
        weatherTemperatureFeels.className = "weather-temperature-feels-like";
        weatherTemperatureFeels.innerHTML = feelsLikeTemperature;

        const weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`

        const weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.innerHTML = description;

        weatherBlock.appendChild(dateBlock);
        weatherBlock.appendChild(weatherTemperature);
        weatherBlock.appendChild(weatherTemperatureFeels);
        weatherBlock.appendChild(weatherIcon);
        weatherBlock.appendChild(weatherDescription);
        return weatherBlock;
    }
}

document.weatherApp = new WeatherApp("7ded80d91f2b280ec979100cc8bbba94", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});

document.querySelector("checkButton").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const query = document.querySelector("#locationInput").value;
        document.weatherApp.getWeather(query);
    }
})