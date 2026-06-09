import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <--- IMPORTANTE

const app = createApp(App)
app.use(router) // <--- ESTO ES LO QUE ACTIVA EL ROUTER
app.mount('#app')