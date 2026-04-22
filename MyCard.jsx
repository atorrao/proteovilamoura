import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

const FIELDS = [
  { key: 'name',     label: 'Full name',              req: true,  placeholder: 'e.g. Prof. Ana Silva', type: 'text' },
  { key: 'inst',     label: 'Institution / Organisation', req: true, placeholder: 'e.g. University of Lisbon', type: 'text' },
  { key: 'email',    label: 'Email',                  req: true,  placeholder: 'e.g. ana.silva@fc.ul.pt', type: 'email' },
  { key: 'country',  label: 'Country',                req: true,  placeholder: 'e.g. Portugal', type: 'text' },
  { key: 'role',     label: 'Position / Title',       req: false, placeholder: 'e.g. Associate Professor', type: 'text' },
  { key: 'spec',     label: 'Specialisation',         req: false, placeholder: 'e.g. Proteomics, Mass Spectrometry', type: 'text' },
  { key: 'linkedin', label: 'LinkedIn',               req: false, placeholder: 'e.g. linkedin.com/in/anasilva', type: 'text' },
]

function buildVCard(d) {
  const esc = s => String(s || '').replace(/[\\;,]/g, m => '\\' + m)
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0',
    d.name    ? `FN:${esc(d.name)}` : '',
    d.name    ? `N:${esc(d.name.split(' ').slice(1).join(' '))};${esc(d.name.split(' ')[0])};;;` : '',
    d.role    ? `TITLE:${esc(d.role)}` : '',
    d.inst    ? `ORG:${esc(d.inst)}` : '',
    d.email   ? `EMAIL;TYPE=WORK:${esc(d.email)}` : '',
    d.country ? `ADR;TYPE=WORK:;;;;;;${esc(d.country)}` : '',
    d.linkedin? `URL;TYPE=LinkedIn:https://${d.linkedin.replace(/^https?:\/\//,'').replace(/^www\./,'')}` : '',
    d.spec    ? `NOTE:ProteoVilamoura 2026 | ${esc(d.spec)}` : 'NOTE:ProteoVilamoura 2026',
    'END:VCARD'
  ]
  return lines.filter(Boolean).join('\n')
}

function openIDCard(d) {
  const vcard = buildVCard(d)
  const linkedinClean = d.linkedin ? d.linkedin.replace(/^https?:\/\//,'').replace(/^www\.linkedin\.com\//,'linkedin.com/') : ''

  // Blinq-style card page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>${d.name} — ProteoVilamoura 2026</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  background:#0a0f1e;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:20px;
  gap:16px;
}

/* Main card — Blinq style */
.card{
  width:360px;
  max-width:100%;
  border-radius:24px;
  overflow:hidden;
  box-shadow:0 32px 80px rgba(0,0,0,0.6);
  position:relative;
}

/* Top section: gradient hero */
.card-hero{
  background:linear-gradient(160deg,#0d3349 0%,#106080 50%,#208080 100%);
  padding:28px 24px 60px;
  position:relative;
}
.event-badge{
  display:inline-block;
  background:rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.85);
  font-size:10px;
  font-weight:700;
  letter-spacing:0.1em;
  text-transform:uppercase;
  padding:4px 10px;
  border-radius:20px;
  margin-bottom:20px;
}
.avatar{
  width:72px;
  height:72px;
  border-radius:50%;
  background:rgba(255,255,255,0.15);
  border:3px solid rgba(255,255,255,0.3);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:28px;
  font-weight:800;
  color:#fff;
  margin-bottom:14px;
}
.hero-name{
  font-size:22px;
  font-weight:800;
  color:#fff;
  line-height:1.2;
  margin-bottom:4px;
}
.hero-role{
  font-size:13px;
  color:rgba(255,255,255,0.75);
  font-weight:500;
  margin-bottom:2px;
}
.hero-spec{
  font-size:11px;
  color:rgba(255,255,255,0.5);
}

/* QR section — white pill overlapping hero */
.qr-pill{
  position:absolute;
  bottom:-40px;
  right:20px;
  background:#fff;
  border-radius:16px;
  padding:10px;
  box-shadow:0 8px 32px rgba(0,0,0,0.3);
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
}
.qr-pill canvas{ display:block; }
.qr-label{
  font-size:9px;
  color:#888;
  font-weight:600;
  letter-spacing:0.05em;
  text-transform:uppercase;
}

/* Bottom section: white info */
.card-body{
  background:#fff;
  padding:52px 24px 24px;
}
.info-row{
  display:flex;
  align-items:flex-start;
  gap:10px;
  padding:10px 0;
  border-bottom:1px solid #f0f0f0;
}
.info-row:last-child{ border-bottom:none; }
.info-icon{
  width:32px;
  height:32px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
  font-size:14px;
}
.info-content{ flex:1; min-width:0; }
.info-label{ font-size:10px; color:#999; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:1px; }
.info-value{ font-size:13px; color:#111; font-weight:500; word-break:break-word; line-height:1.35; }

/* Actions */
.actions{
  display:flex;
  gap:10px;
  width:360px;
  max-width:100%;
}
.btn-save{
  flex:1;
  padding:13px;
  border-radius:14px;
  border:none;
  cursor:pointer;
  font-size:14px;
  font-weight:700;
  background:linear-gradient(135deg,#106080,#208080);
  color:#fff;
  transition:opacity .15s;
}
.btn-save:hover{ opacity:.88; }
.btn-close{
  padding:13px 20px;
  border-radius:14px;
  border:1px solid #ddd;
  cursor:pointer;
  font-size:14px;
  font-weight:600;
  background:#fff;
  color:#666;
}
.btn-close:hover{ background:#f5f5f5; }

.scan-hint{
  font-size:11px;
  color:rgba(255,255,255,0.5);
  text-align:center;
}
@media print{ .actions,.scan-hint{ display:none; } }
</style>
</head>
<body>

<div class="card" id="idCard">
  <!-- Hero -->
  <div class="card-hero">
    <div class="event-badge">ProteoVilamoura 2026 · Vilamoura</div>
    <div class="avatar">${(d.name || '?').charAt(0).toUpperCase()}</div>
    <div class="hero-name">${d.name || '—'}</div>
    ${d.role ? `<div class="hero-role">${d.role}</div>` : ''}
    ${d.spec ? `<div class="hero-spec">${d.spec}</div>` : ''}
    <!-- QR pill -->
    <div class="qr-pill">
      <div id="qrcode"></div>
      <div class="qr-label">Add contact</div>
    </div>
  </div>

  <!-- Body info -->
  <div class="card-body">
    ${d.inst ? `
    <div class="info-row">
      <div class="info-icon" style="background:#f0f7ff">🏛</div>
      <div class="info-content">
        <div class="info-label">Institution</div>
        <div class="info-value">${d.inst}</div>
      </div>
    </div>` : ''}
    ${d.email ? `
    <div class="info-row">
      <div class="info-icon" style="background:#fff0f0">✉️</div>
      <div class="info-content">
        <div class="info-label">Email</div>
        <div class="info-value">${d.email}</div>
      </div>
    </div>` : ''}
    ${d.country ? `
    <div class="info-row">
      <div class="info-icon" style="background:#f0fff4">🌍</div>
      <div class="info-content">
        <div class="info-label">Country</div>
        <div class="info-value">${d.country}</div>
      </div>
    </div>` : ''}
    ${linkedinClean ? `
    <div class="info-row">
      <div class="info-icon" style="background:#f0f4ff">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077b5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </div>
      <div class="info-content">
        <div class="info-label">LinkedIn</div>
        <div class="info-value">${linkedinClean}</div>
      </div>
    </div>` : ''}
  </div>
</div>

<div class="actions">
  <button class="btn-save" onclick="dlCard()">Download Card</button>
  <button class="btn-close" onclick="window.close()">Close</button>
</div>

<script>
var vc = ${JSON.stringify(vcard)};
new QRCode(document.getElementById('qrcode'), {
  text: vc,
  width: 90,
  height: 90,
  colorDark: '#0d3349',
  colorLight: '#ffffff',
  correctLevel: QRCode.CorrectLevel.M
});

async function dlCard() {
  var cv = await html2canvas(document.getElementById('idCard'), {
    backgroundColor: '#fff',
    scale: 3,
    useCORS: true,
  });
  var a = document.createElement('a');
  a.href = cv.toDataURL('image/png');
  a.download = 'ProteoVilamoura_${(d.name || 'card').replace(/\s+/g, '_')}.png';
  a.click();
}
</script>
</body>
</html>`

  const w = window.open('', '_blank')
  if (w) { w.document.write(html); w.document.close() }
  else alert('Please allow pop-ups for this site to generate your ID card.')
}

export default function MyCard({ session, state }) {
  const [form, setForm] = useState({ name: '', inst: '', email: '', country: '', role: '', spec: '', linkedin: '' })
  const [errors, setErrors] = useState({})
  const qrRef = useRef(null)

  // Pre-fill from login data
  useEffect(() => {
    const att = state.attendees?.find(a => a.name === session.user)
    setForm(f => ({
      name:     f.name     || session.user || '',
      inst:     f.inst     || att?.inst    || '',
      country:  f.country  || att?.country || '',
      email:    f.email    || '',
      role:     f.role     || '',
      spec:     f.spec     || '',
      linkedin: f.linkedin || '',
    }))
  }, [session.user, state.attendees])

  // Live QR preview
  useEffect(() => {
    if (!qrRef.current) return
    QRCode.toCanvas(qrRef.current, buildVCard(form), {
      width: 88, margin: 1, color: { dark: '#0d3349', light: '#ffffff' }
    }).catch(() => {})
  }, [form])

  const setField = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: false }))
  }

  const validate = () => {
    const e = {}
    FIELDS.filter(f => f.req).forEach(f => { if (!form[f.key]?.trim()) e[f.key] = true })
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleGenerate = () => { if (validate()) openIDCard(form) }

  const missing = FIELDS.filter(f => f.req && !form[f.key]?.trim()).map(f => f.label)
  const canGenerate = missing.length === 0

  return (
    <div className="container" style={{ maxWidth: 920 }}>
      <div className="page-title">My Card</div>
      <div className="page-sub" style={{ marginBottom: 28 }}>
        Your professional participant card — fill in your details, preview, then generate your ID card.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* ── Form ── */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 16 }}>
            Your information
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {FIELDS.map(f => (
              <div key={f.key} className="field">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {f.label}
                  {f.req
                    ? <span style={{ color: 'var(--red)', fontSize: '0.9rem' }}>*</span>
                    : <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.71rem' }}>(optional)</span>}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={errors[f.key] ? 'error' : ''}
                />
              </div>
            ))}
          </div>

          {missing.length > 0 && (
            <div className="err-msg" style={{ marginTop: 14 }}>
              Required fields missing: {missing.join(', ')}.
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            style={{ width: '100%', marginTop: 20, padding: 13, fontSize: '0.95rem', justifyContent: 'center', opacity: canGenerate ? 1 : 0.45, cursor: canGenerate ? 'pointer' : 'not-allowed' }}>
            Generate ID Card
          </button>
          <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--muted)' }}>
            <span style={{ color: 'var(--red)' }}>*</span> Required · Opens a shareable card with a scannable QR code
          </div>
        </div>

        {/* ── Live Preview ── */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 16 }}>
            Preview
          </div>

          {/* Blinq-style preview card */}
          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(160deg,#0d3349 0%,#106080 50%,#208080 100%)', padding: '24px 22px 52px', position: 'relative' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.12)', padding: '3px 9px', borderRadius: 20, display: 'inline-block', marginBottom: 16 }}>
                ProteoVilamoura 2026 · Vilamoura
              </div>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
                {(form.name || '?').charAt(0).toUpperCase()}
              </div>
              <div style={{ fontFamily: 'Syne', fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 3 }}>{form.name || '—'}</div>
              {form.role && <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{form.role}</div>}
              {form.spec && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{form.spec}</div>}
              {/* QR pill */}
              <div style={{ position: 'absolute', bottom: -38, right: 18, background: '#fff', borderRadius: 14, padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <canvas ref={qrRef} width={88} height={88} />
                <div style={{ fontSize: '8px', color: '#888', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Add contact</div>
              </div>
            </div>
            {/* Body */}
            <div style={{ background: '#fff', padding: '50px 20px 18px' }}>
              {[
                { show: !!form.inst,     bg: '#f0f7ff', icon: '🏛', label: 'Institution', val: form.inst },
                { show: !!form.email,    bg: '#fff0f0', icon: '✉',  label: 'Email',       val: form.email },
                { show: !!form.country,  bg: '#f0fff4', icon: '🌍', label: 'Country',     val: form.country },
                { show: !!form.linkedin, bg: '#f0f4ff', icon: 'in', label: 'LinkedIn',    val: form.linkedin },
              ].filter(r => r.show).map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: row.icon === 'in' ? '10px' : '13px', fontWeight: 800, color: '#0077b5', flexShrink: 0 }}>{row.icon}</div>
                  <div>
                    <div style={{ fontSize: '9px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</div>
                    <div style={{ fontSize: '12px', color: '#111', fontWeight: 500, wordBreak: 'break-word' }}>{row.val}</div>
                  </div>
                </div>
              ))}
              {!form.inst && !form.email && !form.country && !form.linkedin && (
                <div style={{ textAlign: 'center', padding: '10px 0', color: '#ccc', fontSize: '0.82rem' }}>Fill in your details to see the preview</div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            Scanning the QR code opens the native contacts app — the person can save your details with one tap.
          </div>
        </div>
      </div>
    </div>
  )
}
