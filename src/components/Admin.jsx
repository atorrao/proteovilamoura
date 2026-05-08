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
  const [email, setEmail] = useState(initial?.email || '')
  const [inst, setInst] = useState(initial?.inst || '')
  const [country, setCountry] = useState(initial?.country || '')
  const [sections, setSections] = useState(initial?.sections || [])
  const [err, setErr] = useState('')
  const save = () => {
    if (!name.trim()) { setErr('Please enter a name.'); return }
    if (!email.trim()) { setErr('Please enter an email.'); return }
    if (!isEdit && existingNames.includes(name.trim())) { setErr('Name already exists.'); return }
    onSave({ name: name.trim(), email: email.trim(), inst, country, sections })
  }
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit evaluator' : 'Add evaluator'}</h2>
        <div className="modal-sub">{isEdit ? 'Update evaluator details and assigned sections.' : 'Add evaluator. They will log in using their email.'}</div>
        <div style={{ display: 'grid', gap: 14 }}>
          <div className="field">
            <label>Name <span style={{ color: 'var(--red)' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Prof. Ana Silva" />
          </div>
          <div className="field">
            <label>Email <span style={{ color: 'var(--red)' }}>*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. evaluator@institution.com" />
          </div>
          <div className="field">
            <label>Institution</label>
            <input value={inst} onChange={e => setInst(e.target.value)} placeholder="e.g. University of Lisbon" />
          </div>
          <div className="field">
            <label>Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Portugal" />
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
  const [email, setEmail] = useState(initial?.email || '')
  const [inst, setInst] = useState(initial?.inst || '')
  const [country, setCountry] = useState(initial?.country || '')
  const [err, setErr] = useState('')

  const save = () => {
    if (!name.trim()) { setErr('Please enter a name.'); return }
    if (!email.trim()) { setErr('Please enter an email.'); return }
    if (!isEdit && existingNames.includes(name.trim())) { setErr('Name already exists.'); return }
    onSave({ name: name.trim(), email: email.trim(), inst, country })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit attendee' : 'Add attendee'}</h2>
        <div className="modal-sub">{isEdit ? 'Update attendee details.' : 'Add an attendee. They will log in using their email.'}</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="field">
            <label>Name <span style={{ color: "var(--red)" }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ana Silva" />
          </div>
          <div className="field">
            <label>Email <span style={{ color: "var(--red)" }}>*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. ana@fc.ul.pt" />
          </div>
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
  // Safety: ensure all state arrays exist even if Supabase returns unexpected data
  const safeState = {
    ...state,
    evaluators: state.evaluators || [],
    registeredEvaluators: state.registeredEvaluators || [],
    attendees: state.attendees || [],
    votes: state.votes || {},
    locked: state.locked || {},
  }
  return <AdminInner state={safeState} actions={actions} showToast={showToast} />
}

function AdminInner({ state, actions, showToast }) {
  const [activeTab, setActiveTab] = useState('evaluators') // 'evaluators' | 'attendees' | 'results'
  const [evalModal, setEvalModal] = useState(null)
  const [attModal, setAttModal] = useState(null)

  const evalNames = (state.evaluators || [])
  const attendees = state.attendees || []

  const totalVotes = Object.values(state.votes || {}).reduce((acc, vmap) => acc + Object.keys(vmap).length, 0)

  // Results across ALL sections, grouped by type
  // Each evaluator votes for presentations in their assigned sections
  // Final = 85% eval avg + 15% attendee avg
  const getAllResults = () => {
    const attNames = attendees.map(a => a.name)
    const allEvals = state.registeredEvaluators || []

    return Object.values(ALL_PRES).map(p => {
      // Find evaluators assigned to this presentation's section
      const sectionEvals = allEvals
        .filter(e => e.sections?.includes(p.sectionKey))
        .map(e => e.name)

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

      let finalAvg = null
      if (evalAvg !== null && attAvg !== null) {
        finalAvg = (evalAvg * 0.85 + attAvg * 0.15).toFixed(2)
      } else if (evalAvg !== null) {
        finalAvg = evalAvg.toFixed(2)
      } else if (attAvg !== null) {
        finalAvg = attAvg.toFixed(2)
      }

      return { ...p, rawCount, evalCount, attCount, evalAvg: evalAvg?.toFixed(2), attAvg: attAvg?.toFixed(2), finalAvg }
    }).sort((a, b) => !a.finalAvg && !b.finalAvg ? 0 : !a.finalAvg ? 1 : !b.finalAvg ? -1 : parseFloat(b.finalAvg) - parseFloat(a.finalAvg))
  }

  const handleSaveEval = async (data) => {
    const isEdit = evalModal && evalModal !== 'add'
    try {
      if (isEdit && evalModal.name !== data.name) {
        // Name changed: remove old, add new
        await actions.removeEvaluator(evalModal.name)
        await actions.addEvaluator(data)
      } else if (isEdit) {
        await actions.updateEvaluator(data)
      } else {
        await actions.addEvaluator(data)
      }
      setEvalModal(null)
      showToast(isEdit ? `${data.name} updated.` : `${data.name} added.`, 'green')
    } catch(e) {
      showToast('Error: ' + (e?.message || 'unknown'), 'red')
    }
  }

  const removeEval = async (name) => {
    if (!confirm(`Remove "${name}"? Their votes will be kept.`)) return
    await actions.removeEvaluator(name)
    showToast(`${name} removed.`, 'orange')
  }

  const handleSaveAtt = async (data) => {
    const isEdit = attModal && attModal !== 'add'
    try {
      if (isEdit && attModal.name !== data.name) {
        await actions.removeAttendee(attModal.name)
        await actions.addAttendee(data)
      } else if (isEdit) {
        await actions.updateAttendee(data)
      } else {
        await actions.addAttendee(data)
      }
      setAttModal(null)
      showToast(isEdit ? `${data.name} updated.` : `${data.name} added.`, 'green')
    } catch(e) {
      showToast('Error: ' + (e?.message || 'unknown'), 'red')
    }
  }

  const removeAtt = async (name) => {
    if (!confirm(`Remove "${name}"? Their votes will be kept.`)) return
    await actions.removeAttendee(name)
    showToast(`${name} removed.`, 'orange')
  }

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
          ['Accessed', attendees.filter(a => a.accessed).length, 'c-cyan'],
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
                    {['Name', 'Email', 'Institution', 'Sections', 'Progress', ''].map(h => <th key={h} style={th}>{h}</th>)}
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
                      {['Name', 'Email', 'Institution', 'Country', 'Votes', 'Accessed', ''].map(h => <th key={h} style={th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map(att => {
                      const myV = state.votes?.[att.name] || {}
                      const voteCount = Object.keys(myV).length
                      return (
                        <tr key={att.name} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{att.name}</td>
                          <td style={{ padding: '10px 14px', fontSize: '0.82rem', color: 'var(--muted)' }}>{att.email || '—'}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{att.inst || '—'}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{att.country || '—'}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.76rem', fontWeight: 600, background: voteCount > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(90,128,153,0.15)', color: voteCount > 0 ? 'var(--green)' : 'var(--muted)' }}>
                              {voteCount}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.76rem', fontWeight: 600,
                              background: att.accessed ? 'rgba(30,143,171,0.12)' : 'rgba(90,128,153,0.1)',
                              color: att.accessed ? 'var(--accent)' : 'var(--muted)' }}>
                              {att.accessed ? 'Yes' : 'Not yet'}
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
      {activeTab === 'results' && (() => {
        let allResults = []
        try { allResults = getAllResults() } catch(e) { console.error('getAllResults error:', e) }
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {['oral', 'flash', 'poster'].map(type => {
              const rows = allResults.filter(p => p.type === type)
              if (!rows.length) return (
                <div key={type}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Syne' }}>{typeLabels[type]}</span>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.86rem', padding: '16px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    No votes yet for {typeLabels[type].toLowerCase()}.
                  </div>
                </div>
              )
              return (
                <div key={type}>
                  {/* Type header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Syne' }}>{typeLabels[type]}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em',
                      background: type === 'oral' ? 'rgba(30,143,171,0.12)' : type === 'flash' ? 'rgba(249,115,22,0.12)' : 'rgba(168,85,247,0.12)',
                      color: type === 'oral' ? 'var(--accent)' : type === 'flash' ? 'var(--orange)' : 'var(--purple)' }}>
                      {rows.length} presentations
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>· top 3 are winners</span>
                  </div>

                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    {rows.map((p, i) => {
                      const pct = p.finalAvg ? Math.round(parseFloat(p.finalAvg) / 10 * 100) : 0
                      const top3 = i < 3
                      const medalBg = i === 0 ? 'rgba(232,160,32,0.12)' : i === 1 ? 'rgba(148,163,184,0.08)' : 'rgba(205,127,50,0.08)'
                      const medalColor = i === 0 ? 'var(--gold)' : i === 1 ? '#94a3b8' : '#cd7f32'
                      return (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none', background: top3 ? medalBg : 'transparent' }}>
                          {/* Rank */}
                          <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700,
                            background: top3 ? (i === 0 ? 'rgba(232,160,32,0.25)' : i === 1 ? 'rgba(148,163,184,0.2)' : 'rgba(205,127,50,0.2)') : 'var(--surface2)',
                            color: top3 ? medalColor : 'var(--muted)' }}>
                            {i + 1}
                          </div>

                          {/* Title + author */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 500, fontSize: '0.86rem', lineHeight: 1.35 }}>
                              {p.title}
                              {top3 && <span style={{ marginLeft: 6, fontSize: '0.66rem', padding: '1px 6px', borderRadius: 4, fontWeight: 700,
                                background: i === 0 ? 'rgba(232,160,32,0.18)' : i === 1 ? 'rgba(148,163,184,0.15)' : 'rgba(205,127,50,0.15)',
                                color: medalColor }}>{medals[i]}</span>}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>{p.author}</div>
                          </div>

                          {/* Scores */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                            {p.finalAvg ? (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ width: 80, height: 5, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--brand-mid),var(--accent2))', borderRadius: 3 }} />
                                  </div>
                                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent2)', minWidth: 32, textAlign: 'right' }}>{p.finalAvg}</span>
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--muted)', textAlign: 'right' }}>
                                  {p.evalCount > 0 && `Eval: ${p.evalAvg}`}
                                  {p.evalCount > 0 && p.attCount > 0 && ' · '}
                                  {p.attCount > 0 && `Att: ${p.attAvg}`}
                                  {' · '}{p.rawCount} vote{p.rawCount !== 1 ? 's' : ''}
                                </div>
                              </>
                            ) : (
                              <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>No votes</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}

      {evalModal && (
        <EvalModal
          initial={evalModal === 'add' ? null : evalModal}
          existingNames={(state.registeredEvaluators || []).map(e => e.name)}
          onSave={handleSaveEval}
          onClose={() => setEvalModal(null)}
        />
      )}
      {attModal && (
        <AttendeeModal
          initial={attModal === 'add' ? null : attModal}
          existingNames={(state.attendees || []).map(a => a.name)}
          onSave={handleSaveAtt}
          onClose={() => setAttModal(null)}
        />
      )}
    </div>
  )
}
