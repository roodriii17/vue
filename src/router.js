import { createRouter, createWebHashHistory } from 'vue-router'

// Importamos tus componentes
import LandingPage from './components/LandingPage.vue'
import AuthPage from './components/AuthPage.vue'
import NotesPage from './components/NotesPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: LandingPage },
    { path: '/login', component: AuthPage },
    { path: '/notes', component: NotesPage }
  ]
})

export default router