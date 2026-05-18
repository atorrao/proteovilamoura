import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pv2026_onboarding_done'

const STEPS = [
  {
    icon: '🔬',
    color: '#106080',
    gradient: 'linear-gradient(160deg, #0d3349 0%, #106080 60%, #208080 100%)',
    title: 'Welcome to ProteoApp',
    subtitle: '20–22 May 2026 · Vilamoura',
    body: 'The official app for the 6th Joint Meeting of Spanish, French and Portuguese Proteomics Societies. Browse the programme, vote on presentations and share your contact.',
  },
  {
    icon: '📋',
    color: '#1e8fab',
    gradient: 'linear-gradient(160deg, #0a2535 0%, #1e8fab 100%)',
    title: 'Programme',
    subtitle: 'Always know what\'s happening',
    body: 'The Programme tab shows the full 3-day schedule. The current session is highlighted in real time and the view automatically moves to what\'s happening now.',
  },
  {
    icon: '✏️',
    color: '#27b5a0',
    gradient: 'linear-gradient(160deg, #082520 0%, #0d6b5e 50%, #27b5a0 100%)',
    title: 'Voting',
    subtitle: 'Rate the presentations',
    body: 'Sign in with your email to access the Voting tab. Score each presentation from 1 (lowest) to 10 (highest). Your votes are saved automatically.',
  },
  {
    icon: '💳',
    color: '#8b5cf6',
    gradient: 'linear-gradient(160deg, #1a0a35 0%, #4c1d95 50%, #8b5cf6 100%)',
    title: 'My Card',
    subtitle: 'Your digital contact card',
    body: 'After signing in, go to the My Card tab. Your details are pre-filled and a QR code is generated automatically. Anyone can scan it to save your contact instantly.',
  },
  {
    icon: '🥇',
    color: '#e8a020',
    gradient: 'linear-gradient(160deg, #2a1800 0%, #8a4d00 50%, #e8a020 100%)',
    title: 'Awards',
    subtitle: 'Your vote counts',
    body: 'Your votes will determine the 1st, 2nd and 3rd place winners for Best Oral Communication, Best Flash Communication and Best Poster.',
  },
]

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back

  const finish = () => {
    setExiting(true)
    setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
      onDone()
    }, 350)
  }

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      background: current.gradient,
      transition: 'background 0.5s ease',
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'scale(0.97)' : 'scale(1)',
      transitionProperty: 'opacity, transform, background',
      transitionDuration: exiting ? '0.35s' : '0.5s',
    }}>

      {/* Skip button */}
      {!isLast && (
        <button onClick={finish} style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: '6px 14px',
          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', zIndex: 10,
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Skip
        </button>
      )}

      {/* Step dots */}
      <div style={{
        position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 6, zIndex: 10,
      }}>
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === step ? 20 : 6, height: 6,
            borderRadius: 3, border: 'none', cursor: 'pointer',
            background: i === step ? '#fff' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s', padding: 0,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 32px 32px', textAlign: 'center',
      }}>

        {/* Icon */}
        <div style={{
          fontSize: '4rem', lineHeight: 1, marginBottom: 28,
          filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))',
          animation: 'iconPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {current.icon}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: '1.6rem', fontWeight: 700,
          color: '#fff', lineHeight: 1.2, marginBottom: 6,
          letterSpacing: '-0.01em',
          textShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          {current.title}
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.03em', marginBottom: 20,
        }}>
          {current.subtitle}
        </div>

        {/* Divider */}
        <div style={{
          width: 40, height: 2, borderRadius: 2,
          background: 'rgba(255,255,255,0.35)', marginBottom: 20,
        }} />

        {/* Body */}
        <div style={{
          fontSize: '1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.65,
          maxWidth: 340, fontFamily: 'DM Sans, sans-serif',
        }}>
          {current.body}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        padding: '20px 32px',
        paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>

        {/* Main CTA button */}
        <button onClick={isLast ? finish : () => goTo(step + 1)} style={{
          width: '100%', maxWidth: 340,
          padding: '15px 24px', borderRadius: 14, border: 'none',
          background: '#fff', color: current.color,
          fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform = '' }}
          onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onTouchEnd={e => { e.currentTarget.style.transform = '' }}
        >
          {isLast ? "Let's get started →" : 'Next →'}
        </button>

        {/* Back link */}
        {step > 0 && (
          <button onClick={() => goTo(step - 1)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem',
            fontFamily: 'DM Sans, sans-serif', padding: '4px 12px',
          }}>
            ← Back
          </button>
        )}
      </div>

      <style>{`
        @keyframes iconPop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Hook to control visibility
export function useOnboarding() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  return [show, () => setShow(false)]
}
