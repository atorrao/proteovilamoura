import { useState, useEffect, useCallback, useRef } from 'react'
import { loadFromFirebase, saveToFirebase, listenFirebase, EMPTY_STATE } from './firebase.js'
import Header from './components/Header.jsx'
import NavTabs from './components/NavTabs.jsx'
import Programme from './components/Programme.jsx'
import Login from './components/Login.jsx'
import Voting from './components/Voting.jsx'
import Admin from './components/Admin.jsx'
import MyCard from './components/MyCard.jsx'
import SciBingo from './components/SciBingo.jsx'
import Toast from './components/Toast.jsx'
import AdminLoginModal from './components/AdminLoginModal.jsx'

// localStorage so session persists across tabs AND page refreshes
const SESSION_KEY = 'pv2026_session'

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : { user: null, role: null, page: 'programme' }
  } catch { return { user: null, role: null, page: 'programme' } }
}

function saveSession(session, page) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, page })) } catch {}
}

export default function App() {
  const saved = loadSession()
  const [page, setPage] = useState(saved.page || 'programme')
  const [session, setSession] = useState({ user: saved.user || null, role: saved.role || null })
  const [state, setStateRaw] = useState(EMPTY_STATE)
  const [firebaseReady, setFirebaseReady] = useState(false)
  const [toast, setToast] = useState({ msg: '', color: 'green', show: false })
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => { saveSession(session, page) }, [session, page])

  useEffect(() => {
    loadFromFirebase().then(data => { setStateRaw(data); setFirebaseReady(true) })
    const unsub = listenFirebase(data => setStateRaw(data))
    return () => unsub()
  }, [])

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => saveToFirebase(next), 600)
      return next
    })
  }, [])

  const showToast = useCallback((msg, color = 'green') => {
    setToast({ msg, color, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000)
  }, [])

  const navigate = useCallback((p) => {
    if (p === 'voting' && session.user && session.role !== 'admin') { setPage('voting'); return }
    setPage(p)
  }, [session])

  const logout = useCallback(() => {
    setSession({ user: null, role: null })
    localStorage.removeItem(SESSION_KEY)
    setPage('login')
  }, [])

  const loginAsAdmin = useCallback(() => {
    setSession({ user: 'Admin', role: 'admin' })
    setShowAdminLogin(false)
    setPage('admin')
  }, [])

  const currentPage = (() => {
    if (page === 'voting' && !session.user) return 'login'
    if (page === 'admin' && session.role !== 'admin') return 'programme'
    if (page === 'card' && !session.user) return 'programme'
    return page
  })()

  return (
    <div className="app">
      <Header session={session} onLogout={logout} onAdminClick={() => setShowAdminLogin(true)} />
      <NavTabs page={currentPage} session={session} onNavigate={navigate} />
      <div className="screen-area">
        {currentPage === 'programme' && <Programme />}
        {currentPage === 'login' && (
          <Login firebaseReady={firebaseReady} state={state} setState={setState}
            onLogin={(user, role) => { setSession({ user, role }); setPage('voting') }} />
        )}
        {currentPage === 'voting' && session.user && (
          <Voting session={session} state={state} setState={setState} showToast={showToast} />
        )}
        {currentPage === 'admin' && session.role === 'admin' && (
          <Admin state={state} setState={setState} showToast={showToast} />
        )}
        {currentPage === 'card' && session.user && (
          <MyCard session={session} state={state} setState={setState} />
        )}
        {currentPage === 'bingo' && (
          <SciBingo session={session} state={state} setState={setState} showToast={showToast} />
        )}
      </div>
      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} onLogin={loginAsAdmin}
          adminPass={state.adminPass || 'admin123'} />
      )}
      <Toast {...toast} />
    </div>
  )
}
