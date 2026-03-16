import { useEffect, useRef, useState } from 'react'
import { RiMapPin2Line, RiCalendarLine } from 'react-icons/ri'
import { getWeatherIcon, getWeatherGradient, kelvinToCelsius } from '../../utils/weatherHelpers'

export default function CurrentWeatherCard({ data, scoreData, selectedCityId, onCityChange, cities }) {
  if (!data) return null

  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false)
  const [hoveredCityId, setHoveredCityId] = useState(null)
  const cityMenuRef = useRef(null)
  const selectedCity = cities.find(c => c.id === selectedCityId) ?? cities[0]

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cityMenuRef.current && !cityMenuRef.current.contains(event.target)) {
        setIsCityMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleCitySelect = (cityId) => {
    onCityChange(cityId)
    setIsCityMenuOpen(false)
    setHoveredCityId(null)
  }

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
      <div ref={cityMenuRef} style={{ position: 'relative', width: 'fit-content' }}>
        <button
          type='button'
          onClick={() => setIsCityMenuOpen(open => !open)}
          style={{
            background: 'rgba(15, 23, 42, 0.45)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 10,
            padding: '8px 12px',
            color: 'white',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.2,
            cursor: 'pointer',
            minWidth: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span>{selectedCity?.name ?? 'Select city'}</span>
          <span
            style={{
              fontSize: 12,
              opacity: 0.9,
              transform: isCityMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s ease',
            }}
          >
            ▾
          </span>
        </button>

        {isCityMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              minWidth: 160,
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 12,
              overflowX: 'hidden',
              overflowY: 'auto',
              maxHeight: 240,
              overscrollBehavior: 'contain',
              boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
              backdropFilter: 'blur(8px)',
              zIndex: 6,
            }}
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            {cities.map((c, index) => (
              <button
                type='button'
                key={c.id}
                onClick={() => handleCitySelect(c.id)}
                onMouseEnter={() => setHoveredCityId(c.id)}
                onMouseLeave={() => setHoveredCityId(null)}
                style={{
                  width: '100%',
                  border: 'none',
                  textAlign: 'left',
                  padding: '10px 12px',
                  fontSize: 13,
                  fontWeight: c.id === selectedCityId ? 700 : 500,
                  color: 'white',
                  cursor: 'pointer',
                  background: c.id === selectedCityId
                    ? 'rgba(29, 130, 176, 0.25)'
                    : hoveredCityId === c.id
                      ? 'rgba(148, 163, 184, 0.35)'
                      : 'transparent',
                  transition: 'background-color 0.15s ease',
                  borderBottom: index < cities.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
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
