const cities = require("../data/cities.json")
const { getWeather } = require("../services/weatherService")
const { calculateComfortIndex } = require("../services/comfortIndexService")
const cache = require("../cache/cacheService")



async function getComfortRanking(req,res){

 const cacheKey = "weather-ranking"

 const cached = cache.get(cacheKey)

 if(cached){
  return res.json({cache:"HIT", data:cached})
 }

 const results = []

 for(const city of cities){

  const weather = await getWeather(city.cityCode)

  const score = calculateComfortIndex(weather)

  results.push({
   city: city.name,
   weather: weather.weather[0].description,
   temperature: weather.main.temp,
   score
  })
 }

 results.sort((a,b)=>b.score-a.score)

 cache.set(cacheKey,results)

 res.json({cache:"MISS", data:results})
}



async function getCityWeather(req, res) {

  try {

    const cityId = req.params.cityId;

    const weather = await getWeather(cityId);

    const result = {
      city: weather.name,

      temperature: weather.main.temp,
      feels_like: weather.main.feels_like,

      humidity: weather.main.humidity,
      pressure: weather.main.pressure,

      wind_speed: weather.wind.speed,

      weather_condition: weather.weather[0].main,
      description: weather.weather[0].description,

      cloudiness: weather.clouds.all,
      visibility: weather.visibility,

      sunrise: weather.sys.sunrise,
      sunset: weather.sys.sunset,

      current_time: weather.dt,
      timezone_offset: weather.timezone
    };

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch weather",
      error: error.message
    });

  }
}




module.exports = { getComfortRanking, getCityWeather };