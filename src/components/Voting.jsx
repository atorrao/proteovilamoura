import { useState, useMemo } from 'react'
import { SECTIONS, ALL_PRES } from '../data/index.js'

export default function Voting({ session, state, actions, showToast }) {
  const [activeSec, setActiveSec] = useState(() => {
    const reg = state.registeredEvaluators?.find(e => e.name === session.user)
    return reg?.sections?.[0] || 'sec1'
  })
  const [typeFilter, setTypeFilter] = useState('all')

  const isAttendee = session.role === 'attendee'
  const myVotes = state.votes[session.user] || {}

  const visibleSections = useMemo(() => {
    if (isAttendee) return SECTIONS
    const reg = state.registeredEvaluators?.find(e => e.name === session.user)
    if (!reg?.sections?.length) return SECTIONS
    return SECTIONS.filter(s => reg.sections.includes(s.key))
  }, [session.user, state.registeredEvaluators, isAttendee])

  const secPres = useMemo(() =>
    Object.values(ALL_PRES).filter(p => p.sectionKey === activeSec), [activeSec])
  const filteredPres = typeFilter === 'all' ? secPres : secPres.filter(p => p.type === typeFilter)
  const types = [...new Set(secPres.map(p => p.type))]

  const voted = visibleSections.reduce((acc, s) =>
    acc + Object.values(ALL_PRES).filter(p => p.sectionKey === s.key && myVotes[p.id] !== undefined).length, 0)
  const total = visibleSections.reduce((acc, s) =>
    acc + Object.values(ALL_PRES).filter(p => p.sectionKey === s.key).length, 0)
  const pct = total ? Math.round(voted / total * 100) : 0

  const castVote = async (presId, score) => {
    await actions.castVote(session.user, presId, score)
  }

  const typeColors = { oral: '#1e8fab', flash: '#f97316', poster: '#a855f7' }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div className="page-title">Hello, {session.user}</div>
        <div className="page-sub">
          {isAttendee ? 'Rate presentations from 1 to 10' : `Rate your ${visibleSections.length} assigned section${visibleSections.length !== 1 ? 's' : ''}`}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 5 }}>
          <span>{voted}/{total} rated</span>
          <span style={{ color: pct === 100 ? 'var(--green)' : 'var(--muted)' }}>{pct}%</span>
        </div>
        <div style={{ height: 5, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--brand-mid),var(--accent2))', transition: 'width 0.4s', borderRadius: 3 }} />
        </div>
      </div>

      {/* Section tabs — horizontal scroll */}
      <div className="section-tabs">
        {visibleSections.map(sec => {
          const pres = Object.values(ALL_PRES).filter(p => p.sectionKey === sec.key)
          const done = pres.filter(p => myVotes[p.id] !== undefined).length
          const isActive = activeSec === sec.key
          return (
            <button key={sec.key}
              className="section-tab"
              onClick={() => { setActiveSec(sec.key); setTypeFilter('all') }}
              style={{
                background: isActive ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'var(--card)',
                borderColor: isActive ? 'transparent' : 'var(--border)',
                color: isActive ? '#fff' : 'var(--muted)',
              }}>
              {sec.short} <span style={{ opacity: 0.75, marginLeft: 4 }}>{done}/{pres.length}</span>
            </button>
          )
        })}
      </div>

      {/* Type filter */}
      {types.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {['all', ...types].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{
                padding: '5px 12px', border: '1px solid', borderRadius: 20, cursor: 'pointer',
                fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s', minHeight: 34,
                background: typeFilter === t ? 'rgba(30,143,171,0.2)' : 'transparent',
                borderColor: typeFilter === t ? 'var(--accent)' : 'var(--border)',
                color: typeFilter === t ? 'var(--accent2)' : 'var(--muted)',
              }}>
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Presentations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredPres.map(p => {
          const score = myVotes[p.id]
          return (
            <div key={p.id} className={`pres-card ${score !== undefined ? 'rated' : ''}`}>
              {/* Type + score indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="pres-type-badge" style={{ background: `${typeColors[p.type]}20`, color: typeColors[p.type] }}>
                  {p.type}
                </span>
                {score !== undefined && (
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent2)' }}>
                    {score}/10
                  </span>
                )}
              </div>

              {/* Title + author */}
              <div>
                <div className="pres-title">{p.title}</div>
                <div className="pres-author" style={{ marginTop: 3 }}>{p.author}</div>
              </div>

              {/* Score grid — 5 columns on mobile (2 rows of 5) */}
              <div className="score-grid">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n} className={`score-btn ${score === n ? 'selected' : ''}`}
                    onClick={() => castVote(p.id, n)}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {filteredPres.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)', fontSize: '0.88rem' }}>
            No presentations in this section.
          </div>
        )}
      </div>
    </div>
  )
}
