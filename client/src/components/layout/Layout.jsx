import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { SearchProvider } from '../../context/SearchContext.jsx'

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <SearchProvider>
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      {/* Sidebar — always visible on desktop, toggle on mobile */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        className="md:hidden"
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar onMenuToggle={() => setMobileOpen(o => !o)} />
        <main
          className="app-main"
          style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
          background: 'var(--bg-primary)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
    </SearchProvider>
  )
}
