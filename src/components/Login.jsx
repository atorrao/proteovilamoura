import { useState } from 'react'

export default function Login({ ready, state, actions, onLogin }) {
  const [mode, setMode] = useState('evaluator') // 'evaluator' | 'attendee-login' | 'attendee-register'
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [inst, setInst] = useState('')
  const [country, setCountry] = useState('Portugal')
  const [countryOther, setCountryOther] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  const handleEvaluatorLogin = async () => {
    if (!name.trim()) { setErr('Please enter your name.'); return }
    if (!pass.trim()) { setErr('Please enter your password.'); return }
    const reg = state.registeredEvaluators.find(e => e.name === name.trim())
    if (!reg) { setErr('Evaluator not found. Contact the administrator.'); return }
    if (reg.pass !== pass) { setErr('Incorrect password.'); return }
    onLogin(name.trim(), 'evaluator')
  }

  const handleAttendeeLogin = async () => {
    if (!name.trim()) { setErr('Please enter your name.'); return }
    if (!pass.trim()) { setErr('Please enter your password.'); return }
    // Check if approved attendee
    const att = state.attendees.find(a => a.name === name.trim())
    if (!att) {
      // Check if pending
      const pending = state.pendingAttendees?.find(a => a.name === name.trim())
      if (pending) { setErr('Your registration is pending admin approval.'); return }
      setErr('Name not found. Please register first.'); return
    }
    if (att.pass && att.pass !== pass) { setErr('Incorrect password.'); return }
    onLogin(name.trim(), 'attendee')
  }

  const handleAttendeeRegister = async () => {
    if (!name.trim()) { setErr('Please enter your name.'); return }
    if (!pass.trim()) { setErr('Please enter a password.'); return }
    if (pass.length < 4) { setErr('Password must be at least 4 characters.'); return }
    const finalCountry = country === 'Other' ? (countryOther.trim() || 'Other') : country
    // Check if name already exists
    const existing = state.attendees.find(a => a.name === name.trim())
    const pending = state.pendingAttendees?.find(a => a.name === name.trim())
    if (existing || pending) { setErr('This name is already registered.'); return }
    setLoading(true)
    try {
      await actions.requestAttendee({ name: name.trim(), inst, country: finalCountry, pass })
      setRegistered(true)
    } catch (e) {
      setErr('Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  const handleSubmit = async () => {
    if (!ready) { setErr('Connecting… please wait.'); return }
    setErr('')
    setLoading(true)
    try {
      if (mode === 'evaluator') await handleEvaluatorLogin()
      else if (mode === 'attendee-login') await handleAttendeeLogin()
      else await handleAttendeeRegister()
    } finally { setLoading(false) }
  }

  if (registered) {
    return (
      <div style={{ padding: '24px 16px', maxWidth: 420, margin: '0 auto' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(39,181,160,0.4)', borderRadius: 16, padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>✓</div>
          <div style={{ fontFamily: 'Syne', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: 'var(--accent2)' }}>Registration submitted!</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Your request has been sent to the administrator.<br />
            You will be able to sign in once approved.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src="https://proteo-vilamoura.sci-meet.net/img/proteo-vilamoura.sci-meet.net/3e43a443-0406-41ce-874f-826688ab0e5d/Logo-proteovilamoral1.png?q=100&fit=max&crop=2825%2C871%2C0%2C0&s=41b3f5c0a7da78ab26677346af93c84f"
          alt="ProteoVilamoura 2026" style={{ height: 48, objectFit: 'contain' }}
        />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px' }}>
        <div style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>Voting Access</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: 20 }}>Sign in to evaluate presentations</div>

        {/* Mode selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <button onClick={() => { setMode('evaluator'); setErr('') }}
              style={{ flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.88rem', fontWeight: 600, minHeight: 44, transition: 'all 0.18s',
                background: mode === 'evaluator' ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: mode === 'evaluator' ? '#fff' : 'var(--muted)' }}>
              Evaluator
            </button>
            <button onClick={() => { setMode('attendee-login'); setErr('') }}
              style={{ flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.88rem', fontWeight: 600, minHeight: 44, transition: 'all 0.18s',
                background: mode === 'attendee-login' ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: mode === 'attendee-login' ? '#fff' : 'var(--muted)' }}>
              Attendee
            </button>
          </div>
          {mode.startsWith('attendee') && (
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
              <button onClick={() => { setMode('attendee-login'); setErr('') }}
                style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
                  background: mode === 'attendee-login' ? 'rgba(30,143,171,0.2)' : 'transparent',
                  color: mode === 'attendee-login' ? 'var(--accent2)' : 'var(--muted)' }}>
                Sign In
              </button>
              <button onClick={() => { setMode('attendee-register'); setErr('') }}
                style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
                  background: mode === 'attendee-register' ? 'rgba(30,143,171,0.2)' : 'transparent',
                  color: mode === 'attendee-register' ? 'var(--accent2)' : 'var(--muted)' }}>
                Register
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Prof. Ana Silva" />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••" />
          </div>

          {mode === 'attendee-register' && (
            <>
              <div className="field">
                <label>Institution</label>
                <input value={inst} onChange={e => setInst(e.target.value)}
                  placeholder="e.g. University of Lisbon" />
              </div>
              <div className="field">
                <label>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M0 0l6 8 6-8z\' fill=\'%235a8099\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 38 }}>
                  <option>Portugal</option>
                  <option>Spain</option>
                  <option>France</option>
                  <option>Other</option>
                </select>
              </div>
              {country === 'Other' && (
                <div className="field">
                  <label>Which country?</label>
                  <input value={countryOther} onChange={e => setCountryOther(e.target.value)} placeholder="Your country" />
                </div>
              )}
            </>
          )}
        </div>

        {err && <div style={{ color: 'var(--red)', fontSize: '0.84rem', marginTop: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>{err}</div>}

        <button className="btn btn-primary btn-full" onClick={handleSubmit}
          disabled={!ready || loading}
          style={{ marginTop: 18, fontSize: '1rem', opacity: (!ready || loading) ? 0.6 : 1 }}>
          {loading ? '…' : mode === 'attendee-register' ? 'Register' : 'Sign In'}
        </button>

        {mode === 'evaluator' && (
          <div style={{ marginTop: 12, fontSize: '0.74rem', color: 'var(--muted)', textAlign: 'center' }}>
            Evaluator credentials are provided by the administrator
          </div>
        )}
      </div>
    </div>
  )
}
