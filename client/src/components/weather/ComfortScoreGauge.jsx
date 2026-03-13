import { getComfortLabel } from '../../utils/weatherHelpers'

export default function ComfortScoreGauge({ score, size = 120 }) {
  const { label, color } = getComfortLabel(score ?? 0)
  const r = (size / 2) - 12
  const circumference = 2 * Math.PI * r
  const pct = Math.min(Math.max((score ?? 0) / 100, 0), 1)
  const offset = circumference * (1 - pct)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--border-color)" strokeWidth={8}
        />
        {/* Score arc — starts at top (-90°) */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.2s ease, stroke 0.5s' }}
        />
        {/* Score text */}
        <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="var(--text-primary)" fontSize={size * 0.22} fontWeight="800">
          {score ?? '--'}
        </text>
        <text x={size / 2} y={size / 2 + size * 0.14} textAnchor="middle" fill={color} fontSize={size * 0.09} fontWeight="600">
          {label}
        </text>
      </svg>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Comfort Score</p>
    </div>
  )
}
