import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

const CARD_STORAGE_KEY = 'pv2026_card_profile'

const EMPTY_PROFILE = {
  name: '', role: '', company: '', email: '', linkedin: '', country: '',
}

// ── vCard builder — strict RFC 6350 / vCard 3.0 for max compatibility ─────────
function buildVCard(p) {
  // Escape special characters per vCard spec
  const esc = s => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

  const nameParts = (p.name || '').trim().split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const li = p.linkedin
    ? (p.linkedin.startsWith('http') ? p.linkedin : `https://linkedin.com/in/${p.linkedin.replace(/^.*linkedin\.com\/in\//,'')}`)
    : ''

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(p.name)}`,
    `N:${esc(lastName)};${esc(firstName)};;;`,
    p.role    ? `TITLE:${esc(p.role)}`            : null,
    p.company ? `ORG:${esc(p.company)}`           : null,
    p.email   ? `EMAIL;TYPE=INTERNET,WORK,PREF:${esc(p.email)}` : null,
    p.country ? `ADR;TYPE=WORK:;;;;;;${esc(p.country)}` : null,
    li        ? `URL;TYPE=LinkedIn:${li}`          : null,
    'NOTE:ProteoVilamoura 2026',
    'END:VCARD',
  ].filter(Boolean)

  return lines.join('\r\n')  // vCard spec requires CRLF
}

function downloadVCF(p) {
  const vcf = buildVCard(p)
  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(p.name || 'contact').replace(/\s+/g, '_')}_ProteoVilamoura.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function loadSavedProfile() {
  try { const r = localStorage.getItem(CARD_STORAGE_KEY); return r ? JSON.parse(r) : null } catch { return null }
}

function Avatar({ name, size = 64 }) {
  const initials = (name || '?').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#106080,#208080)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800, color: '#fff',
      border: '3px solid rgba(255,255,255,0.25)' }}>
      {initials}
    </div>
  )
}

function useCopy(text) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }
  return [copied, copy]
}

// ── Card preview component ────────────────────────────────────────────────────
function CardPreview({ profile, qrDataUrl, onSaveVCF }) {
  const [emailCopied, copyEmail] = useCopy(profile.email)
  const li = profile.linkedin
    ? (profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin.replace(/^.*linkedin\.com\/in\//,'')}`)
    : ''

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', maxWidth: 400, width: '100%', margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#0d3349 0%,#106080 55%,#208080 100%)', padding: '24px 20px 56px', position: 'relative' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 16 }}>
          ProteoVilamoura 2026 · Vilamoura
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <Avatar name={profile.name} size={64} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 3 }}>
              {profile.name || '—'}
            </div>
            {profile.role && <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginBottom: 2 }}>{profile.role}</div>}
            {profile.company && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{profile.company}</div>}
          </div>
        </div>

        {/* QR pill */}
        {qrDataUrl && (
          <div style={{ position: 'absolute', bottom: -42, right: 18, background: '#fff', borderRadius: 14, padding: 9, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <img src={qrDataUrl} width={84} height={84} alt="QR vCard" style={{ display: 'block', imageRendering: 'pixelated' }} />
            <div style={{ fontSize: 8, color: '#888', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scan to add</div>
          </div>
        )}
      </div>

      {/* Info rows */}
      <div style={{ background: '#fff', padding: '54px 20px 16px' }}>
        {[
          profile.email && { label: 'Email', value: profile.email, color: '#e67e22', bg: '#fff8f0',
            action: <button onClick={copyEmail} style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: 8, background: emailCopied ? '#f0fff4' : '#fff', color: emailCopied ? '#22c55e' : '#888', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>{emailCopied ? 'Copied!' : 'Copy'}</button> },
          profile.company && { label: 'Institution', value: profile.company, color: '#3b82f6', bg: '#f0f7ff' },
          profile.country && { label: 'Country', value: profile.country, color: '#22c55e', bg: '#f0fff4' },
          li && { label: 'LinkedIn', value: li.replace('https://',''), color: '#0077b5', bg: '#f0f4ff',
            action: <a href={li} target="_blank" rel="noreferrer" style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', color: '#0077b5', fontSize: 11, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>Open</a> },
        ].filter(Boolean).map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #f2f2f2' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: row.color, opacity: 0.8 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{row.label}</div>
              <div style={{ fontSize: 12, color: '#111', fontWeight: 500, wordBreak: 'break-word', lineHeight: 1.35 }}>{row.value}</div>
            </div>
            {row.action}
          </div>
        ))}

        {/* Save to contacts button */}
        <button onClick={onSaveVCF}
          style={{ width: '100%', marginTop: 14, padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: 12, background: '#fff', color: '#333', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Save to Contacts (.vcf)
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyCard({ session, state }) {
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [errors, setErrors] = useState({})
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [activeTab, setActiveTab] = useState('edit')
  const [savedMsg, setSavedMsg] = useState('')

  // Pre-fill from saved profile or login data
  useEffect(() => {
    const saved = loadSavedProfile()
    const att = state.attendees?.find(a => a.name === session.user)
    setProfile({
      name:     saved?.name     || session.user || '',
      company:  saved?.company  || att?.inst    || '',
      country:  saved?.country  || att?.country || '',
      email:    saved?.email    || '',
      role:     saved?.role     || '',
      linkedin: saved?.linkedin || '',
    })
  }, [session.user, state.attendees])

  // Regenerate QR whenever profile changes
  useEffect(() => {
    if (!profile.name) { setQrDataUrl(''); return }
    const vcard = buildVCard(profile)
    QRCode.toDataURL(vcard, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 2,
      width: 256,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(url => setQrDataUrl(url)).catch(err => {
      console.error('QR generation failed:', err)
      setQrDataUrl('')
    })
  }, [profile])

  const setField = (key, val) => {
    setProfile(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: false }))
  }

  const validate = () => {
    const e = {}
    FIELDS.filter(f => f.req).forEach(f => { if (!profile[f.key]?.trim()) e[f.key] = true })
    setErrors(e)
    return !Object.keys(e).length
  }

  const saveInfo = () => {
    try {
      localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(profile))
      setSavedMsg('Saved!')
      setTimeout(() => setSavedMsg(''), 2000)
    } catch {}
  }

  const FIELDS = [
    { key: 'name',    label: 'Name',           req: true,  placeholder: 'e.g. Prof. Ana Silva' },
    { key: 'role',    label: 'Position / Title',    req: false, placeholder: 'e.g. Associate Professor' },
    { key: 'company', label: 'Institution',         req: true,  placeholder: 'e.g. University of Lisbon' },
    { key: 'email',   label: 'Email',               req: true,  placeholder: 'e.g. ana@fc.ul.pt', type: 'email' },
    { key: 'country', label: 'Country',             req: true,  placeholder: 'e.g. Portugal' },
    { key: 'linkedin',label: 'LinkedIn',            req: false, placeholder: 'e.g. linkedin.com/in/anasilva' },
  ]

  const missing = FIELDS.filter(f => f.req && !profile[f.key]?.trim())

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 24px' }}>
      <div className="page-title" style={{ marginBottom: 4 }}>My Card</div>
      <div className="page-sub" style={{ marginBottom: 20 }}>Digital business card with scannable QR code</div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
        {['edit','preview'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.18s', minHeight: 44,
              background: activeTab === t ? 'linear-gradient(135deg,var(--brand-mid),var(--brand-teal))' : 'transparent',
              color: activeTab === t ? '#fff' : 'var(--muted)' }}>
            {t === 'edit' ? 'Edit Details' : 'Preview Card'}
          </button>
        ))}
      </div>

      {/* Edit tab */}
      {activeTab === 'edit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FIELDS.map(f => (
            <div key={f.key} className="field">
              <label style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {f.label}
                {f.req ? <span style={{ color: 'var(--red)' }}>*</span>
                  : <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.7rem' }}>(optional)</span>}
              </label>
              <input
                type={f.type || 'text'}
                value={profile[f.key]}
                onChange={e => setField(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ borderColor: errors[f.key] ? 'rgba(239,68,68,0.6)' : '' }}
              />
            </div>
          ))}

          {missing.length > 0 && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', fontSize: '0.8rem' }}>
              Required: {missing.map(f => f.label).join(', ')}
            </div>
          )}

          <button className="btn btn-primary btn-full" onClick={() => { if (validate()) setActiveTab('preview') }}
            style={{ marginTop: 4 }}>
            View My Card
          </button>

          <button onClick={saveInfo}
            style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 10, background: savedMsg ? 'rgba(34,197,94,0.1)' : 'transparent', color: savedMsg ? 'var(--green)' : 'var(--muted)', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', minHeight: 44 }}>
            {savedMsg || 'Save Information'}
          </button>
        </div>
      )}

      {/* Preview tab */}
      {activeTab === 'preview' && (
        <div>
          {!profile.name ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
              Fill in your details first.
            </div>
          ) : (
            <CardPreview profile={profile} qrDataUrl={qrDataUrl} onSaveVCF={() => downloadVCF(profile)} />
          )}
          <button className="btn btn-ghost btn-full" style={{ marginTop: 16 }} onClick={() => setActiveTab('edit')}>
            Edit Details
          </button>
        </div>
      )}
    </div>
  )
}
