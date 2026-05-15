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
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxWidth: 400, width: '100%', margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#0d3349 0%,#106080 55%,#208080 100%)', padding: '22px 20px 90px', position: 'relative' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 16 }}>
          ProteoVilamoura 2026 · Vilamoura
        </div>
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: profile.company ? 5 : 0 }}>
            {(() => {
              const parts = (profile.name || '—').trim().split(' ')
              if (parts.length <= 2) return profile.name || '—'
              const line1 = parts.slice(0, 2).join(' ')
              const line2 = parts.slice(2).join(' ')
              return <>{line1}<br />{line2}</>
            })()}
          </div>
          {profile.company && (
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{profile.company}</div>
          )}
        </div>

        {/* QR code */}
        {qrDataUrl && (
          <div style={{ position: 'absolute', bottom: -80, right: 16, background: '#fff', borderRadius: 16, padding: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <img src={qrDataUrl} width={160} height={160} alt="QR vCard" style={{ display: 'block' }} />
            <div style={{ fontSize: 9, color: '#999', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scan to add</div>
          </div>
        )}
      </div>

      {/* Info body */}
      <div style={{ background: '#fff', padding: '92px 20px 20px' }}>
        <InfoRow label="Email" value={profile.email} />
        <InfoRow label="Institution" value={profile.company} />
        <InfoRow label="Country" value={profile.country} />


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
      errorCorrectionLevel: 'M', type: 'image/png', margin: 2, width: 400,
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
