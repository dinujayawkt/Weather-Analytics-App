import { useState } from 'react'
import { RiInformationLine } from 'react-icons/ri'

export default function InfoTooltip({ text, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="More info"
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          style={{ cursor: 'help' }}
        >
          {children}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="More info"
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'help',
            backdropFilter: 'blur(6px)',
          }}
        >
          <RiInformationLine size={15} />
        </div>
      )}

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: -8,
            transform: 'translateY(-100%)',
            width: 220,
            background: 'rgba(15, 17, 23, 0.92)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 10,
            padding: '10px 12px',
            color: '#E5E7EB',
            fontSize: 11,
            lineHeight: 1.5,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
            zIndex: 90,
            pointerEvents: 'none',
          }}
        >
          {text}
        </div>
      )}
    </div>
  )
}
