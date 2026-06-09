<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Si el usuario está logueado, vamos a las notas
      router.push('/notes')
    } else {
      // Si no hay usuario y no estamos en la landing, volvemos al inicio
      if (window.location.hash !== '#/') {
        router.push('/')
      }
    }
  })
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>