import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { RiSearchLine, RiMenuLine, RiSunLine, RiMoonLine } from 'react-icons/ri'
import { useTheme } from '../../hooks/useTheme'

const pageTitles = {
  '/':           'Dashboard',
  '/rankings':   'City Rankings',
  '/analytics':  'Analytics',
  '/settings':   'Settings',
}

export default function TopBar({ onMenuToggle }) {
  const { pathname } = useLocation()
  const { user } = useAuth0()
  const { isDark, toggleTheme } = useTheme()
  const [searchVal, setSearchVal] = useState('')

  const title = pageTitles[pathname] ?? 'Climatrix'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const topTextPrimary = 'var(--text-primary)'
  const topTextSecondary = 'var(--text-secondary)'
  const searchBg = isDark ? 'var(--bg-card)' : '#FFFFFF'
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
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Search cities…"
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: topTextPrimary, fontSize: 13, width: '100%',
          }}
        />
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
