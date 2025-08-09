// script.js

// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements
    const cityInput = document.getElementById('cityInput');
    const weatherContainer = document.getElementById('weatherContainer');

    // OpenWeatherMap API Key
    // IMPORTANT: This API key is provided by the user. If you are using this code,
    // ensure you have a valid API key from https://openweathermap.org/api
    const API_KEY = '83d6377cfecc3ed5456a2028f6249c98';

    /**
     * Fetches weather data for a given city from the OpenWeatherMap API.
     * Displays loading, success, or error messages in the weatherContainer.
     * @param {string} city - The name of the city to fetch weather for.
     */
    async function getWeatherData(city) {
        // Display a loading message while fetching data
        weatherContainer.innerHTML = `<p>Loading weather data for "${city}"...</p>`;

        // Construct the API URL using the city and API key
        // `units=metric` is used to get temperature in Celsius
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        try {
            // Make the API request
            const response = await fetch(url);
            const data = await response.json(); // Parse the JSON response

            // Check if the response was successful (HTTP status 200-299)
            if (response.ok) {
                displayWeather(data); // Display the weather information
            } else {
                // If the response was not OK, handle the API-specific error message
                // Use the message from the API response, or a generic one if not available
                displayError(data.message || 'Could not find weather data for that city. Please check the spelling.');
            }
        } catch (error) {
            // Catch any network-related errors (e.g., no internet connection)
            console.error('Network or parsing error:', error);
            displayError('Failed to fetch weather data. Please check your internet connection or try again later.');
        }
    }

    /**
     * Displays the fetched weather information in the weatherContainer.
     * @param {object} data - The weather data object received from the API.
     */
    function displayWeather(data) {
        // Destructure relevant data points for easier access
        const { name, sys, main, weather, wind } = data;

        // Extract specific values, providing defaults if necessary (though OpenWeatherMap usually provides these)
        const cityName = name;
        const countryCode = sys?.country || 'N/A'; // Use optional chaining for safety
        const temperature = main?.temp;
        const feelsLike = main?.feels_like;
        const humidityValue = main?.humidity;
        const windSpeed = wind?.speed; // Speed in meters/second
        const weatherCondition = weather[0]?.main;
        const weatherDescription = weather[0]?.description;
        const iconCode = weather[0]?.icon;

        // Construct the URL for the weather icon
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Format the description to have the first letter capitalized
        const formattedDescription = weatherDescription
            ? weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)
            : 'N/A';

        // Update the weatherContainer with the formatted weather information
        weatherContainer.innerHTML = `
            <h3>${cityName}, ${countryCode}</h3>
            <img src="${iconUrl}" alt="${weatherDescription || 'Weather icon'}" class="weather-icon">
            <p><strong>${weatherCondition || 'N/A'}</strong> - ${formattedDescription}</p>
            <p>🌡 Temperature: ${temperature !== undefined ? temperature.toFixed(1) : 'N/A'}°C (Feels like: ${feelsLike !== undefined ? feelsLike.toFixed(1) : 'N/A'}°C)</p>
            <p>💧 Humidity: ${humidityValue !== undefined ? humidityValue : 'N/A'}%</p>
            <p>🌬 Wind Speed: ${windSpeed !== undefined ? windSpeed.toFixed(1) : 'N/A'} m/s</p>
        `;
    }

    /**
     * Displays an error message in the weatherContainer.
     * @param {string} message - The error message to display.
     */
    function displayError(message) {
        weatherContainer.innerHTML = `<p class="error">Error: ${message}</p>`;
    }

    // Add an event listener to the city input field
    // This listens for the 'keypress' event and specifically checks for the 'Enter' key
    cityInput.addEventListener('keypress', (event) => {
        // Check if the pressed key is 'Enter'
        if (event.key === 'Enter') {
            const city = cityInput.value.trim(); // Get the trimmed value from the input field
            if (city) {
                // If a city name is entered, fetch its weather data
                getWeatherData(city);
            } else {
                // If the input is empty, display an error message
                displayError('Please enter a city name to get weather information.');
            }
        }
    });

    // Optional: Uncomment the line below to load weather for a default city
    // when the app starts.
    // getWeatherData('London');
});
