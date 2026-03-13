export default function LoadingSpinner({ fullScreen = false, size = 48 }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        style={{ animation: 'spin 0.9s linear infinite' }}
      >
        <circle cx="24" cy="24" r="20" stroke="var(--border-color)" strokeWidth="4" />
        <path
          d="M24 4 A20 20 0 0 1 44 24"
          stroke="var(--accent-blue)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading weather data…</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-primary)',
        }}
      >
        {spinner}
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      {spinner}
    </div>
  )
}
