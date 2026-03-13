import { RiMapPin2Line, RiCalendarLine } from 'react-icons/ri'
import { getWeatherIcon, getWeatherGradient, kelvinToCelsius } from '../../utils/weatherHelpers'

export default function CurrentWeatherCard({ data, scoreData, selectedCityId, onCityChange, cities }) {
  if (!data) return null

  const tempC = typeof data.temperature === 'number'
    ? Math.round(data.temperature)
    : Math.round(kelvinToCelsius(data.temperature))

  const feelsC = typeof data.feels_like === 'number'
    ? Math.round(data.feels_like)
    : null

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

  const gradient = getWeatherGradient(data.weather_condition)
  const icon = getWeatherIcon(data.weather_condition, data.description)

  return (
    <div style={{
      background: gradient,
      borderRadius: 20,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 280,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      {/* Background decorative circle */}
      <div style={{
        position: 'absolute', right: -40, top: -40,
        width: 180, height: 180, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 20, bottom: -60,
        width: 140, height: 140, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
      }} />

      {/* City selector */}
      <div>
        <select
          value={selectedCityId}
          onChange={e => onCityChange(Number(e.target.value))}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, padding: '5px 10px',
            color: 'white', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', outline: 'none',
          }}
        >
          {cities.map(c => (
            <option key={c.id} value={c.id} style={{ background: '#1A1D24', color: 'white' }}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Temperature + icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ fontSize: 64, fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: -2 }}>
            {tempC}°
          </div>
          {feelsC !== null && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              Feels like {feelsC}°C
            </div>
          )}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 72, opacity: 0.9, lineHeight: 1 }}>
          {icon}
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: 500, textTransform: 'capitalize' }}>
        {data.description}
      </div>

      {/* Location & date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
          <RiMapPin2Line size={14} />
          <span>{data.city}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
          <RiCalendarLine size={14} />
          <span>{dateStr} &bull; {timeStr}</span>
        </div>
      </div>

      {/* Comfort score badge */}
      {scoreData && (
        <div style={{
          position: 'absolute', top: 24, right: 24,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 10, padding: '6px 12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{scoreData.score}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>COMFORT</div>
        </div>
      )}
    </div>
  )
}
