import { getComfortLabel, getWeatherIcon } from '../../utils/weatherHelpers'

export default function CityOverviewCard({ rank, city, weather, temperature, score, isTop }) {
  const { label, color } = getComfortLabel(score)
  const icon = getWeatherIcon('', weather)

  const medalColors = ['#FFC82D', '#C0C0C0', '#CD7F32']
  const medalEmojis = ['🥇', '🥈', '🥉']

  return (
    <div
      className="glass-card"
      style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        transition: 'background 0.2s',
        cursor: 'default',
        background: isTop ? 'rgba(29,111,242,0.06)' : undefined,
        borderColor: isTop ? 'rgba(29,111,242,0.2)' : undefined,
      }}
    >
      {/* Rank */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: rank <= 3 ? 18 : 13,
        fontWeight: 700,
        background: rank <= 3 ? `${medalColors[rank - 1]}18` : 'var(--border-color)',
        color: rank <= 3 ? medalColors[rank - 1] : 'var(--text-secondary)',
      }}>
        {rank <= 3 ? medalEmojis[rank - 1] : rank}
      </div>

      {/* Weather icon */}
      <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>
        {icon}
      </div>

      {/* City name & description */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {city}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: 1 }}>
          {weather}
        </p>
      </div>

      {/* Temperature */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
          {Math.round(temperature)}°C
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, marginTop: 2,
          background: `${color}18`, color,
          border: `1px solid ${color}30`,
        }}>
          {score} · {label}
        </div>
      </div>
    </div>
  )
}
