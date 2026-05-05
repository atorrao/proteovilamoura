import { useState } from 'react'

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function PasswordInput({ value, onChange, onKeyDown, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder || 'Password'}
        style={{ paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', padding: 4 }}>
        <EyeIcon open={show} />
      </button>
    </div>
  )
}

export default function Login({ ready, state, actions, onLogin }) {
  const [tab, setTab] = useState('evaluator') // 'evaluator' | 'attendee'
  const [attMode, setAttMode] = useState('login') // 'login' | 'register'

  // Shared fields
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')

  // Register-only fields
  const [inst, setInst] = useState('')
  const [country, setCountry] = useState('Portugal')
  const [countryOther, setCountryOther] = useState('')

  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [registerDone, setRegisterDone] = useState(false)

  const reset = () => { setErr(''); setName(''); setPass(''); setInst(''); setCountry('Portugal'); setCountryOther('') }

  const handleSubmit = async () => {
    if (!ready) { setErr('Connecting… please wait.'); return }
    setErr('')

    if (!name.trim()) { setErr('Please enter your name.'); return }
    if (!pass.trim()) { setErr('Please enter your password.'); return }

    setLoading(true)
    try {
      if (tab === 'evaluator') {
        const reg = state.registeredEvaluators?.find(e => e.name === name.trim())
        if (!reg) { setErr('Evaluator not found. Contact the administrator.'); return }
        if (reg.pass !== pass) { setErr('Incorrect password.'); return }
        onLogin(name.trim(), 'evaluator')

      } else if (attMode === 'register') {
        // Check name not already taken
        const exists = state.attendees?.find(a => a.name === name.trim())
        if (exists) { setErr('This name is already registered. Sign in instead.'); return }
        if (pass.length < 4) { setErr('Password must be at least 4 characters.'); return }
        const finalCountry = country === 'Other' ? (countryOther.trim() || 'Other') : country
        await actions.registerAttendee({ name: name.trim(), inst: inst.trim(), country: finalCountry, pass })
        setRegisterDone(true)
        // Auto-login after register
        setTimeout(() => {
          onLogin(name.trim(), 'attendee')
        }, 1200)

      } else {
        // Attendee login
        const att = state.attendees?.find(a => a.name === name.trim())
        if (!att) { setErr("Name not found. Please register first."); return }
        if (att.pass && att.pass !== pass) { setErr('Incorrect password.'); return }
        onLogin(name.trim(), 'attendee')
      }
    } catch (e) {
      console.error(e)
      setErr('Error: ' + (e?.message || JSON.stringify(e)))
    } finally {
      setLoading(false)
    }
  }

  if (registerDone) {
    return (
      <div style={{ padding: '40px 16px', maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(39,181,160,0.12)', border: '2px solid var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem' }}>✓</div>
        <div style={{ fontFamily: 'Syne', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent2)', marginBottom: 8 }}>Registered!</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Signing you in…</div>
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

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>Voting Access</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: 20 }}>Sign in to evaluate presentations</div>

        {/* Evaluator / Attendee tabs */}
        <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 16 }}>
          {[['evaluator','Evaluator'],['attendee','Attendee']].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setErr(''); setAttMode('login') }}
              style={{ flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem', fontWeight: 600, minHeight: 44, transition: 'all 0.18s',
                background: tab === key ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: tab === key ? '#fff' : 'var(--muted)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Attendee: login / register toggle */}
        {tab === 'attendee' && (
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 16, fontSize: '0.84rem' }}>
            {[['login','Sign In'],['register','Register']].map(([key, label]) => (
              <button key={key} onClick={() => { setAttMode(key); setErr('') }}
                style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s', minHeight: 36,
                  background: attMode === key ? 'rgba(30,143,171,0.1)' : 'transparent',
                  color: attMode === key ? 'var(--accent)' : 'var(--muted)' }}>
                {label}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Ana Silva" />
          </div>

          <div className="field">
            <label>Password</label>
            <PasswordInput
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Password"
            />
          </div>

          {tab === 'attendee' && attMode === 'register' && (
            <>
              <div className="field">
                <label>Institution <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.72rem' }}>(optional)</span></label>
                <input value={inst} onChange={e => setInst(e.target.value)} placeholder="e.g. University of Lisbon" />
              </div>
              <div className="field">
                <label>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M0 0l6 8 6-8z\' fill=\'%236b8a9e\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 38 }}>
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

        {err && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', color: 'var(--red)', fontSize: '0.84rem' }}>
            {err}
          </div>
        )}

        <button className="btn btn-primary btn-full" onClick={handleSubmit}
          disabled={!ready || loading}
          style={{ marginTop: 18, fontSize: '1rem', opacity: (!ready || loading) ? 0.6 : 1 }}>
          {loading ? '…' : tab === 'attendee' && attMode === 'register' ? 'Register & Sign In' : 'Sign In'}
        </button>

        {tab === 'evaluator' && (
          <div style={{ marginTop: 10, fontSize: '0.74rem', color: 'var(--muted)', textAlign: 'center' }}>
            Credentials provided by the administrator
          </div>
        )}
        {tab === 'attendee' && attMode === 'login' && (
          <div style={{ marginTop: 10, fontSize: '0.74rem', color: 'var(--muted)', textAlign: 'center' }}>
            No account yet? Switch to <button onClick={() => { setAttMode('register'); setErr('') }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 600 }}>Register</button>
          </div>
        )}
      </div>
    </div>
  )
}
