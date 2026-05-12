export default function NavTabs({ page, session, onNavigate }) {
  const isAdmin = session.role === 'admin'

  const tabs = isAdmin ? [
    { id: 'programme', label: 'Programme' },
    { id: 'admin', label: 'Backoffice' },
  ] : [
    { id: 'programme', label: 'Programme' },
    { id: 'sponsors', label: 'Sponsors' },
    { id: 'login', label: session.user ? 'Voting' : 'Login' },
    ...(session.user ? [{ id: 'card', label: 'My Card' }] : []),
  ]

  const isActive = (id) => {
    if (id === 'login') return ['login','voting'].includes(page)
    if (id === 'admin') return page === 'admin'
    return page === id
  }

  const handleNav = (id) => {
    if (id === 'login' && session.user && session.role !== 'admin') {
      onNavigate('voting')
    } else {
      onNavigate(id)
    }
  }

  return (
    <nav className="nav-tabs">
      {tabs.map(t => (
        <button key={t.id}
          className={`nav-tab ${isActive(t.id) ? 'active' : ''}`}
          onClick={() => handleNav(t.id)}>
          {t.label}
        </button>
      ))}
    </nav>
  )
}
