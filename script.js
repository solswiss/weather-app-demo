const cityIn = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const searchCity = document.querySelector('.search-city');
const search404 = document.querySelector('.search-404');
const returnBtn = document.querySelector('.return-btn');

const weatherInfo = document.querySelector('.weather-info');
const cityTxt = document.querySelector('.city-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const windTxt = document.querySelector('.wind-value-txt');
const summaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastsInfo = document.querySelector('.forecast-items-container');

const feelsLikeValue = document.querySelector('.feels-like-value');
const minTempValue = document.querySelector('.min-temp-value');
const maxTempValue = document.querySelector('.max-temp-value');
const pressureValue = document.querySelector('.pressure-value');
const humidityValue = document.querySelector('.humidity-value');
const windSpeedValue = document.querySelector('.wind-speed-value');
const windDegValue = document.querySelector('.wing-deg-value');

const mainContainer = document.querySelector('.main-container');
const theme = document.querySelector('html').classList[0];

const SILLY_CODE = "getsillysicily";
var silly = false;

const HP_TO_HG_RATIO = 0.02952998057228;
const MS_TO_MPH_RATIO = 2.237;

// this is a key for the free plan Current Weather from openweathermap.org
const apiKey = '27e0c46f2b227d1c7d10bf4a9d3a3b37';

updateWeatherInfo('Seattle');

const updateWithCity = () => {
    let prompt = cityIn.value.trim();
    if (prompt != '') {
        if (prompt == "getsillysicily") {
            console.log("silly activated");
            silly = !silly;
            return
        }
        updateWeatherInfo(cityIn.value);
        cityIn.value = '';
        cityIn.blur();
    }
}

searchBtn.addEventListener('click', () => {
    updateWithCity();
})

cityIn.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityIn.value.trim() != '') {
        updateWithCity();
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id <= 800) return 'clear.svg';
    else return 'clouds.svg';
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod != 200) {
        showDisplaySection(search404);
        return
    }
    const {
        name: targetCity,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    cityTxt.textContent = targetCity;
    tempTxt.textContent = Math.round(temp) + ' °C';

    let x = "";

    if (!silly) {
        x = main.toLowerCase();
    } else {
        // silly is active!
        switch(main) {
            case "Thunderstorm":
                x = "storms abound";
                break;
            case "Drizzle":
                x = "drizzle sizzle";
                break;
            case "Rain":
                x = "g*d's tears";
                break;
            case "Snow":
                x = "snowfall";
                break;
            case "Atmosphere":
                x = "beware! unusual!";
                break;
            case "Clear":
                x = "sunny";
                break;
            case "Clouds":
                x = "cloudy";
                break;
            case "Mist":
                x = "ashes of cloud";
                break;
            case "Smoke":
                x = "great grey particles";
                break;
            case "Haze":
                x = "big oof";
                break;
            default:
                x = "confusion";
        }
    }
    conditionTxt.textContent = x;
    humidityTxt.textContent = humidity + '%';
    windTxt.textContent = speed + ' m/s';
    summaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
    currentDateTxt.textContent = getCurrentDate();

    await updateForecastsInfo(city);
    await updateConditionsInfo(city);
    updateSchema(main, temp);

    showDisplaySection(weatherInfo);
}

// shit gets weird
function updateTheme() {
    if (theme === "dark" || window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.style.backgroundImage = `url('assets/thomas-tucker-solheimasandur-night.jpg')`;
        document.body.style.height = "100vh";
    } else {
        document.body.style.backgroundImage = "url('assets/marc-wieland-patrouille-suisse.jpg')";
        document.body.style.height = "100vh";
    }
}

function updateSchema(main, temp) {
    updateTheme();

    if (main === "Thunderstorm") {
        if (theme === "dark") mainContainer.style.background = 'linear-gradient(to top, rgb(0,10,30,0.7), rgb(0,10,30,0.3))';
        else mainContainer.style.background = 'linear-gradient(to top, rgb(0,0,0,0.5), rgb(0,0,0,0.2))';
    }
    else if (main === "Drizzle") {
        if (theme === "dark")  mainContainer.style.background = 'linear-gradient(to top, rgb(255,255,255,0.3), rgb(10,20,50,0.15))';
        else  mainContainer.style.background = 'linear-gradient(to top, rgb(255,255,255,0.15), rgb(0,0,50,0.15))';
    }
    else if (main === "Rain") {
        if (theme === "dark")  mainContainer.style.background = 'linear-gradient(to top, rgb(230,250,255,0.4), rgb(10,60,120,0.2))';
        else mainContainer.style.background = 'linear-gradient(to top, rgb(230,250,255,0.25), rgb(0,90,150,0.2))';

    }
    else if (main === "Snow") {
        if (theme === "dark")  mainContainer.style.background = 'linear-gradient(to top, rgb(255,255,255,0.3), rgb(0,20,35,0.25))';
        else  mainContainer.style.background = 'linear-gradient(to top, rgb(255,255,255,0.3), rgb(200,200,255,0.15))';
    }
    else if (main === "Atmosphere") {
        // do nothing
    }
    else if (main === "Clear") {
        if (theme === "dark")  mainContainer.style.background = 'linear-gradient(to top, rgb(0,25,55,0.2), rgb(200,150,30,0.15))';
        else  mainContainer.style.background = 'linear-gradient(to top, rgb(230,245,255,0.3), rgb(255,255,255,0.15))';
    }
     else {
        if (theme === "dark")  mainContainer.style.background = 'linear-gradient(to top, rgb(0,50,100,0.15), rgb(200,200,200,0.1))';
        else  mainContainer.style.background = 'linear-gradient(to top, rgb(0,50,100,0.15), rgb(200,200,200,0.15))';
    }
}

function updateForecastsItems(data) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = data;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;

    forecastsInfo.insertAdjacentHTML('beforeend', forecastItem);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';

    const dt = await getFetchData('dt', city);
    const timezone = await getFetchData('timezone', city);
    const date = getDate(dt, timezone);;

    forecastsInfo.innerHTML = '';

    forecastsData.list.forEach(f => {
        if (f.dt_txt.includes(timeTaken) && !f.dt_txt.includes(date)) {
            updateForecastsItems(f);
        }
        
    })
}

function updateConditions(data){}

async function updateConditionsInfo(city) {
    const conditionData = await getFetchData('weather', city);
    if (conditionData.cod != 200) {
        showDisplaySection(search404);
        return
    }
    const {
        main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
        weather: [{ id, main, description }],
        wind: { speed, deg }
    } = conditionData;

    feelsLikeValue.textContent = `${Math.round(feels_like)} °C (${Math.round(convertToFahrenheit(feels_like))} °F)`;
    minTempValue.textContent = `${Math.round(temp_min)} °C (${Math.round(convertToFahrenheit(temp_min))} °F)`;
    maxTempValue.textContent = `${Math.round(temp_max)} °C (${Math.round(convertToFahrenheit(temp_max))} °F)`;
    pressureValue.textContent = (pressure * HP_TO_HG_RATIO).toFixed(2) + " inHg";
    humidityValue.textContent = Math.round(humidity) + "%";
    windSpeedValue.textContent = `${speed} m/s (${(speed * MS_TO_MPH_RATIO).toFixed(2)} mph)`;
    windDegValue.textContent = deg + "°";
}

function convertToFahrenheit(value) {
    return (value * 9/5) + 32
}

function getDate(dt, timezone) {
    const utc_seconds = parseInt(dt, 10) + parseInt(timezone, 10);
    const utc_milliseconds = utc_seconds * 1000;
    const local_date = new Date(utc_milliseconds).toUTCString();
    return local_date;
}

function showDisplaySection(section) {
    [weatherInfo, searchCity, search404].forEach(section => section.style.display = 'none');
    section.style.display = 'flex';
}

returnBtn.addEventListener('click', () => {
    showDisplaySection(weatherInfo);
})
