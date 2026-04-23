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

export default function App() {
  const [page, setPage] = useState('programme')
  const [session, setSession] = useState({ user: null, role: null })
  const [state, setStateRaw] = useState(EMPTY_STATE)
  const [firebaseReady, setFirebaseReady] = useState(false)
  const [toast, setToast] = useState({ msg: '', color: 'green', show: false })
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const saveTimer = useRef(null)

  // Load from Firebase on mount
  useEffect(() => {
    loadFromFirebase().then(data => {
      setStateRaw(data)
      setFirebaseReady(true)
    })
    // Listen for real-time updates from other devices
    const unsub = listenFirebase(data => {
      setStateRaw(data)
    })
    return () => unsub()
  }, [])

  // Debounced save to Firebase
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
    // If already logged in and clicking Voting, go to voting screen
    if (p === 'voting' && session.user && session.role !== 'admin') {
      setPage('voting')
      return
    }
    setPage(p)
  }, [session])

  const logout = useCallback(() => {
    setSession({ user: null, role: null })
    setPage('login')
    const adminBtn = document.getElementById('hAdminBtn')
    if (adminBtn) adminBtn.style.display = ''
  }, [])

  const loginAsAdmin = useCallback(() => {
    setSession({ user: 'Admin', role: 'admin' })
    setShowAdminLogin(false)
    setPage('admin')
  }, [])

  return (
    <div className="app">
      <Header
        session={session}
        onLogout={logout}
        onAdminClick={() => setShowAdminLogin(true)}
      />
      <NavTabs
        page={page}
        session={session}
        onNavigate={navigate}
      />

      <div className="screen-area">
        {page === 'programme' && <Programme />}
        {page === 'login' && (
          <Login
            firebaseReady={firebaseReady}
            state={state}
            setState={setState}
            onLogin={(user, role) => {
              setSession({ user, role })
              setPage('voting')
            }}
          />
        )}
        {page === 'voting' && session.user && (
          <Voting
            session={session}
            state={state}
            setState={setState}
            showToast={showToast}
          />
        )}
        {page === 'admin' && session.role === 'admin' && (
          <Admin
            state={state}
            setState={setState}
            showToast={showToast}
          />
        )}
        {page === 'card' && session.user && (
          <MyCard session={session} state={state} />
        )}
        {page === 'bingo' && (
          <SciBingo
            session={session}
            state={state}
            setState={setState}
            showToast={showToast}
          />
        )}
      </div>

      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onLogin={loginAsAdmin}
          adminPass={state.adminPass || 'admin123'}
        />
      )}

      <Toast {...toast} />
    </div>
  )
}
