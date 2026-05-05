import { useState, useEffect, useCallback } from 'react'
import {
  loadAllFromSupabase, subscribeToChanges,
  upsertVote, upsertEvaluator, deleteEvaluator, upsertAttendee,
  insertPendingAttendee, approvePendingAttendee, rejectPendingAttendee,
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

const SESSION_KEY = 'pv2026_session'
const ADMIN_PASS = 'admin123'

function loadSession() {
  try { const r = localStorage.getItem(SESSION_KEY); return r ? JSON.parse(r) : {} } catch { return {} }
}
function saveSession(s, page) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ ...s, page })) } catch {}
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

  useEffect(() => { saveSession(session, page) }, [session, page])

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
    // Votes
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

    // Attendees — direct add (admin use)
    addAttendee: async (att) => {
      await upsertAttendee(att)
      setState(prev => ({
        ...prev,
        attendees: [...prev.attendees.filter(a => a.name !== att.name), att],
      }))
    },

    // Attendees — register flow (requires admin approval)
    requestAttendee: async (att) => {
      await insertPendingAttendee(att)
      setState(prev => ({
        ...prev,
        pendingAttendees: [...(prev.pendingAttendees || []), att],
      }))
    },
    approveAttendee: async (id, att) => {
      await approvePendingAttendee(id, att)
      setState(prev => ({
        ...prev,
        attendees: [...prev.attendees.filter(a => a.name !== att.name), att],
        pendingAttendees: (prev.pendingAttendees || []).filter(a => a.id !== id),
      }))
    },
    rejectAttendee: async (id) => {
      await rejectPendingAttendee(id)
      setState(prev => ({
        ...prev,
        pendingAttendees: (prev.pendingAttendees || []).filter(a => a.id !== id),
      }))
    },

    // Clear all
    clearAll: async () => {
      const { supabase } = await import('./supabase.js')
      await Promise.all([
        supabase.from('votes').delete().neq('id', 0),
        supabase.from('evaluators').delete().neq('name', ''),
        supabase.from('attendees').delete().neq('name', ''),
        supabase.from('pending_attendees').delete().neq('id', 0),
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
    localStorage.removeItem(SESSION_KEY)
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
