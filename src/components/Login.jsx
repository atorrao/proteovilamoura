import { useState } from 'react'

function EyeIcon({ open }) {
  return open
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
}

export default function Login({ ready, state, actions, onLogin }) {
  const [tab, setTab] = useState('evaluator')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!ready) { setErr('Connecting… please wait.'); return }
    setErr('')
    setLoading(true)
    try {
      if (tab === 'evaluator') {
        if (!name.trim()) { setErr('Please enter your name.'); return }
        if (!pass.trim()) { setErr('Please enter your password.'); return }
        const reg = state.registeredEvaluators?.find(e => e.name === name.trim())
        if (!reg) { setErr('Evaluator not found. Contact the administrator.'); return }
        if (reg.pass !== pass) { setErr('Incorrect password.'); return }
        onLogin(name.trim(), 'evaluator')
      } else {
        if (!email.trim()) { setErr('Please enter your email.'); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr('Please enter a valid email.'); return }
        const att = state.attendees?.find(a => a.email?.toLowerCase() === email.trim().toLowerCase())
        if (!att) { setErr('Email not found. Please contact the administrator.'); return }
        await actions.markAttendeeAccessed(att.name)
        onLogin(att.name, 'attendee')
      }
    } catch (e) {
      setErr('Error: ' + (e?.message || 'unknown'))
    } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src="https://proteo-vilamoura.sci-meet.net/img/proteo-vilamoura.sci-meet.net/3e43a443-0406-41ce-874f-826688ab0e5d/Logo-proteovilamoral1.png?q=100&fit=max&crop=2825%2C871%2C0%2C0&s=41b3f5c0a7da78ab26677346af93c84f"
          alt="ProteoVilamoura 2026" style={{ height: 48, objectFit: 'contain' }}
        />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>Voting Access</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: 20 }}>Sign in to evaluate presentations</div>

        {/* Tab selector */}
        <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
          {[['evaluator','Evaluator'],['attendee','Attendee']].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setErr('') }}
              style={{ flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: '0.9rem', fontWeight: 600, minHeight: 44, transition: 'all 0.18s',
                background: tab === key ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: tab === key ? '#fff' : 'var(--muted)' }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'evaluator' ? (
            <>
              <div className="field">
                <label>Name <span style={{ color: 'var(--red)' }}>*</span></label>
                <input value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="e.g. Prof. Ana Silva" />
              </div>
              <div className="field">
                <label>Password <span style={{ color: 'var(--red)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} value={pass}
                    onChange={e => setPass(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Password" style={{ paddingRight: 46 }} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', padding: 4 }}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)', textAlign: 'center' }}>
                Credentials provided by the administrator
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label>Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="your@email.com" />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', padding: '10px 12px', background: 'rgba(30,143,171,0.06)', borderRadius: 8, border: '1px solid rgba(30,143,171,0.15)', lineHeight: 1.5 }}>
                Your account has been pre-created. Simply enter your email to access the voting area.
              </div>
            </>
          )}
        </div>

        {err && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', color: 'var(--red)', fontSize: '0.84rem' }}>
            {err}
          </div>
        )}

        <button className="btn btn-primary btn-full" onClick={handleSubmit}
          disabled={!ready || loading}
          style={{ marginTop: 18, fontSize: '1rem', opacity: (!ready || loading) ? 0.6 : 1 }}>
          {loading ? '…' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}
