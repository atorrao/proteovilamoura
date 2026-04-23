import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

// ─── User profile model ───────────────────────────────────────────────────────
const EMPTY_PROFILE = {
  name: '',
  role: '',       // position / title
  company: '',    // institution / organisation
  email: '',
  linkedin: '',   // linkedin URL or username
  country: '',
}

// ─── Build vCard string for QR / download ────────────────────────────────────
function buildVCard(p) {
  const esc = s => String(s || '').replace(/[\\;,]/g, m => '\\' + m)
  const li = p.linkedin
    ? `https://${p.linkedin.replace(/^https?:\/\//,'').replace(/^www\./,'')}`
    : ''
  return [
    'BEGIN:VCARD', 'VERSION:3.0',
    p.name    ? `FN:${esc(p.name)}` : '',
    p.name    ? `N:${esc(p.name.split(' ').slice(1).join(' '))};${esc(p.name.split(' ')[0])};;;` : '',
    p.role    ? `TITLE:${esc(p.role)}` : '',
    p.company ? `ORG:${esc(p.company)}` : '',
    p.email   ? `EMAIL;TYPE=WORK:${esc(p.email)}` : '',
    p.country ? `ADR;TYPE=WORK:;;;;;;${esc(p.country)}` : '',
    li        ? `URL;TYPE=LinkedIn:${li}` : '',
    'NOTE:ProteoVilamoura 2026 — Vilamoura, Portugal',
    'END:VCARD',
  ].filter(Boolean).join('\n')
}

// ─── Download as .vcf file ───────────────────────────────────────────────────
function downloadVCF(p) {
  const blob = new Blob([buildVCard(p)], { type: 'text/vcard' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${(p.name || 'contact').replace(/\s+/g, '_')}.vcf`
  a.click()
}

// ─── Copy to clipboard ───────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return [copied, copy]
}

// ─── Avatar initials ─────────────────────────────────────────────────────────
function Avatar({ name, size = 80 }) {
  const initials = name
    ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg,#106080,#208080)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800, color: '#fff',
      border: '3px solid rgba(255,255,255,0.25)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

// ─── Digital Card preview (Blinq-style) ──────────────────────────────────────
function DigitalCard({ profile, qrDataUrl }) {
  const [emailCopied, copyEmail] = useCopy()
  const li = profile.linkedin
    ? `https://${profile.linkedin.replace(/^https?:\/\//,'').replace(/^www\./,'')}`
    : ''

  const isEmpty = !profile.name && !profile.email && !profile.company

  if (isEmpty) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360, color: 'var(--muted)', fontSize: '0.88rem', textAlign: 'center' }}>
        Fill in your details to see your digital card
      </div>
    )
  }

  return (
    <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', maxWidth: 380, width: '100%' }}>

      {/* ── Hero section ── */}
      <div style={{ background: 'linear-gradient(160deg,#0d3349 0%,#106080 55%,#208080 100%)', padding: '28px 24px 64px', position: 'relative' }}>

        {/* Event badge */}
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, marginBottom: 20 }}>
          ProteoVilamoura 2026 · Vilamoura
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <Avatar name={profile.name} size={72} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif', fontSize: '1.3rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
              {profile.name || '—'}
            </div>
            {profile.role && (
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginBottom: 2 }}>
                {profile.role}
              </div>
            )}
            {profile.company && (
              <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)' }}>
                {profile.company}
              </div>
            )}
          </div>
        </div>

        {/* QR code pill — overlaps hero/body boundary */}
        {qrDataUrl && (
          <div style={{ position: 'absolute', bottom: -44, right: 20, background: '#fff', borderRadius: 16, padding: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <img src={qrDataUrl} width={88} height={88} alt="QR code" style={{ display: 'block' }} />
            <div style={{ fontSize: 8, color: '#999', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scan to connect</div>
          </div>
        )}
      </div>

      {/* ── Info body ── */}
      <div style={{ background: '#fff', padding: '58px 22px 22px' }}>
        {[
          profile.email && {
            bg: '#fff7f0', icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-10 7L2 7"/>
              </svg>
            ),
            label: 'Email', value: profile.email,
            action: (
              <button onClick={() => copyEmail(profile.email)} style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: 8, background: emailCopied ? '#f0fff4' : '#fff', color: emailCopied ? '#22c55e' : '#888', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
                {emailCopied ? 'Copied!' : 'Copy'}
              </button>
            )
          },
          profile.company && {
            bg: '#f0f7ff', icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            ),
            label: 'Institution', value: profile.company,
          },
          profile.country && {
            bg: '#f0fff4', icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            ),
            label: 'Country', value: profile.country,
          },
          li && {
            bg: '#f0f4ff', icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#0077b5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            ),
            label: 'LinkedIn', value: li.replace('https://', ''),
            action: (
              <a href={li} target="_blank" rel="noreferrer" style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', color: '#0077b5', fontSize: 11, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
                Open
              </a>
            )
          },
        ].filter(Boolean).map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f2f2f2' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {row.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 1 }}>{row.label}</div>
              <div style={{ fontSize: 12, color: '#111', fontWeight: 500, wordBreak: 'break-word', lineHeight: 1.3 }}>{row.value}</div>
            </div>
            {row.action}
          </div>
        ))}

        {/* Save to phone */}
        <button onClick={() => downloadVCF(profile)}
          style={{ width: '100%', marginTop: 16, padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: 12, background: '#fff', color: '#333', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          Save to Phone (vCard)
        </button>
      </div>
    </div>
  )
}

const CARD_STORAGE_KEY = 'pv2026_card_profile'

function loadSavedProfile() {
  try { const r = localStorage.getItem(CARD_STORAGE_KEY); return r ? JSON.parse(r) : null } catch { return null }
}

// ─── Main MyCard page ─────────────────────────────────────────────────────────
export default function MyCard({ session, state, setState }) {
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [errors, setErrors] = useState({})
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [activeTab, setActiveTab] = useState('edit')
  const [savedMsg, setSavedMsg] = useState('')

  // Load from localStorage first, then pre-fill from login if fields empty
  useEffect(() => {
    const saved = loadSavedProfile()
    const att = state.attendees?.find(a => a.name === session.user)
    setProfile(p => ({
      name:     saved?.name     || p.name     || session.user || '',
      company:  saved?.company  || p.company  || att?.inst    || '',
      country:  saved?.country  || p.country  || att?.country || '',
      email:    saved?.email    || p.email    || '',
      role:     saved?.role     || p.role     || '',
      linkedin: saved?.linkedin || p.linkedin || '',
    }))
  }, [session.user, state.attendees])

  const saveInfo = () => {
    try {
      localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(profile))
      setSavedMsg('Information saved!')
      setTimeout(() => setSavedMsg(''), 2500)
    } catch {}
  }

  // Generate QR whenever profile changes
  useEffect(() => {
    const vcard = buildVCard(profile)
    QRCode.toDataURL(vcard, {
      width: 200, margin: 1,
      color: { dark: '#0d3349', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then(setQrDataUrl).catch(() => {})
  }, [profile])

  const setField = (key, val) => {
    setProfile(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: false }))
  }

  const required = ['name', 'company', 'email', 'country']
  const validate = () => {
    const e = {}
    required.forEach(k => { if (!profile[k]?.trim()) e[k] = true })
    setErrors(e)
    return !Object.keys(e).length
  }

  const FIELD_DEFS = [
    { key: 'name',     label: 'Full name',              req: true,  placeholder: 'e.g. Prof. Ana Silva',         type: 'text' },
    { key: 'role',     label: 'Position / Title',       req: false, placeholder: 'e.g. Associate Professor',     type: 'text' },
    { key: 'company',  label: 'Institution / Organisation', req: true, placeholder: 'e.g. University of Lisbon', type: 'text' },
    { key: 'email',    label: 'Email',                  req: true,  placeholder: 'e.g. ana@fc.ul.pt',            type: 'email' },
    { key: 'country',  label: 'Country',                req: true,  placeholder: 'e.g. Portugal',                type: 'text' },
    { key: 'linkedin', label: 'LinkedIn URL',           req: false, placeholder: 'e.g. linkedin.com/in/anasilva', type: 'text' },
  ]

  const missingLabels = FIELD_DEFS.filter(f => f.req && !profile[f.key]?.trim()).map(f => f.label)

  return (
    <div className="container" style={{ maxWidth: 960 }}>
      <div className="page-title">My Card</div>
      <div className="page-sub" style={{ marginBottom: 24 }}>
        Your digital business card — fill in your details, share the QR code or save to contacts.
      </div>

      {/* Tabs — mobile only */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--border)' }} className="mobile-tabs">
        {['edit', 'preview'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '9px 18px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.86rem', fontWeight: 600, color: activeTab === t ? 'var(--accent2)' : 'var(--muted)', borderBottom: `2px solid ${activeTab === t ? 'var(--accent2)' : 'transparent'}`, marginBottom: -1, transition: 'all 0.18s' }}>
            {t === 'edit' ? 'Edit details' : 'Card preview'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

        {/* ── Form ── */}
        <div style={{ display: activeTab === 'edit' ? 'block' : 'none' }} className="edit-panel">
          <div style={{ fontFamily: 'Syne', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 16 }}>
            Your information
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {FIELD_DEFS.map(f => (
              <div key={f.key} className="field">
                <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {f.label}
                  {f.req
                    ? <span style={{ color: 'var(--red)' }}>*</span>
                    : <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.7rem' }}>(optional)</span>}
                </label>
                <input
                  type={f.type}
                  value={profile[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={errors[f.key] ? 'error' : ''}
                />
              </div>
            ))}
          </div>

          {missingLabels.length > 0 && (
            <div className="err-msg" style={{ marginTop: 14 }}>
              Required: {missingLabels.join(', ')}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ flex: 1, padding: 12, justifyContent: 'center', opacity: missingLabels.length ? 0.45 : 1, cursor: missingLabels.length ? 'not-allowed' : 'pointer' }}
              onClick={() => { if (validate()) setActiveTab('preview') }}>
              View my card
            </button>
            <button className="btn btn-ghost" style={{ padding: 12, flexShrink: 0 }} onClick={() => { if (validate()) downloadVCF(profile) }}>
              Save .vcf
            </button>
          </div>

          <button onClick={saveInfo}
            style={{ width: '100%', marginTop: 10, padding: '10px', border: '1px solid var(--border)', borderRadius: 9, background: savedMsg ? 'rgba(34,197,94,0.1)' : 'transparent', color: savedMsg ? 'var(--green)' : 'var(--muted)', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            {savedMsg || 'Save information'}
          </button>

          <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--muted)' }}>
            <span style={{ color: 'var(--red)' }}>*</span> Required · Saved info is restored automatically next time
          </div>
        </div>

        {/* ── Card preview ── */}
        <div style={{ display: activeTab === 'preview' ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', gap: 16 }} className="preview-panel">
          <DigitalCard profile={profile} qrDataUrl={qrDataUrl} />
          <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('edit')}>
            Edit details
          </button>
        </div>
      </div>

      {/* On desktop always show both */}
      <style>{`
        @media (min-width: 640px) {
          .mobile-tabs { display: none !important; }
          .edit-panel { display: block !important; }
          .preview-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
