export default function NavTabs({ page, session, onNavigate }) {
  const tabs = [
    { id: 'programme', label: 'Programme' },
    { id: 'login', label: 'Voting' },
    { id: 'bingo', label: 'SciBingo' },
    ...(session.user && session.role !== 'admin' ? [{ id: 'card', label: 'My Card' }] : []),
  ]

  const isActive = (id) => {
    if (id === 'login') return ['login','voting','admin'].includes(page)
    return page === id
  }

  return (
    <nav className="nav-tabs">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-tab ${isActive(t.id) ? 'active' : ''}`}
          onClick={() => onNavigate(t.id === 'login' ? (session.user && session.role !== 'admin' ? 'voting' : 'login') : t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
