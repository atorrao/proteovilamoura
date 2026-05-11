import { useState } from 'react'
import { SECTIONS, ALL_PRES } from '../data/index.js'

const medals = ['1st', '2nd', '3rd']
const medalColors = ['rgba(232,160,32,0.15)', 'rgba(148,163,184,0.1)', 'rgba(205,127,50,0.1)']
const typeLabels = { oral: 'Oral Communications', flash: 'Flash Presentations', poster: 'Posters' }
const th = { padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.76rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }

// ── Section toggle ─────────────────────────────────────────────────────────
function SectionToggle({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {SECTIONS.map(s => {
        const active = selected.includes(s.key)
        return (
          <button key={s.key} type="button"
            onClick={() => onChange(active ? selected.filter(k => k !== s.key) : [...selected, s.key])}
            style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              background: active ? 'rgba(30,143,171,0.2)' : 'transparent',
              borderColor: active ? 'var(--accent)' : 'var(--border)',
              color: active ? 'var(--accent2)' : 'var(--muted)' }}>
            {s.short}
          </button>
        )
      })}
    </div>
  )
}

// ── Evaluator modal ────────────────────────────────────────────────────────
function EvalModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [inst, setInst] = useState(initial?.inst || '')
  const [country, setCountry] = useState(initial?.country || '')
  const [sections, setSections] = useState(initial?.sections || [])
  const [err, setErr] = useState('')

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{initial ? 'Edit evaluator' : 'Add evaluator'}</h2>
        <div className="modal-sub">Login is by email. Assign sections to this evaluator.</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="field">
            <label>Name <span style={{ color: 'var(--red)' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Prof. Ana Silva" />
          </div>
          <div className="field">
            <label>Email <span style={{ color: 'var(--red)' }}>*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. ana@institution.com" />
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
          <button className="btn btn-primary" onClick={() => {
            if (!name.trim()) { setErr('Name is required.'); return }
            if (!email.trim()) { setErr('Email is required.'); return }
            onSave({ name: name.trim(), email: email.trim(), inst: inst.trim(), country: country.trim(), sections })
          }}>{initial ? 'Save changes' : 'Add evaluator'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Attendee modal ─────────────────────────────────────────────────────────
function AttendeeModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [inst, setInst] = useState(initial?.inst || '')
  const [country, setCountry] = useState(initial?.country || '')
  const [err, setErr] = useState('')

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{initial ? 'Edit attendee' : 'Add attendee'}</h2>
        <div className="modal-sub">Attendees log in using their email address.</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="field">
            <label>Name <span style={{ color: 'var(--red)' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ana Silva" />
          </div>
          <div className="field">
            <label>Email <span style={{ color: 'var(--red)' }}>*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. ana@email.com" />
          </div>
          <div className="field">
            <label>Institution</label>
            <input value={inst} onChange={e => setInst(e.target.value)} placeholder="e.g. University of Lisbon" />
          </div>
          <div className="field">
            <label>Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Portugal" />
          </div>
        </div>
        {err && <div className="err-msg" style={{ marginTop: 10 }}>{err}</div>}
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            if (!name.trim()) { setErr('Name is required.'); return }
            if (!email.trim()) { setErr('Email is required.'); return }
            onSave({ name: name.trim(), email: email.trim(), inst: inst.trim(), country: country.trim() })
          }}>{initial ? 'Save changes' : 'Add attendee'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Admin({ state = {}, actions = {}, showToast = () => {} }) {
  const [tab, setTab] = useState('evaluators')
  const [evalModal, setEvalModal] = useState(null)
  const [attModal, setAttModal] = useState(null)

  // Safe defaults — never crash on undefined
  const regs = state.registeredEvaluators || []
  const attendees = state.attendees || []
  const votes = state.votes || {}
  const totalVotes = Object.values(votes).reduce((a, v) => a + Object.keys(v || {}).length, 0)
  const accessed = attendees.filter(a => a.accessed).length

  // ── Save handlers ──────────────────────────────────────────────────────
  const saveEval = async (data) => {
    const isEdit = evalModal && evalModal !== 'add'
    try {
      if (isEdit && evalModal.name !== data.name) {
        await actions.removeEvaluator(evalModal.name)
        await actions.addEvaluator(data)
      } else if (isEdit) {
        await actions.updateEvaluator(data)
      } else {
        await actions.addEvaluator(data)
      }
      setEvalModal(null)
      showToast(isEdit ? `${data.name} updated.` : `${data.name} added.`, 'green')
    } catch (e) { showToast('Error: ' + (e?.message || 'unknown'), 'red') }
  }

  const saveAtt = async (data) => {
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
    } catch (e) { showToast('Error: ' + (e?.message || 'unknown'), 'red') }
  }

  const removeEval = async (name) => {
    if (!confirm(`Remove "${name}"?`)) return
    try { await actions.removeEvaluator(name); showToast(`${name} removed.`, 'orange') }
    catch (e) { showToast('Error: ' + e?.message, 'red') }
  }

  const removeAtt = async (name) => {
    if (!confirm(`Remove "${name}"?`)) return
    try { await actions.removeAttendee(name); showToast(`${name} removed.`, 'orange') }
    catch (e) { showToast('Error: ' + e?.message, 'red') }
  }

  // ── Results calculation ────────────────────────────────────────────────
  const getResults = () => {
    const attNames = new Set(attendees.map(a => a.name))
    return Object.values(ALL_PRES || {}).map(p => {
      const sectionEvalNames = new Set(
        regs.filter(e => Array.isArray(e.sections) && e.sections.includes(p.sectionKey)).map(e => e.name)
      )
      let evalSum = 0, evalCount = 0, attSum = 0, attCount = 0, rawCount = 0
      Object.entries(votes).forEach(([user, vmap]) => {
        if (!vmap) return
        const score = vmap[p.id]
        if (score === undefined || score === null) return
        rawCount++
        if (sectionEvalNames.has(user)) { evalSum += Number(score); evalCount++ }
        if (attNames.has(user)) { attSum += Number(score); attCount++ }
      })
      const evalAvg = evalCount > 0 ? evalSum / evalCount : null
      const attAvg = attCount > 0 ? attSum / attCount : null
      let finalAvg = null
      if (evalAvg !== null && attAvg !== null) finalAvg = (evalAvg * 0.85 + attAvg * 0.15).toFixed(2)
      else if (evalAvg !== null) finalAvg = evalAvg.toFixed(2)
      else if (attAvg !== null) finalAvg = attAvg.toFixed(2)
      return { ...p, rawCount, evalAvg: evalAvg?.toFixed(2) || null, attAvg: attAvg?.toFixed(2) || null, finalAvg }
    }).filter(p => p.type).sort((a, b) => {
      if (!a.finalAvg && !b.finalAvg) return 0
      if (!a.finalAvg) return 1
      if (!b.finalAvg) return -1
      return parseFloat(b.finalAvg) - parseFloat(a.finalAvg)
    })
  }

  // ── CSV export ─────────────────────────────────────────────────────────
  const exportCSV = () => {
    const rows = [['Presentation', 'Author', 'Type', 'Section', 'User', 'Score']]
    Object.entries(votes).forEach(([user, vmap]) => {
      Object.entries(vmap || {}).forEach(([presId, score]) => {
        const p = ALL_PRES[parseInt(presId)]
        if (p) rows.push([p.title, p.author, p.type, p.sectionKey, user, score])
      })
    })
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'proteovilamoura_votes.csv'; a.click()
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
          <button className="btn btn-ghost btn-sm" onClick={exportCSV}>Export CSV</button>
          <button className="btn btn-danger btn-sm" onClick={async () => {
            if (!confirm('Delete ALL data? This cannot be undone.')) return
            try { await actions.clearAll(); showToast('All data cleared.', 'red') }
            catch (e) { showToast('Error: ' + e?.message, 'red') }
          }}>Clear data</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 20 }}>
        {[
          ['Evaluators', regs.length, 'c-gold'],
          ['Attendees', attendees.length, 'c-purple'],
          ['Accessed', accessed, 'c-cyan'],
          ['Votes', totalVotes, 'c-green'],
          ['Sections', SECTIONS.length, 'c-blue'],
          ['Presentations', Object.keys(ALL_PRES || {}).length, 'c-orange'],
        ].map(([lbl, val, cls]) => (
          <div key={lbl} className="stat-box">
            <div className="stat-lbl">{lbl}</div>
            <div className={`stat-val ${cls}`}>{val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {[['evaluators','Evaluators'],['attendees','Attendees'],['results','Results']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans', fontSize: '0.86rem', fontWeight: 600, transition: 'all 0.18s',
              color: tab === id ? 'var(--accent2)' : 'var(--muted)',
              borderBottom: `2px solid ${tab === id ? 'var(--accent2)' : 'transparent'}`,
              marginBottom: -1 }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── EVALUATORS ── */}
      {tab === 'evaluators' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700 }}>Registered evaluators ({regs.length})</div>
            <button className="btn btn-sm btn-ghost" onClick={() => setEvalModal('add')}>+ Add evaluator</button>
          </div>
          {regs.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.86rem' }}>No evaluators yet. Click "Add evaluator" to start.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Name','Email','Institution','Sections','Progress',''].map(h => <th key={h} style={th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {regs.map(ev => {
                    const myV = votes[ev.name] || {}
                    const allPres = (ev.sections || []).flatMap(sk => Object.values(ALL_PRES).filter(p => p.sectionKey === sk))
                    const voted = allPres.filter(p => myV[p.id] !== undefined).length
                    const done = allPres.length > 0 && voted === allPres.length
                    return (
                      <tr key={ev.name} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{ev.name}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--muted)', fontSize: '0.82rem' }}>{ev.email || '—'}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--muted)', fontSize: '0.82rem' }}>{ev.inst || '—'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {(ev.sections || []).length === 0
                              ? <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>None</span>
                              : (ev.sections || []).map(sk => {
                                const sec = SECTIONS.find(s => s.key === sk)
                                const pres = Object.values(ALL_PRES).filter(p => p.sectionKey === sk)
                                const v = pres.filter(p => myV[p.id] !== undefined).length
                                return (
                                  <span key={sk} style={{ padding: '2px 7px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600,
                                    background: v === pres.length && pres.length > 0 ? 'rgba(34,197,94,0.15)' : v > 0 ? 'rgba(251,146,60,0.15)' : 'rgba(90,128,153,0.12)',
                                    color: v === pres.length && pres.length > 0 ? 'var(--green)' : v > 0 ? 'var(--orange)' : 'var(--muted)' }}>
                                    {sec?.short || sk} {v}/{pres.length}
                                  </span>
                                )
                              })}
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.76rem', fontWeight: 600,
                            background: done ? 'rgba(34,197,94,0.15)' : voted > 0 ? 'rgba(251,146,60,0.15)' : 'rgba(90,128,153,0.1)',
                            color: done ? 'var(--green)' : voted > 0 ? 'var(--orange)' : 'var(--muted)' }}>
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

      {/* ── ATTENDEES ── */}
      {tab === 'attendees' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700 }}>Attendees ({attendees.length})</div>
            <button className="btn btn-sm btn-ghost" onClick={() => setAttModal('add')}>+ Add attendee</button>
          </div>
          {attendees.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.86rem' }}>No attendees yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Name','Email','Institution','Country','Votes','Accessed',''].map(h => <th key={h} style={th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {attendees.map(att => {
                    const voteCount = Object.keys(votes[att.name] || {}).length
                    return (
                      <tr key={att.name} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{att.name}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--muted)', fontSize: '0.82rem' }}>{att.email || '—'}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{att.inst || '—'}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{att.country || '—'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.76rem', fontWeight: 600,
                            background: voteCount > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(90,128,153,0.1)',
                            color: voteCount > 0 ? 'var(--green)' : 'var(--muted)' }}>
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
      )}

      {/* ── RESULTS ── */}
      {tab === 'results' && (() => {
        let results = []
        try { results = getResults() } catch (e) { console.error('Results error:', e) }
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Anchor navigation */}
            <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, flexWrap: 'wrap' }}>
              {[['oral','Oral Communications'],['flash','Flash Presentations'],['poster','Posters']].map(([id, label]) => (
                <a key={id} href={`#results-${id}`}
                  style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', padding: '3px 10px', borderRadius: 6, background: 'rgba(30,143,171,0.08)', border: '1px solid rgba(30,143,171,0.2)' }}
                  onClick={e => { e.preventDefault(); document.getElementById(`results-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                  {label}
                </a>
              ))}
            </div>
            {['oral', 'flash', 'poster'].map(type => {
              const rows = results.filter(p => p.type === type)
              const typeColor = type === 'oral' ? 'var(--accent)' : type === 'flash' ? 'var(--orange)' : 'var(--purple)'
              const typeBg = type === 'oral' ? 'rgba(30,143,171,0.1)' : type === 'flash' ? 'rgba(249,115,22,0.1)' : 'rgba(168,85,247,0.1)'
              return (
                <div key={type} id={`results-${type}`} style={{ scrollMarginTop: 80 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Syne', color: 'var(--text)' }}>{typeLabels[type]}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: typeBg, color: typeColor }}>
                      {rows.length} presentations
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>· top 3 are winners</span>
                  </div>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    {rows.length === 0 ? (
                      <div style={{ padding: '20px 16px', color: 'var(--muted)', fontSize: '0.86rem' }}>No votes yet.</div>
                    ) : rows.map((p, i) => {
                      const top3 = i < 3
                      const pct = p.finalAvg ? Math.round(parseFloat(p.finalAvg) / 10 * 100) : 0
                      const medalBg = i === 0 ? 'rgba(232,160,32,0.1)' : i === 1 ? 'rgba(148,163,184,0.07)' : 'rgba(205,127,50,0.07)'
                      const medalColor = i === 0 ? 'var(--gold)' : i === 1 ? '#94a3b8' : '#cd7f32'
                      return (
                        <div key={p.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                          borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                          background: top3 ? medalBg : 'transparent' }}>
                          {/* Rank */}
                          <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.78rem', fontWeight: 700,
                            background: top3 ? (i === 0 ? 'rgba(232,160,32,0.25)' : i === 1 ? 'rgba(148,163,184,0.2)' : 'rgba(205,127,50,0.2)') : 'var(--surface2)',
                            color: top3 ? medalColor : 'var(--muted)' }}>
                            {i + 1}
                          </div>
                          {/* Title + author */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 500, fontSize: '0.86rem', lineHeight: 1.35 }}>
                              {p.title}
                              {top3 && (
                                <span style={{ marginLeft: 6, fontSize: '0.66rem', padding: '1px 6px', borderRadius: 4, fontWeight: 700,
                                  background: i === 0 ? 'rgba(232,160,32,0.18)' : i === 1 ? 'rgba(148,163,184,0.15)' : 'rgba(205,127,50,0.15)',
                                  color: medalColor }}>{medals[i]}</span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>{p.author}</div>
                            {type === 'oral' && p.sectionKey && (() => {
                              const sec = SECTIONS.find(s => s.key === p.sectionKey)
                              return sec ? (
                                <div style={{ fontSize: '0.68rem', marginTop: 3, display: 'inline-block', padding: '1px 7px', borderRadius: 4, background: 'rgba(30,143,171,0.08)', border: '1px solid rgba(30,143,171,0.18)', color: 'var(--accent2)', fontWeight: 600 }}>
                                  {sec.label}
                                </div>
                              ) : null
                            })()}
                          </div>
                          {/* Score */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0, minWidth: 100 }}>
                            {p.finalAvg ? (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ width: 70, height: 5, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--brand-mid),var(--accent2))', borderRadius: 3 }} />
                                  </div>
                                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent2)' }}>{p.finalAvg}</span>
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>
                                  {p.evalAvg && `E: ${p.evalAvg}`}
                                  {p.evalAvg && p.attAvg && ' · '}
                                  {p.attAvg && `A: ${p.attAvg}`}
                                  {' · '}{p.rawCount}v
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

      {/* Modals */}
      {evalModal && (
        <EvalModal
          initial={evalModal === 'add' ? null : evalModal}
          onSave={saveEval}
          onClose={() => setEvalModal(null)}
        />
      )}
      {attModal && (
        <AttendeeModal
          initial={attModal === 'add' ? null : attModal}
          onSave={saveAtt}
          onClose={() => setAttModal(null)}
        />
      )}
    </div>
  )
}
