<template>
  <div class="app-container">
    <nav class="user-island" v-if="currentUser">
      <div class="user-profile">
        <div class="avatar-wrapper">
          <img v-if="userPhoto" :src="userPhoto" class="avatar-img" />
          <div v-else class="avatar-placeholder">{{ currentUser.charAt(0).toUpperCase() }}</div>
          <span class="status-dot"></span>
        </div>
        <div class="user-info">
          <span class="user-name">{{ currentUser }}</span>
          <span class="user-status">En línea</span>
        </div>
      </div>
      <button @click="handleLogout" class="btn-logout-pill">Salir</button>
    </nav>

    <div class="todo-app">
      <header>
        <h1>📝 RecVue Cloud</h1>
        <input 
          v-model="newNoteText" 
          @keyup.enter="addNote" 
          placeholder="¿Qué quieres recordar?" 
          class="input-add" 
        />
      </header>

      <div class="stats-bar">
        <span>📊 {{ pendingCount }} de {{ notes.length }} pendientes</span>
        <button 
          v-if="pendingCount < notes.length"
          @click="deleteCompleted" 
          class="btn-clear-tasks"
        >
          ✖ Borrar completadas
        </button>
      </div>

      <div v-if="notes.length === 0" class="empty-state">
        <p>📭 No tienes notas. ¡Crea una nueva!</p>
      </div>

      <transition-group v-else name="list" tag="div" class="notes-container">
        <div 
          v-for="note in sortedNotes" 
          :key="note.id" 
          class="note-row" 
          :class="{ 'note-completed': note.completed }"
        >
          <div @click="toggleComplete(note)" class="check-icon">
            <span v-if="note.completed" class="check-mark">✔</span>
            <span v-else class="empty-circle"></span>
          </div>
          
          <div class="note-info">
            <h2 class="note-title">{{ note.text }}</h2>
            <div class="note-details">
              <span class="note-time">{{ formatTime(note.createdAt) }}</span>
              <div class="prio-buttons">
                <button 
                  v-for="(label, p) in ['Low', 'Normal', 'High']" 
                  :key="p"
                  @click="setPriority(note, p)" 
                  :class="['prio-btn', { active: note.priority === p }, label.toLowerCase()]"
                >
                  {{ label }}
                </button>
              </div>
            </div>
          </div>
          <button @click="deleteNote(note.id)" class="btn-delete-row">🗑</button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { auth, db } from '../firebase.js'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const userPhoto = ref(null)
const userUid = ref(null)
const notes = ref([])
const newNoteText = ref('')
let unsubscribe = null

const formatTime = (timestamp) => {
  if (!timestamp) return 'Hace poco'
  const now = Date.now()
  const diffMs = now - timestamp
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins <= 0) return 'Recién'
  if (diffMins < 60) return `Hace ${diffMins} min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`
  return new Date(timestamp).toLocaleDateString()
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user.displayName || user.email
      userUid.value = user.uid
      userPhoto.value = user.photoURL
      const q = query(collection(db, 'notes'), where('userId', '==', user.uid))
      unsubscribe = onSnapshot(q, (snapshot) => {
        notes.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      })
    } else {
      router.push('/login')
    }
  })
})

onUnmounted(() => { if (unsubscribe) unsubscribe() })

const addNote = async () => {
  if (!newNoteText.value.trim() || !userUid.value) return
  await addDoc(collection(db, 'notes'), {
    text: newNoteText.value,
    priority: 1,
    completed: false,
    createdAt: Date.now(),
    userId: userUid.value
  })
  newNoteText.value = ''
}

const deleteNote = (id) => deleteDoc(doc(db, 'notes', id))
const toggleComplete = (n) => updateDoc(doc(db, 'notes', n.id), { completed: !n.completed })
const setPriority = (n, p) => updateDoc(doc(db, 'notes', n.id), { priority: p })
const deleteCompleted = () => notes.value.filter(n => n.completed).forEach(n => deleteNote(n.id))

const sortedNotes = computed(() => 
  [...notes.value].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return b.priority - a.priority
  })
)

const pendingCount = computed(() => notes.value.filter(n => !n.completed).length)

const handleLogout = async () => {
  if (unsubscribe) unsubscribe()
  await signOut(auth)
  router.push('/')
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
  background-color: #1a1a1a;
}

/* --- ESTILO ISLA DE USUARIO --- */
.user-island {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2a2a2a;
  padding: 8px 15px;
  border-radius: 50px;
  max-width: 400px;
  margin: 0 auto 30px auto;
  border: 1px solid #444;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-wrapper {
  position: relative;
  display: flex;
}

.avatar-img, .avatar-placeholder {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1abc9c;
}

.avatar-placeholder {
  background: #3d3d3d;
  color: #1abc9c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #27ae60;
  border: 2px solid #2a2a2a;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  color: #1abc9c;
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: bold;
}

.btn-logout-pill {
  background: #3d3d3d;
  color: #eee;
  border: none;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-logout-pill:hover {
  background: #e74c3c;
  color: white;
}

/* --- CUERPO DE LA APP --- */
.todo-app {
  background-color: #242424;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  max-width: 650px;
  margin: 0 auto;
}

h1 { text-align: center; font-size: 2rem; font-weight: 300; color: white; margin-bottom: 25px; }

.input-add {
  width: 100%;
  padding: 15px 20px;
  background: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  margin-bottom: 20px;
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 20px;
}

.btn-clear-tasks { background: none; border: none; color: #f39c12; cursor: pointer; font-weight: bold; }

/* --- FILAS DE NOTAS --- */
.note-row {
  display: flex;
  align-items: center;
  background: #2d2d2d;
  margin-bottom: 10px;
  padding: 12px 18px;
  border-radius: 10px;
  border-left: 4px solid #444;
  transition: 0.3s;
}

/* Dinámica de bordes por prioridad */
.note-row:has(.high.active) { border-left-color: #e74c3c; }
.note-row:has(.normal.active) { border-left-color: #27ae60; }
.note-row:has(.low.active) { border-left-color: #3498db; }

.note-completed { opacity: 0.5; }
.check-mark { color: #1abc9c; font-size: 1.2rem; margin-right: 15px; }
.empty-circle {
  display: inline-block;
  width: 20px; height: 20px;
  border: 2px solid #555;
  border-radius: 50%;
  margin-right: 15px;
}

.note-info { flex-grow: 1; }
.note-title { font-size: 1.1rem; color: #eee; margin: 0; font-weight: 400; }
.note-completed .note-title { text-decoration: line-through; color: #1abc9c; }

.note-details { display: flex; align-items: center; gap: 15px; margin-top: 5px; }
.note-time { font-size: 0.7rem; color: #666; }

.prio-btn {
  background: #3d3d3d; border: none; color: #777;
  padding: 2px 8px; border-radius: 4px; font-size: 0.6rem;
  text-transform: uppercase; cursor: pointer;
}

.prio-btn.active.low { background: #3498db; color: white; }
.prio-btn.active.normal { background: #27ae60; color: white; }
.prio-btn.active.high { background: #e74c3c; color: white; }

.btn-delete-row {
  background: none; border: none; color: #555;
  font-size: 1.2rem; cursor: pointer;
}
.btn-delete-row:hover { color: #e74c3c; }

.list-enter-active, .list-leave-active { transition: all 0.3s; }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.95); }
</style>