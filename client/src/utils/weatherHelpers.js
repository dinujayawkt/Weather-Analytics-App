// Weather helpers used across components

export function kelvinToCelsius(k) {
  return k - 273.15
}

export function getWeatherGradient(condition) {
  const c = (condition || '').toLowerCase()
  if (c.includes('thunder')) return 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)'
  if (c.includes('snow'))    return 'linear-gradient(135deg, #74b9d0 0%, #a0c4d8 100%)'
  if (c.includes('rain') || c.includes('drizzle'))
    return 'linear-gradient(135deg, #2c3e50 0%, #3d5a73 100%)'
  if (c.includes('mist') || c.includes('fog') || c.includes('haze'))
    return 'linear-gradient(135deg, #485563 0%, #29323c 100%)'
  if (c.includes('cloud'))   return 'linear-gradient(135deg, #2c3e6e 0%, #3b6a9a 100%)'
  if (c.includes('clear'))   return 'linear-gradient(135deg, #1565c0 0%, #0097A7 100%)'
  return 'linear-gradient(135deg, #1D6FF2 0%, #3ECDE0 100%)'
}

export function getWeatherIcon(condition, description) {
  const c = (condition || '').toLowerCase()
  const d = (description || '').toLowerCase()

  if (c.includes('thunder'))             return '⛈️'
  if (c.includes('snow'))                return '❄️'
  if (c.includes('rain') || d.includes('rain'))  return '🌧️'
  if (c.includes('drizzle'))             return '🌦️'
  if (c.includes('mist') || c.includes('fog') || c.includes('haze'))
    return '🌫️'
  if (d.includes('overcast') || d.includes('broken')) return '☁️'
  if (d.includes('scattered') || d.includes('few'))   return '⛅'
  if (c.includes('cloud'))               return '🌤️'
  if (c.includes('clear'))               return '☀️'
  return '🌡️'
}

export function formatTime(unixTs) {
  if (!unixTs) return '--'
  const d = new Date(unixTs * 1000)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function getComfortLabel(score) {
  if (score >= 80) return { label: 'Excellent',  color: '#4ADE80' }
  if (score >= 65) return { label: 'Good',        color: '#3ECDE0' }
  if (score >= 50) return { label: 'Moderate',    color: '#FFC82D' }
  if (score >= 35) return { label: 'Uncomfortable', color: '#FF8157' }
  return               { label: 'Poor',           color: '#F87171' }
}

export function estimateUVIndex({ cloudiness = 0, currentTime, sunrise, sunset, timezoneOffset = 0 } = {}) {
  if (!currentTime || !sunrise || !sunset) {
    return 0
  }

  const localNow = currentTime + timezoneOffset
  const localSunrise = sunrise + timezoneOffset
  const localSunset = sunset + timezoneOffset

  if (localNow <= localSunrise || localNow >= localSunset) {
    return 0
  }

  const daylightSpan = Math.max(localSunset - localSunrise, 1)
  const solarNoon = localSunrise + daylightSpan / 2
  const halfDaylight = daylightSpan / 2
  const solarDistance = Math.abs(localNow - solarNoon)
  const solarFactor = Math.max(0, 1 - solarDistance / halfDaylight)
  const cloudFactor = Math.max(0.15, 1 - (cloudiness * 0.75 / 100))

  return +(12 * solarFactor * cloudFactor).toFixed(1)
}

export function generateWindData(baseSpeed) {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${(i * 2).toString().padStart(2, '0')}:00`,
    speed: +(baseSpeed + (Math.sin(i * 0.8) * baseSpeed * 0.35)).toFixed(1),
  }))
}
