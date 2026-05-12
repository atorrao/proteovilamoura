const SPONSORS = {
  diamond: [
    { name: 'Bruker', url: 'https://www.bruker.com/pt.html', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bruker_Logo.svg/320px-Bruker_Logo.svg.png' },
    { name: 'Preomics', url: 'https://www.preomics.com/', logo: 'https://www.preomics.com/wp-content/uploads/2020/05/preomics_logo.png' },
    { name: 'Thermo Scientific / Unicam', url: 'https://www.unicam.pt/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Thermo_Fisher_Scientific_logo.svg/320px-Thermo_Fisher_Scientific_logo.svg.png' },
  ],
  platinum: [
    { name: 'Illumina', url: 'https://www.illumina.com/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Illumina_logo.svg/320px-Illumina_logo.svg.png' },
  ],
  gold: [
    { name: 'Affinisep', url: 'https://www.affinisep.com/', logo: 'https://www.affinisep.com/wp-content/uploads/2020/10/logo-affinisep.png' },
    { name: 'SCIEX', url: 'https://sciex.com/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/SCIEX_logo.svg/320px-SCIEX_logo.svg.png' },
  ],
  silver: [
    { name: 'Evosep', url: 'https://www.evosep.com/', logo: 'https://www.evosep.com/wp-content/uploads/2021/02/Evosep-Logo.png' },
    { name: 'Ionopticks', url: 'https://ionopticks.com/', logo: 'https://ionopticks.com/wp-content/uploads/2020/07/ionopticks-logo-dark.png' },
    { name: 'Promega', url: 'https://portugal.promega.com/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Promega_logo.svg/320px-Promega_logo.svg.png' },
    { name: 'Quilaban', url: 'https://www.quilaban.pt/parceiros/illumina/', logo: 'https://www.quilaban.pt/wp-content/uploads/2021/03/quilaban-logo.png' },
    { name: 'Solitica', url: 'https://solitica.pt/', logo: 'https://solitica.pt/wp-content/uploads/2021/06/logo-solitica.png' },
  ],
  custom: [
    { name: 'Ceres Nano', url: 'https://www.ceresnano.com/proteomics', logo: 'https://www.ceresnano.com/wp-content/uploads/2022/03/ceres-nano-logo.png' },
  ],
  partners: [
    { name: 'CCMAR', url: 'https://ccmar.ualg.pt/', logo: 'https://ccmar.ualg.pt/sites/default/files/logo_ccmar.png' },
    { name: 'Universidade do Algarve', url: 'https://www.ualg.pt/', logo: 'https://www.ualg.pt/sites/default/files/logo_ualg.png' },
    { name: 'CIBB', url: 'https://cibb.uc.pt/pt', logo: 'https://cibb.uc.pt/sites/default/files/logo_cibb.png' },
    { name: 'Loulé', url: 'https://www.cm-loule.pt/pt/Default.aspx', logo: 'https://www.cm-loule.pt/wp-content/uploads/logo-loule.png' },
  ],
}

const TIER_CONFIG = {
  diamond: { label: 'Diamond Sponsors', accent: '#1e8fab', size: 140, cols: 3 },
  platinum: { label: 'Platinum Sponsor', accent: '#8b7355', size: 120, cols: 2 },
  gold:     { label: 'Gold Sponsors',    accent: '#c8921a', size: 100, cols: 3 },
  silver:   { label: 'Silver Sponsors',  accent: '#7a8fa6', size: 80,  cols: 4 },
  custom:   { label: 'Custom Sponsor',   accent: '#1e8fab', size: 90,  cols: 2 },
  partners: { label: 'Partners',         accent: '#555',    size: 70,  cols: 4 },
}

function SponsorLogo({ sponsor, height }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      title={sponsor.name}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px 16px', borderRadius: 10,
        background: 'var(--surface)', border: '1px solid var(--border)',
        transition: 'all 0.2s', cursor: 'pointer',
        minHeight: height + 24,
        textDecoration: 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        style={{ maxHeight: height, maxWidth: '100%', objectFit: 'contain', filter: 'none' }}
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

export default function Sponsors() {
  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Organized by banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f9fb 0%, #e8f4f8 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '20px 16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
          Organized by
        </div>
        <img
          src="/organizers-banner.jpg"
          alt="PROCURA · French Proteomics Society · SEProt"
          style={{ maxWidth: '100%', width: 420, objectFit: 'contain', display: 'block', margin: '0 auto' }}
        />
      </div>

      {/* Thank you header */}
      <div style={{ padding: '28px 16px 8px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.3 }}>
          Thank you to all our sponsors
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>
          for supporting ProteoVilamoura 2026
        </div>
        <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, var(--brand-mid), var(--accent2))', borderRadius: 2, margin: '12px auto 0' }} />
      </div>

      {/* Sponsor tiers */}
      <div style={{ padding: '8px 16px', maxWidth: 680, margin: '0 auto' }}>
        {Object.entries(TIER_CONFIG).map(([tier, cfg]) => {
          const list = SPONSORS[tier]
          if (!list?.length) return null
          return (
            <div key={tier} style={{ marginBottom: 28 }}>
              {/* Tier label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: cfg.accent,
                  padding: '3px 10px', borderRadius: 20,
                  background: `${cfg.accent}15`, border: `1px solid ${cfg.accent}30`,
                }}>
                  {cfg.label}
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              {/* Logo grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(130, cfg.size + 40)}px, 1fr))`,
                gap: 10,
              }}>
                {list.map(s => (
                  <SponsorLogo key={s.name} sponsor={s} height={cfg.size} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
