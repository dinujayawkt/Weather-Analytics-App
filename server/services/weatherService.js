const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY;

async function getWeather(cityId) {

  const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}&units=metric`;

  const response = await axios.get(url);

  return response.data;
}

module.exports = { getWeather };