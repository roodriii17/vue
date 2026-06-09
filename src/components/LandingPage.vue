<template>
  <div class="landing-wrapper">
    <div class="blob"></div>
    
    <main class="main-content">
      <div class="badge">v2.0 Cloud Sync</div>
      
      <h1 class="main-title">
        Tus notas. <br> 
        <span class="gradient-text">Sin líos.</span>
      </h1>
      
      <p class="description">
        RecVue es el rincón donde guardas lo que importa. 
        Rápido, bonito y siempre contigo.
      </p>

      <div class="cta-section">
        <button @click="goToLogin" class="btn-main">
          Entrar a mis notas
        </button>
        <p class="sub-text">No requiere tarjeta. Solo tu ganas de organizarte.</p>
      </div>

      <div class="mini-preview">
        <div class="card">✨ Comprar café</div>
        <div class="card">🚀 Proyecto Vue</div>
        <div class="card">🌙 Meditar 10min</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.landing-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #111; /* Negro casi total */
  color: #fff;
  overflow: hidden;
  position: relative;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Mancha de color de fondo sutil */
.blob {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(26, 188, 156, 0.15);
  filter: blur(80px);
  border-radius: 50%;
  z-index: 0;
  top: 10%;
  right: 10%;
}

.main-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 500px;
  padding: 20px;
}

.badge {
  display: inline-block;
  background: #222;
  color: #1abc9c;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid #333;
}

.main-title {
  font-size: 3.8rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 20px;
  letter-spacing: -2px;
}

.gradient-text {
  background: linear-gradient(90deg, #1abc9c, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  color: #999;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 40px;
}

.btn-main {
  background: #fff;
  color: #000;
  border: none;
  padding: 18px 40px;
  font-size: 1.1rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-main:hover {
  background: #1abc9c;
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(26, 188, 156, 0.3);
}

.sub-text {
  font-size: 0.8rem;
  color: #444;
  margin-top: 15px;
}

/* Estilo de las tarjetitas decorativas */
.mini-preview {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.card {
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #777;
  transform: rotate(-2deg);
}

.card:nth-child(2) {
  transform: rotate(3deg);
  color: #eee;
  border-color: #1abc9c;
}

.card:nth-child(3) {
  transform: rotate(-1deg);
}
</style>