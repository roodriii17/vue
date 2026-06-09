<template>
  <div class="stats-bar">
    <div class="stats-info">
      <span class="pending-count">{{ pending }} of {{ total }} pending</span>
    </div>
    <button v-if="pending < total" @click="$emit('clear')" class="clear-btn">
      Clear completed
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  pending: Number,
  total: Number
});

defineEmits(['clear']);
</script>

<style scoped>
.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 20px 0;
  background-color: #2a2a2a;
  border-radius: 8px;
}

.stats-info {
  color: #cccccc;
  font-size: 1rem;
}

.pending-count {
  font-weight: bold;
  color: #ff6b6b;
}

.clear-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: #ff8888;
}
</style>