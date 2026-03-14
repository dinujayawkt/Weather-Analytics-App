import { estimateUVIndex } from '../../utils/weatherHelpers'
import { RiSunLine } from 'react-icons/ri'
import InfoTooltip from '../ui/InfoTooltip'

function UVGauge({ value, max = 12 }) {
  const pct = Math.max(0, Math.min(value / max, 1))
  const cx = 100, cy = 88, r = 72
  const startAngle = Math.PI
  const sweepAngle = Math.PI
  const endAngle = startAngle + sweepAngle * pct

  const toXY = (ang) => ({
    x: cx + r * Math.cos(ang),
    y: cy + r * Math.sin(ang),
  })

  const start = toXY(Math.PI)
  const end   = toXY(endAngle)

  const uvColor =
    value <= 2 ? '#4ADE80'
    : value <= 5 ? '#FFC82D'
    : value <= 7 ? '#FF8157'
    : '#F87171'

  return (
    <svg width="100%" viewBox="0 0 200 95" style={{ maxWidth: 240 }}>
      {/* Track */}
      <path
        d={`M ${toXY(Math.PI).x} ${toXY(Math.PI).y} A ${r} ${r} 0 0 1 ${toXY(2 * Math.PI).x} ${toXY(2 * Math.PI).y}`}
        fill="none" stroke="var(--border-color)" strokeWidth={10} strokeLinecap="round"
      />
      {/* Fill */}
      {value > 0 && (
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
          fill="none" stroke={uvColor} strokeWidth={10} strokeLinecap="round"
        />
      )}
      {/* Value text */}
      <text x="100" y="82" textAnchor="middle" fill="var(--text-primary)" fontSize="26" fontWeight="700">
        {value}
      </text>
    </svg>
  )
}

export default function UVIndexCard({ cloudiness, currentTime, sunrise, sunset, timezoneOffset }) {
  const uvIndex = estimateUVIndex({
    cloudiness,
    currentTime,
    sunrise,
    sunset,
    timezoneOffset,
  })
  const label =
    uvIndex <= 2 ? 'Low'
    : uvIndex <= 5 ? 'Moderate'
    : uvIndex <= 7 ? 'High'
    : uvIndex <= 10 ? 'Very High'
    : 'Extreme'

  return (
    <div className="glass-card" style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>UV Index</p>
        <InfoTooltip text="UV Index estimates sun radiation intensity (0 to 12+). Higher UV means stronger sun exposure and higher skin-risk during daytime.">
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(255,200,45,0.1)', border: '1px solid rgba(255,200,45,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-yellow)',
          }}>
            <RiSunLine size={16} />
          </div>
        </InfoTooltip>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <UVGauge value={uvIndex} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
          background: uvIndex <= 2 ? 'rgba(74,222,128,0.15)' : uvIndex <= 5 ? 'rgba(255,200,45,0.15)' : 'rgba(255,129,87,0.15)',
          color: uvIndex <= 2 ? '#4ADE80' : uvIndex <= 5 ? 'var(--accent-yellow)' : 'var(--accent-coral)',
          border: `1px solid ${uvIndex <= 2 ? 'rgba(74,222,128,0.25)' : uvIndex <= 5 ? 'rgba(255,200,45,0.25)' : 'rgba(255,129,87,0.25)'}`,
        }}>
          {label}
        </span>
        <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
          Est. from local daylight & cloud cover
        </p>
      </div>
    </div>
  )
}
