import { useState, useMemo } from 'react'
import { BINGO_FIXED } from '../data/index.js'

function seededShuffle(arr, seed) {
  const a = [...arr]; let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function strToSeed(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  return h
}

export default function SciBingo({ session, state, setState, showToast }) {
  const [tab, setTab] = useState('play')
  const [ffName, setFfName] = useState('')
  const [ffText, setFfText] = useState('')
  const [ffSubmitted, setFfSubmitted] = useState(false)
  const [ffErr, setFfErr] = useState('')

  const isAdmin = session.role === 'admin'
  const myKey = session.user
    ? `card_${session.user}`
    : (() => {
        let k = sessionStorage.getItem('bingo_anon')
        if (!k) { k = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`; sessionStorage.setItem('bingo_anon', k) }
        return k
      })()

  const myCard = state.bingoCards?.[myKey] || null

  const generateCard = () => {
    const facts = (state.funFacts || []).map(f => ({
      text: f.text + (f.name ? ` (${f.name.split(' ')[0]})` : ''), isFact: true
    }))
    const fixed = BINGO_FIXED.map(t => ({ text: t, isFact: false }))
    const all = [...facts, ...fixed]
    const cardIndex = Object.keys(state.bingoCards || {}).length
    const seed = strToSeed(myKey + '_' + cardIndex + '_' + (state.funFacts || []).length)
    const shuffled = seededShuffle(all, seed)
    const picked = shuffled.slice(0, 8)
    const squares = []
    for (let i = 0; i < 9; i++) {
      if (i === 4) squares.push({ text: 'FREE', signed: true, name: 'ProteoVilamoura 2026', free: true })
      else squares.push({ ...picked[i < 4 ? i : i - 1], signed: false, name: '' })
    }
    setState(prev => ({ ...prev, bingoCards: { ...(prev.bingoCards || {}), [myKey]: { squares, key: myKey, generated: Date.now() } } }))
  }

  const signCell = (i) => {
    if (!myCard) return
    const sq = myCard.squares[i]
    if (sq.free || sq.signed) return
    const name = window.prompt('Who signs? ' + sq.text)
    if (name?.trim()) {
      setState(prev => {
        const card = { ...prev.bingoCards[myKey] }
        card.squares = card.squares.map((s, idx) => idx === i ? { ...s, signed: true, name: name.trim() } : s)
        return { ...prev, bingoCards: { ...prev.bingoCards, [myKey]: card } }
      })
    }
  }

  const checkWin = (squares) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    return lines.some(l => l.every(i => squares[i]?.signed))
  }

  const submitFunFact = () => {
    setFfErr('')
    if (!ffName.trim()) { setFfErr('Please enter your name.'); return }
    if (!ffText.trim()) { setFfErr('Please write your fun fact.'); return }
    if (ffText.length > 80) { setFfErr('Maximum 80 characters.'); return }
    setState(prev => {
      const facts = [...(prev.funFacts || [])]
      const idx = facts.findIndex(f => f.name.toLowerCase() === ffName.trim().toLowerCase())
      const entry = { id: Date.now(), name: ffName.trim(), text: ffText.trim() }
      if (idx >= 0) facts[idx] = entry; else facts.push(entry)
      return { ...prev, funFacts: facts }
    })
    setFfSubmitted(true)
  }

  const won = myCard ? checkWin(myCard.squares) : false
  const factCount = (state.funFacts || []).length

  return (
    <div className="container" style={{ maxWidth: 780 }}>
      {/* Tabs */}
      <div style={{ display:'flex', gap:0, marginBottom:24, borderBottom:'1px solid var(--border)' }}>
        {['play','submit', ...(isAdmin?['admin']:[])].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'10px 18px', border:'none', background:'none', cursor:'pointer',
              fontFamily:'DM Sans', fontSize:'0.88rem', fontWeight:600,
              color: tab===t ? 'var(--accent2)' : 'var(--muted)',
              borderBottom: `2px solid ${tab===t ? 'var(--accent2)' : 'transparent'}`,
              marginBottom:-1, transition:'all 0.18s' }}>
            {t === 'play' ? 'Play' : t === 'submit' ? 'My Fun Fact' : 'Manage Facts'}
          </button>
        ))}
      </div>

      {/* PLAY */}
      {tab === 'play' && (
        <div>
          {!myCard ? (
            <div style={{ maxWidth:440, margin:'40px auto', textAlign:'center' }}>
              <div className="page-title" style={{ fontSize:'1.5rem', marginBottom:8 }}>Your SciBingo Card</div>
              <div className="page-sub" style={{ marginBottom:16 }}>Generate your personalised unique card for the networking cocktail.</div>
              <div style={{ fontSize:'0.8rem', color:'var(--muted)', marginBottom:24, padding:'10px 16px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:8 }}>
                {BINGO_FIXED.length} scientific statements available{factCount ? ` · ${factCount} fun fact${factCount!==1?'s':''} from participants` : ''}
              </div>
              <button className="btn btn-primary" style={{ padding:'14px 32px', fontSize:'1rem', justifyContent:'center' }} onClick={generateCard}>
                Generate My Card
              </button>
              <div style={{ marginTop:10, fontSize:'0.74rem', color:'var(--muted)' }}>Each card is unique and generated only once.</div>
            </div>
          ) : (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:10 }}>
                <div>
                  <div className="page-title" style={{ fontSize:'1.4rem' }}>My Card</div>
                  <div className="page-sub">Find someone who matches · Each person signs one square</div>
                </div>
              </div>

              <div style={{ background:'rgba(30,143,171,0.06)', border:'1px solid rgba(30,143,171,0.15)', borderRadius:10, padding:'11px 16px', marginBottom:18, fontSize:'0.82rem', color:'var(--muted)' }}>
                Mingle with participants · Each person can only sign <strong style={{ color:'var(--accent2)' }}>one square per card</strong> · Complete a row, column or diagonal to win!
              </div>

              {/* 3x3 grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, maxWidth:520, margin:'0 auto 20px' }}>
                {myCard.squares.map((sq, i) => (
                  <div key={i} onClick={() => signCell(i)}
                    style={{
                      background: sq.free ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : sq.signed ? 'rgba(30,143,171,0.13)' : 'var(--card)',
                      border: `1px solid ${sq.signed && !sq.free ? 'var(--accent2)' : 'var(--border)'}`,
                      borderRadius:14, padding:'18px 12px', minHeight:120,
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8,
                      cursor: sq.free || sq.signed ? 'default' : 'pointer',
                      transition:'all 0.2s',
                      boxShadow: sq.free ? '0 4px 16px rgba(16,96,128,0.3)' : 'none',
                    }}>
                    {sq.isFact && !sq.signed && (
                      <span style={{ fontSize:'0.6rem', background:'rgba(39,181,160,0.15)', color:'var(--accent2)', padding:'2px 6px', borderRadius:6, fontWeight:700 }}>fun fact</span>
                    )}
                    <span style={{ fontSize: sq.free ? '0.92rem' : '0.8rem', lineHeight:1.4, textAlign:'center', fontWeight: sq.free ? 800 : 500, color: sq.free ? '#fff' : sq.signed ? 'var(--muted)' : 'var(--text)', fontFamily: sq.free ? 'Syne' : 'DM Sans' }}>
                      {sq.text}
                    </span>
                    {sq.signed && !sq.free && (
                      <span style={{ fontSize:'0.7rem', color:'var(--accent2)', fontStyle:'italic', background:'rgba(6,182,212,0.1)', padding:'2px 8px', borderRadius:10, fontWeight:500 }}>
                        {sq.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {won && (
                <div style={{ textAlign:'center', padding:24, background:'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(39,181,160,0.12))', border:'1px solid var(--gold)', borderRadius:14 }}>
                  <div style={{ fontFamily:'Syne', fontSize:'2rem', fontWeight:800, color:'var(--gold)', marginBottom:8 }}>BINGO!</div>
                  <div style={{ color:'var(--accent2)', fontSize:'0.9rem' }}>Congratulations! Go to the organisers to claim your prize.</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MY FUN FACT */}
      {tab === 'submit' && (
        <div>
          <div className="page-title" style={{ fontSize:'1.4rem', marginBottom:6 }}>My Fun Fact</div>
          <div className="page-sub" style={{ marginBottom:24 }}>Share a curious fact about yourself — it may appear on other participants' bingo cards!</div>

          {ffSubmitted ? (
            <div style={{ background:'rgba(39,181,160,0.1)', border:'1px solid rgba(39,181,160,0.3)', borderRadius:12, padding:20, textAlign:'center' }}>
              <div style={{ color:'var(--accent2)', fontWeight:600, marginBottom:12 }}>
                Fun fact submitted, {ffName.split(' ')[0]}! It may appear on other participants' cards.
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setFfSubmitted(false)}>Edit</button>
            </div>
          ) : (
            <div style={{ maxWidth:460 }}>
              <div style={{ display:'grid', gap:14 }}>
                <div className="field"><label>Your name</label><input value={ffName} onChange={e => setFfName(e.target.value)} placeholder="e.g. Ana Silva" /></div>
                <div className="field">
                  <label>Your fun fact</label>
                  <textarea value={ffText} onChange={e => setFfText(e.target.value)} rows={3} placeholder="e.g. I have worked in 4 different countries"
                    style={{ padding:'10px 13px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:9, color:'var(--text)', fontFamily:'DM Sans', fontSize:'0.88rem', resize:'vertical', lineHeight:1.5, width:'100%' }} />
                  <div style={{ fontSize:'0.73rem', color: ffText.length > 80 ? 'var(--red)' : 'var(--muted)' }}>{ffText.length}/80 characters</div>
                </div>
              </div>
              {ffErr && <div className="err-msg" style={{ marginTop:10 }}>{ffErr}</div>}
              <button className="btn btn-primary" style={{ marginTop:14 }} onClick={submitFunFact}>Submit fun fact</button>
            </div>
          )}
        </div>
      )}

      {/* ADMIN */}
      {tab === 'admin' && isAdmin && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div className="page-title" style={{ fontSize:'1.4rem' }}>Participants' Fun Facts</div>
            <button className="btn btn-danger btn-sm" onClick={() => {
              if (!confirm('Delete all fun facts?')) return
              setState(prev => ({ ...prev, funFacts: [] }))
              showToast('Fun facts deleted.', 'red')
            }}>Clear all</button>
          </div>

          <div className="stats-row" style={{ marginBottom:16 }}>
            <div className="stat-box"><div className="stat-lbl">Fun facts</div><div className="stat-val c-cyan">{(state.funFacts||[]).length}</div></div>
            <div className="stat-box"><div className="stat-lbl">Cards generated</div><div className="stat-val c-gold">{Object.keys(state.bingoCards||{}).length}</div></div>
          </div>

          {!(state.funFacts?.length) ? (
            <div style={{ color:'var(--muted)', fontSize:'0.88rem' }}>No fun facts submitted yet.</div>
          ) : (
            <div style={{ display:'grid', gap:8 }}>
              {(state.funFacts||[]).map((f, i) => (
                <div key={f.id} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <div>
                    <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:2 }}>{f.name}</div>
                    <div style={{ fontSize:'0.88rem', fontWeight:500 }}>{f.text}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => {
                    setState(prev => ({ ...prev, funFacts: prev.funFacts.filter((_,idx) => idx !== i) }))
                    showToast('Fun fact removed.', 'orange')
                  }}>Remove</button>
                </div>
              ))}
            </div>
          )}

          {Object.keys(state.bingoCards||{}).length > 0 && (
            <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
              <div style={{ fontWeight:700, fontSize:'0.86rem', marginBottom:10 }}>Generated cards</div>
              {Object.values(state.bingoCards||{}).map(c => (
                <div key={c.key} style={{ fontSize:'0.8rem', color:'var(--muted)', padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  {c.key} · {c.squares?.filter(s=>s.signed&&!s.free).length}/8 signed
                </div>
              ))}
              <button className="btn btn-danger btn-sm" style={{ marginTop:12 }} onClick={() => {
                if (!confirm('Delete all generated cards?')) return
                setState(prev => ({ ...prev, bingoCards: {} }))
                showToast('Cards deleted.', 'orange')
              }}>Clear all cards</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
