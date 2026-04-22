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

// Each square: { text, isFact, factOwnerId?, signed, name, free, status: null|'correct'|'wrong' }

export default function SciBingo({ session, state, setState, showToast }) {
  const [tab, setTab] = useState('play')
  const [activeCell, setActiveCell] = useState(null) // index of cell being answered
  const [answerDraft, setAnswerDraft] = useState('')
  const [ffName, setFfName] = useState('')
  const [ffText, setFfText] = useState('')
  const [ffSubmitted, setFfSubmitted] = useState(false)
  const [ffErr, setFfErr] = useState('')

  const isAdmin = session.role === 'admin'

  const myKey = useMemo(() => {
    if (session.user) return `card_${session.user}`
    let k = sessionStorage.getItem('bingo_anon')
    if (!k) { k = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`; sessionStorage.setItem('bingo_anon', k) }
    return k
  }, [session.user])

  const myCard = state.bingoCards?.[myKey] || null

  const generateCard = () => {
    const facts = (state.funFacts || []).map(f => ({
      text: f.text,
      isFact: true,
      factOwnerName: f.name,
    }))
    const fixed = BINGO_FIXED.map(t => ({ text: t, isFact: false }))
    const all = [...facts, ...fixed]
    const cardIndex = Object.keys(state.bingoCards || {}).length
    const seed = strToSeed(myKey + '_' + cardIndex + '_' + (state.funFacts || []).length)
    const shuffled = seededShuffle(all, seed)
    const picked = shuffled.slice(0, 8)
    const squares = []
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        squares.push({ text: 'FREE', signed: true, name: '', free: true, isFact: false, status: 'correct' })
      } else {
        const sq = picked[i < 4 ? i : i - 1]
        squares.push({ ...sq, signed: false, name: '', status: null })
      }
    }
    setState(prev => ({
      ...prev,
      bingoCards: { ...(prev.bingoCards || {}), [myKey]: { squares, key: myKey, generated: Date.now() } }
    }))
  }

  const updateCard = (updater) => {
    setState(prev => {
      const card = { ...prev.bingoCards[myKey] }
      card.squares = updater(card.squares)
      return { ...prev, bingoCards: { ...prev.bingoCards, [myKey]: card } }
    })
  }

  // Submit answer for a cell
  const submitAnswer = (cellIndex) => {
    const sq = myCard.squares[cellIndex]
    const answer = answerDraft.trim()
    if (!answer) return

    if (sq.isFact) {
      // For fun facts: correct answer is the name of the person who submitted it
      const isCorrect = answer.toLowerCase() === (sq.factOwnerName || '').toLowerCase()
      updateCard(squares => squares.map((s, i) => i === cellIndex
        ? { ...s, name: answer, signed: isCorrect, status: isCorrect ? 'correct' : 'wrong' }
        : s
      ))
      if (isCorrect) showToast('Correct! Square signed.', 'green')
      else showToast('Not quite — try again!', 'red')
    } else {
      // For fixed statements: any non-empty name is accepted as "signed"
      updateCard(squares => squares.map((s, i) => i === cellIndex
        ? { ...s, name: answer, signed: true, status: 'correct' }
        : s
      ))
      showToast('Square signed!', 'green')
    }
    setActiveCell(null)
    setAnswerDraft('')
  }

  const clearAnswer = (cellIndex) => {
    updateCard(squares => squares.map((s, i) => i === cellIndex
      ? { ...s, name: '', signed: false, status: null }
      : s
    ))
    setActiveCell(null)
    setAnswerDraft('')
  }

  const checkWin = (squares) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    return lines.some(l => l.every(i => squares[i]?.status === 'correct'))
  }

  const won = myCard ? checkWin(myCard.squares) : false
  const factCount = (state.funFacts || []).length

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

  return (
    <div className="container" style={{ maxWidth: 780 }}>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {['play', 'submit', ...(isAdmin ? ['admin'] : [])].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
            fontFamily: 'DM Sans', fontSize: '0.88rem', fontWeight: 600,
            color: tab === t ? 'var(--accent2)' : 'var(--muted)',
            borderBottom: `2px solid ${tab === t ? 'var(--accent2)' : 'transparent'}`,
            marginBottom: -1, transition: 'all 0.18s',
          }}>
            {t === 'play' ? 'Play' : t === 'submit' ? 'My Fun Fact' : 'Manage Facts'}
          </button>
        ))}
      </div>

      {/* ── PLAY ── */}
      {tab === 'play' && (
        <div>
          {!myCard ? (
            <div style={{ maxWidth: 440, margin: '40px auto', textAlign: 'center' }}>
              <div className="page-title" style={{ fontSize: '1.5rem', marginBottom: 8 }}>Your SciBingo Card</div>
              <div className="page-sub" style={{ marginBottom: 16 }}>
                Generate your personalised unique card for the networking cocktail.
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 24, padding: '10px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                {BINGO_FIXED.length} scientific statements available
                {factCount ? ` · ${factCount} fun fact${factCount !== 1 ? 's' : ''} from participants` : ''}
              </div>
              <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }} onClick={generateCard}>
                Generate My Card
              </button>
              <div style={{ marginTop: 10, fontSize: '0.74rem', color: 'var(--muted)' }}>Each card is unique and generated only once.</div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div className="page-title" style={{ fontSize: '1.3rem' }}>My SciBingo Card</div>
                  <div className="page-sub" style={{ fontSize: '0.82rem' }}>
                    {myCard.squares.filter(s => s.status === 'correct' && !s.free).length}/8 squares signed · Find someone who matches each statement
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(30,143,171,0.06)', border: '1px solid rgba(30,143,171,0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: '0.81rem', color: 'var(--muted)' }}>
                Click a square, type the name of the person who matches, and press Enter. 
                For <strong style={{ color: 'var(--accent2)' }}>fun facts</strong>, you must guess the correct person — it turns green if right.
                Each person can only sign <strong style={{ color: 'var(--accent2)' }}>one square</strong>.
              </div>

              {/* 3×3 grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 560, margin: '0 auto 20px' }}>
                {myCard.squares.map((sq, i) => {
                  const isActive = activeCell === i
                  const bg = sq.free
                    ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))'
                    : sq.status === 'correct' ? 'rgba(34,197,94,0.12)'
                    : sq.status === 'wrong' ? 'rgba(239,68,68,0.1)'
                    : isActive ? 'var(--surface2)'
                    : 'var(--card)'
                  const border = sq.free ? 'transparent'
                    : sq.status === 'correct' ? 'rgba(34,197,94,0.5)'
                    : sq.status === 'wrong' ? 'rgba(239,68,68,0.5)'
                    : isActive ? 'var(--accent)'
                    : 'var(--border)'

                  return (
                    <div key={i}
                      onClick={() => { if (!sq.free) { setActiveCell(isActive ? null : i); setAnswerDraft(sq.name || '') } }}
                      style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '16px 12px', minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: sq.free ? 'default' : 'pointer', transition: 'all 0.2s', position: 'relative', boxShadow: sq.free ? '0 4px 16px rgba(16,96,128,0.3)' : 'none' }}>

                      {/* Status indicator */}
                      {sq.status === 'correct' && !sq.free && (
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 800 }}>✓</div>
                      )}
                      {sq.status === 'wrong' && (
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 800 }}>✗</div>
                      )}

                      {sq.isFact && !sq.signed && (
                        <span style={{ fontSize: '0.58rem', background: 'rgba(39,181,160,0.15)', color: 'var(--accent2)', padding: '2px 6px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>fun fact</span>
                      )}

                      <span style={{ fontSize: sq.free ? '0.92rem' : '0.78rem', lineHeight: 1.4, textAlign: 'center', fontWeight: sq.free ? 800 : 500, color: sq.free ? '#fff' : sq.status === 'correct' ? 'var(--green)' : sq.status === 'wrong' ? 'var(--red)' : 'var(--text)', fontFamily: sq.free ? 'Syne' : 'DM Sans' }}>
                        {sq.text}
                      </span>

                      {sq.name && !sq.free && (
                        <span style={{ fontSize: '0.68rem', fontStyle: 'italic', padding: '2px 8px', borderRadius: 10, background: sq.status === 'correct' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: sq.status === 'correct' ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>
                          {sq.name}
                        </span>
                      )}

                      {/* Inline answer input */}
                      {isActive && !sq.free && (
                        <div onClick={e => e.stopPropagation()} style={{ width: '100%', marginTop: 4 }}>
                          <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 4, textAlign: 'center' }}>
                            {sq.isFact ? 'Who does this describe?' : 'Who matches this?'}
                          </div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 4, textAlign: 'center' }}>Answer:</div>
                          <input
                            autoFocus
                            value={answerDraft}
                            onChange={e => setAnswerDraft(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') submitAnswer(i); if (e.key === 'Escape') { setActiveCell(null); setAnswerDraft('') } }}
                            placeholder="Type name…"
                            style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--accent)', borderRadius: 7, background: 'var(--bg)', color: 'var(--text)', fontSize: '0.78rem', fontFamily: 'DM Sans', textAlign: 'center' }}
                          />
                          <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                            <button onClick={() => submitAnswer(i)} style={{ flex: 1, padding: '5px', border: 'none', borderRadius: 6, background: 'var(--accent2)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                              Confirm
                            </button>
                            {sq.status && (
                              <button onClick={() => clearAnswer(i)} style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', color: 'var(--muted)', fontSize: '0.72rem', cursor: 'pointer' }}>
                                Clear
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {won && (
                <div style={{ textAlign: 'center', padding: 28, background: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(39,181,160,0.12))', border: '1px solid var(--gold)', borderRadius: 14, marginTop: 8 }}>
                  <div style={{ fontFamily: 'Syne', fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold)', marginBottom: 8 }}>BINGO!</div>
                  <div style={{ color: 'var(--accent2)', fontSize: '0.9rem' }}>Congratulations! Go to the organisers to claim your prize.</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── MY FUN FACT ── */}
      {tab === 'submit' && (
        <div>
          <div className="page-title" style={{ fontSize: '1.4rem', marginBottom: 6 }}>My Fun Fact</div>
          <div className="page-sub" style={{ marginBottom: 24 }}>
            Share a curious fact about yourself — others will try to guess that it describes you!
          </div>
          {ffSubmitted ? (
            <div style={{ background: 'rgba(39,181,160,0.1)', border: '1px solid rgba(39,181,160,0.3)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ color: 'var(--accent2)', fontWeight: 600, marginBottom: 12 }}>
                Fun fact submitted, {ffName.split(' ')[0]}! Others will see this on their card and try to guess it's you.
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setFfSubmitted(false)}>Edit</button>
            </div>
          ) : (
            <div style={{ maxWidth: 460 }}>
              <div style={{ display: 'grid', gap: 14 }}>
                <div className="field">
                  <label>Your name</label>
                  <input value={ffName} onChange={e => setFfName(e.target.value)} placeholder="e.g. Ana Silva" />
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 3 }}>This name is the correct answer others must guess.</div>
                </div>
                <div className="field">
                  <label>Your fun fact</label>
                  <textarea value={ffText} onChange={e => setFfText(e.target.value)} rows={3}
                    placeholder="e.g. I have worked in 4 different countries"
                    style={{ padding: '10px 13px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, color: 'var(--text)', fontFamily: 'DM Sans', fontSize: '0.88rem', resize: 'vertical', lineHeight: 1.5, width: '100%' }} />
                  <div style={{ fontSize: '0.73rem', color: ffText.length > 80 ? 'var(--red)' : 'var(--muted)' }}>{ffText.length}/80 characters</div>
                </div>
              </div>
              {ffErr && <div className="err-msg" style={{ marginTop: 10 }}>{ffErr}</div>}
              <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={submitFunFact}>Submit fun fact</button>
            </div>
          )}
        </div>
      )}

      {/* ── ADMIN ── */}
      {tab === 'admin' && isAdmin && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="page-title" style={{ fontSize: '1.4rem' }}>Participants' Fun Facts</div>
            <button className="btn btn-danger btn-sm" onClick={() => { if (!confirm('Delete all fun facts?')) return; setState(prev => ({ ...prev, funFacts: [] })); showToast('Fun facts deleted.', 'red') }}>Clear all</button>
          </div>
          <div className="stats-row" style={{ marginBottom: 16 }}>
            <div className="stat-box"><div className="stat-lbl">Fun facts</div><div className="stat-val c-cyan">{(state.funFacts || []).length}</div></div>
            <div className="stat-box"><div className="stat-lbl">Cards generated</div><div className="stat-val c-gold">{Object.keys(state.bingoCards || {}).length}</div></div>
          </div>
          {!(state.funFacts?.length) ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No fun facts submitted yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {(state.funFacts || []).map((f, i) => (
                <div key={f.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--accent2)', marginBottom: 2, fontWeight: 600 }}>{f.name}</div>
                    <div style={{ fontSize: '0.88rem' }}>{f.text}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => { setState(prev => ({ ...prev, funFacts: prev.funFacts.filter((_, idx) => idx !== i) })); showToast('Removed.', 'orange') }}>Remove</button>
                </div>
              ))}
            </div>
          )}
          {Object.keys(state.bingoCards || {}).length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', marginBottom: 10 }}>Generated cards</div>
              {Object.values(state.bingoCards || {}).map(c => (
                <div key={c.key} style={{ fontSize: '0.8rem', color: 'var(--muted)', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {c.key} · {c.squares?.filter(s => s.status === 'correct' && !s.free).length}/8 correct
                </div>
              ))}
              <button className="btn btn-danger btn-sm" style={{ marginTop: 12 }} onClick={() => { if (!confirm('Delete all generated cards?')) return; setState(prev => ({ ...prev, bingoCards: {} })); showToast('Cards deleted.', 'orange') }}>Clear all cards</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
