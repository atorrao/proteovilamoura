import { useState } from 'react'

export function AdminLoginModal({ onClose, onLogin, adminPass }) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  const submit = () => {
    if (pass !== adminPass) { setErr('Incorrect password.'); return }
    onLogin()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth:380 }} onClick={e => e.stopPropagation()}>
        <h2>Administrator Access</h2>
        <div className="modal-sub">Enter the password to access the management panel.</div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()} placeholder="••••••••" autoFocus />
        </div>
        {err && <div className="err-msg" style={{ marginTop:8 }}>{err}</div>}
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Sign in as Admin</button>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginModal
