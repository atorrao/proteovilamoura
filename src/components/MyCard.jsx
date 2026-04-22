import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function MyCard({ session, state }) {
  const [form, setForm] = useState({ name: '', inst: '', email: '', country: '', role: '', spec: '' })
  const [errors, setErrors] = useState({})
  const qrRef = useRef(null)

  useEffect(() => {
    const att = state.attendees?.find(a => a.name === session.user)
    setForm(f => ({
      name: f.name || session.user || '',
      inst: f.inst || att?.inst || '',
      country: f.country || att?.country || '',
      email: f.email || '',
      role: f.role || '',
      spec: f.spec || '',
    }))
  }, [session.user, state.attendees])

  // Re-render QR when form changes
  useEffect(() => {
    if (!qrRef.current) return
    const vcard = buildVCard(form)
    QRCode.toCanvas(qrRef.current, vcard, { width: 80, margin: 1, color: { dark: '#0d3349', light: '#ffffff' } })
      .catch(() => {})
  }, [form])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = true
    if (!form.inst.trim()) e.inst = true
    if (!form.email.trim()) e.email = true
    if (!form.country.trim()) e.country = true
    setErrors(e)
    return !Object.keys(e).length
  }

  const generateCard = () => {
    if (!validate()) return
    openIDCard(form)
  }

  const missingFields = ['name','inst','email','country'].filter(k => !form[k]?.trim())
  const canGenerate = missingFields.length === 0

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="page-title">My Card</div>
      <div className="page-sub" style={{ marginBottom: 28 }}>Your professional participant card — share, save or export.</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Form */}
        <div>
          <div style={{ fontFamily:'Syne', fontSize:'0.82rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--muted)', marginBottom:14 }}>
            Professional information
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { key:'name', label:'Full name', req:true, placeholder:'e.g. Prof. Ana Silva' },
              { key:'inst', label:'Institution / Organisation', req:true, placeholder:'e.g. University of Lisbon' },
              { key:'email', label:'Email', req:true, placeholder:'e.g. ana.silva@fc.ul.pt', type:'email' },
              { key:'country', label:'Country', req:true, placeholder:'e.g. Portugal' },
              { key:'role', label:'Position / Title', placeholder:'e.g. Associate Professor' },
              { key:'spec', label:'Specialisation', placeholder:'e.g. Proteomics, Mass Spectrometry' },
            ].map(f => (
              <div key={f.key} className="field">
                <label>
                  {f.label}
                  {f.req ? <span style={{ color:'var(--red)', marginLeft:3 }}>*</span>
                    : <span style={{ color:'var(--muted)', fontWeight:400, fontSize:'0.72rem', marginLeft:5 }}>(optional)</span>}
                </label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key]}
                  onChange={e => { setForm(p => ({ ...p, [f.key]: e.target.value })); setErrors(p => ({ ...p, [f.key]: false })) }}
                  placeholder={f.placeholder}
                  className={errors[f.key] ? 'error' : ''}
                />
              </div>
            ))}
          </div>

          {missingFields.length > 0 && (
            <div className="err-msg" style={{ marginTop: 12 }}>
              Required fields missing: {missingFields.map(k => ({ name:'Full name', inst:'Institution', email:'Email', country:'Country' }[k])).join(', ')}.
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={generateCard}
            style={{ width:'100%', marginTop:20, padding:13, fontSize:'0.95rem', justifyContent:'center', opacity: canGenerate ? 1 : 0.5, cursor: canGenerate ? 'pointer' : 'not-allowed' }}>
            Generate ID Card
          </button>
          <div style={{ marginTop:8, fontSize:'0.73rem', color:'var(--muted)' }}>
            <span style={{ color:'var(--red)' }}>*</span> Required fields to generate the card
          </div>
        </div>

        {/* Preview */}
        <div>
          <div style={{ fontFamily:'Syne', fontSize:'0.82rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--muted)', marginBottom:14 }}>
            Preview
          </div>
          <div style={{ background:'linear-gradient(145deg,#0a2030,#0e2d40,#061a28)', border:'1px solid #164055', borderRadius:16, padding:28, position:'relative', overflow:'hidden', minHeight:220 }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg,#0d3349,#106080,#208080,#27b5a0)' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#27b5a0', marginBottom:10 }}>
                  ProteoVilamoura 2026 · Vilamoura, Portugal
                </div>
                <div style={{ fontFamily:'Syne', fontSize:'1.3rem', fontWeight:700, color:'#fff', marginBottom:4, lineHeight:1.2 }}>
                  {form.name || '—'}
                </div>
                {form.role && <div style={{ fontSize:'0.84rem', color:'#7fd4e8', marginBottom:3, fontWeight:500 }}>{form.role}</div>}
                {form.spec && <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:10 }}>{form.spec}</div>}
                <div style={{ height:1, background:'rgba(22,64,85,0.8)', margin:'10px 0' }} />
                <div style={{ fontSize:'0.82rem', color:'var(--text)', marginBottom:2, fontWeight:600 }}>{form.inst || '—'}</div>
                {form.country && <div style={{ fontSize:'0.76rem', color:'var(--muted)' }}>{form.country}</div>}
                {form.email && <div style={{ fontSize:'0.72rem', color:'#7fd4e8', marginTop:4 }}>{form.email}</div>}
              </div>
              <div>
                <div style={{ background:'#fff', padding:6, borderRadius:8, width:92, height:92, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3 }}>
                  <canvas ref={qrRef} width={80} height={80} />
                </div>
                <div style={{ fontSize:'0.58rem', color:'var(--muted)', textAlign:'center', marginTop:4 }}>Scan for info</div>
              </div>
            </div>
            <div style={{ position:'absolute', bottom:10, right:14, fontSize:'0.58rem', color:'rgba(90,128,153,0.45)', fontStyle:'italic' }}>20–22 MAY 2026</div>
          </div>
          <div style={{ marginTop:12, padding:'12px 14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, fontSize:'0.78rem', color:'var(--muted)', lineHeight:1.5 }}>
            The QR Code encodes your contact details as a vCard — scan it to add you as a contact instantly.
          </div>
        </div>
      </div>
    </div>
  )
}

function buildVCard(d) {
  const esc = s => String(s||'').replace(/[\\;,]/g, m => '\\'+m)
  return [
    'BEGIN:VCARD', 'VERSION:3.0',
    d.name   ? `FN:${esc(d.name)}` : '',
    d.name   ? `N:${esc(d.name.split(' ').slice(1).join(' '))};${esc(d.name.split(' ')[0])};;;` : '',
    d.role   ? `TITLE:${esc(d.role)}` : '',
    d.inst   ? `ORG:${esc(d.inst)}` : '',
    d.email  ? `EMAIL;TYPE=WORK:${esc(d.email)}` : '',
    d.country? `ADR;TYPE=WORK:;;;;;;${esc(d.country)}` : '',
    d.spec   ? `NOTE:ProteoVilamoura 2026 | ${esc(d.spec)}` : 'NOTE:ProteoVilamoura 2026',
    'END:VCARD'
  ].filter(Boolean).join('\n')
}

function openIDCard(d) {
  const vcard = buildVCard(d)
  const name = d.name || 'card'
  const page = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ID Card — ${d.name}</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial,Helvetica,sans-serif;background:#061520;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:20px;}
.card{width:420px;max-width:100%;background:linear-gradient(145deg,#0a2030,#0e2d40,#061a28);border-radius:18px;padding:30px;position:relative;overflow:hidden;border:1px solid #164055;box-shadow:0 20px 60px rgba(0,0,0,0.5);}
.bar{position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#0d3349,#106080,#208080,#27b5a0);}
.eyebrow{font-size:8px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#27b5a0;margin-bottom:14px;}
.inner{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;}
.info{flex:1;min-width:0;}
.nm{font-size:22px;font-weight:800;color:#fff;margin-bottom:4px;line-height:1.2;letter-spacing:-.02em;}
.rl{font-size:12px;color:#7fd4e8;margin-bottom:3px;font-weight:500;}
.sp{font-size:11px;color:#5a8099;margin-bottom:10px;}
.ln{height:1px;background:rgba(22,64,85,.8);margin:10px 0;}
.it{font-size:12px;color:#d8eaf2;margin-bottom:3px;font-weight:600;}
.ct{font-size:11px;color:#5a8099;}
.em{font-size:11px;color:#7fd4e8;margin-top:4px;word-break:break-all;}
.qrw{background:#fff;padding:7px;border-radius:9px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:3px;}
.qrw div{width:82px;height:82px;}
.qrl{font-size:8px;color:#888;white-space:nowrap;}
.stamp{position:absolute;bottom:12px;right:16px;font-size:8px;color:rgba(90,128,153,.4);font-style:italic;}
.actions{display:flex;gap:10px;}
button{padding:11px 26px;border-radius:9px;border:none;cursor:pointer;font-size:13px;font-weight:700;font-family:Arial;transition:opacity .15s;}
button:hover{opacity:.85;}
.bdl{background:linear-gradient(135deg,#106080,#208080);color:#fff;}
.bclose{background:rgba(22,64,85,.7);color:#d8eaf2;border:1px solid #164055;}
@media print{.actions{display:none;}}
</style></head><body>
<div class="card" id="idCard">
<div class="bar"></div>
<div class="eyebrow">ProteoVilamoura 2026 &middot; Vilamoura, Portugal</div>
<div class="inner"><div class="info">
<div class="nm">${d.name||'—'}</div>
${d.role?`<div class="rl">${d.role}</div>`:''}
${d.spec?`<div class="sp">${d.spec}</div>`:''}
<div class="ln"></div>
<div class="it">${d.inst||'—'}</div>
${d.country?`<div class="ct">${d.country}</div>`:''}
${d.email?`<div class="em">${d.email}</div>`:''}
</div>
<div class="qrw"><div id="qr"></div><span class="qrl">Scan to add contact</span></div>
</div>
<div class="stamp">20–22 MAY 2026</div></div>
<div class="actions">
<button class="bdl" onclick="dlCard()">Download Card</button>
<button class="bclose" onclick="window.close()">Close</button>
</div>
<script>
var vc=${JSON.stringify(vcard)};
new QRCode(document.getElementById('qr'),{text:vc,width:82,height:82,colorDark:'#0d3349',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
async function dlCard(){var cv=await html2canvas(document.getElementById('idCard'),{backgroundColor:'#0a2030',scale:3});var a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download='ProteoVilamoura_ID_${name.replace(/\s+/g,'_')}.png';a.click();}
</script></body></html>`

  const w = window.open('','_blank')
  if (w) { w.document.write(page); w.document.close() }
  else alert('Please allow pop-ups for this site to generate your ID card.')
}
