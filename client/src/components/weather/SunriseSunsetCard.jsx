import { formatTime } from '../../utils/weatherHelpers'
import { RiSunLine, RiMoonLine } from 'react-icons/ri'
import InfoTooltip from '../ui/InfoTooltip'

export default function SunriseSunsetCard({ sunrise, sunset, currentTime }) {
  const sr = sunrise || 0
  const ss = sunset || 0
  const now = currentTime || Math.floor(Date.now() / 1000)

  const dayDuration = ss - sr
  const elapsed = Math.max(0, Math.min(now - sr, dayDuration))
  const progress = dayDuration > 0 ? elapsed / dayDuration : 0

  // Arc geometry
  const W = 280, H = 108, r = 96
  const cx = W / 2, cy = H  // endpoints sit at the very bottom of the viewBox
  const startAngle = Math.PI
  const endAngle = 2 * Math.PI
  const sunAngle = startAngle + progress * Math.PI

  const toXY = (ang) => ({
    x: cx + r * Math.cos(ang),
    y: cy + r * Math.sin(ang),
  })

  const sunPos = toXY(sunAngle)
  const trackStart = toXY(startAngle)
  const trackEnd = toXY(endAngle)
  const progressEnd = toXY(sunAngle)

  return (
    <div className="glass-card" style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Sunrise &amp; Sunset</p>
        <InfoTooltip text="This arc shows daytime progress between sunrise and sunset. It helps you see how far the day has advanced in your selected city." />
      </div>

      {/* SVG arc */}
      <div style={{ display: 'flex', justifyContent: 'center', overflow: 'visible' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: 360, display: 'block' }}>
          {/* Track arc */}
          <path
            d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
            fill="none" stroke="var(--border-color)" strokeWidth={3} strokeDasharray="4 4"
          />
          {/* Progress arc */}
          {progress > 0 && (
            <path
              d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${progress > 0.5 ? 1 : 0} 1 ${progressEnd.x} ${progressEnd.y}`}
              fill="none"
              stroke="url(#sunGrad)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}
          <defs>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF8157" />
              <stop offset="100%" stopColor="#FFC82D" />
            </linearGradient>
          </defs>
          {/* Sun circle */}
          <circle cx={sunPos.x} cy={sunPos.y} r={6} fill="#FFC82D" filter="url(#sunGlow)" />
          <defs>
            <filter id="sunGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Times */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RiSunLine size={16} style={{ color: '#FF8157' }} />
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Sunrise</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{formatTime(sr)}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Sunset</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{formatTime(ss)}</p>
          </div>
          <RiMoonLine size={16} style={{ color: '#FFC82D' }} />
        </div>
      </div>
    </div>
  )
}
