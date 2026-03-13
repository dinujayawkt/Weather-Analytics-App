import InfoTooltip from '../ui/InfoTooltip'

// Generic mini highlight card (Humidity, Visibility, Feels Like, Pressure)
export default function HighlightCard({ label, value, unit, note, icon: Icon, color = 'var(--accent-cyan)', progress, description }) {
  return (
    <div className="glass-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</p>
        {Icon && (
          <InfoTooltip text={description || `${label} details`}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: `${color}18`,
              border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color,
            }}>
              <Icon size={15} />
            </div>
          </InfoTooltip>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{unit}</span>}
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div style={{ height: 4, background: 'var(--border-color)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${Math.min(100, progress)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}AA)`,
            borderRadius: 2,
            transition: 'width 1s ease',
          }} />
        </div>
      )}

      {note && (
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{note}</p>
      )}
    </div>
  )
}
