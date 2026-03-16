import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { RiSearchLine, RiMenuLine, RiSunLine, RiMoonLine, RiMapPin2Line } from 'react-icons/ri'
import { useTheme } from '../../hooks/useTheme'
import { useSearch } from '../../context/SearchContext.jsx'

const CITIES = [
  { id: 1248991, name: 'Colombo' },
  { id: 1850147, name: 'Tokyo' },
  { id: 2643743, name: 'London' },
  { id: 5128581, name: 'New York' },
  { id: 2950159, name: 'Berlin' },
  { id: 2147714, name: 'Sydney' },
  { id: 1816670, name: 'Beijing' },
  { id: 2988507, name: 'Paris' },
  { id: 524901, name: 'Moscow' },
  { id: 1275339, name: 'Mumbai' },
  { id: 1796236, name: 'Shanghai' },
  { id: 3448439, name: 'Sao Paulo' },
]

const pageTitles = {
  '/':           'Dashboard',
  '/rankings':   'City Rankings',
  '/analytics':  'Analytics',
  '/settings':   'Settings',
}

const normalizeCityText = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

export default function TopBar({ onMenuToggle }) {
  const { pathname } = useLocation()
  const { user } = useAuth0()
  const { isDark, toggleTheme } = useTheme()
  const { searchQuery, setSearchQuery, submitSearch } = useSearch()

  const [popup, setPopup] = useState({ visible: false, matched: null, query: '' })
  const popupTimerRef = useRef(null)

  // Clear search input + submitted filter when navigating
  useEffect(() => {
    setSearchQuery('')
    submitSearch('')
    setPopup({ visible: false, matched: null, query: '' })
  }, [pathname, setSearchQuery, submitSearch])

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return
    const q = searchQuery.trim()
    if (!q) return

    const normalizedQuery = normalizeCityText(q)
    const matched = CITIES.find(c => normalizeCityText(c.name) === normalizedQuery) ?? null
    submitSearch(matched ? matched.name : '')

    if (popupTimerRef.current) clearTimeout(popupTimerRef.current)
    setPopup({ visible: true, matched, query: q })
    popupTimerRef.current = setTimeout(
      () => setPopup(p => ({ ...p, visible: false })),
      2500,
    )
    setSearchQuery('')
  }

  const title = pageTitles[pathname] ?? 'Climatrix'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const topTextPrimary = 'var(--text-primary)'
  const topTextSecondary = 'var(--text-secondary)'
  const searchBg = 'var(--bg-card)'
  const searchBorder = 'var(--border-color)'

  return (
    <header
      className="topbar"
      style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--sidebar-bg)',
      flexShrink: 0,
      }}
    >
      {/* Mobile hamburger */}
      <button
        className="topbar-menu md:hidden"
        onClick={onMenuToggle}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: topTextSecondary, padding: 4,
        }}
      >
        <RiMenuLine size={22} />
      </button>

      {/* Page title */}
      <div className="topbar-title" style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: topTextPrimary, lineHeight: 1.2 }}>
          {title}
        </h1>
        <p className="topbar-date" style={{ fontSize: 11, color: topTextSecondary, marginTop: 1 }}>{today}</p>
      </div>

      {/* Search bar */}
      <div className="topbar-search-wrap" style={{ position: 'relative' }}>
        <div
          className="topbar-search"
          style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: searchBg, border: `1px solid ${searchBorder}`,
          borderRadius: 10, padding: '7px 14px', minWidth: 200,
        }}
        >
          <RiSearchLine size={15} style={{ color: topTextSecondary, flexShrink: 0 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search Cities…"
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: topTextPrimary, fontSize: 13, width: '100%',
            }}
          />
        </div>

        {/* Result popup */}
        {popup.visible && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '100%',
            background: isDark ? '#1e2535' : '#ffffff',
            border: `1px solid ${popup.matched ? 'rgba(74,222,128,0.45)' : 'var(--border-color)'}`,
            borderRadius: 10,
            padding: '10px 14px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            color: popup.matched ? '#4ADE80' : 'var(--text-secondary)',
            animation: 'fadeSlideUp 0.2s ease',
          }}>
            {popup.matched
              ? <><RiMapPin2Line size={14} style={{ flexShrink: 0 }} />{popup.matched.name}</>
              : <>No results for &quot;{popup.query}&quot;</>
            }
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <button
        className="topbar-theme"
        onClick={toggleTheme}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: isDark ? 'rgba(255,200,45,0.08)' : 'rgba(29,111,242,0.08)',
          border: `1px solid ${isDark ? 'rgba(255,200,45,0.28)' : 'rgba(29,111,242,0.28)'}`,
          padding: 0,
          marginLeft: 5,
          marginRight: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: isDark ? 'var(--accent-yellow)' : 'var(--accent-blue)',
        }}
      >
        {isDark ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
      </button>

      <div className="hidden md:block" style={{ textAlign: 'right' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: topTextPrimary }}>
          Meteorologist
        </p>
        <p style={{ fontSize: 11, color: topTextSecondary }}>
          {user?.email || user?.name || 'User'}
        </p>
      </div>
    </header>
  )
}
