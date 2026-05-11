import { useState, useEffect, useCallback, useRef } from 'react'
import {
  loadAllFromSupabase, loadUserFromSupabase, subscribeToChanges,
  upsertVote, upsertEvaluator, deleteEvaluator, upsertAttendee,
} from './supabase.js'
import Header from './components/Header.jsx'
import NavTabs from './components/NavTabs.jsx'
import Programme from './components/Programme.jsx'
import Login from './components/Login.jsx'
import Voting from './components/Voting.jsx'
import Admin from './components/Admin.jsx'
import MyCard from './components/MyCard.jsx'
import Toast from './components/Toast.jsx'
import AdminLoginModal from './components/AdminLoginModal.jsx'

const ADMIN_PASS = 'admin123'

// ── Tab-scoped session key ─────────────────────────────────────────────────
// Each browser tab gets its own key so two users on the same device/browser
// never share session state, even in the same incognito window.
function getTabSessionKey() {
  let tabId = sessionStorage.getItem('pv2026_tab_id')
  if (!tabId) {
    tabId = Math.random().toString(36).slice(2)
    sessionStorage.setItem('pv2026_tab_id', tabId)
  }
  return `pv2026_session_${tabId}`
}

const SESSION_KEY = getTabSessionKey()

function loadSession() {
  try { const r = sessionStorage.getItem(SESSION_KEY); return r ? JSON.parse(r) : {} } catch { return {} }
}

const EMPTY_STATE = {
  evaluators: [], registeredEvaluators: [],
  attendees: [], votes: {}, locked: {},
}

export default function App() {
  const saved = loadSession()

  const [auth, setAuth] = useState({
    user: saved.user || null,
    role: saved.role || null,
    page: saved.page || 'programme',
  })

  const [state, setState] = useState(EMPTY_STATE)
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState({ msg: '', color: 'green', show: false })
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  // Persist auth on every change — scoped to this tab only
  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(auth)) } catch {}
  }, [auth])

  // On mount: if a session exists load only that user's data, otherwise load all (for admin/login page)
  useEffect(() => {
    const { user, role } = loadSession()
    const loader = (user && role !== 'admin')
      ? loadUserFromSupabase(user)
      : loadAllFromSupabase()

    loader
      .then(data => { setState(data); setReady(true) })
      .catch(e => { console.error('Load error:', e); setReady(true) })

    // Realtime: re-fetch only this user's data to avoid cross-user leakage
    const unsub = subscribeToChanges(() => {
      const { user: u, role: r } = loadSession()
      const reload = (u && r !== 'admin')
        ? loadUserFromSupabase(u)
        : loadAllFromSupabase()
      reload.then(data => setState(data)).catch(() => {})
    })
    return unsub
  }, [])

  const showToast = useCallback((msg, color = 'green') => {
    setToast({ msg, color, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000)
  }, [])

  const actions = {
    castVote: async (userName, presId, score) => {
      await upsertVote(userName, presId, score)
      setState(prev => ({
        ...prev,
        votes: { ...prev.votes, [userName]: { ...(prev.votes[userName] || {}), [presId]: score } }
      }))
    },
    addEvaluator: async (ev) => {
      await upsertEvaluator(ev)
      setState(prev => ({
        ...prev,
        registeredEvaluators: [...prev.registeredEvaluators.filter(e => e.name !== ev.name), ev],
        evaluators: prev.evaluators.includes(ev.name) ? prev.evaluators : [...prev.evaluators, ev.name],
      }))
    },
    updateEvaluator: async (ev) => {
      await upsertEvaluator(ev)
      setState(prev => ({
        ...prev,
        registeredEvaluators: prev.registeredEvaluators.map(e => e.name === ev.name ? ev : e),
      }))
    },
    removeEvaluator: async (name) => {
      await deleteEvaluator(name)
      setState(prev => ({
        ...prev,
        registeredEvaluators: prev.registeredEvaluators.filter(e => e.name !== name),
        evaluators: prev.evaluators.filter(e => e !== name),
      }))
    },
    addAttendee: async (att) => {
      await upsertAttendee(att)
      setState(prev => ({ ...prev, attendees: [...prev.attendees.filter(a => a.name !== att.name), att] }))
    },
    updateAttendee: async (att) => {
      await upsertAttendee(att)
      setState(prev => ({ ...prev, attendees: prev.attendees.map(a => a.name === att.name ? att : a) }))
    },
    removeAttendee: async (name) => {
      const { supabase } = await import('./supabase.js')
      await supabase.from('attendees').delete().eq('name', name)
      setState(prev => ({ ...prev, attendees: prev.attendees.filter(a => a.name !== name) }))
    },
    markAttendeeAccessed: async (name) => {
      const { supabase } = await import('./supabase.js')
      await supabase.from('attendees').update({ accessed: true }).eq('name', name)
      setState(prev => ({
        ...prev,
        attendees: prev.attendees.map(a => a.name === name ? { ...a, accessed: true } : a),
      }))
    },
    registerAttendee: async (att) => {
      await upsertAttendee(att)
      setState(prev => ({ ...prev, attendees: [...prev.attendees.filter(a => a.name !== att.name), att] }))
    },
    clearAll: async () => {
      const { supabase } = await import('./supabase.js')
      await Promise.all([
        supabase.from('votes').delete().neq('id', 0),
        supabase.from('evaluators').delete().neq('name', ''),
        supabase.from('attendees').delete().neq('name', ''),
      ])
      setState(EMPTY_STATE)
    },
  }

  const navigate = useCallback((p) => {
    setAuth(prev => {
      if (p === 'voting' && prev.user && prev.role !== 'admin') return { ...prev, page: 'voting' }
      return { ...prev, page: p }
    })
  }, [])

  const logout = useCallback(() => {
    // Remove only this tab's session — other tabs are unaffected
    sessionStorage.removeItem(SESSION_KEY)
    setState(EMPTY_STATE)
    setAuth({ user: null, role: null, page: 'login' })
    // Reload public data for the login screen
    loadAllFromSupabase().then(data => setState(data)).catch(() => {})
  }, [])

  const loginUser = useCallback((user, role) => {
    // On login, fetch only this user's votes and update state
    setAuth({ user, role, page: 'voting' })
    loadUserFromSupabase(user)
      .then(data => setState(data))
      .catch(e => console.error('loginUser load error:', e))
  }, [])

  const loginAdmin = useCallback(() => {
    setAuth({ user: 'Admin', role: 'admin', page: 'admin' })
    setShowAdminLogin(false)
    // Admin needs all data
    loadAllFromSupabase().then(data => setState(data)).catch(() => {})
  }, [])

  const { user, role, page } = auth
  const currentPage = (() => {
    if (page === 'admin' && role === 'admin') return 'admin'
    if (page === 'admin') return 'programme'
    if (page === 'voting' && user) return 'voting'
    if (page === 'voting') return 'login'
    if (page === 'card' && user) return 'card'
    if (page === 'card') return 'programme'
    return page
  })()

  const session = { user, role }

  return (
    <div className="app">
      <Header
        session={session}
        onLogout={logout}
        onAdminClick={() => setShowAdminLogin(true)}
        onAdminHome={() => setAuth(prev => ({ ...prev, page: 'admin' }))}
      />
      <NavTabs page={currentPage} session={session} onNavigate={navigate} />
      <div className="screen-area">
        {currentPage === 'programme' && <Programme />}
        {currentPage === 'login' && (
          <Login ready={ready} state={state} actions={actions} onLogin={loginUser} />
        )}
        {currentPage === 'voting' && (
          <Voting session={session} state={state} actions={actions} showToast={showToast} />
        )}
        {currentPage === 'admin' && (
          <Admin state={state} actions={actions} showToast={showToast} />
        )}
        {currentPage === 'card' && (
          <MyCard session={session} state={state} />
        )}
      </div>
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onLogin={loginAdmin}
          adminPass={ADMIN_PASS}
        />
      )}
      <Toast {...toast} />
    </div>
  )
}
