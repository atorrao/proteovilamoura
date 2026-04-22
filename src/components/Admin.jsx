import { useState } from 'react'
import { SECTIONS, ALL_PRES, GUEST_WEIGHT } from '../data/index.js'

export default function Admin({ state, setState, showToast }) {
  const [activeSec, setActiveSec] = useState('sec1')
  const [showAddEval, setShowAddEval] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newSections, setNewSections] = useState([])

  const allEvalNames = state.evaluators || []
  const allAttNames = (state.attendees || []).map(a => a.name)
  const evalNames = [...allEvalNames, ...allAttNames]

  const totalVotes = Object.entries(state.votes || {}).reduce((acc, [user, vmap]) => {
    const locked = state.locked?.[user] || {}
    return acc + Object.keys(vmap).filter(pid => locked[pid]).length
  }, 0)
  const pendingVotes = Object.values(state.votes || {}).reduce((a, v) => a + Object.keys(v).length, 0) - totalVotes
  const pendingReqs = (state.editRequests || []).filter(r => r.status === 'pending').length

  const getWeighted = (secKey) => {
    return Object.values(ALL_PRES).filter(p => p.sectionKey === secKey).map(p => {
      let wSum = 0, wTot = 0, rawCount = 0, lockedCount = 0
      Object.entries(state.votes || {}).forEach(([evalName, vmap]) => {
        const score = vmap[p.id]
        if (score === undefined) return
        const w = (state.attendees || []).find(a => a.name === evalName) ? GUEST_WEIGHT : 1
        rawCount++
        if ((state.locked?.[evalName] || {})[p.id]) { lockedCount++; wSum += score * w; wTot += w }
      })
      const avg = wTot > 0 ? (wSum / wTot).toFixed(2) : null
      return { ...p, rawCount, lockedCount, avg }
    }).sort((a, b) => {
      if (!a.avg && !b.avg) return 0
      if (!a.avg) return 1; if (!b.avg) return -1
      return parseFloat(b.avg) - parseFloat(a.avg)
    })
  }

  const addEval = () => {
    if (!newName.trim()) { showToast('Please enter a name.', 'red'); return }
    if (!newPass.trim()) { showToast('Please enter a password.', 'red'); return }
    if ((state.registeredEvaluators || []).find(e => e.name === newName.trim())) {
      showToast('Name already exists.', 'red'); return
    }
    setState(prev => ({
      ...prev,
      registeredEvaluators: [...(prev.registeredEvaluators || []), { name: newName.trim(), pass: newPass.trim(), sections: newSections }],
      evaluators: [...(prev.evaluators || []), newName.trim()],
    }))
    setNewName(''); setNewPass(''); setNewSections([])
    setShowAddEval(false)
    showToast(`${newName.trim()} added.`, 'green')
  }

  const removeEval = (name) => {
    setState(prev => ({
      ...prev,
      registeredEvaluators: (prev.registeredEvaluators || []).filter(e => e.name !== name),
      evaluators: (prev.evaluators || []).filter(e => e !== name),
    }))
  }

  const approve = (id) => {
    setState(prev => {
      const r = prev.editRequests?.find(x => x.id === id)
      if (!r) return prev
      const newLocked = { ...prev.locked }
      if (newLocked[r.evalName]) { const l = { ...newLocked[r.evalName] }; delete l[r.presId]; newLocked[r.evalName] = l }
      return { ...prev, editRequests: prev.editRequests.map(x => x.id === id ? { ...x, status: 'approved' } : x), locked: newLocked }
    })
    showToast('Edit approved.', 'green')
  }

  const reject = (id) => {
    setState(prev => ({ ...prev, editRequests: prev.editRequests.map(x => x.id === id ? { ...x, status: 'rejected' } : x) }))
    showToast('Request rejected.', 'red')
  }

  const resetAll = () => {
    if (!confirm('Warning: this deletes ALL votes, evaluators and data. Continue?')) return
    setState({ ...state, votes: {}, locked: {}, editRequests: [], evaluators: [], attendees: [], registeredEvaluators: [], funFacts: [], bingoCards: {} })
    showToast('All data cleared.', 'red')
  }

  const scored = getWeighted(activeSec)
  const types = ['oral', 'flash', 'poster']
  const typeLabels = { oral: 'Oral Communications', flash: 'Flash Presentations', poster: 'Posters' }
  const medals = ['1st', '2nd', '3rd']
  const medalColors = ['rgba(232,160,32,0.15)', 'rgba(148,163,184,0.1)', 'rgba(205,127,50,0.1)']

  return (
    <div className="container" style={{ maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Backoffice — ProteoVilamoura 2026</div>
          <div className="page-sub">Votes, averages and rankings in real time</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(state)}>Export CSV</button>
          <button className="btn btn-danger btn-sm" onClick={resetAll}>Clear data</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box"><div className="stat-lbl">Presentations</div><div className="stat-val c-blue">{Object.keys(ALL_PRES).length}</div></div>
        <div className="stat-box"><div className="stat-lbl">Evaluators</div><div className="stat-val c-gold">{(state.evaluators||[]).length}</div></div>
        <div className="stat-box"><div className="stat-lbl">Attendees</div><div className="stat-val c-purple">{(state.attendees||[]).length}</div></div>
        <div className="stat-box"><div className="stat-lbl">Confirmed votes</div><div className="stat-val c-green">{totalVotes}</div></div>
        <div className="stat-box"><div className="stat-lbl">Pending votes</div><div className="stat-val c-gold">{pendingVotes}</div></div>
        <div className="stat-box"><div className="stat-lbl">Sections</div><div className="stat-val c-cyan">{SECTIONS.length}</div></div>
        <div className="stat-box"><div className="stat-lbl">Requests</div><div className="stat-val c-orange">{pendingReqs}</div></div>
      </div>

      {/* Edit requests */}
      {pendingReqs > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Vote edit requests <span style={{ background: 'var(--orange)', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: '0.72rem' }}>{pendingReqs}</span></div>
          {(state.editRequests || []).filter(r => r.status === 'pending').map(req => (
            <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.86rem' }}>{req.presTitle}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{req.evalName} · Vote: {(state.votes?.[req.evalName] || {})[req.presId] ?? '—'}/10 · {req.requestedAt}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.3)' }} onClick={() => approve(req.id)}>Approve</button>
                <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)' }} onClick={() => reject(req.id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Evaluator status */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700 }}>Registered evaluators</div>
          <button className="btn btn-sm btn-ghost" onClick={() => setShowAddEval(true)}>+ Add evaluator</button>
        </div>
        {!(state.registeredEvaluators?.length) ? (
          <div style={{ color: 'var(--muted)', fontSize: '0.86rem' }}>No evaluators registered. Click "Add evaluator" to start.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name','Assigned sections','Overall',''].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(state.registeredEvaluators || []).map(ev => {
                  const myV = state.votes?.[ev.name] || {}
                  const myL = state.locked?.[ev.name] || {}
                  const allPres = (ev.sections||[]).flatMap(sk => Object.values(ALL_PRES).filter(p => p.sectionKey === sk))
                  const locked = allPres.filter(p => myL[p.id]).length
                  const voted = allPres.filter(p => myV[p.id] !== undefined).length
                  const done = locked === allPres.length && allPres.length > 0
                  return (
                    <tr key={ev.name} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 10px' }}>
                        <div style={{ fontWeight: 600 }}>{ev.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>pass: {ev.pass}</div>
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(ev.sections||[]).map(sk => {
                            const sec = SECTIONS.find(s => s.key === sk)
                            const pres = Object.values(ALL_PRES).filter(p => p.sectionKey === sk)
                            const l = pres.filter(p => myL[p.id]).length
                            return (
                              <span key={sk} style={{ padding: '2px 7px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600,
                                background: l === pres.length && pres.length > 0 ? 'rgba(34,197,94,0.15)' : l > 0 ? 'rgba(251,146,60,0.15)' : 'rgba(90,128,153,0.15)',
                                color: l === pres.length && pres.length > 0 ? 'var(--green)' : l > 0 ? 'var(--orange)' : 'var(--muted)' }}>
                                {sec?.short || sk} · {l}/{pres.length}
                              </span>
                            )
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.76rem', fontWeight: 600,
                          background: done ? 'rgba(34,197,94,0.15)' : voted > 0 ? 'rgba(251,146,60,0.15)' : 'rgba(90,128,153,0.15)',
                          color: done ? 'var(--green)' : voted > 0 ? 'var(--orange)' : 'var(--muted)' }}>
                          {done ? 'Completed' : voted > 0 ? `${voted} voted · ${locked} locked` : 'Not started'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <button className="btn btn-sm btn-danger" onClick={() => removeEval(ev.name)}>Remove</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results by section */}
      <div style={{ fontFamily: 'Syne', fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Results by section</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setActiveSec(s.key)}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              background: activeSec === s.key ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'var(--card)',
              borderColor: activeSec === s.key ? 'transparent' : 'var(--border)',
              color: activeSec === s.key ? '#fff' : 'var(--muted)' }}>
            {s.short}
          </button>
        ))}
      </div>

      {/* Results table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={th}>#</th>
              <th style={th}>Presentation</th>
              <th style={th}>Type</th>
              {evalNames.map(n => (
                <th key={n} style={{ ...th, minWidth: 72, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.66rem', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n}</div>
                  <div style={{ fontSize: '0.58rem', color: (state.attendees||[]).find(a=>a.name===n) ? 'var(--purple)' : 'var(--accent2)' }}>
                    {(state.attendees||[]).find(a=>a.name===n) ? 'Att 0.3×' : 'Eval'}
                  </div>
                </th>
              ))}
              <th style={{ ...th, minWidth: 160 }}>Weighted avg.</th>
              <th style={th}>Votes</th>
            </tr>
          </thead>
          <tbody>
            {types.map(type => {
              const rows = scored.filter(p => p.type === type)
              if (!rows.length) return null
              return [
                <tr key={`hdr-${type}`}>
                  <td colSpan={5 + evalNames.length} style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--accent2)', background: 'rgba(30,143,171,0.05)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {typeLabels[type]}
                  </td>
                </tr>,
                ...rows.map((p, i) => {
                  const bg = i < 3 ? medalColors[i] : 'transparent'
                  const pct = p.avg ? Math.round(parseFloat(p.avg) / 10 * 100) : 0
                  return (
                    <tr key={p.id} style={{ background: bg, borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 14px', width: 40 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.76rem', fontWeight: 700,
                          background: i === 0 ? 'rgba(232,160,32,0.3)' : i === 1 ? 'rgba(148,163,184,0.2)' : i === 2 ? 'rgba(205,127,50,0.2)' : 'var(--surface2)',
                          color: i === 0 ? 'var(--gold)' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : 'var(--muted)' }}>
                          {i + 1}
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 500, lineHeight: 1.35 }}>
                          {p.title}
                          {i < 3 && <span style={{ marginLeft: 6, fontSize: '0.68rem', padding: '1px 5px', borderRadius: 4, background: i===0?'rgba(232,160,32,0.2)':i===1?'rgba(148,163,184,0.15)':'rgba(205,127,50,0.15)', color: i===0?'var(--gold)':i===1?'#94a3b8':'#cd7f32' }}>{medals[i]}</span>}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>{p.author}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, textTransform: 'uppercase',
                          background: type==='oral'?'rgba(30,143,171,0.15)':type==='flash'?'rgba(249,115,22,0.15)':'rgba(168,85,247,0.15)',
                          color: type==='oral'?'var(--accent)':type==='flash'?'var(--orange)':'var(--purple)' }}>
                          {type}
                        </span>
                      </td>
                      {evalNames.map(n => {
                        const score = (state.votes?.[n] || {})[p.id]
                        const isAtt = (state.attendees||[]).find(a=>a.name===n)
                        return (
                          <td key={n} style={{ padding: '10px 6px', textAlign: 'center', fontWeight: score !== undefined ? 700 : 400,
                            color: score !== undefined ? (isAtt ? 'var(--purple)' : 'var(--accent2)') : 'var(--muted)', fontSize: '0.84rem' }}>
                            {score ?? '—'}
                          </td>
                        )
                      })}
                      <td style={{ padding: '10px 14px' }}>
                        {p.avg ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--brand-mid),var(--accent2))', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontWeight: 700, minWidth: 36, color: 'var(--accent2)' }}>{p.avg}</span>
                          </div>
                        ) : <span style={{ color: 'var(--muted)' }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--muted)', fontSize: '0.78rem' }}>
                        {p.rawCount}v{p.lockedCount !== p.rawCount ? ` (${p.lockedCount})` : ''}
                      </td>
                    </tr>
                  )
                })
              ]
            })}
            {!scored.length && (
              <tr><td colSpan={5 + evalNames.length} style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>No evaluations yet for this section.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add evaluator modal */}
      {showAddEval && (
        <div className="overlay" onClick={() => setShowAddEval(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add evaluator</h2>
            <div className="modal-sub">Set the name, password and assigned sections for this evaluator.</div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div className="field"><label>Name</label><input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Prof. Ana Silva" /></div>
              <div className="field"><label>Access password</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Choose a password" /></div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>ASSIGNED SECTIONS</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {SECTIONS.map(s => (
                    <button key={s.key}
                      onClick={() => setNewSections(prev => prev.includes(s.key) ? prev.filter(x => x !== s.key) : [...prev, s.key])}
                      style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                        background: newSections.includes(s.key) ? 'rgba(30,143,171,0.2)' : 'transparent',
                        borderColor: newSections.includes(s.key) ? 'var(--accent)' : 'var(--border)',
                        color: newSections.includes(s.key) ? 'var(--accent2)' : 'var(--muted)' }}>
                      {s.short}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowAddEval(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addEval}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const th = { padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.76rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }

function exportCSV(state) {
  const rows = [['Presentation','Author','Type','Section','Evaluator','Score','Locked']]
  Object.entries(state.votes || {}).forEach(([user, vmap]) => {
    Object.entries(vmap).forEach(([presId, score]) => {
      const p = ALL_PRES[parseInt(presId)]
      if (!p) return
      const locked = !!(state.locked?.[user] || {})[presId]
      rows.push([p.title, p.author, p.type, p.sectionKey, user, score, locked])
    })
  })
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = 'proteovilamoura_votes.csv'
  a.click()
}
