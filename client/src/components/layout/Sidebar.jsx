import { createElement } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useTheme } from '../../hooks/useTheme'
import {
  RiDashboardLine, RiBarChartLine, RiTrophyLine, RiSettings3Line,
  RiSunLine, RiMoonLine,
} from 'react-icons/ri'

const navItems = [
  { to: '/',           icon: RiDashboardLine, label: 'Dashboard'   },
  { to: '/rankings',   icon: RiTrophyLine,    label: 'Rankings'    },
  { to: '/analytics',  icon: RiBarChartLine,  label: 'Analytics'   },
  { to: '/settings',   icon: RiSettings3Line, label: 'Settings'    },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth0()
  const { isDark, toggleTheme } = useTheme()

  const sidebarStyle = {
    width: 68,
    minWidth: 68,
    background: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    gap: 8,
    position: 'relative',
    zIndex: 50,
    transition: 'transform 0.3s ease',
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 40, display: 'block',
          }}
          className="md:hidden"
        />
      )}

      <aside
        style={{
          ...sidebarStyle,
          position: mobileOpen !== undefined ? 'fixed' : 'relative',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100%',
          transform: mobileOpen === false ? 'translateX(-100%)' : 'translateX(0)',
          zIndex: mobileOpen !== undefined ? 50 : 'auto',
        }}
        className={mobileOpen !== undefined ? 'md:relative md:transform-none' : ''}
      >
        {/* Logo */}
        <div style={{ marginBottom: 16, padding: '4px 0 12px' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(29,111,242,0.4)',
          }}>
            <RiDashboardLine size={20} color="white" />
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, width: '100%', alignItems: 'center' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={label}
              onClick={onClose}
              style={({ isActive }) => ({
                width: 44,
                height: 44,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                background: isActive ? 'var(--sidebar-active)' : 'transparent',
                border: isActive ? '1px solid rgba(29,111,242,0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                position: 'relative',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span style={{
                      position: 'absolute', left: -12, top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3, height: 24, borderRadius: 2,
                      background: 'var(--accent-blue)',
                    }} />
                  )}
                  {createElement(Icon, { size: 20 })}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Theme toggle + avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)', width: '100%', paddingInline: 12 }}>
          {/* Theme toggle (replaces notification bell from the design) */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: isDark ? 'rgba(255,200,45,0.1)' : 'rgba(29,111,242,0.1)',
              border: `1px solid ${isDark ? 'rgba(255,200,45,0.25)' : 'rgba(29,111,242,0.25)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
              color: isDark ? 'var(--accent-yellow)' : 'var(--accent-blue)',
            }}
          >
            {isDark ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </button>

          {/* User avatar */}
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              title={user.name}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                border: '2px solid var(--border-color)', objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          ) : (
            <div
              title={user?.name}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-coral), var(--accent-yellow))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer',
              }}
            >
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
