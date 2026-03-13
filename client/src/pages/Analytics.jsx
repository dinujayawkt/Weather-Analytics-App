import { useRankings } from '../hooks/useWeather'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { getComfortLabel } from '../utils/weatherHelpers'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
  Cell,
} from 'recharts'

const COLORS = ['#1D6FF2', '#3ECDE0', '#FF8157', '#FFC82D', '#4ADE80', '#A78BFA', '#F87171', '#FB923C']

function StatCard({ title, value, subtitle, color = 'var(--accent-blue)' }) {
  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color }}>{value}</p>
      {subtitle && <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{subtitle}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 10, padding: '10px 14px', fontSize: 12,
      }}>
        <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{p.value}{p.name === 'Temperature' ? '°C' : ''}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  const { data, cacheStatus, loading, error } = useRankings()

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
      <p style={{ color: '#F87171' }}>Failed to load analytics data: {error}</p>
    </div>
  )
  if (!data) return null

  // Sorted by score (API already sorts desc, but let's keep original order)
  const chartData = data.map(d => ({
    city: d.city,
    Temperature: Math.round(d.temperature),
    Score: d.score,
    ...getComfortLabel(d.score),
  }))

  const avgScore = Math.round(data.reduce((s, d) => s + d.score, 0) / data.length)
  const topCity = data[0]
  const coldestCity = [...data].sort((a, b) => a.temperature - b.temperature)[0]
  const hottestCity = [...data].sort((a, b) => b.temperature - a.temperature)[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Weather Analytics</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
            Comparative analysis of city weather metrics
          </p>
        </div>
        {cacheStatus && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
            background: cacheStatus === 'HIT' ? 'rgba(74,222,128,0.1)' : 'rgba(255,200,45,0.1)',
            color: cacheStatus === 'HIT' ? '#4ADE80' : 'var(--accent-yellow)',
            border: `1px solid ${cacheStatus === 'HIT' ? 'rgba(74,222,128,0.25)' : 'rgba(255,200,45,0.25)'}`,
          }}>
            Cache: {cacheStatus}
          </span>
        )}
      </div>

      {/* Key stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
        <StatCard title="Most Comfortable" value={topCity.city} subtitle={`Score: ${topCity.score}`} color="var(--accent-cyan)" />
        <StatCard title="Average Score" value={avgScore} subtitle="Across all cities" color="#4ADE80" />
        <StatCard title="Hottest City" value={`${Math.round(hottestCity.temperature)}°C`} subtitle={hottestCity.city} color="var(--accent-coral)" />
        <StatCard title="Coolest City" value={`${Math.round(coldestCity.temperature)}°C`} subtitle={coldestCity.city} color="var(--accent-blue)" />
      </div>

      {/* Charts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Comfort Score bar chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            Comfort Score by City
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="city" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Score" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature bar chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            Temperature Comparison (°C)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="city" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Temperature" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar + Score progression */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Radar chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Multi-Metric Radar
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={[
              { metric: 'Score', ...Object.fromEntries(data.map(d => [d.city, d.score])) },
              { metric: 'Temp Fit', ...Object.fromEntries(data.map(d => [d.city, Math.round(Math.max(0, 100 - Math.abs(d.temperature - 22) * 2))])) },
            ]}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              {data.map((d, i) => (
                <Radar key={d.city} name={d.city} dataKey={d.city} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
              ))}
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score table */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            Score Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.map((d, i) => {
              const { label, color } = getComfortLabel(d.score)
              return (
                <div key={d.city}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{d.city}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                        background: `${color}18`, color, border: `1px solid ${color}30`,
                      }}>
                        {label}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 800, color }}>{d.score}</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${d.score}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}99)`,
                      borderRadius: 3, transition: 'width 1.2s ease',
                    }} />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>
                    {Math.round(d.temperature)}°C · {d.weather}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Comfort index formula note */}
          <div style={{
            marginTop: 20, padding: 14,
            background: 'var(--bg-primary)', borderRadius: 10,
            border: '1px solid var(--border-color)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Comfort Index Formula
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Score = 0.4 × TempScore + 0.3 × HumidityScore + 0.3 × WindScore
              <br />
              <span style={{ color: 'var(--accent-cyan)' }}>TempScore</span> = max(0, 100 − |T − 298K|)
              <br />
              <span style={{ color: 'var(--accent-yellow)' }}>HumidityScore</span> = 100 − humidity%
              <br />
              <span style={{ color: 'var(--accent-coral)' }}>WindScore</span> = max(0, 100 − wind×10)
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
