import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ituweoglpzzeuwffqrae.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dXdlb2dscHp6ZXV3ZmZxcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTUxMzAsImV4cCI6MjA5Mjg3MTEzMH0.JnJevJx5AK1PsrJD_So54bfZ2amZkVem7oxgIxmyq7g'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── EVALUATORS ───────────────────────────────────────────────────────────────
export async function getEvaluators() {
  const { data, error } = await supabase.from('evaluators').select('*')
  if (error) { console.error('getEvaluators:', error); return [] }
  return data
}

export async function upsertEvaluator(ev) {
  const { error } = await supabase.from('evaluators').upsert({
    name: ev.name, pass: ev.pass, sections: ev.sections || []
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
    name: att.name, inst: att.inst || '', country: att.country || ''
  })
  if (error) console.error('upsertAttendee:', error)
}

// ─── VOTES ────────────────────────────────────────────────────────────────────
export async function getVotes() {
  const { data, error } = await supabase.from('votes').select('*')
  if (error) { console.error('getVotes:', error); return [] }
  // Transform to { user_name: { pres_id: score } } and locked map
  const votes = {}, locked = {}
  for (const row of data) {
    if (!votes[row.user_name]) votes[row.user_name] = {}
    votes[row.user_name][row.pres_id] = row.score
    if (row.locked) {
      if (!locked[row.user_name]) locked[row.user_name] = {}
      locked[row.user_name][row.pres_id] = true
    }
  }
  return { votes, locked }
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

// ─── LOAD ALL STATE ───────────────────────────────────────────────────────────
export async function loadAllFromSupabase() {
  const [evaluators, attendees, pendingAttendees, voteData] = await Promise.all([
    getEvaluators(),
    getAttendees(),
    getPendingAttendees(),
    getVotes(),
  ])
  return {
    evaluators: evaluators.map(e => e.name),
    registeredEvaluators: evaluators,
    attendees,
    pendingAttendees,
    votes: voteData.votes || {},
    locked: voteData.locked || {},
  }
}

// ─── REALTIME SUBSCRIPTION ───────────────────────────────────────────────────
export function subscribeToChanges(onUpdate) {
  const channel = supabase.channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, onUpdate)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'evaluators' }, onUpdate)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'attendees' }, onUpdate)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pending_attendees' }, onUpdate)
    .subscribe()
  return () => supabase.removeChannel(channel)
}

// ─── PENDING ATTENDEES ────────────────────────────────────────────────────────
export async function getPendingAttendees() {
  const { data, error } = await supabase.from('pending_attendees').select('*').order('requested_at')
  if (error) { console.error('getPendingAttendees:', error); return [] }
  return data
}

export async function insertPendingAttendee(att) {
  const { error } = await supabase.from('pending_attendees').insert({
    name: att.name, inst: att.inst || '', country: att.country || '', pass: att.pass
  })
  if (error) { console.error('insertPendingAttendee:', error); throw error }
}

export async function approvePendingAttendee(id, att) {
  // Add to attendees table
  const { error: e1 } = await supabase.from('attendees').upsert({
    name: att.name, inst: att.inst, country: att.country, pass: att.pass
  })
  if (e1) { console.error('approvePendingAttendee upsert:', e1); throw e1 }
  // Remove from pending
  const { error: e2 } = await supabase.from('pending_attendees').delete().eq('id', id)
  if (e2) console.error('approvePendingAttendee delete:', e2)
}

export async function rejectPendingAttendee(id) {
  const { error } = await supabase.from('pending_attendees').delete().eq('id', id)
  if (error) console.error('rejectPendingAttendee:', error)
}
