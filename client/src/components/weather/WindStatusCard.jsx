import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { generateWindData } from '../../utils/weatherHelpers'
import { RiWindyLine } from 'react-icons/ri'

export default function WindStatusCard({ windSpeed, windDeg }) {
  const speed = windSpeed ?? 0
  const data = generateWindData(speed)

  const directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  const cardinalDir = windDeg !== undefined
    ? directions[Math.round(windDeg / 22.5) % 16]
    : '--'

  return (
    <div className="glass-card" style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Wind Status</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
              {speed.toFixed(1)}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>km/h</span>
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(62, 205, 224, 0.12)',
          border: '1px solid rgba(62, 205, 224, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-cyan)',
        }}>
          <RiWindyLine size={18} />
        </div>
      </div>

      {/* Wind area chart */}
      <div style={{ flex: 1, minHeight: 70 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3ECDE0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3ECDE0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} interval={2} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 11 }}
              itemStyle={{ color: 'var(--accent-cyan)' }}
              labelStyle={{ color: 'var(--text-secondary)', fontSize: 10 }}
              formatter={v => [`${v} km/h`, 'Wind']}
            />
            <Area type="monotone" dataKey="speed" stroke="#3ECDE0" strokeWidth={2} fill="url(#windGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Direction */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'rgba(62,205,224,0.15)', border: '1px solid rgba(62,205,224,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: 'var(--accent-cyan)', fontWeight: 700,
        }}>
          {cardinalDir}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          {windDeg !== undefined ? `${windDeg}°` : ''} — Windward
        </span>
      </div>
    </div>
  )
}
