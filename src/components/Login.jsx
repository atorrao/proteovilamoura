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
    if (!ready) { setErr('Connecting to server… please wait.'); return }
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
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', minHeight:'60vh' }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:32, width:'100%', maxWidth:420 }}>
        <div style={{ fontFamily:'Syne', fontSize:'1.7rem', fontWeight:700, marginBottom:4 }}>Voting Access</div>
        <div style={{ color:'var(--muted)', fontSize:'0.86rem', marginBottom:24 }}>Identify yourself to evaluate presentations</div>

        <div style={{ display:'flex', gap:0, marginBottom:22, borderRadius:9, overflow:'hidden', border:'1px solid var(--border)' }}>
          {['evaluator','attendee'].map(r => (
            <button key={r} onClick={() => { setRole(r); setErr('') }}
              style={{ flex:1, padding:'9px 0', border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:'0.86rem', fontWeight:600,
                background: role===r ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: role===r ? '#fff' : 'var(--muted)', transition:'all 0.18s' }}>
              {r === 'evaluator' ? 'Evaluator' : 'Attendee'}
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gap:12 }}>
          <div className="field">
            <label>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key==='Enter' && handleSubmit()}
              placeholder="e.g. Prof. Ana Silva" />
          </div>
          {role === 'evaluator' && (
            <div className="field">
              <label>Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleSubmit()} placeholder="••••••••" />
            </div>
          )}
          {role === 'attendee' && (
            <>
              <div className="field">
                <label>Institution</label>
                <input value={inst} onChange={e => setInst(e.target.value)} placeholder="e.g. University of Lisbon" />
              </div>
              <div className="field">
                <label>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  style={{ appearance:'none', backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M0 0l6 8 6-8z\' fill=\'%235a8099\'/%3E%3C/svg%3E")', backgroundRepeat:'no-repeat', backgroundPosition:'right 13px center', backgroundSize:'10px', paddingRight:36 }}>
                  <option>Portugal</option><option>Spain</option><option>France</option><option>Other</option>
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

        {err && <div style={{ color:'var(--red)', fontSize:'0.82rem', marginTop:10 }}>{err}</div>}

        <button className="btn btn-primary" onClick={handleSubmit} disabled={!ready || loading}
          style={{ width:'100%', marginTop:16, padding:12, fontSize:'0.95rem', justifyContent:'center', opacity: (!ready||loading) ? 0.6 : 1 }}>
          {loading ? 'Signing in…' : ready ? 'Sign in' : 'Loading…'}
        </button>

        <div style={{ marginTop:14, fontSize:'0.74rem', color:'var(--muted)', textAlign:'center' }}>
          No registration required · identification by name
        </div>
      </div>
    </div>
  )
}
