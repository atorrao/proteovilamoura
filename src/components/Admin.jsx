import { useState } from 'react'
import { SECTIONS, ALL_PRES } from '../data/index.js'

const th = { padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.76rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }
const medalColors = ['rgba(232,160,32,0.15)', 'rgba(148,163,184,0.1)', 'rgba(205,127,50,0.1)']
const medals = ['1st', '2nd', '3rd']
const typeLabels = { oral: 'Oral Communications', flash: 'Flash Presentations', poster: 'Posters' }

function exportCSV(state) {
  const rows = [['Presentation', 'Author', 'Type', 'Section', 'User', 'Score']]
  Object.entries(state.votes || {}).forEach(([user, vmap]) => {
    Object.entries(vmap).forEach(([presId, score]) => {
      const p = ALL_PRES[parseInt(presId)]
      if (!p) return
      rows.push([p.title, p.author, p.type, p.sectionKey, user, score])
    })
  })
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = 'proteovilamoura_votes.csv'; a.click()
}

function SectionToggle({ selected, onChange }) {
  const toggle = key => onChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key])
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {SECTIONS.map(s => (
        <button key={s.key} type="button" onClick={() => toggle(s.key)}
          style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.18s',
            background: selected.includes(s.key) ? 'rgba(30,143,171,0.2)' : 'transparent',
            borderColor: selected.includes(s.key) ? 'var(--accent)' : 'var(--border)',
            color: selected.includes(s.key) ? 'var(--accent2)' : 'var(--muted)' }}>
          {s.short}
        </button>
      ))}
    </div>
  )
}

function EvalModal({ initial, existingNames, onSave, onClose }) {
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name || '')
  const [pass, setPass] = useState(initial?.pass || '')
  const [sections, setSections] = useState(initial?.sections || [])
  const [err, setErr] = useState('')
  const save = () => {
    if (!name.trim()) { setErr('Please enter a name.'); return }
    if (!pass.trim()) { setErr('Please enter a password.'); return }
    if (!isEdit && existingNames.includes(name.trim())) { setErr('Name already exists.'); return }
    onSave({ name: name.trim(), pass: pass.trim(), sections })
  }
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit evaluator' : 'Add evaluator'}</h2>
        <div className="modal-sub">{isEdit ? 'Update password and assigned sections.' : 'Set name, password and assigned sections.'}</div>
        <div style={{ display: 'grid', gap: 14 }}>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Prof. Ana Silva"
              disabled={isEdit} style={isEdit ? { opacity: 0.55, cursor: 'not-allowed' } : {}} />
            {isEdit && <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 3 }}>Name cannot be changed as it is linked to existing votes.</div>}
          </div>
          <div className="field">
            <label>Access password</label>
            <input type="text" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned sections</div>
            <SectionToggle selected={sections} onChange={setSections} />
          </div>
        </div>
        {err && <div className="err-msg" style={{ marginTop: 10 }}>{err}</div>}
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{isEdit ? 'Save changes' : 'Add evaluator'}</button>
        </div>
      </div>
    </div>
  )
}

function AttendeeModal({ initial, existingNames, onSave, onClose }) {
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name || '')
  const [pass, setPass] = useState(initial?.pass || '')
  const [inst, setInst] = useState(initial?.inst || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [country, setCountry] = useState(initial?.country || 'Portugal')
  const [err, setErr] = useState('')
  const [showPass, setShowPass] = useState(false)

  const save = () => {
    if (!name.trim()) { setErr('Please enter a name.'); return }
    if (!isEdit && existingNames.includes(name.trim())) { setErr('Name already exists.'); return }
    onSave({ name: name.trim(), pass, inst, email, country })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit attendee' : 'Add attendee'}</h2>
        <div className="modal-sub">{isEdit ? 'Update attendee details.' : 'Add an attendee manually.'}</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ana Silva"
              disabled={isEdit} style={isEdit ? { opacity: 0.55, cursor: 'not-allowed' } : {}} />
          </div>
          <div className="field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" style={{ paddingRight: 46 }} />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{showPass ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}</svg>
              </button>
            </div>
          </div>
          <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. ana@fc.ul.pt" /></div>
          <div className="field"><label>Institution</label><input value={inst} onChange={e => setInst(e.target.value)} placeholder="e.g. University of Lisbon" /></div>
          <div className="field"><label>Country</label><input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Portugal" /></div>
        </div>
        {err && <div className="err-msg" style={{ marginTop: 10 }}>{err}</div>}
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{isEdit ? 'Save changes' : 'Add attendee'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Admin({ state, actions, showToast }) {
  const [activeTab, setActiveTab] = useState('evaluators') // 'evaluators' | 'attendees' | 'results'
  const [activeSec, setActiveSec] = useState('sec1')
  const [evalModal, setEvalModal] = useState(null)
  const [attModal, setAttModal] = useState(null)

  const evalNames = (state.evaluators || [])
  const attendees = state.attendees || []
  const pendingAttendees = state.pendingAttendees || []

  const totalVotes = Object.values(state.votes || {}).reduce((acc, vmap) => acc + Object.keys(vmap).length, 0)

  // Results: evaluators assigned to section → weighted average
  // + one column for attendee average
  const getResults = (secKey) => {
    const sectionEvals = (state.registeredEvaluators || [])
      .filter(e => e.sections?.includes(secKey))
      .map(e => e.name)
    const attNames = attendees.map(a => a.name)

    return Object.values(ALL_PRES).filter(p => p.sectionKey === secKey).map(p => {
      let evalSum = 0, evalCount = 0
      let attSum = 0, attCount = 0, rawCount = 0

      Object.entries(state.votes || {}).forEach(([user, vmap]) => {
        const score = vmap[p.id]; if (score === undefined) return
        rawCount++
        if (sectionEvals.includes(user)) { evalSum += score; evalCount++ }
        if (attNames.includes(user)) { attSum += score; attCount++ }
      })

      const evalAvg = evalCount > 0 ? evalSum / evalCount : null
      const attAvg = attCount > 0 ? attSum / attCount : null

      // Final average = 90% evaluator avg + 10% attendee avg
      // If only one group has votes, use only that group
      let finalAvg = null
      if (evalAvg !== null && attAvg !== null) {
        finalAvg = (evalAvg * 0.9 + attAvg * 0.1).toFixed(2)
      } else if (evalAvg !== null) {
        finalAvg = evalAvg.toFixed(2)
      } else if (attAvg !== null) {
        finalAvg = attAvg.toFixed(2)
      }

      const evalScores = {}
      sectionEvals.forEach(n => {
        const s = (state.votes?.[n] || {})[p.id]
        if (s !== undefined) evalScores[n] = s
      })

      return { ...p, rawCount, evalCount, attCount, evalAvg: evalAvg?.toFixed(2), attAvg: attAvg?.toFixed(2), finalAvg, evalScores }
    }).sort((a, b) => !a.finalAvg && !b.finalAvg ? 0 : !a.finalAvg ? 1 : !b.finalAvg ? -1 : parseFloat(b.finalAvg) - parseFloat(a.finalAvg))
  }

  const handleSaveEval = async (data) => {
    const isEdit = !!(evalModal?.name)
    if (isEdit) await actions.updateEvaluator(data)
    else await actions.addEvaluator(data)
    setEvalModal(null)
    showToast(isEdit ? `${data.name} updated.` : `${data.name} added.`, 'green')
  }

  const removeEval = async (name) => {
    if (!confirm(`Remove "${name}"? Their votes will be kept.`)) return
    await actions.removeEvaluator(name)
    showToast(`${name} removed.`, 'orange')
  }

  const handleSaveAtt = async (data) => {
    const isEdit = !!(attModal?.name)
    await actions.registerAttendee(data)
    setAttModal(null)
    showToast(isEdit ? `${data.name} updated.` : `${data.name} added.`, 'green')
  }

  const removeAtt = async (name) => {
    if (!confirm(`Remove "${name}"? Their votes will be kept.`)) return
    const { supabase } = await import('../supabase.js')
    await supabase.from('attendees').delete().eq('name', name)
    showToast(`${name} removed.`, 'orange')
  }

  const scored = getResults(activeSec)
  const sectionEvals = (state.registeredEvaluators || []).filter(e => e.sections?.includes(activeSec)).map(e => e.name)

  return (
    <div className="container" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Backoffice</div>
          <div className="page-sub">ProteoVilamoura 2026 — real-time management</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(state)}>Export CSV</button>
          <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm('Delete ALL data?')) { await actions.clearAll(); showToast('All data cleared.', 'red') } }}>Clear data</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 20 }}>
        {[
          ['Presentations', Object.keys(ALL_PRES).length, 'c-blue'],
          ['Evaluators', evalNames.length, 'c-gold'],
          ['Attendees', attendees.length, 'c-purple'],

          ['Votes', totalVotes, 'c-green'],
          ['Sections', SECTIONS.length, 'c-cyan'],
        ].map(([lbl, val, cls]) => (
          <div key={lbl} className="stat-box">
            <div className="stat-lbl">{lbl}</div>
            <div className={`stat-val ${cls}`}>{val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'evaluators', label: 'Evaluators' },
          { id: 'attendees',  label: `Attendees${pendingAttendees.length ? ` (${pendingAttendees.length} pending)` : ''}` },
          { id: 'results',    label: 'Results by section' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.86rem', fontWeight: 600, transition: 'all 0.18s',
              color: activeTab === t.id ? 'var(--accent2)' : 'var(--muted)',
              borderBottom: `2px solid ${activeTab === t.id ? 'var(--accent2)' : 'transparent'}`,
              marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── EVALUATORS TAB ── */}
      {activeTab === 'evaluators' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700 }}>Registered evaluators</div>
            <button className="btn btn-sm btn-ghost" onClick={() => setEvalModal('add')}>+ Add evaluator</button>
          </div>
          {!(state.registeredEvaluators?.length) ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.86rem' }}>No evaluators registered.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Name', 'Password', 'Sections', 'Progress', ''].map(h => <th key={h} style={th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(state.registeredEvaluators || []).map(ev => {
                    const myV = state.votes?.[ev.name] || {}
                    const allPres = (ev.sections || []).flatMap(sk => Object.values(ALL_PRES).filter(p => p.sectionKey === sk))
                    const voted = allPres.filter(p => myV[p.id] !== undefined).length
                    const done = voted === allPres.length && allPres.length > 0
                    return (
                      <tr key={ev.name} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{ev.name}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', background: 'var(--surface2)', padding: '2px 8px', borderRadius: 6, color: 'var(--accent2)' }}>{ev.pass}</span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {!(ev.sections?.length) ? <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>None</span>
                              : ev.sections.map(sk => {
                                const sec = SECTIONS.find(s => s.key === sk)
                                const pres = Object.values(ALL_PRES).filter(p => p.sectionKey === sk)
                                const v = pres.filter(p => myV[p.id] !== undefined).length
                                return <span key={sk} style={{ padding: '2px 7px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600, background: v === pres.length && pres.length > 0 ? 'rgba(34,197,94,0.15)' : v > 0 ? 'rgba(251,146,60,0.15)' : 'rgba(90,128,153,0.15)', color: v === pres.length && pres.length > 0 ? 'var(--green)' : v > 0 ? 'var(--orange)' : 'var(--muted)' }}>{sec?.short || sk} · {v}/{pres.length}</span>
                              })}
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.76rem', fontWeight: 600, background: done ? 'rgba(34,197,94,0.15)' : voted > 0 ? 'rgba(251,146,60,0.15)' : 'rgba(90,128,153,0.15)', color: done ? 'var(--green)' : voted > 0 ? 'var(--orange)' : 'var(--muted)' }}>
                            {done ? 'Completed' : voted > 0 ? `${voted}/${allPres.length} voted` : 'Not started'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-sm btn-ghost" onClick={() => setEvalModal(ev)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => removeEval(ev.name)}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ATTENDEES TAB ── */}
      {activeTab === 'attendees' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Attendees */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 700 }}>Attendees ({attendees.length})</div>
              <button className="btn btn-sm btn-ghost" onClick={() => setAttModal('add')}>+ Add attendee</button>
            </div>
            {!attendees.length ? (
              <div style={{ color: 'var(--muted)', fontSize: '0.86rem' }}>No attendees yet.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Name', 'Password', 'Email', 'Institution', 'Country', 'Votes', ''].map(h => <th key={h} style={th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map(att => {
                      const myV = state.votes?.[att.name] || {}
                      const voteCount = Object.keys(myV).length
                      return (
                        <tr key={att.name} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{att.name}</td>
                          <td style={{ padding: '10px 14px' }}>
                            {att.pass ? <span style={{ fontFamily:'monospace', fontSize:'0.82rem', background:'var(--bg)', padding:'2px 8px', borderRadius:6, color:'var(--accent2)', border:'1px solid var(--border)' }}>{att.pass}</span>
                              : <span style={{ color:'var(--muted)', fontSize:'0.78rem' }}>—</span>}
                          </td>
                          <td style={{ padding: '10px 14px', color: 'var(--muted)', fontSize: '0.82rem' }}>{att.email || '—'}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{att.inst || '—'}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{att.country || '—'}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.76rem', fontWeight: 600, background: voteCount > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(90,128,153,0.15)', color: voteCount > 0 ? 'var(--green)' : 'var(--muted)' }}>
                              {voteCount}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-sm btn-ghost" onClick={() => setAttModal(att)}>Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={() => removeAtt(att.name)}>Remove</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RESULTS TAB ── */}
      {activeTab === 'results' && (
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => setActiveSec(s.key)}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                  background: activeSec === s.key ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'var(--surface)',
                  borderColor: activeSec === s.key ? 'transparent' : 'var(--border)',
                  color: activeSec === s.key ? '#fff' : 'var(--muted)' }}>
                {s.short}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={th}>#</th>
                  <th style={th}>Presentation</th>
                  <th style={th}>Type</th>
                  {sectionEvals.map(n => (
                    <th key={n} style={{ ...th, minWidth: 72, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.66rem', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n}</div>
                      <div style={{ fontSize: '0.58rem', color: 'var(--accent2)' }}>Evaluator</div>
                    </th>
                  ))}
                  {attendees.length > 0 && (
                    <th style={{ ...th, minWidth: 80, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.66rem' }}>Attendees</div>
                      <div style={{ fontSize: '0.58rem', color: 'var(--purple)' }}>avg.</div>
                    </th>
                  )}
                  <th style={{ ...th, minWidth: 140 }}>Final avg.</th>
                  <th style={th}>Votes</th>
                </tr>
              </thead>
              <tbody>
                {['oral', 'flash', 'poster'].map(type => {
                  const rows = scored.filter(p => p.type === type)
                  if (!rows.length) return null
                  return [
                    <tr key={`h-${type}`}>
                      <td colSpan={5 + sectionEvals.length + (attendees.length > 0 ? 1 : 0)} style={{ padding: '10px 14px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--accent2)', background: 'rgba(30,143,171,0.05)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {typeLabels[type]}
                      </td>
                    </tr>,
                    ...rows.map((p, i) => {
                      const pct = p.finalAvg ? Math.round(parseFloat(p.finalAvg) / 10 * 100) : 0
                      return (
                        <tr key={p.id} style={{ background: i < 3 ? medalColors[i] : 'transparent', borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.76rem', fontWeight: 700, background: i === 0 ? 'rgba(232,160,32,0.3)' : i === 1 ? 'rgba(148,163,184,0.2)' : i === 2 ? 'rgba(205,127,50,0.2)' : 'var(--surface2)', color: i === 0 ? 'var(--gold)' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : 'var(--muted)' }}>{i + 1}</div>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ fontWeight: 500, lineHeight: 1.35 }}>
                              {p.title}
                              {i < 3 && <span style={{ marginLeft: 6, fontSize: '0.68rem', padding: '1px 5px', borderRadius: 4, background: i === 0 ? 'rgba(232,160,32,0.2)' : i === 1 ? 'rgba(148,163,184,0.15)' : 'rgba(205,127,50,0.15)', color: i === 0 ? 'var(--gold)' : i === 1 ? '#94a3b8' : '#cd7f32' }}>{medals[i]}</span>}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>{p.author}</div>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, textTransform: 'uppercase', background: type === 'oral' ? 'rgba(30,143,171,0.15)' : type === 'flash' ? 'rgba(249,115,22,0.15)' : 'rgba(168,85,247,0.15)', color: type === 'oral' ? 'var(--accent)' : type === 'flash' ? 'var(--orange)' : 'var(--purple)' }}>{type}</span>
                          </td>
                          {sectionEvals.map(n => {
                            const sc = p.evalScores[n]
                            return <td key={n} style={{ padding: '10px 6px', textAlign: 'center', fontWeight: sc !== undefined ? 700 : 400, color: sc !== undefined ? 'var(--text)' : 'var(--muted)', fontSize: '0.84rem' }}>{sc ?? '—'}</td>
                          })}
                          {attendees.length > 0 && (
                            <td style={{ padding: '10px 6px', textAlign: 'center', fontWeight: p.attAvg ? 700 : 400, color: p.attAvg ? 'var(--purple)' : 'var(--muted)', fontSize: '0.84rem' }}>
                              {p.attAvg ?? '—'}
                            </td>
                          )}
                          <td style={{ padding: '10px 14px' }}>
                            {p.finalAvg ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--brand-mid),var(--accent2))', borderRadius: 3 }} />
                                </div>
                                <span style={{ fontWeight: 700, minWidth: 36, color: 'var(--accent2)' }}>{p.finalAvg}</span>
                              </div>
                            ) : <span style={{ color: 'var(--muted)' }}>—</span>}
                          </td>
                          <td style={{ padding: '10px 14px', color: 'var(--text)', fontSize: '0.78rem' }}>{p.rawCount}</td>
                        </tr>
                      )
                    })
                  ]
                })}
                {!scored.length && (
                  <tr><td colSpan={5 + sectionEvals.length + (attendees.length > 0 ? 1 : 0)} style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>No evaluations yet for this section.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {evalModal && (
        <EvalModal
          initial={evalModal === 'add' ? null : evalModal}
          existingNames={(state.registeredEvaluators || []).map(e => e.name)}
          onSave={handleSaveEval}
          onClose={() => setEvalModal(null)}
        />
      )}
    </div>
  )
}
