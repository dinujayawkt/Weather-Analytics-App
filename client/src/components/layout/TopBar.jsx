import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { RiSearchLine, RiMenuLine } from 'react-icons/ri'

const pageTitles = {
  '/':           'Dashboard',
  '/rankings':   'City Rankings',
  '/analytics':  'Analytics',
  '/settings':   'Settings',
}

export default function TopBar({ onMenuToggle }) {
  const { pathname } = useLocation()
  const { user } = useAuth0()
  const [searchVal, setSearchVal] = useState('')

  const title = pageTitles[pathname] ?? 'Weathery'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <header style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      flexShrink: 0,
    }}>
      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        onClick={onMenuToggle}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', padding: 4,
        }}
      >
        <RiMenuLine size={22} />
      </button>

      {/* Page title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {title}
        </h1>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{today}</p>
      </div>

      {/* Search bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 10, padding: '7px 14px', minWidth: 200,
      }}
        className="hidden sm:flex"
      >
        <RiSearchLine size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <input
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Search cities…"
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: 13, width: '100%',
          }}
        />
      </div>

      {/* User info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="hidden sm:block" style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.name || user?.email || 'User'}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Meteorologist</p>
        </div>
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--border-color)', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-coral), var(--accent-yellow))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'white',
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>
    </header>
  )
}
