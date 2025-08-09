document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements
    const cityInput = document.getElementById('cityInput');
    const weatherContainer = document.getElementById('weatherContainer');

    // OpenWeatherMap API Key
    // IMPORTANT: This API key is provided by the user. If you are using this code,
    // ensure you have a valid API key from https://openweathermap.org/api
    const API_KEY = '83d6377cfecc3ed5456a2028f6249c98'; //This is my API replace it with yours

    async function getWeatherData(city) {
        // Display a loading message while fetching data
        weatherContainer.innerHTML = `<p>Loading weather data for "${city}"...</p>`;

        // Construct the API URL using the city and API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        try {
            // Make the API request
            const response = await fetch(url);
            const data = await response.json(); 

            if (response.ok) {
                displayWeather(data); 
            } else {
                displayError(data.message || 'Could not find weather data for that city. Please check the spelling.');
            }
        } catch (error) {
            // Catch any network-related errors (e.g., no internet connection)
            console.error('Network or parsing error:', error);
            displayError('Failed to fetch weather data. Please check your internet connection or try again later.');
        }
    }

  
    function displayWeather(data) {
        const { name, sys, main, weather, wind } = data;

        const cityName = name;
        const countryCode = sys?.country || 'N/A'; 
        const temperature = main?.temp;
        const feelsLike = main?.feels_like;
        const humidityValue = main?.humidity;
        const windSpeed = wind?.speed; 
        const weatherCondition = weather[0]?.main;
        const weatherDescription = weather[0]?.description;
        const iconCode = weather[0]?.icon;

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const formattedDescription = weatherDescription
            ? weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)
            : 'N/A';

        weatherContainer.innerHTML = `
            <h3>${cityName}, ${countryCode}</h3>
            <img src="${iconUrl}" alt="${weatherDescription || 'Weather icon'}" class="weather-icon">
            <p><strong>${weatherCondition || 'N/A'}</strong> - ${formattedDescription}</p>
            <p>🌡 Temperature: ${temperature !== undefined ? temperature.toFixed(1) : 'N/A'}°C (Feels like: ${feelsLike !== undefined ? feelsLike.toFixed(1) : 'N/A'}°C)</p>
            <p>💧 Humidity: ${humidityValue !== undefined ? humidityValue : 'N/A'}%</p>
            <p>🌬 Wind Speed: ${windSpeed !== undefined ? windSpeed.toFixed(1) : 'N/A'} m/s</p>
        `;
    }

   
    function displayError(message) {
        weatherContainer.innerHTML = `<p class="error">Error: ${message}</p>`;
    }

   
    cityInput.addEventListener('keypress', (event) => {
        // Check if the pressed key is 'Enter'
        if (event.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                // If a city name is entered, fetch its weather data
                getWeatherData(city);
            } else {
                // If the input is empty, display an error message
                displayError('Please enter a city name to get weather information.');
            }
        }
    });

   
});

