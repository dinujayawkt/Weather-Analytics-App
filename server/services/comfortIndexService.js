function calculateComfortIndex(weather){

 const temp = weather.main.temp
 const humidity = weather.main.humidity
 const wind = weather.wind.speed

 const tempScore = Math.max(0,100 - Math.abs(temp-298))
 const humidityScore = 100 - humidity
 const windScore = 100 - (wind * 10)

 const score =
 (0.4*tempScore) +
 (0.3*humidityScore) +
 (0.3*windScore)

 return Math.round(score)
}

module.exports = { calculateComfortIndex }