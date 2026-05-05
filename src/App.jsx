import { useState, useEffect, useCallback } from 'react'
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

// ── Session: sessionStorage so each tab is completely isolated ────────────────
// This prevents Person A's login bleeding into Person B's tab
function loadSession() {
  try {
    const r = sessionStorage.getItem('pv2026_session')
    return r ? JSON.parse(r) : { user: null, role: null, page: 'programme' }
  } catch { return { user: null, role: null, page: 'programme' } }
}
function saveSession(s, page) {
  try { sessionStorage.setItem('pv2026_session', JSON.stringify({ ...s, page })) } catch {}
}

const EMPTY_STATE = {
  evaluators: [], registeredEvaluators: [],
  attendees: [], pendingAttendees: [],
  votes: {}, locked: {},
}

export default function App() {
  const saved = loadSession()
  const [page, setPage] = useState(saved.page || 'programme')
  const [session, setSession] = useState({ user: saved.user || null, role: saved.role || null })
  const [state, setState] = useState(EMPTY_STATE)
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState({ msg: '', color: 'green', show: false })
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  // Persist session to sessionStorage (tab-isolated)
  useEffect(() => { saveSession(session, page) }, [session, page])

  // Load from Supabase and subscribe to real-time changes
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
    // Votes — each user's votes are keyed by their own name
    castVote: async (userName, presId, score) => {
      await upsertVote(userName, presId, score)
      setState(prev => ({
        ...prev,
        votes: { ...prev.votes, [userName]: { ...(prev.votes[userName] || {}), [presId]: score } }
      }))
    },

    // Evaluators
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

    // Attendees — register directly (no approval needed)
    registerAttendee: async (att) => {
      await upsertAttendee(att)
      setState(prev => ({
        ...prev,
        attendees: [...prev.attendees.filter(a => a.name !== att.name), att],
      }))
    },

    // Admin: clear all
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
    if (p === 'voting' && session.user && session.role !== 'admin') { setPage('voting'); return }
    setPage(p)
  }, [session])

  const logout = useCallback(() => {
    setSession({ user: null, role: null })
    sessionStorage.removeItem('pv2026_session')
    setPage('login')
  }, [])

  const currentPage = (() => {
    if (page === 'voting' && !session.user) return 'login'
    if (page === 'admin' && session.role !== 'admin') return 'programme'
    if (page === 'card' && !session.user) return 'programme'
    return page
  })()

  return (
    <div className="app">
      <Header
        session={session}
        onLogout={logout}
        onAdminClick={() => setShowAdminLogin(true)}
        onAdminHome={() => setPage('admin')}
      />
      <NavTabs page={currentPage} session={session} onNavigate={navigate} />
      <div className="screen-area">
        {currentPage === 'programme' && <Programme />}
        {currentPage === 'login' && (
          <Login ready={ready} state={state} actions={actions}
            onLogin={(user, role) => { setSession({ user, role }); setPage('voting') }} />
        )}
        {currentPage === 'voting' && session.user && (
          <Voting session={session} state={state} actions={actions} showToast={showToast} />
        )}
        {currentPage === 'admin' && session.role === 'admin' && (
          <Admin state={state} actions={actions} showToast={showToast} />
        )}
        {currentPage === 'card' && session.user && (
          <MyCard session={session} state={state} />
        )}
      </div>
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onLogin={() => { setSession({ user: 'Admin', role: 'admin' }); setShowAdminLogin(false); setPage('admin') }}
          adminPass={ADMIN_PASS}
        />
      )}
      <Toast {...toast} />
    </div>
  )
}
