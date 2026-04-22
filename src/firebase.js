import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBUzXWVdprS2NNdUBMyCbbE9YWn9SrAJLQ",
  authDomain: "proteovilamoura.firebaseapp.com",
  databaseURL: "https://proteovilamoura-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "proteovilamoura",
  storageBucket: "proteovilamoura.firebasestorage.app",
  messagingSenderId: "401607696447",
  appId: "1:401607696447:web:96ea75087c6c1fd448d88a"
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export const EMPTY_STATE = {
  votes: {},
  locked: {},
  editRequests: [],
  evaluators: [],
  attendees: [],
  registeredEvaluators: [],
  funFacts: [],
  bingoCards: {},
}

export async function loadFromFirebase() {
  try {
    const snap = await get(ref(db, 'state'))
    if (snap.exists()) return { ...EMPTY_STATE, ...snap.val() }
  } catch (e) { console.warn('Firebase load error:', e) }
  return EMPTY_STATE
}

export async function saveToFirebase(state) {
  try {
    await set(ref(db, 'state'), { ...state, lastUpdated: Date.now() })
  } catch (e) { console.warn('Firebase save error:', e) }
}

export function listenFirebase(callback) {
  return onValue(ref(db, 'state'), (snap) => {
    if (snap.exists()) callback({ ...EMPTY_STATE, ...snap.val() })
  })
}
