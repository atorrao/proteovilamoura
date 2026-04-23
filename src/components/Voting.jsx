import { useState, useMemo } from 'react'
import { SECTIONS, ALL_PRES } from '../data/index.js'

export default function Voting({ session, state, setState, showToast }) {
  const [activeSec, setActiveSec] = useState(() => {
    const reg = state.registeredEvaluators?.find(e => e.name === session.user)
    return reg?.sections?.[0] || 'sec1'
  })
  const [typeFilter, setTypeFilter] = useState('all')

  const isAttendee = session.role === 'attendee'
  const myVotes = state.votes[session.user] || {}
  const myLocked = state.locked[session.user] || {}

  const visibleSections = useMemo(() => {
    if (isAttendee) return SECTIONS
    const reg = state.registeredEvaluators?.find(e => e.name === session.user)
    if (!reg?.sections?.length) return SECTIONS
    return SECTIONS.filter(s => reg.sections.includes(s.key))
  }, [session.user, state.registeredEvaluators, isAttendee])

  const secPres = useMemo(() =>
    Object.values(ALL_PRES).filter(p => p.sectionKey === activeSec),
    [activeSec])

  const filteredPres = typeFilter === 'all' ? secPres : secPres.filter(p => p.type === typeFilter)
  const types = [...new Set(secPres.map(p => p.type))]

  const voted = visibleSections.reduce((acc, s) => {
    const pres = Object.values(ALL_PRES).filter(p => p.sectionKey === s.key)
    acc += pres.filter(p => myVotes[p.id] !== undefined).length
    return acc
  }, 0)
  const total = visibleSections.reduce((acc, s) => {
    return acc + Object.values(ALL_PRES).filter(p => p.sectionKey === s.key).length
  }, 0)
  const pct = total ? Math.round(voted / total * 100) : 0

  const castVote = (presId, score) => {
    if (myLocked[presId]) return
    setState(prev => ({
      ...prev,
      votes: { ...prev.votes, [session.user]: { ...(prev.votes[session.user] || {}), [presId]: score } }
    }))
  }

  const confirmSection = () => {
    const pres = Object.values(ALL_PRES).filter(p => p.sectionKey === activeSec)
    const toConfirm = pres.filter(p => myVotes[p.id] !== undefined && !myLocked[p.id])
    if (!toConfirm.length) return
    setState(prev => ({
      ...prev,
      locked: {
        ...prev.locked,
        [session.user]: {
          ...(prev.locked[session.user] || {}),
          ...Object.fromEntries(toConfirm.map(p => [p.id, true]))
        }
      }
    }))
    showToast(`${toConfirm.length} vote${toConfirm.length !== 1 ? 's' : ''} confirmed and locked!`, 'green')
  }

  const unlockedVoted = secPres.filter(p => myVotes[p.id] !== undefined && !myLocked[p.id])
  const allUnlockedVoted = secPres.filter(p => !myLocked[p.id]).length > 0 &&
    unlockedVoted.length === secPres.filter(p => !myLocked[p.id]).length
  const canConfirm = isAttendee ? unlockedVoted.length > 0 : allUnlockedVoted

  const requestEdit = (presId) => {
    const existing = state.editRequests?.find(r => r.evalName === session.user && r.presId === presId && r.status === 'pending')
    if (existing) return
    const p = ALL_PRES[presId]
    setState(prev => ({
      ...prev,
      editRequests: [...(prev.editRequests || []), {
        id: Date.now(), evalName: session.user, presId,
        presTitle: p?.title || '', requestedAt: new Date().toLocaleTimeString('en-GB'), status: 'pending'
      }]
    }))
    showToast('Edit request sent to the administrator.', 'orange')
  }

  return (
    <div className="container">
      <div className="page-title">Hello, {session.user}</div>
      <div className="page-sub" style={{ marginBottom: 20 }}>
        {isAttendee ? 'Rate the presentations you attended from 1 to 10'
          : `Evaluate the presentations in your ${visibleSections.length} assigned section${visibleSections.length !== 1 ? 's' : ''}`}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 6 }}>
          <span>{voted} of {total} evaluated</span>
          <span>{pct}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--brand-mid),var(--accent2))', transition: 'width 0.4s', borderRadius: 3 }} />
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {visibleSections.map(sec => {
          const pres = Object.values(ALL_PRES).filter(p => p.sectionKey === sec.key)
          const done = pres.filter(p => myVotes[p.id] !== undefined).length
          return (
            <button key={sec.key}
              onClick={() => { setActiveSec(sec.key); setTypeFilter('all') }}
              style={{
                padding: '7px 12px', border: '1px solid', borderRadius: 9, cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.18s',
                background: activeSec === sec.key ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'var(--card)',
                borderColor: activeSec === sec.key ? 'transparent' : 'var(--border)',
                color: activeSec === sec.key ? '#fff' : 'var(--muted)',
              }}>
              {sec.icon} {sec.short} <span style={{ opacity: 0.7 }}>{done}/{pres.length}</span>
            </button>
          )
        })}
      </div>

      {/* Type filter */}
      {types.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {['all', ...types].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{
                padding: '4px 12px', border: '1px solid', borderRadius: 20, cursor: 'pointer',
                fontSize: '0.78rem', fontWeight: 600, fontFamily: 'DM Sans', transition: 'all 0.18s',
                background: typeFilter === t ? 'rgba(30,143,171,0.2)' : 'transparent',
                borderColor: typeFilter === t ? 'var(--accent)' : 'var(--border)',
                color: typeFilter === t ? 'var(--accent2)' : 'var(--muted)',
              }}>
              {t === 'all' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Presentations */}
      <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
        {filteredPres.map(p => {
          const score = myVotes[p.id]
          const locked = !!myLocked[p.id]
          const editReq = state.editRequests?.find(r => r.evalName === session.user && r.presId === p.id && r.status === 'pending')
          const editApproved = state.editRequests?.find(r => r.evalName === session.user && r.presId === p.id && r.status === 'approved')
          const typeColors = { oral: '#1e8fab', flash: '#f97316', poster: '#a855f7' }

          return (
            <div key={p.id} style={{
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12,
              padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start',
              opacity: locked ? 0.85 : 1,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                    background: `${typeColors[p.type]}20`, color: typeColors[p.type], textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {p.type}
                  </span>
                  {locked && <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Locked</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.4, marginBottom: 3 }}>{p.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{p.author}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {!locked && (
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 220, justifyContent: 'flex-end', marginBottom: 6 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button key={n} onClick={() => castVote(p.id, n)}
                        style={{
                          width: 30, height: 30, borderRadius: 6, border: '1px solid',
                          cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.15s',
                          background: score === n ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'var(--surface2)',
                          borderColor: score === n ? 'transparent' : 'var(--border)',
                          color: score === n ? '#fff' : 'var(--muted)',
                        }}>
                        {n}
                      </button>
                    ))}
                  </div>
                )}
                {score !== undefined && (
                  <div style={{ fontSize: '0.78rem', color: locked ? 'var(--accent2)' : 'var(--green)', textAlign: 'right' }}>
                    {locked ? `Locked: ${score}/10` : `Selected: ${score}/10`}
                    {locked && !editReq && (
                      <button onClick={() => requestEdit(p.id)} style={{ display: 'block', marginTop: 6, padding: '6px 12px', border: 'none', borderRadius: 7, background: 'rgba(249,115,22,0.15)', color: 'var(--orange)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                        Request edit
                      </button>
                    )}
                    {editReq && <span style={{ display: 'block', color: 'var(--orange)', fontSize: '0.72rem' }}>Edit pending…</span>}
                    {editApproved && <span style={{ display: 'block', color: 'var(--green)', fontSize: '0.72rem' }}>Edit approved</span>}
                  </div>
                )}
                {score === undefined && !locked && (
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', textAlign: 'right' }}>Select a score</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirm bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
            {secPres.every(p => myLocked[p.id]) ? 'All evaluations in this section are locked'
              : !isAttendee && !allUnlockedVoted ? `${secPres.filter(p => !myLocked[p.id]).length - unlockedVoted.length} evaluation${secPres.filter(p=>!myLocked[p.id]).length - unlockedVoted.length !== 1 ? 's' : ''} missing in this section`
              : unlockedVoted.length > 0 ? `${unlockedVoted.length} vote${unlockedVoted.length !== 1 ? 's' : ''} ready to confirm`
              : 'Select scores to confirm'}
          </div>
          {canConfirm && <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>Confirm to lock your votes for this section.</div>}
          {!isAttendee && !allUnlockedVoted && <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>As an evaluator, score all presentations before confirming.</div>}
        </div>
        <button className="btn btn-primary" onClick={confirmSection} disabled={!canConfirm}
          style={{ opacity: canConfirm ? 1 : 0.4, cursor: canConfirm ? 'pointer' : 'not-allowed' }}>
          Confirm section votes
        </button>
      </div>
    </div>
  )
}
