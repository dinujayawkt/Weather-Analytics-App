import { createElement, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import {
  RiDashboardLine, RiBarChartLine, RiTrophyLine, RiSettings3Line,
  RiLogoutBoxLine,
} from 'react-icons/ri'

const navItems = [
  { to: '/',           icon: RiDashboardLine, label: 'Dashboard'   },
  { to: '/rankings',   icon: RiTrophyLine,    label: 'Rankings'    },
  { to: '/analytics',  icon: RiBarChartLine,  label: 'Analytics'   },
  { to: '/settings',   icon: RiSettings3Line, label: 'Settings'    },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth0()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin + '/login' } })

  useEffect(() => {
    if (!profileMenuOpen) return

    const handleClickOutside = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [profileMenuOpen])

  const handleSettingsClick = () => {
    setProfileMenuOpen(false)
    onClose?.()
  }

  const handleLogoutClick = () => {
    setProfileMenuOpen(false)
    handleLogout()
  }

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

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    padding: '8px 10px',
    color: 'var(--text-primary)',
    background: 'transparent',
    border: '1px solid transparent',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.2s ease',
  }

  const applyMenuHover = (target) => {
    target.style.background = 'var(--menu-hover-bg)'
    target.style.borderColor = 'var(--menu-hover-border)'
    target.style.backdropFilter = 'blur(8px)'
  }

  const clearMenuHover = (target) => {
    target.style.background = 'transparent'
    target.style.borderColor = 'transparent'
    target.style.backdropFilter = 'none'
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

        {/* Bottom: avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)', width: '100%', paddingInline: 12, position: 'relative' }}>
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileMenuOpen(v => !v)}
              title={user?.name || 'Profile'}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'transparent',
                border: `2px solid ${profileMenuOpen ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--accent-coral), var(--accent-yellow))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </button>

            {profileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  left: 52,
                  bottom: 0,
                  width: 150,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: 6,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                  zIndex: 70,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <NavLink
                  to="/settings"
                  onClick={handleSettingsClick}
                  onMouseEnter={e => applyMenuHover(e.currentTarget)}
                  onMouseLeave={e => clearMenuHover(e.currentTarget)}
                  style={{
                    ...menuItemStyle,
                  }}
                >
                  <RiSettings3Line size={16} />
                  Settings
                </NavLink>

                <button
                  onClick={handleLogoutClick}
                  onMouseEnter={e => applyMenuHover(e.currentTarget)}
                  onMouseLeave={e => clearMenuHover(e.currentTarget)}
                  style={{
                    ...menuItemStyle,
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <RiLogoutBoxLine size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
