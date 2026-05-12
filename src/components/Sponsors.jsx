// Sponsor logo paths — all files go in public/sponsors/
const SPONSORS = {
  diamond: {
    featured: [
      { name: 'Thermo Scientific / Unicam', url: 'https://www.unicam.pt/', logo: '/sponsors/unicam.png' },
    ],
    secondary: [
      { name: 'Bruker', url: 'https://www.bruker.com/pt.html', logo: '/sponsors/bruker.png' },
      { name: 'Preomics', url: 'https://www.preomics.com/', logo: '/sponsors/preomics.png' },
    ],
  },
  platinum: [
    { name: 'Illumina', url: 'https://www.illumina.com/', logo: '/sponsors/illumina.png' },
  ],
  gold: [
    { name: 'Affinisep', url: 'https://www.affinisep.com/', logo: '/sponsors/affinisep.png' },
    { name: 'SCIEX', url: 'https://sciex.com/', logo: '/sponsors/sciex.png' },
  ],
  silver: [
    { name: 'Evosep', url: 'https://www.evosep.com/', logo: '/sponsors/evosep.png' },
    { name: 'Ionopticks', url: 'https://ionopticks.com/', logo: '/sponsors/ionopticks.png' },
    { name: 'Promega', url: 'https://portugal.promega.com/', logo: '/sponsors/promega.jpg' },
    { name: 'Quilaban', url: 'https://www.quilaban.pt/parceiros/illumina/', logo: '/sponsors/quilaban.png' },
    { name: 'Solitica', url: 'https://solitica.pt/', logo: '/sponsors/solitica.png' },
  ],
  custom: [
    { name: 'Ceres Nano', url: 'https://www.ceresnano.com/proteomics', logo: '/sponsors/ceres.png' },
  ],
  partners: [
    { name: 'CCMAR', url: 'https://ccmar.ualg.pt/', logo: '/sponsors/ccmar.png' },
    { name: 'Universidade do Algarve', url: 'https://www.ualg.pt/', logo: '/sponsors/ualg.png' },
    { name: 'CIBB', url: 'https://cibb.uc.pt/pt', logo: '/sponsors/cibb.png' },
    { name: 'Loulé', url: 'https://www.cm-loule.pt/pt/Default.aspx', logo: '/sponsors/loule.png' },
  ],
}

const TIER_CONFIG = {
  platinum: { label: 'Platinum Sponsor', accent: '#8b7355' },
  gold:     { label: 'Gold Sponsors',    accent: '#c8921a' },
  silver:   { label: 'Silver Sponsors',  accent: '#7a8fa6' },
  custom:   { label: 'Custom Sponsor',   accent: '#1e8fab' },
  partners: { label: 'Partners',         accent: '#555'    },
}

function LogoCard({ sponsor, height, fullWidth = false }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      title={sponsor.name}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '14px 20px', borderRadius: 10,
        background: '#fff', border: '1px solid var(--border)',
        transition: 'all 0.2s', cursor: 'pointer',
        minHeight: height + 28,
        textDecoration: 'none',
        ...(fullWidth ? { gridColumn: '1 / -1' } : {}),
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'
        e.currentTarget.style.borderColor = 'var(--accent)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        style={{ maxHeight: height, maxWidth: '100%', objectFit: 'contain' }}
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'block'
        }}
      />
      <span style={{ display: 'none', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', textAlign: 'center' }}>
        {sponsor.name}
      </span>
    </a>
  )
}

function TierSection({ label, accent, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{
          fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: accent,
          padding: '3px 10px', borderRadius: 20,
          background: `${accent}18`, border: `1px solid ${accent}30`,
        }}>
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      {children}
    </div>
  )
}

export default function Sponsors() {
  return (
    <div style={{ paddingBottom: 40 }}>

      {/* Organized by — white background */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '20px 16px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14,
        }}>
          Organized by
        </div>
        <img
          src="/organizers-banner.jpg"
          alt="PROCURA · French Proteomics Society · SEProt"
          style={{ maxWidth: '100%', width: 400, objectFit: 'contain', display: 'block', margin: '0 auto' }}
        />
      </div>

      {/* Thank you header */}
      <div style={{ padding: '28px 16px 8px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Syne', fontSize: '1.1rem', fontWeight: 800,
          color: 'var(--text)', letterSpacing: '0.04em',
          textTransform: 'uppercase', lineHeight: 1.3,
        }}>
          Thank you to all our sponsors
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>
          for supporting ProteoVilamoura 2026
        </div>
        <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, var(--brand-mid), var(--accent2))', borderRadius: 2, margin: '12px auto 0' }} />
      </div>

      <div style={{ padding: '8px 16px', maxWidth: 680, margin: '0 auto' }}>

        {/* ── DIAMOND — featured (Unicam full width) + secondary (Bruker + Preomics smaller) ── */}
        <TierSection label="Diamond Sponsors" accent="#1e8fab">
          {/* Row 1: Unicam full width */}
          <div style={{ marginBottom: 10 }}>
            <LogoCard sponsor={SPONSORS.diamond.featured[0]} height={70} fullWidth />
          </div>
          {/* Row 2: Bruker + Preomics smaller */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SPONSORS.diamond.secondary.map(s => (
              <LogoCard key={s.name} sponsor={s} height={44} />
            ))}
          </div>
        </TierSection>

        {/* ── PLATINUM ── */}
        <TierSection label="Platinum Sponsor" accent="#8b7355">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {SPONSORS.platinum.map(s => <LogoCard key={s.name} sponsor={s} height={55} />)}
          </div>
        </TierSection>

        {/* ── GOLD ── */}
        <TierSection label="Gold Sponsors" accent="#c8921a">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {SPONSORS.gold.map(s => <LogoCard key={s.name} sponsor={s} height={50} />)}
          </div>
        </TierSection>

        {/* ── SILVER ── */}
        <TierSection label="Silver Sponsors" accent="#7a8fa6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {SPONSORS.silver.map(s => <LogoCard key={s.name} sponsor={s} height={44} />)}
          </div>
        </TierSection>

        {/* ── CUSTOM ── */}
        <TierSection label="Custom Sponsor" accent="#1e8fab">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {SPONSORS.custom.map(s => <LogoCard key={s.name} sponsor={s} height={50} />)}
          </div>
        </TierSection>

        {/* ── PARTNERS ── */}
        <TierSection label="Partners" accent="#555">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
            {SPONSORS.partners.map(s => <LogoCard key={s.name} sponsor={s} height={44} />)}
          </div>
        </TierSection>

      </div>
    </div>
  )
}
