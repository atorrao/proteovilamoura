import { useState, useEffect } from 'react'
import { PROGRAMME } from '../data/index.js'

const DAY_KEYS = ['wed','thu','fri']
const KIND_LABELS = { section:'Section', flash:'Flash', invited:'Invited', break:'Break', special:'Special', social:'Social' }
const KIND_COLORS = { section:'var(--accent)', flash:'var(--orange)', invited:'var(--gold)', break:'var(--muted)', special:'var(--muted)', social:'var(--green)' }

function autoDay() {
  const now = new Date()
  const map = { wed:'2026-05-20', thu:'2026-05-21', fri:'2026-05-22' }
  for (const [k, d] of Object.entries(map)) {
    if (now.toDateString() === new Date(d+'T00:00:00').toDateString()) return { day:k, half: now.getHours()<13?'morning':'afternoon' }
  }
  return { day:'wed', half:'morning' }
}

function isHappening(timeStr) {
  const now = new Date()
  const h = now.getHours(), m = now.getMinutes()
  const cur = h*60+m
  const [start, end] = (timeStr||'').split('–').map(t => {
    const [hh, mm] = t.trim().split(':').map(Number)
    return hh*60+(mm||0)
  })
  if (!end) return false
  return cur >= start && cur <= end
}

function parseSectionTitle(title) {
  const m = title.match(/^Section\s+(\d+)\s+[—–-]\s+(.+)/)
  return m ? { num: m[1], name: m[2] } : null
}

export default function Programme() {
  const init = autoDay()
  const [activeDay, setActiveDay] = useState(init.day)
  const [activeHalf, setActiveHalf] = useState(init.half)
  const [nowTime, setNowTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setNowTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])

  const day = PROGRAMME[activeDay]
  const blocks = (day[activeHalf] || [])

  return (
    <div className="container">
      {/* Hero */}
      <div style={{ textAlign:'center', padding:'36px 0 32px', marginBottom: 8 }}>
        <div style={{ fontSize:'0.74rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent2)', marginBottom:10 }}>
          20–22 May 2026 · Vilamoura, Portugal
        </div>
        <h1 style={{ fontFamily:'Syne', fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
          Proteo<span style={{ color:'var(--accent2)' }}>Vilamoura</span><br />2026
        </h1>
        <p style={{ color:'var(--muted)', maxWidth:520, margin:'0 auto', fontSize:'0.9rem' }}>
          Iberian proteomics congress — Meet researchers, discover top science and vote for the best presentations.
        </p>
      </div>

      {/* Day selector */}
      <div style={{ display:'flex', gap:6, marginBottom:24, flexWrap:'wrap' }}>
        {DAY_KEYS.map(k => {
          const d = PROGRAMME[k]
          const now = new Date()
          const isToday = now.toDateString() === new Date('2026-05-'+({wed:'20',thu:'21',fri:'22'}[k])+'T00:00:00').toDateString()
          return (
            <button key={k} onClick={() => setActiveDay(k)}
              style={{ flex:1, minWidth:90, padding:'10px 8px', border:'1px solid', borderRadius:10, cursor:'pointer', transition:'all 0.18s', textAlign:'center',
                background: activeDay===k ? 'var(--surface2)' : 'var(--card)',
                borderColor: activeDay===k ? 'var(--accent)' : 'var(--border)',
                color: activeDay===k ? 'var(--text)' : 'var(--muted)' }}>
              <div style={{ fontSize:'0.72rem', opacity:0.7 }}>{d.date}</div>
              <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{d.full.split(' — ')[1]}</div>
              {isToday && <div style={{ fontSize:'0.65rem', color:'var(--green)', marginTop:2 }}>● Today</div>}
            </button>
          )
        })}
      </div>

      {/* Morning/Afternoon toggle + now chip */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ display:'flex', background:'var(--surface)', borderRadius:10, overflow:'hidden', border:'1px solid var(--border)' }}>
          {['morning','afternoon'].map(h => (
            <button key={h} onClick={() => setActiveHalf(h)}
              style={{ padding:'8px 18px', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.84rem', transition:'all 0.18s',
                background: activeHalf===h ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: activeHalf===h ? '#fff' : 'var(--muted)' }}>
              {h === 'morning' ? 'Morning' : 'Afternoon'}
            </button>
          ))}
        </div>
        {nowTime && (
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:20, fontSize:'0.78rem', color:'var(--green)' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', display:'inline-block', animation:'pulse 2s infinite' }} />
            {nowTime}
          </div>
        )}
      </div>

      {/* Blocks */}
      {!blocks.length ? (
        <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>No events scheduled for this period.</div>
      ) : (
        <div style={{ display:'grid', gap:8 }}>
          {blocks.map((block, idx) => {
            const happening = isHappening(block.time)
            const talks = (block.talks||[]).filter(t => t.id || t.kind)
            const parsed = (block.kind==='section'||block.kind==='flash') ? parseSectionTitle(block.title) : null
            const isInvited = block.kind === 'invited'
            const parts = isInvited ? block.title.split(' — ') : []

            return (
              <div key={idx} style={{ background: happening ? 'rgba(34,197,94,0.06)' : 'var(--card)',
                border: `1px solid ${happening ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                borderRadius:12, overflow:'hidden',
                boxShadow: happening ? '0 0 20px rgba(34,197,94,0.1)' : 'none' }}>
                <div style={{ padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:12, flexWrap:'wrap' }}>
                  <span style={{ fontSize:'0.8rem', fontWeight:700, color:'#fff', minWidth:90, fontVariantNumeric:'tabular-nums' }}>{block.time}</span>
                  <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'2px 7px', borderRadius:6, background:`${KIND_COLORS[block.kind]}20`, color:KIND_COLORS[block.kind], textTransform:'uppercase', letterSpacing:'0.05em', flexShrink:0 }}>
                    {KIND_LABELS[block.kind]||block.kind}
                  </span>
                  <div style={{ flex:1 }}>
                    {parsed ? (
                      <div>
                        <span style={{ fontSize:'0.7rem', color:'var(--accent)', fontWeight:700 }}>Section {parsed.num}</span>
                        <div style={{ fontWeight:600, fontSize:'0.9rem', marginTop:2 }}>{parsed.name}</div>
                      </div>
                    ) : isInvited && parts.length >= 2 ? (
                      <div>
                        <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{parts[1]}</div>
                        {parts[2] && <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginTop:2 }}>{parts.slice(2).join(' — ')}</div>}
                      </div>
                    ) : (
                      <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{block.title}</div>
                    )}
                  </div>
                  {happening && <span style={{ padding:'2px 8px', borderRadius:10, background:'rgba(34,197,94,0.15)', color:'var(--green)', fontSize:'0.72rem', fontWeight:700 }}>Now on</span>}
                </div>
                {talks.length > 0 && (
                  <div style={{ borderTop:'1px solid var(--border)' }}>
                    {talks.map((t, ti) => (
                      <div key={ti} style={{ padding:'10px 18px', display:'flex', gap:10, alignItems:'flex-start', borderBottom: ti < talks.length-1 ? '1px solid rgba(22,64,85,0.4)' : 'none' }}>
                        <span style={{ fontSize:'0.75rem', color:'var(--muted)', minWidth:80, fontVariantNumeric:'tabular-nums' }}>{t.time||''}</span>
                        {t.type && (
                          <span style={{ fontSize:'0.66rem', fontWeight:700, padding:'1px 5px', borderRadius:5, textTransform:'uppercase',
                            background: t.type==='flash'?'rgba(249,115,22,0.15)':t.type==='poster'?'rgba(168,85,247,0.15)':'rgba(30,143,171,0.15)',
                            color: t.type==='flash'?'var(--orange)':t.type==='poster'?'var(--purple)':'var(--accent)', flexShrink:0 }}>
                            {t.type}
                          </span>
                        )}
                        <div>
                          <div style={{ fontSize:'0.84rem', fontWeight:500, lineHeight:1.35 }}>{t.title}</div>
                          {t.author && <div style={{ fontSize:'0.74rem', color:'var(--muted)', marginTop:2 }}>{t.author}</div>}
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
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}
