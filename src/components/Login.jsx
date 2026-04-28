import { useState } from 'react'

export default function Login({ ready, state, actions, onLogin }) {
  const [role, setRole] = useState('evaluator')
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [inst, setInst] = useState('')
  const [country, setCountry] = useState('Portugal')
  const [countryOther, setCountryOther] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!ready) { setErr('Connecting… please wait.'); return }
    if (!name.trim()) { setErr('Please enter your name.'); return }
    setErr(''); setLoading(true)
    try {
      if (role === 'attendee') {
        const finalCountry = country === 'Other' ? (countryOther.trim() || 'Other') : country
        await actions.addAttendee({ name: name.trim(), inst, country: finalCountry })
        onLogin(name.trim(), 'attendee')
      } else {
        const reg = state.registeredEvaluators.find(e => e.name === name.trim())
        if (!reg) { setErr('Evaluator not found. Contact the administrator.'); return }
        if (reg.pass && reg.pass !== pass) { setErr('Incorrect password.'); return }
        onLogin(name.trim(), 'evaluator')
      }
    } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 420, margin: '0 auto' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src="https://proteo-vilamoura.sci-meet.net/img/proteo-vilamoura.sci-meet.net/3e43a443-0406-41ce-874f-826688ab0e5d/Logo-proteovilamoral1.png?q=100&fit=max&crop=2825%2C871%2C0%2C0&s=41b3f5c0a7da78ab26677346af93c84f"
          alt="ProteoVilamoura 2026"
          style={{ height: 48, objectFit: 'contain' }}
        />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px' }}>
        <div style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>Voting Access</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: 20 }}>Identify yourself to vote</div>

        {/* Role selector */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {['evaluator','attendee'].map(r => (
            <button key={r} onClick={() => { setRole(r); setErr('') }}
              style={{ flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans',
                fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.18s', minHeight: 44,
                background: role === r ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: role === r ? '#fff' : 'var(--muted)' }}>
              {r === 'evaluator' ? 'Evaluator' : 'Attendee'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Prof. Ana Silva"
              style={{ fontSize: '1rem' }} />
          </div>

          {role === 'evaluator' && (
            <div className="field">
              <label>Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••" style={{ fontSize: '1rem' }} />
            </div>
          )}

          {role === 'attendee' && (
            <>
              <div className="field">
                <label>Institution</label>
                <input value={inst} onChange={e => setInst(e.target.value)}
                  placeholder="e.g. University of Lisbon" style={{ fontSize: '1rem' }} />
              </div>
              <div className="field">
                <label>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  style={{ fontSize: '1rem',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M0 0l6 8 6-8z\' fill=\'%235a8099\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 38 }}>
                  <option>Portugal</option>
                  <option>Spain</option>
                  <option>France</option>
                  <option>Other</option>
                </select>
              </div>
              {country === 'Other' && (
                <div className="field">
                  <label>Which country?</label>
                  <input value={countryOther} onChange={e => setCountryOther(e.target.value)}
                    placeholder="Your country" style={{ fontSize: '1rem' }} />
                </div>
              )}
            </>
          )}
        </div>

        {err && <div style={{ color: 'var(--red)', fontSize: '0.84rem', marginTop: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>{err}</div>}

        <button className="btn btn-primary btn-full" onClick={handleSubmit}
          disabled={!ready || loading}
          style={{ marginTop: 18, fontSize: '1rem', opacity: (!ready || loading) ? 0.6 : 1 }}>
          {loading ? 'Signing in…' : ready ? 'Sign in' : 'Loading…'}
        </button>
      </div>
    </div>
  )
}
