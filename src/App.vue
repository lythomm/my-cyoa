<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showCountdown = ref(false)
const endDate = new Date('2025-10-30T09:00:00') // Date de fin du compte à rebours
const timeRemaining = ref(0)
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

// Fonction pour calculer le compte à rebours
const updateCountdown = () => {
  const now = new Date()
  timeRemaining.value = endDate - now // Calculer le temps restant

  if (timeRemaining.value <= 0) {
    clearInterval(timer)
    return
  }

  days.value = Math.floor(timeRemaining.value / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((timeRemaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((timeRemaining.value % (1000 * 60)) / 1000)
}

// Démarrer le compte à rebours
let timer
onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000) // Met à jour chaque seconde
})

// Arrêter le compte à rebours lors de la destruction du composant
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div v-if="showCountdown" class="flex justify-center items-center h-screen">
    <div>
      <p class="text-xl text-center mb-8">Disponible dans</p>
      <div v-if="timeRemaining > 0" class="flex gap-6">
        <div class="flex flex-col space-y-2">
          <span class="text-center text-3xl font-medium">{{ days }}</span>
          <span>JOURS</span>
        </div>
        <div class="flex flex-col space-y-2">
          <span class="text-center text-3xl font-medium">{{ hours }}</span>
          <span>HEURES</span>
        </div>
        <div class="flex flex-col space-y-2">
          <span class="text-center text-3xl font-medium">{{ minutes }}</span>
          <span>MINUTES</span>
        </div>
        <div class="flex flex-col space-y-2">
          <span class="text-center text-3xl font-medium">{{ seconds }}</span>
          <span>SECONDES</span>
        </div>
      </div>
    </div>
  </div>
  <router-view v-else />
</template>
