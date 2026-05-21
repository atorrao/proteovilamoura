import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tvjgewzsxjvdsypqrkqw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amdld3pzeGp2ZHN5cHFya3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjM4OTQsImV4cCI6MjA5Mzc5OTg5NH0.K_2utQBLZPifdIdTVLHuZXEObDndYMG3KEL4l4hzRk4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── EVALUATORS ───────────────────────────────────────────────────────────────
export async function getEvaluators() {
  const { data, error } = await supabase.from('evaluators').select('*')
  if (error) { console.error('getEvaluators:', error); return [] }
  return data
}

export async function upsertEvaluator(ev) {
  const { error } = await supabase.from('evaluators').upsert({
    name: ev.name,
    email: ev.email || '',
    sections: ev.sections || [],
    inst: ev.inst || '',
    country: ev.country || '',
  })
  if (error) console.error('upsertEvaluator:', error)
}

export async function deleteEvaluator(name) {
  const { error } = await supabase.from('evaluators').delete().eq('name', name)
  if (error) console.error('deleteEvaluator:', error)
}

// ─── ATTENDEES ────────────────────────────────────────────────────────────────
export async function getAttendees() {
  const { data, error } = await supabase.from('attendees').select('*')
  if (error) { console.error('getAttendees:', error); return [] }
  return data
}

export async function upsertAttendee(att) {
  const { error } = await supabase.from('attendees').upsert({
    name: att.name,
    inst: att.inst || '',
    email: att.email || '',
    country: att.country || '',
    ...(att.pass !== undefined ? { pass: att.pass } : {}),
    ...(att.accessed !== undefined ? { accessed: att.accessed } : {}),
  })
  if (error) { console.error('upsertAttendee:', error); throw error }
}

// ─── VOTES ────────────────────────────────────────────────────────────────────
export async function getVotes() {
  const votes = {}, locked = {}
  const PAGE = 1000
  let from = 0
  // Paginate to bypass PostgREST's default 1000-row limit
  while (true) {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .range(from, from + PAGE - 1)
    if (error) { console.error('getVotes:', error); break }
    if (!data || data.length === 0) break
    for (const row of data) {
      if (!votes[row.user_name]) votes[row.user_name] = {}
      votes[row.user_name][row.pres_id] = row.score
      if (row.locked) {
        if (!locked[row.user_name]) locked[row.user_name] = {}
        locked[row.user_name][row.pres_id] = true
      }
    }
    if (data.length < PAGE) break
    from += PAGE
  }
  return { votes, locked }
}

// Fetch votes for a single user only — used after login to avoid cross-user leakage
export async function getVotesForUser(userName) {
  const { data, error } = await supabase.from('votes').select('*').eq('user_name', userName).limit(10000)
  if (error) { console.error('getVotesForUser:', error); return {} }
  const userVotes = {}
  for (const row of data) {
    userVotes[row.pres_id] = row.score
  }
  return userVotes
}

export async function upsertVote(userName, presId, score) {
  const { error } = await supabase.from('votes').upsert({
    user_name: userName, pres_id: presId, score
  }, { onConflict: 'user_name,pres_id' })
  if (error) console.error('upsertVote:', error)
}

export async function lockVotes(userName, presIds) {
  const { error } = await supabase.from('votes')
    .update({ locked: true })
    .eq('user_name', userName)
    .in('pres_id', presIds)
  if (error) console.error('lockVotes:', error)
}

export async function unlockVote(userName, presId) {
  const { error } = await supabase.from('votes')
    .update({ locked: false })
    .eq('user_name', userName)
    .eq('pres_id', presId)
  if (error) console.error('unlockVote:', error)
}

// ─── EDIT REQUESTS ────────────────────────────────────────────────────────────
export async function getEditRequests() {
  const { data, error } = await supabase.from('edit_requests').select('*').order('id')
  if (error) { console.error('getEditRequests:', error); return [] }
  return data.map(r => ({
    id: r.id, evalName: r.eval_name, presId: r.pres_id,
    presTitle: r.pres_title, requestedAt: r.requested_at, status: r.status
  }))
}

export async function insertEditRequest(req) {
  const { error } = await supabase.from('edit_requests').insert({
    id: req.id, eval_name: req.evalName, pres_id: req.presId,
    pres_title: req.presTitle, requested_at: req.requestedAt, status: 'pending'
  })
  if (error) console.error('insertEditRequest:', error)
}

export async function updateEditRequestStatus(id, status) {
  const { error } = await supabase.from('edit_requests').update({ status }).eq('id', id)
  if (error) console.error('updateEditRequestStatus:', error)
}

// ─── FUN FACTS ────────────────────────────────────────────────────────────────
export async function getFunFacts() {
  const { data, error } = await supabase.from('fun_facts').select('*').order('id')
  if (error) { console.error('getFunFacts:', error); return [] }
  return data.map(r => ({ id: r.id, name: r.name, text: r.text }))
}

export async function upsertFunFact(fact) {
  const { error } = await supabase.from('fun_facts').upsert({
    id: fact.id, name: fact.name, text: fact.text
  })
  if (error) console.error('upsertFunFact:', error)
}

export async function deleteFunFact(id) {
  const { error } = await supabase.from('fun_facts').delete().eq('id', id)
  if (error) console.error('deleteFunFact:', error)
}

export async function deleteAllFunFacts() {
  const { error } = await supabase.from('fun_facts').delete().neq('id', 0)
  if (error) console.error('deleteAllFunFacts:', error)
}

// ─── BINGO CARDS ─────────────────────────────────────────────────────────────
export async function getBingoCards() {
  const { data, error } = await supabase.from('bingo_cards').select('*')
  if (error) { console.error('getBingoCards:', error); return {} }
  const cards = {}
  for (const row of data) cards[row.card_key] = { key: row.card_key, squares: row.squares, generated: row.generated }
  return cards
}

export async function upsertBingoCard(card) {
  const { error } = await supabase.from('bingo_cards').upsert({
    card_key: card.key, squares: card.squares, generated: card.generated
  })
  if (error) console.error('upsertBingoCard:', error)
}

export async function deleteAllBingoCards() {
  const { error } = await supabase.from('bingo_cards').delete().neq('card_key', '')
  if (error) console.error('deleteAllBingoCards:', error)
}

// ─── LOAD ALL STATE (admin only) ──────────────────────────────────────────────
export async function loadAllFromSupabase() {
  const [evaluators, attendees, voteData] = await Promise.all([
    getEvaluators(),
    getAttendees(),
    getVotes(),
  ])
  return {
    evaluators: evaluators.map(e => e.name),
    registeredEvaluators: evaluators,
    attendees,
    votes: voteData.votes || {},
    locked: voteData.locked || {},
  }
}

// ─── LOAD STATE FOR LOGGED-IN USER (non-admin) ────────────────────────────────
// Only fetches that user's own votes — never exposes other users' data
export async function loadUserFromSupabase(userName) {
  const [evaluators, attendees, userVotes] = await Promise.all([
    getEvaluators(),
    getAttendees(),
    getVotesForUser(userName),
  ])
  return {
    evaluators: evaluators.map(e => e.name),
    registeredEvaluators: evaluators,
    attendees,
    // Only this user's votes in the map — other keys simply don't exist
    votes: { [userName]: userVotes },
    locked: {},
  }
}

// ─── REALTIME SUBSCRIPTION ───────────────────────────────────────────────────
export function subscribeToChanges(onUpdate) {
  const channel = supabase.channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, onUpdate)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'evaluators' }, onUpdate)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'attendees' }, onUpdate)
    .subscribe()
  return () => supabase.removeChannel(channel)
}
