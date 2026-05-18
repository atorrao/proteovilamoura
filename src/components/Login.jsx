import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function Login({ ready, state, actions, onLogin }) {
  const [tab, setTab] = useState('attendee')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!ready) { setErr('Connecting… please wait.'); return }
    setErr('')
    if (!email.trim()) { setErr('Please enter your email.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr('Please enter a valid email.'); return }
    setLoading(true)
    try {
      const cleanEmail = email.trim().toLowerCase()

      if (tab === 'evaluator') {
        // Always fetch fresh from Supabase — never trust in-memory state
        const { data, error } = await supabase
          .from('evaluators')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle()
        if (error) throw error
        if (!data) { setErr('Email not found. Contact the administrator.'); return }
        onLogin(data.name, 'evaluator')
      } else {
        // Always fetch fresh from Supabase
        const { data, error } = await supabase
          .from('attendees')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle()
        if (error) throw error
        if (!data) { setErr('Email not found. Please contact the administrator.'); return }
        await actions.markAttendeeAccessed(data.name)
        onLogin(data.name, 'attendee')
      }
    } catch (e) {
      setErr('Error: ' + (e?.message || 'unknown'))
    } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src="https://proteo-vilamoura.sci-meet.net/img/proteo-vilamoura.sci-meet.net/3e43a443-0406-41ce-874f-826688ab0e5d/Logo-proteovilamoral1.png?q=100&fit=max&crop=2825%2C871%2C0%2C0&s=41b3f5c0a7da78ab26677346af93c84f" alt="ProteoVilamoura 2026" style={{ height: 48, objectFit: 'contain' }} />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 700, marginBottom: 4, color: 'var(--text)', lineHeight: 1.25 }}>Voting Access<br />and Contact Card</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: 20 }}>Sign in with your email to evaluate presentations</div>

        <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
          {[['attendee','Attendee'],['evaluator','Evaluator']].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setErr('') }}
              style={{ flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem', fontWeight: 600, minHeight: 44, transition: 'all 0.18s',
                background: tab === key ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
                color: tab === key ? '#fff' : 'var(--muted)' }}>
              {label}
            </button>
          ))}
        </div>

        <div className="field" style={{ marginBottom: 12 }}>
          <label>Email <span style={{ color: 'var(--red)' }}>*</span></label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="your@email.com" />
        </div>

        <div style={{ fontSize: '0.76rem', color: 'var(--muted)', padding: '8px 12px', background: 'rgba(30,143,171,0.05)', borderRadius: 8, border: '1px solid rgba(30,143,171,0.12)', lineHeight: 1.5 }}>
          Your account has been pre-created. Simply enter your email to access.
        </div>

        {err && <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', color: 'var(--red)', fontSize: '0.84rem' }}>{err}</div>}

        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={!ready || loading}
          style={{ marginTop: 16, fontSize: '1rem', opacity: (!ready || loading) ? 0.6 : 1 }}>
          {loading ? '…' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}
