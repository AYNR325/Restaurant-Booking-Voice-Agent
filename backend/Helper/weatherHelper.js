const axios = require('axios');

// Weather Helper to fetch weather data based on date
async function getWeather(dateStr) {
  try {
    //uses free tier of OpenWeatherMap API with 5 day / 3 hour forecast data and it will forecast within range of 5 days from current date only 

    const city = 'Mumbai'; // Defaulting to a city for simplicity
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) return "Weather data unavailable (API Key missing)";

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    
    // Simple logic to find a forecast close to the requested date
    // Note: This is a basic approximation.
    const targetDate = new Date(dateStr);
    const forecast = response.data.list.find(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.getDate() === targetDate.getDate();
    });

    if (forecast) {
      const weatherData = {
        condition: forecast.weather[0].main, // e.g., "Rain", "Clear"
        temp: forecast.main.temp,
        description: forecast.weather[0].description // e.g., "light rain"
      };
      console.log("Weather Fetched:", JSON.stringify(weatherData, null, 2));
      return JSON.stringify(weatherData);
    } else {
      return "Weather forecast not available for this date (too far ahead or past).";
    }
  } catch (error) {
    console.error("Weather API Error:", error.message);
    return "Unable to fetch weather.";
  }
}

module.exports = { getWeather };