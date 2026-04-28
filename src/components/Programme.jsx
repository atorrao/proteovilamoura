import { useState, useEffect } from 'react'
import { PROGRAMME } from '../data/index.js'

const DAY_KEYS = ['wed','thu','fri']
const KIND_COLORS = { section:'var(--accent)', flash:'var(--orange)', invited:'var(--gold)', break:'var(--muted)', special:'var(--muted)', social:'var(--green)' }
const KIND_LABELS = { section:'Section', flash:'Flash', invited:'Invited', break:'Break', special:'Special', social:'Social' }

function autoDay() {
  const now = new Date()
  const map = { wed:'2026-05-20', thu:'2026-05-21', fri:'2026-05-22' }
  for (const [k, d] of Object.entries(map)) {
    if (now.toDateString() === new Date(d+'T00:00:00').toDateString())
      return { day: k, half: now.getHours() < 13 ? 'morning' : 'afternoon' }
  }
  return { day: 'wed', half: 'morning' }
}

function isHappening(timeStr) {
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  const parts = (timeStr || '').split('–')
  if (parts.length < 2) return false
  const [sh, sm] = parts[0].trim().split(':').map(Number)
  const [eh, em] = parts[1].trim().split(':').map(Number)
  return cur >= sh*60+(sm||0) && cur <= eh*60+(em||0)
}

export default function Programme() {
  const init = autoDay()
  const [activeDay, setActiveDay] = useState(init.day)
  const [activeHalf, setActiveHalf] = useState(init.half)
  const [nowTime, setNowTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setNowTime(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick, 15000); return () => clearInterval(id)
  }, [])

  const day = PROGRAMME[activeDay]
  const blocks = day[activeHalf] || []

  return (
    <div className="container" style={{ paddingTop: 16 }}>
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
          const isToday = new Date().toDateString() === new Date('2026-05-'+({wed:'20',thu:'21',fri:'22'}[k])+'T00:00:00').toDateString()
          const isActive = activeDay === k
          return (
            <button key={k} onClick={() => setActiveDay(k)}
              style={{ flex: 1, padding: '8px 4px', border: '1px solid', borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all 0.18s',
                background: isActive ? 'var(--surface2)' : 'var(--card)',
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
          {['morning','afternoon'].map(h => (
            <button key={h} onClick={() => setActiveHalf(h)}
              style={{ flex: 1, padding: '9px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.84rem', transition: 'all 0.18s',
                background: activeHalf === h ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: activeHalf === h ? '#fff' : 'var(--muted)' }}>
              {h === 'morning' ? 'Morning' : 'Afternoon'}
            </button>
          ))}
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
            const happening = isHappening(block.time)
            const talks = (block.talks || []).filter(t => t.id || t.kind)
            const isSection = block.kind === 'section' || block.kind === 'flash'
            const isInvited = block.kind === 'invited'

            // Parse section title
            let titleEl = <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{block.title}</div>
            if (isSection) {
              const m = block.title.match(/^Section\s+(\d+)\s+[—–-]\s+(.+)/)
              if (m) titleEl = (
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700, marginBottom: 2 }}>Section {m[1]}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', lineHeight: 1.3 }}>{m[2]}</div>
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
              <div key={idx} className="prog-block"
                style={{
                  background: happening ? 'rgba(34,197,94,0.06)' : 'var(--card)',
                  borderColor: happening ? 'rgba(34,197,94,0.3)' : 'var(--border)',
                  boxShadow: happening ? '0 0 16px rgba(34,197,94,0.1)' : 'none',
                }}>
                <div className="prog-block-header">
                  <span className="prog-block-time">{block.time}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5,
                    background: `${KIND_COLORS[block.kind]}20`, color: KIND_COLORS[block.kind],
                    textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0, marginTop: 1 }}>
                    {KIND_LABELS[block.kind] || block.kind}
                  </span>
                  <div style={{ flex: 1 }}>{titleEl}</div>
                  {happening && <span style={{ padding: '2px 7px', borderRadius: 10, background: 'rgba(34,197,94,0.15)', color: 'var(--green)', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>Now</span>}
                </div>
                {talks.length > 0 && (
                  <div>
                    {talks.map((t, ti) => (
                      <div key={ti} className="prog-talk">
                        {t.time && <span style={{ fontSize: '0.7rem', color: 'var(--muted)', minWidth: 68, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{t.time}</span>}
                        <div style={{ flex: 1 }}>
                          {t.type && <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: 4, marginBottom: 3, display: 'inline-block',
                            background: t.type==='flash'?'rgba(249,115,22,0.15)':t.type==='poster'?'rgba(168,85,247,0.15)':'rgba(30,143,171,0.15)',
                            color: t.type==='flash'?'var(--orange)':t.type==='poster'?'var(--purple)':'var(--accent)',
                            textTransform: 'uppercase' }}>{t.type}</span>}
                          <div style={{ fontSize: '0.82rem', fontWeight: 500, lineHeight: 1.35 }}>{t.title}</div>
                          {t.author && <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{t.author}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
