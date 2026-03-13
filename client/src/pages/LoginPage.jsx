import { useEffect } from 'react'
import { createElement } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { RiCloudLine, RiFlashlightLine, RiShieldCheckLine } from 'react-icons/ri'

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, isLoading, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark
        ? 'linear-gradient(135deg, #0F1117 0%, #131929 50%, #0D1520 100%)'
        : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #DBEAFE 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 400, height: 400,
        borderRadius: '50%',
        background: isDark ? 'radial-gradient(circle, rgba(29,111,242,0.15), transparent 70%)'
          : 'radial-gradient(circle, rgba(29,111,242,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80, width: 320, height: 320,
        borderRadius: '50%',
        background: isDark ? 'radial-gradient(circle, rgba(62,205,224,0.1), transparent 70%)'
          : 'radial-gradient(circle, rgba(62,205,224,0.15), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Floating weather decorations */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', fontSize: 40, opacity: 0.15, filter: isDark ? 'none' : 'invert(0)' }}
        className="animate-spin-slow">
        ☀️
      </div>
      <div style={{ position: 'absolute', top: '30%', right: '12%', fontSize: 32, opacity: 0.12 }}>
        ⛅
      </div>
      <div style={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: 28, opacity: 0.1 }}>
        🌧️
      </div>
      <div style={{ position: 'absolute', bottom: '35%', right: '8%', fontSize: 24, opacity: 0.1 }}>
        ❄️
      </div>

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{
          background: isDark ? 'rgba(26, 29, 36, 0.85)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 24,
          padding: '48px 40px',
          boxShadow: isDark ? '0 24px 80px rgba(0,0,0,0.5)' : '0 24px 80px rgba(0,0,0,0.12)',
          animation: 'scaleIn 0.4s ease',
        }}>
          {/* Logo & brand */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #1D6FF2, #3ECDE0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(29,111,242,0.4)',
            }}>
              <RiCloudLine size={32} color="white" />
            </div>
            <h1 style={{
              fontSize: 30, fontWeight: 800,
              color: isDark ? 'white' : '#0F1117',
              letterSpacing: -1, marginBottom: 6,
            }}>
              Climatrix
            </h1>
            <p style={{ fontSize: 14, color: isDark ? '#8B9AB0' : '#4A5568', lineHeight: 1.5 }}>
              Your intelligent weather analytics platform
            </p>
          </div>

          {/* Feature highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {[
              { icon: RiFlashlightLine, text: 'Real-time weather for global cities', color: '#FFC82D' },
              { icon: RiShieldCheckLine, text: 'Secure Auth0 authentication & MFA', color: '#4ADE80' },
              { icon: RiCloudLine, text: 'Custom Comfort Index analytics', color: '#3ECDE0' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color,
                }}>
                  {createElement(Icon, { size: 15 })}
                </div>
                <span style={{ fontSize: 13, color: isDark ? '#8B9AB0' : '#4A5568' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Sign-in button */}
          <button
            onClick={() => loginWithRedirect()}
            disabled={isLoading}
            style={{
              width: '100%', padding: '14px 24px',
              background: 'linear-gradient(135deg, #1D6FF2, #3ECDE0)',
              border: 'none', borderRadius: 12,
              color: 'white', fontSize: 15, fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(29,111,242,0.4)',
              transition: 'opacity 0.2s, transform 0.15s',
              letterSpacing: 0.3,
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
          >
            {isLoading ? 'Redirecting…' : 'Sign In with Auth0'}
          </button>

          {/* Notice */}
          <p style={{
            textAlign: 'center', marginTop: 20,
            fontSize: 12, color: isDark ? '#4A5568' : '#9CA3AF', lineHeight: 1.5,
          }}>
            🔒 Access is restricted to authorised users only.
            <br />Public signups are disabled.
          </p>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: 20,
          fontSize: 11, color: isDark ? '#2D3748' : '#9CA3AF',
        }}>
          Climatrix © {new Date().getFullYear()} &mdash; Weather Analytics Platform
        </p>
      </div>
    </div>
  )
}
