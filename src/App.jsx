import { useState, useEffect, useCallback, useRef } from 'react'
import {
  loadAllFromSupabase, subscribeToChanges,
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
const SESSION_KEY = 'pv2026_session'

function loadSession() {
  try { const r = sessionStorage.getItem(SESSION_KEY); return r ? JSON.parse(r) : {} } catch { return {} }
}

const EMPTY_STATE = {
  evaluators: [], registeredEvaluators: [],
  attendees: [], votes: {}, locked: {},
}

export default function App() {
  const saved = loadSession()

  // Single unified auth state — avoids race conditions between page + session
  const [auth, setAuth] = useState({
    user: saved.user || null,
    role: saved.role || null,
    page: saved.page || 'programme',
  })

  const [state, setState] = useState(EMPTY_STATE)
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState({ msg: '', color: 'green', show: false })
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  // Persist auth on every change
  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(auth)) } catch {}
  }, [auth])

  useEffect(() => {
    loadAllFromSupabase()
      .then(data => { setState(data); setReady(true) })
      .catch(e => { console.error('Load error:', e); setReady(true) })
    const unsub = subscribeToChanges(() => {
      loadAllFromSupabase().then(data => setState(data)).catch(() => {})
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

  // All navigation and auth changes go through setAuth — single atomic update
  const navigate = useCallback((p) => {
    setAuth(prev => {
      if (p === 'voting' && prev.user && prev.role !== 'admin') return { ...prev, page: 'voting' }
      return { ...prev, page: p }
    })
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuth({ user: null, role: null, page: 'login' })
  }, [])

  const loginUser = useCallback((user, role) => {
    setAuth({ user, role, page: 'voting' })
  }, [])

  // Admin login — single atomic update, no race condition possible
  const loginAdmin = useCallback(() => {
    setAuth({ user: 'Admin', role: 'admin', page: 'admin' })
    setShowAdminLogin(false)
  }, [])

  // Derive what to show
  const { user, role, page } = auth
  const currentPage = (() => {
    if (page === 'admin' && role === 'admin') return 'admin'
    if (page === 'admin') return 'programme'  // not admin, redirect
    if (page === 'voting' && user) return 'voting'
    if (page === 'voting') return 'login'     // not logged in
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
