import { useState } from 'react'
import { useRankings } from '../hooks/useWeather'
import { useTheme } from '../hooks/useTheme'
import { getComfortLabel, getWeatherIcon } from '../utils/weatherHelpers'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { RiRefreshLine, RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri'

function RankingCard({ rank, city, weather, temperature, score }) {
  const { label, color } = getComfortLabel(score)
  const icon = getWeatherIcon('', weather)
  const medalColors = ['#FFC82D', '#C0C0C0', '#CD7F32']
  const medalEmoji  = ['🥇', '🥈', '🥉']
  const pct = Math.min(100, Math.max(0, score))

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
        borderTop: rank === 1 ? `3px solid ${color}` : undefined,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.35)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: rank <= 3 ? 22 : 16, fontWeight: 800,
            background: rank <= 3 ? `${medalColors[rank - 1]}20` : 'var(--border-color)',
            color: rank <= 3 ? medalColors[rank - 1] : 'var(--text-secondary)',
            border: `1px solid ${rank <= 3 ? medalColors[rank - 1] + '40' : 'transparent'}`,
          }}>
            {rank <= 3 ? medalEmoji[rank - 1] : rank}
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{city}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: 2 }}>
              {weather}
            </p>
          </div>
        </div>
        <div style={{ fontSize: 36, lineHeight: 1 }}>
          {icon}
        </div>
      </div>

      {/* Temperature */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>Temperature</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>
            {Math.round(temperature)}°C
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>Comfort Score</p>
          <p style={{ fontSize: 26, fontWeight: 800, color }}>
            {score}
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginLeft: 2 }}>/100</span>
          </p>
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Comfort Index</span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 20,
            background: `${color}18`, color, border: `1px solid ${color}30`,
          }}>
            {label}
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}BB)`,
            borderRadius: 3, transition: 'width 1.2s ease',
          }} />
        </div>
      </div>
    </div>
  )
}

export default function Rankings() {
  const { isDark } = useTheme()
  const { data, cacheStatus, loading, error, refetch } = useRankings()
  const [sortKey, setSortKey] = useState('score')
  const [sortDir, setSortDir] = useState('desc')
  const cacheHitBg = isDark ? 'rgba(74,222,128,0.1)' : 'rgba(22,163,74,0.14)'
  const cacheHitBorder = isDark ? 'rgba(74,222,128,0.25)' : 'rgba(21,128,61,0.3)'
  const cacheHitColor = isDark ? '#4ADE80' : '#166534'

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = data
    ? [...data].sort((a, b) => {
        const mult = sortDir === 'desc' ? -1 : 1
        return mult * (a[sortKey] - b[sortKey])
      })
    : []

  // Reassign rank based on score (original API order is score-sorted)
  const originalRanks = {}
  data?.forEach((r, i) => { originalRanks[r.city] = i + 1 })

  const SortBtn = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      style={{
        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
        background: sortKey === field ? 'var(--accent-blue)' : 'var(--bg-card)',
        color: sortKey === field ? 'white' : 'var(--text-secondary)',
        border: `1px solid ${sortKey === field ? 'var(--accent-blue)' : 'var(--border-color)'}`,
        transition: 'all 0.2s',
      }}
    >
      {label}
      {sortKey === field && (
        sortDir === 'desc' ? <RiArrowDownLine size={12} /> : <RiArrowUpLine size={12} />
      )}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>City Comfort Rankings</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
            Ranked by Comfort Index Score — Most Comfortable to Least
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {cacheStatus && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
              background: cacheStatus === 'HIT' ? cacheHitBg : 'rgba(255,200,45,0.1)',
              color: cacheStatus === 'HIT' ? cacheHitColor : 'var(--accent-yellow)',
              border: `1px solid ${cacheStatus === 'HIT' ? cacheHitBorder : 'rgba(255,200,45,0.25)'}`,
            }}>
              Cache: {cacheStatus}
            </span>
          )}
          <button
            onClick={refetch}
            style={{
              padding: '7px 14px', borderRadius: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
            }}
          >
            <RiRefreshLine size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Sort controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', alignSelf: 'center', marginRight: 4 }}>Sort by:</span>
        <SortBtn field="score" label="Comfort Score" />
        <SortBtn field="temperature" label="Temperature" />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#F87171', marginBottom: 8 }}>Failed to load ranking data</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      ) : (
        <>
          {/* Legend */}
          <div className="glass-card" style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Comfort Index Scale:</p>
              {[
                { label: 'Excellent 80–100', color: '#4ADE80' },
                { label: 'Good 65–79', color: '#3ECDE0' },
                { label: 'Moderate 50–64', color: '#FFC82D' },
                { label: 'Uncomfortable 35–49', color: '#FF8157' },
                { label: 'Poor 0–34', color: '#F87171' },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
            animation: 'fadeSlideUp 0.4s ease',
          }}>
            {sorted.map((r) => (
              <RankingCard
                key={r.city}
                rank={originalRanks[r.city]}
                city={r.city}
                weather={r.weather}
                temperature={r.temperature}
                score={r.score}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
