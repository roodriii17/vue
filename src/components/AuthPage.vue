<template>
  <div class="auth-container">
    <div class="auth-card">
      <header class="auth-header">
        <button @click="goBack" class="btn-back">← Volver</button>
        <div class="logo"> Notas de Vue</div>
        <h2>{{ isLoginMode ? '¡Hola de nuevo!' : 'Crea tu cuenta' }}</h2>
        <p class="subtitle">{{ isLoginMode ? 'Introduce tu email y contraseña para continuar' : 'Unete ahora' }}</p>
      </header>

      <form @submit.prevent="handleManualAuth" class="auth-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="authForm.email" 
            type="email" 
            placeholder=""
            required
          />
        </div>
        
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input 
            id="password"
            v-model="authForm.password" 
            type="password" 
            placeholder=""
            required
          />
        </div>

        <button type="submit" class="btn-auth-primary">
          {{ isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="separator">
        <span>O continúa con</span>
      </div>

      <div class="social-grid">
        <button @click="loginWithSocial(googleProvider)" class="btn-social google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
          Google
        </button>
        <button @click="loginWithSocial(githubProvider)" class="btn-social github">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub">
          GitHub
        </button>
      </div>

      <footer class="auth-footer">
        <p @click="isLoginMode = !isLoginMode" class="toggle-auth">
          {{ isLoginMode ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Identifícate' }}
        </p>
      </footer>
      
      <transition name="fade">
        <p v-if="authError" class="error-msg">{{ authError }}</p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, googleProvider, githubProvider } from '../firebase.js'
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const isLoginMode = ref(true)
const authError = ref('')
const authForm = ref({ email: '', password: '' })

const goBack = () => router.push('/')

const handleManualAuth = async () => {
  authError.value = ''
  try {
    if (isLoginMode.value) {
      await signInWithEmailAndPassword(auth, authForm.value.email, authForm.value.password)
    } else {
      await createUserWithEmailAndPassword(auth, authForm.value.email, authForm.value.password)
    }
    router.push('/notes')
  } catch (err) {
    authError.value = "Error: Credenciales inválidas"
  }
}

const loginWithSocial = async (provider) => {
  try {
    await signInWithPopup(auth, provider)
    router.push('/notes')
  } catch (err) {
    authError.value = "Error al iniciar sesipn"
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #1a1a1a;
}

.auth-card {
  background: #242424;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
}

.btn-back {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  margin-bottom: 20px;
  transition: color 0.3s;
}

.btn-back:hover { color: #1abc9c; }

.logo {
  font-size: 1.5rem;
  margin-bottom: 10px;
  text-align: center;
}

h2 {
  color: #fff;
  text-align: center;
  font-size: 1.8rem;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #888;
  text-align: center;
  font-size: 0.95rem;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  color: #ccc;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #1abc9c;
  box-shadow: 0 0 0 2px rgba(26, 188, 156, 0.2);
}

.btn-auth-primary {
  width: 100%;
  padding: 14px;
  background: #1abc9c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, background 0.3s;
  margin-top: 10px;
}

.btn-auth-primary:hover {
  background: #16a085;
  transform: translateY(-2px);
}

.separator {
  margin: 25px 0;
  position: relative;
  text-align: center;
}

.separator::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #333;
}

.separator span {
  background: #242424;
  padding: 0 15px;
  color: #666;
  font-size: 0.8rem;
  position: relative;
}

.social-grid {
  display: flex;
  gap: 15px;
}

.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-social img { width: 18px; height: 18px; }

.btn-social:hover { background: #383838; border-color: #666; }

.github img { filter: invert(1); }

.toggle-auth {
  margin-top: 25px;
  text-align: center;
  color: #1abc9c;
  cursor: pointer;
  font-size: 0.9rem;
}

.toggle-auth:hover { text-decoration: underline; }

.error-msg {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-size: 0.85rem;
  margin-top: 20px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>