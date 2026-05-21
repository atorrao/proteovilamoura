import { useState, useEffect, useRef } from 'react'
import { PROGRAMME } from '../data/index.js'

const DAY_KEYS = ['wed','thu','fri']
const DAY_NUMS = { wed:'20', thu:'21', fri:'22' }
const DAY_DATES = { wed:'2026-05-20', thu:'2026-05-21', fri:'2026-05-22' }
const KIND_COLORS = { section:'var(--accent)', flash:'var(--orange)', invited:'var(--gold)', break:'var(--muted)', special:'var(--muted)', social:'var(--green)' }
const KIND_LABELS = { section:'Section', flash:'Flash', invited:'Invited', break:'Break', special:'Special', social:'Social' }

// Parse "HH:MM" → minutes since midnight
function toMin(str) {
  const [h, m] = (str || '').trim().split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

// Parse "HH:MM–HH:MM" → { start, end } in minutes
function parseRange(timeStr) {
  const parts = (timeStr || '').split('–')
  if (parts.length < 2) return null
  return { start: toMin(parts[0]), end: toMin(parts[1]) }
}

// Last end-minute of all blocks in a half
function halfEndMin(blocks) {
  let max = 0
  for (const b of blocks) {
    const r = parseRange(b.time)
    if (r && r.end > max) max = r.end
  }
  return max
}

// Determine current day + half automatically based on real clock
function autoState() {
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()

  for (const key of DAY_KEYS) {
    const dateStr = DAY_DATES[key]
    if (now.toDateString() !== new Date(dateStr + 'T00:00:00').toDateString()) continue

    const day = PROGRAMME[key]
    const morningEnd = halfEndMin(day.morning || [])
    const afternoonBlocks = day.afternoon || []
    const afternoonEnd = halfEndMin(afternoonBlocks)
    const hasAfternoon = afternoonBlocks.length > 0

    // If morning hasn't fully ended yet → show morning
    if (cur < morningEnd) return { day: key, half: 'morning' }
    // If afternoon exists and hasn't ended → show afternoon
    if (hasAfternoon && cur < afternoonEnd) return { day: key, half: 'afternoon' }
    // Day fully over or no afternoon → stay on morning (last content)
    return { day: key, half: hasAfternoon ? 'afternoon' : 'morning' }
  }

  // Outside congress dates — default
  return { day: 'wed', half: 'morning' }
}

function isHappening(timeStr, dayKey) {
  const now = new Date()
  if (now.toDateString() !== new Date(DAY_DATES[dayKey] + 'T00:00:00').toDateString()) return false
  const r = parseRange(timeStr)
  if (!r) return false
  const cur = now.getHours() * 60 + now.getMinutes()
  return cur >= r.start && cur <= r.end
}

function isPast(timeStr, dayKey) {
  const now = new Date()
  if (now.toDateString() !== new Date(DAY_DATES[dayKey] + 'T00:00:00').toDateString()) {
    // If it's a future day, nothing is past. If past day, everything is.
    return now > new Date(DAY_DATES[dayKey] + 'T23:59:59')
  }
  const r = parseRange(timeStr)
  if (!r) return false
  const cur = now.getHours() * 60 + now.getMinutes()
  return cur > r.end
}

export default function Programme() {
  const init = autoState()
  const [activeDay, setActiveDay] = useState(init.day)
  const [activeHalf, setActiveHalf] = useState(init.half)
  const [nowMin, setNowMin] = useState(0)
  const [nowTime, setNowTime] = useState('')
  const nowRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      const cur = n.getHours() * 60 + n.getMinutes()
      setNowMin(cur)
      setNowTime(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`)

      // Auto-switch half — only switch to afternoon if it has content
      const todayKey = DAY_KEYS.find(k =>
        n.toDateString() === new Date(DAY_DATES[k] + 'T00:00:00').toDateString()
      )
      if (todayKey) {
        setActiveDay(todayKeyPrev => {
          if (todayKeyPrev !== todayKey) return todayKeyPrev
          return todayKeyPrev
        })
        setActiveHalf(prev => {
          // Never auto-switch if user manually changed day
          const day = PROGRAMME[todayKey]
          const morningEnd = halfEndMin(day.morning || [])
          const afternoonBlocks = day.afternoon || []
          const hasAfternoon = afternoonBlocks.length > 0
          // Only switch to afternoon if it exists AND morning ended
          if (prev === 'morning' && hasAfternoon && cur >= morningEnd) return 'afternoon'
          // Never switch to afternoon if it's empty
          if (prev === 'afternoon' && !hasAfternoon) return 'morning'
          return prev
        })
      }
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  // Auto-scroll to the current "Now" block — only on mount and when user changes day/half
  const hasScrolled = useRef(false)
  useEffect(() => {
    if (nowRef.current && !hasScrolled.current) {
      hasScrolled.current = true
      setTimeout(() => {
        nowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 400)
    }
  }, [activeDay, activeHalf])

  const day = PROGRAMME[activeDay]
  const blocks = day[activeHalf] || []

  // Is the user viewing today?
  const isViewingToday = new Date().toDateString() ===
    new Date(DAY_DATES[activeDay] + 'T00:00:00').toDateString()

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      {/* Top banner */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <a href="https://proteo-vilamoura.sci-meet.net/" target="_blank" rel="noreferrer"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '0.82rem', boxShadow: 'var(--shadow-sm)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Visit Website
        </a>
        <a href="/ProteoVilamoura_Abstract_Book.pdf" target="_blank" rel="noreferrer"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--accent2)', fontWeight: 600, fontSize: '0.82rem', boxShadow: 'var(--shadow-sm)', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Abstract Book
        </a>
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <img
          src="https://proteo-vilamoura.sci-meet.net/img/proteo-vilamoura.sci-meet.net/3e43a443-0406-41ce-874f-826688ab0e5d/Logo-proteovilamoral1.png?q=100&fit=max&crop=2825%2C871%2C0%2C0&s=41b3f5c0a7da78ab26677346af93c84f"
          alt="ProteoVilamoura 2026"
          style={{ height: 52, objectFit: 'contain' }}
        />
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          20–22 May 2026 · Vilamoura
        </div>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {DAY_KEYS.map(k => {
          const d = PROGRAMME[k]
          const isToday = new Date().toDateString() === new Date('2026-05-' + DAY_NUMS[k] + 'T00:00:00').toDateString()
          const isActive = activeDay === k
          return (
            <button key={k} onClick={() => { setActiveDay(k); setActiveHalf(autoState().day === k ? autoState().half : 'morning') }}
              style={{ flex: 1, padding: '8px 4px', border: '1px solid', borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all 0.18s',
                background: isActive ? 'var(--surface2)' : 'var(--surface)',
                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                color: isActive ? 'var(--text)' : 'var(--muted)' }}>
              <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>{d.date}</div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{d.label}</div>
              {isToday && <div style={{ fontSize: '0.6rem', color: 'var(--green)', marginTop: 1 }}>● Today</div>}
            </button>
          )
        })}
      </div>

      {/* Morning / Afternoon + now chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', flex: 1 }}>
          {['morning','afternoon'].filter(h => (day[h] || []).length > 0).map(h => {
            const isActive = activeHalf === h
            // Show "done" indicator if this half is fully past on today
            const halfBlocks = day[h] || []
            const halfEnd = halfEndMin(halfBlocks)
            const isDone = isViewingToday && halfEnd > 0 && nowMin > halfEnd
            return (
              <button key={h} onClick={() => setActiveHalf(h)}
                style={{ flex: 1, padding: '9px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.84rem', transition: 'all 0.18s', position: 'relative',
                  background: isActive ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                  color: isActive ? '#fff' : isDone ? 'var(--muted)' : 'var(--text)',
                  opacity: isDone && !isActive ? 0.55 : 1,
                }}>
                {h === 'morning' ? 'Morning' : 'Afternoon'}
                {isDone && !isActive && (
                  <span style={{ marginLeft: 4, fontSize: '0.65rem' }}>✓</span>
                )}
              </button>
            )
          })}
        </div>
        {nowTime && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, fontSize: '0.76rem', color: 'var(--green)', flexShrink: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            {nowTime}
          </div>
        )}
      </div>

      {/* Blocks */}
      {!blocks.length ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>No events scheduled.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {blocks.map((block, idx) => {
            const happening = isHappening(block.time, activeDay)
            const past = !happening && isPast(block.time, activeDay)
            const talks = (block.talks || []).filter(t => t.id || t.kind)
            const isSection = block.kind === 'section' || block.kind === 'flash'
            const isInvited = block.kind === 'invited'

            // Parse section title + chairs
            let titleEl = <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{block.title}</div>
            if (isSection) {
              const m = block.title.match(/^Section\s+(\d+)\s+[—–-]\s+(.+)/)
              if (m) titleEl = (
                <div>
                  <div style={{ fontSize: '0.68rem', color: happening ? 'var(--green)' : past ? 'var(--muted)' : 'var(--brand-mid)', fontWeight: 700, marginBottom: 2 }}>Section {m[1]}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', lineHeight: 1.3 }}>{m[2]}</div>
                  {block.chairs && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.62rem' }}>Chairs:</span>
                      {block.chairs}
                    </div>
                  )}
                </div>
              )
            } else if (isInvited) {
              const parts = block.title.split(' — ')
              titleEl = (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{parts[1] || parts[0]}</div>
                  {parts[2] && <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 2, lineHeight: 1.3 }}>{parts.slice(2).join(' — ')}</div>}
                </div>
              )
            }

            return (
              <div key={idx}
                ref={happening ? nowRef : null}
                className="prog-block"
                style={{
                  background: happening
                    ? 'rgba(22,163,74,0.06)'
                    : past ? 'var(--surface2)' : 'var(--surface)',
                  borderColor: happening
                    ? 'rgba(34,197,94,0.4)'
                    : past ? 'var(--border)' : 'var(--border)',
                  boxShadow: happening ? '0 0 0 2px rgba(34,197,94,0.15), 0 4px 16px rgba(34,197,94,0.08)' : 'none',
                  opacity: past ? 0.55 : 1,
                  transition: 'all 0.3s',
                }}>
                <div className="prog-block-header">
                  <span className="prog-block-time" style={{ color: past ? 'var(--muted)' : 'var(--text)' }}>{block.time}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5,
                    background: `${KIND_COLORS[block.kind]}20`, color: KIND_COLORS[block.kind],
                    textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0, marginTop: 1 }}>
                    {KIND_LABELS[block.kind] || block.kind}
                  </span>
                  <div style={{ flex: 1 }}>{titleEl}</div>
                  {happening && (
                    <span style={{ padding: '3px 8px', borderRadius: 10, background: 'rgba(34,197,94,0.18)', color: 'var(--green)', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                      Now
                    </span>
                  )}
                  {past && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)', flexShrink: 0 }}>✓</span>
                  )}
                </div>
                {talks.length > 0 && (
                  <div>
                    {talks.map((t, ti) => {
                      const isSponsor = t.type === 'sponsor'
                      return (
                        <div key={ti} className="prog-talk"
                          style={{
                            alignItems: 'flex-start',
                            ...(isSponsor ? {
                              background: 'rgba(250,175,0,0.07)',
                              borderLeft: '3px solid rgba(250,175,0,0.5)',
                              borderRadius: 6,
                              marginLeft: -4,
                              paddingLeft: 8,
                            } : {}),
                          }}>
                          {t.time && <span style={{ fontSize: '0.7rem', color: 'var(--muted)', minWidth: 68, flexShrink: 0, fontVariantNumeric: 'tabular-nums', alignSelf: 'flex-start', marginTop: 0, lineHeight: '18px' }}>{t.time}</span>}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {t.type && (
                              <span style={{
                                fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                                marginBottom: 3, display: 'inline-block', textTransform: 'uppercase',
                                background: isSponsor ? 'rgba(250,175,0,0.18)'
                                  : t.type==='flash' ? 'rgba(249,115,22,0.15)'
                                  : t.type==='poster' ? 'rgba(168,85,247,0.15)'
                                  : 'rgba(30,143,171,0.15)',
                                color: isSponsor ? '#b07d00'
                                  : t.type==='flash' ? 'var(--orange)'
                                  : t.type==='poster' ? 'var(--purple)'
                                  : 'var(--accent)',
                              }}>
                                {isSponsor ? 'Sponsor Talk' : t.type}
                              </span>
                            )}
                            <div style={{ fontSize: '0.82rem', fontWeight: isSponsor ? 600 : 500, lineHeight: 1.35 }}>{t.title}</div>
                            {t.author && <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{t.author}</div>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pulsing dot animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  )
}
