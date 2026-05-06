import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

// ── vCard builder ─────────────────────────────────────────────────────────────
function buildVCard(p) {
  const esc = s => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
  const nameParts = (p.name || '').trim().split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(p.name)}`,
    `N:${esc(lastName)};${esc(firstName)};;;`,
    p.company ? `ORG:${esc(p.company)}` : null,
    p.email   ? `EMAIL;TYPE=INTERNET,WORK,PREF:${esc(p.email)}` : null,
    p.country ? `ADR;TYPE=WORK:;;;;;;${esc(p.country)}` : null,
    'NOTE:ProteoVilamoura 2026',
    'END:VCARD',
  ].filter(Boolean).join('\r\n')
}

function downloadVCF(p) {
  const blob = new Blob([buildVCard(p)], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(p.name || 'contact').replace(/\s+/g, '_')}_ProteoVilamoura.vcf`
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
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

function Avatar({ name, size = 64 }) {
  const initials = (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#106080,#208080)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800, color: '#fff',
      border: '3px solid rgba(255,255,255,0.25)',
    }}>
      {initials}
    </div>
  )
}

// ── Info row — clean, no colour icons ────────────────────────────────────────
function InfoRow({ label, value, action }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, color: '#bbb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#222', fontWeight: 500, wordBreak: 'break-word', lineHeight: 1.35 }}>{value}</div>
      </div>
      {action}
    </div>
  )
}

// ── Digital Card ──────────────────────────────────────────────────────────────
function DigitalCard({ profile, qrDataUrl }) {
  const [emailCopied, copyEmail] = useCopy(profile.email)

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxWidth: 400, width: '100%', margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#0d3349 0%,#106080 55%,#208080 100%)', padding: '24px 20px 60px', position: 'relative' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 16 }}>
          ProteoVilamoura 2026 · Vilamoura
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <Avatar name={profile.name} size={64} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: profile.company ? 3 : 0 }}>
              {profile.name || '—'}
            </div>
            {profile.company && (
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>{profile.company}</div>
            )}
          </div>
        </div>

        {/* QR code */}
        {qrDataUrl && (
          <div style={{ position: 'absolute', bottom: -44, right: 18, background: '#fff', borderRadius: 14, padding: 9, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <img src={qrDataUrl} width={86} height={86} alt="QR vCard" style={{ display: 'block' }} />
            <div style={{ fontSize: 8, color: '#aaa', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scan to add</div>
          </div>
        )}
      </div>

      {/* Info body */}
      <div style={{ background: '#fff', padding: '56px 20px 20px' }}>
        <InfoRow label="Email" value={profile.email}
          action={
            <button onClick={copyEmail} style={{ padding: '4px 10px', border: '1px solid #eee', borderRadius: 8, background: emailCopied ? '#f0fff4' : '#fff', color: emailCopied ? '#16a34a' : '#999', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
              {emailCopied ? 'Copied!' : 'Copy'}
            </button>
          }
        />
        <InfoRow label="Institution" value={profile.company} />
        <InfoRow label="Country" value={profile.country} />

        {/* Save to contacts */}
        <button onClick={() => downloadVCF(profile)}
          style={{ width: '100%', marginTop: 16, padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: 12, background: '#fff', color: '#333', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          Save to Contacts
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyCard({ session, state }) {
  const [profile, setProfile] = useState({ name: '', email: '', company: '', country: '' })
  const [qrDataUrl, setQrDataUrl] = useState('')

  // Auto-fill from attendee/evaluator data — no manual input needed
  useEffect(() => {
    // Try attendees first
    const att = state.attendees?.find(a => a.name === session.user)
    if (att) {
      setProfile({ name: att.name || '', email: att.email || '', company: att.inst || '', country: att.country || '' })
      return
    }
    // Try evaluators
    const ev = state.registeredEvaluators?.find(e => e.name === session.user)
    if (ev) {
      setProfile({ name: ev.name || '', email: ev.email || '', company: ev.inst || '', country: ev.country || '' })
      return
    }
    // Fallback to session name
    setProfile(p => ({ ...p, name: session.user || '' }))
  }, [session.user, state.attendees, state.registeredEvaluators])

  // Generate QR whenever profile changes
  useEffect(() => {
    if (!profile.name) return
    QRCode.toDataURL(buildVCard(profile), {
      errorCorrectionLevel: 'M', type: 'image/png', margin: 2, width: 256,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => setQrDataUrl(''))
  }, [profile])

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
      <div className="page-title" style={{ marginBottom: 4 }}>My Card</div>
      <div className="page-sub" style={{ marginBottom: 24 }}>Your digital participant card</div>
      <DigitalCard profile={profile} qrDataUrl={qrDataUrl} />
    </div>
  )
}
