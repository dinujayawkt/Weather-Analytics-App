import { useState } from 'react'
import { useRankings, useCityWeather } from '../hooks/useWeather'
import CurrentWeatherCard from '../components/weather/CurrentWeatherCard'
import WindStatusCard from '../components/weather/WindStatusCard'
import UVIndexCard from '../components/weather/UVIndexCard'
import SunriseSunsetCard from '../components/weather/SunriseSunsetCard'
import HighlightCard from '../components/weather/HighlightCard'
import CityOverviewCard from '../components/weather/CityOverviewCard'
import ComfortScoreGauge from '../components/weather/ComfortScoreGauge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import InfoTooltip from '../components/ui/InfoTooltip'
import { useTheme } from '../hooks/useTheme'
import {
  RiDropLine, RiEyeLine, RiTempHotLine, RiDashboardLine,
} from 'react-icons/ri'

// City list matches server/data/cities.json
const CITIES = [
  { id: 1248991, name: 'Colombo',  country: 'LK' },
  { id: 1850147, name: 'Tokyo',    country: 'JP' },
  { id: 2643743, name: 'London',   country: 'GB' },
]

export default function Dashboard() {
  const { isDark } = useTheme()
  const [selectedCityId, setSelectedCityId] = useState(CITIES[0].id)
  const { data: cityData, loading: cityLoading } = useCityWeather(selectedCityId)
  const { data: rankings, loading: rankLoading, cacheStatus } = useRankings()

  const scoreData = rankings?.find(r =>
    r.city.toLowerCase() === CITIES.find(c => c.id === selectedCityId)?.name.toLowerCase()
  )

  const isLoading = cityLoading || rankLoading
  const cacheHitBg = isDark ? 'rgba(74,222,128,0.1)' : 'rgba(22,163,74,0.14)'
  const cacheHitBorder = isDark ? 'rgba(74,222,128,0.25)' : 'rgba(21,128,61,0.3)'
  const cacheHitColor = isDark ? '#4ADE80' : '#166534'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeSlideUp 0.4s ease' }}>
      {/* Cache banner */}
      {cacheStatus && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', background: cacheStatus === 'HIT' ? cacheHitBg : 'rgba(255,200,45,0.1)',
          border: `1px solid ${cacheStatus === 'HIT' ? cacheHitBorder : 'rgba(255,200,45,0.25)'}`,
          borderRadius: 20, fontSize: 11, fontWeight: 600, alignSelf: 'flex-start',
          color: cacheStatus === 'HIT' ? cacheHitColor : 'var(--accent-yellow)',
        }}>
          <RiDashboardLine size={12} />
          Cache: {cacheStatus}
          {cacheStatus === 'MISS' && <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>— fresh data fetched</span>}
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,320px) 1fr', gap: 20 }}
          className="dashboard-grid"
        >
          {/* LEFT PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CurrentWeatherCard
              data={cityData}
              scoreData={scoreData}
              selectedCityId={selectedCityId}
              onCityChange={setSelectedCityId}
              cities={CITIES}
            />
            {/* Comfort range gauge */}
            <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <ComfortScoreGauge score={scoreData?.score} size={130} />
              {rankings && (
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Rank #{(rankings.findIndex(r => r.city.toLowerCase() === CITIES.find(c => c.id === selectedCityId)?.name.toLowerCase()) + 1) || '—'} of {rankings.length} cities
                </p>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="dashboard-right-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: -38 }}>
            {/* Today's Highlights header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Today&apos;s Highlights
              </h2>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>

            {/* Highlight cards grid */}
            <div className="dashboard-highlights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'auto auto auto', gap: 15 }}>
              {/* Wind status — spans row */}
              <div style={{ gridColumn: '1 / 2' }}>
                <WindStatusCard
                  windSpeed={cityData?.wind_speed ? cityData.wind_speed * 3.6 : 0}
                  windDeg={cityData?.wind_deg}
                />
              </div>
              {/* UV Index */}
              <div>
                <UVIndexCard
                  cloudiness={cityData?.cloudiness}
                  currentTime={cityData?.current_time}
                  sunrise={cityData?.sunrise}
                  sunset={cityData?.sunset}
                  timezoneOffset={cityData?.timezone_offset}
                />
              </div>

              {/* Sunrise & Sunset — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <SunriseSunsetCard
                  sunrise={cityData?.sunrise}
                  sunset={cityData?.sunset}
                  currentTime={cityData?.current_time}
                />
              </div>

              {/* Humidity */}
              <HighlightCard
                label="Humidity"
                value={cityData?.humidity ?? '--'}
                unit="%"
                icon={RiDropLine}
                color="#3ECDE0"
                progress={cityData?.humidity}
                description="Humidity is the amount of water vapor in the air. Higher humidity can make temperatures feel warmer and less comfortable."
                note={cityData?.humidity >= 60 ? 'High humidity' : 'Comfortable level'}
              />

              {/* Visibility */}
              <HighlightCard
                label="Visibility"
                value={cityData?.visibility ? (cityData.visibility / 1000).toFixed(1) : '--'}
                unit="km"
                icon={RiEyeLine}
                color="#1D6FF2"
                progress={cityData?.visibility ? Math.min(100, (cityData.visibility / 10000) * 100) : 0}
                description="Visibility indicates how far you can clearly see. Low visibility can come from fog, haze, rain, or heavy particles in the air."
                note={cityData?.visibility < 3000 ? 'Haze is affecting visibility' : 'Clear visibility'}
              />

              {/* Feels Like — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <HighlightCard
                  label="Feels Like"
                  value={cityData?.feels_like !== undefined ? `${Math.round(cityData.feels_like)}` : '--'}
                  unit="°C"
                  icon={RiTempHotLine}
                  color="#FF8157"
                  description="Feels Like is the perceived temperature after combining air temperature with humidity and wind effects."
                  note="Accounts for humidity & wind chill"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom section */}
      {!isLoading && rankings && (
        <div className="dashboard-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Cities overview */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
              Cities — Comfort Ranking
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rankings.map((r, i) => {
                const match = CITIES.find(c => c.name.toLowerCase() === r.city.toLowerCase())
                return (
                  <CityOverviewCard
                    key={r.city}
                    rank={i + 1}
                    city={r.city}
                    weather={r.weather}
                    temperature={r.temperature}
                    score={r.score}
                    isTop={i === 0}
                    isSelected={match?.id === selectedCityId}
                    onSelect={match ? () => setSelectedCityId(match.id) : undefined}
                  />
                )
              })}
            </div>
          </div>

          {/* Pressure + cloudiness info */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Current Conditions
              </h3>
              <InfoTooltip text="Cloudiness is the percentage of sky covered by clouds. It affects sunlight, UV levels, and overall outdoor comfort." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Pressure', value: `${cityData?.pressure ?? '--'} hPa`, progress: cityData?.pressure ? (cityData.pressure / 1050) * 100 : 0, color: '#FFC82D' },
                { label: 'Cloudiness', value: `${cityData?.cloudiness ?? '--'}%`, progress: cityData?.cloudiness, color: '#8B9AB0' },
                { label: 'Wind Speed', value: `${cityData?.wind_speed ? (cityData.wind_speed * 3.6).toFixed(1) : '--'} km/h`, progress: cityData?.wind_speed ? Math.min(100, cityData.wind_speed * 3.6 / 100 * 100) : 0, color: '#3ECDE0' },
                { label: 'Humidity', value: `${cityData?.humidity ?? '--'}%`, progress: cityData?.humidity, color: '#1D6FF2' },
              ].map(({ label, value, progress, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border-color)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${Math.min(100, progress || 0)}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}99)`,
                      borderRadius: 2, transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Weather condition card */}
            {cityData && (
              <div style={{
                marginTop: 20, padding: 14,
                background: 'var(--bg-primary)', borderRadius: 12,
                border: '1px solid var(--border-color)',
              }}>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Current condition</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                  {cityData.description}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {cityData.weather_condition} · {cityData.city}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .dashboard-right-panel { margin-top: 0 !important; }
          .dashboard-highlights-grid { grid-template-columns: 1fr !important; }
          .dashboard-highlights-grid > div { grid-column: auto !important; }
          .dashboard-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
