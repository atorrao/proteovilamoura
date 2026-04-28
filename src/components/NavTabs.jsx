export default function NavTabs({ page, session, onNavigate }) {
  const tabs = [
    { id: 'programme', label: 'Programme', icon: '📋' },
    { id: 'login',     label: 'Voting',    icon: '🗳' },
    { id: 'bingo',     label: 'SciBingo',  icon: '🎯' },
    ...(session.user && session.role !== 'admin' ? [{ id: 'card', label: 'My Card', icon: '👤' }] : []),
  ]

  const isActive = (id) => {
    if (id === 'login') return ['login','voting','admin'].includes(page)
    return page === id
  }

  const handleNav = (id) => {
    if (id === 'login') {
      if (session.user && session.role !== 'admin') onNavigate('voting')
      else onNavigate('login')
    } else {
      onNavigate(id)
    }
  }

  return (
    <nav className="nav-tabs">
      {tabs.map(t => (
        <button key={t.id} className={`nav-tab ${isActive(t.id) ? 'active' : ''}`}
          onClick={() => handleNav(t.id)}>
          <span className="nav-tab-icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}
