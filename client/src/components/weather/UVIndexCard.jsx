import { estimateUVIndex } from '../../utils/weatherHelpers'
import { RiSunLine } from 'react-icons/ri'

function UVGauge({ value, max = 12 }) {
  const pct = Math.min(value / max, 1)
  const cx = 60, cy = 60, r = 48
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
    <svg width={120} height={70} viewBox="0 0 120 70">
      {/* Track */}
      <path
        d={`M ${toXY(Math.PI).x} ${toXY(Math.PI).y} A ${r} ${r} 0 0 1 ${toXY(2 * Math.PI).x} ${toXY(2 * Math.PI).y}`}
        fill="none" stroke="var(--border-color)" strokeWidth={8} strokeLinecap="round"
      />
      {/* Fill */}
      {value > 0 && (
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${end.x} ${end.y}`}
          fill="none" stroke={uvColor} strokeWidth={8} strokeLinecap="round"
        />
      )}
      {/* Value text */}
      <text x="60" y="58" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
        {value}
      </text>
    </svg>
  )
}

export default function UVIndexCard({ cloudiness }) {
  const uvIndex = estimateUVIndex(cloudiness ?? 0)
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
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'rgba(255,200,45,0.1)', border: '1px solid rgba(255,200,45,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-yellow)',
        }}>
          <RiSunLine size={16} />
        </div>
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
          Est. from cloud cover
        </p>
      </div>
    </div>
  )
}
