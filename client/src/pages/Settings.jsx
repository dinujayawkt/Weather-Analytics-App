import { createElement } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useTheme } from '../hooks/useTheme'
import { RiLogoutBoxLine, RiShieldCheckLine, RiUser3Line, RiMailLine, RiSunLine, RiMoonLine, RiInformationLine } from 'react-icons/ri'

function SettingRow({ icon: Icon, label, value, action, actionLabel, color = 'var(--accent-blue)' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        {createElement(Icon, { size: 16 })}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
        {value && <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1, overflowWrap: 'anywhere' }}>{value}</p>}
      </div>
      {action && (
        <button
          onClick={action}
          style={{
            padding: '6px 14px', borderRadius: 8,
            background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default function Settings() {
  const { user, logout } = useAuth0()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin + '/login' } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      {/* Profile card */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Profile</h3>

        <div className="settings-profile-header" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              style={{
                width: 72, height: 72, borderRadius: '50%',
                border: '3px solid var(--border-color)', objectFit: 'cover',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-coral), var(--accent-yellow))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: 'white',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div className="settings-profile-meta" style={{ minWidth: 0, flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>
              {user?.name || 'Unknown User'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, overflowWrap: 'anywhere' }}>
              {user?.email || '—'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#4ADE80',
                boxShadow: '0 0 6px #4ADE80',
              }} />
              <span style={{ fontSize: 11, color: '#4ADE80', fontWeight: 600 }}>Authenticated</span>
            </div>
          </div>
        </div>

        <SettingRow icon={RiUser3Line}  label="Display Name" value={user?.name || '—'}    color="#3ECDE0" />
        <SettingRow icon={RiMailLine}   label="Email Address" value={user?.email || '—'}   color="#1D6FF2" />
        <SettingRow
          icon={RiShieldCheckLine}
          label="Account Security"
          value="Auth0 — MFA Enabled"
          color="#4ADE80"
        />
      </div>

      {/* Preferences */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Preferences</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'rgba(255,200,45,0.1)', border: '1px solid rgba(255,200,45,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-yellow)',
          }}>
            {isDark ? <RiMoonLine size={16} /> : <RiSunLine size={16} />}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Theme</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
              Currently: {isDark ? 'Dark Mode' : 'Light Mode'}
            </p>
          </div>
          {/* Toggle switch */}
          <button
            onClick={toggleTheme}
            style={{
              width: 48, height: 26, borderRadius: 13, border: 'none',
              background: isDark ? 'var(--accent-blue)' : '#CBD5E0',
              cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
              flexShrink: 0,
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 3,
              left: isDark ? 25 : 3,
              transition: 'left 0.3s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            }} />
          </button>
        </div>
      </div>

      {/* About / App info */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>About</h3>
        <div style={{
          padding: 16, background: 'var(--bg-primary)', borderRadius: 12,
          border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RiInformationLine size={16} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>Climatrix — Weather Analytics Application</span>
          </div>
          {[
            ['Version', '1.0.0'],
            ['Data Source', 'OpenWeatherMap API'],
            ['Authentication', 'Auth0 (OIDC / JWT)'],
            ['Cache TTL', '5 minutes (server-side)'],
            ['Cities Monitored', '3 (Colombo, Tokyo, London)'],
          ].map(([k, v]) => (
            <div key={k} className="settings-about-row" style={{ display: 'flex', gap: 8 }}>
              <span className="settings-about-label" style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 140 }}>{k}:</span>
              <span className="settings-about-value" style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Account</h3>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 24px', borderRadius: 12,
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.25)',
            color: '#F87171', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(248,113,113,0.18)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(248,113,113,0.1)'
            e.currentTarget.style.transform = 'none'
          }}
        >
          <RiLogoutBoxLine size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
