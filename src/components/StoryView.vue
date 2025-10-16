<script setup>
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { story } from '../data/story'
import InventoryPanel from '../components/InventoryPanel.vue'
import { Button, Dialog, Drawer, useToast, Toast } from 'primevue'

// Optionnel : si tu utilises la route /node/:id avec props
const props = defineProps({ id: { type: String, default: null } })

const store = useStore()
const router = useRouter()
const route = useRoute()
const shownText = ref('')
const typing = ref(false)
const timeouts = []
const speed = 8 // ms par caractères
const showInventory = ref(false)
const showRestartDialog = ref(false)
const toast = useToast()

function clearTypewriterTimers() {
  while (timeouts.length) clearTimeout(timeouts.pop())
}

// Getters / state
const currentNode = computed(() => store.getters.currentNode)
const visibleChoices = computed(() => store.getters.visibleChoices)
const vars = computed(() => store.state.vars)

// Actions
function pick(ch) {
  if (ch.effects) {
    for (const effect of ch.effects) {
      if (effect?.var === 'inventory') {
        toast.add({
          severity: 'info',
          summary: 'Nouvel objet',
          detail: `Tu as reçu ${effect.value} !`,
          life: 5000,
        })
      }
    }
  }
  store.dispatch('go', { to: ch.to, effects: ch.effects || [] })
  router.replace({ name: 'node', params: { id: store.state.currentNodeId } })
}

function restart() {
  showRestartDialog.value = false
  store.dispatch('restart')
  router.replace({ name: 'home' })
}

function load() {
  store.dispatch('load')
}

// Réagir au changement d'id (par route) — /#/node/:id
watch(
  () => route.params.id,
  (newId) => {
    if (!newId) return
    if (story.nodes[newId]) store.commit('SET_NODE', newId)
  },
  { immediate: true }
)

// Réagir au changement d'id (par prop) — au cas où tu passes :id en props
watch(
  () => props.id,
  (newId) => {
    if (!newId) return
    if (story.nodes[newId]) store.commit('SET_NODE', newId)
  },
  { immediate: true }
)

watch(
  () => route.params.id,
  (newId) => {
    if (newId && story.nodes[newId]) store.commit('SET_NODE', newId)
  },
  { immediate: true }
)

watch(
  () => currentNode.value?.text,
  (t) => {
    clearTypewriterTimers()
    const text = t || ''
    shownText.value = ''
    typing.value = true
    ;[...text].forEach((ch, i) => {
      timeouts.push(
        setTimeout(() => {
          shownText.value += ch
        }, i * speed)
      )
    })

    // Quand tout est affiché, on réactive les choix
    timeouts.push(
      setTimeout(
        () => {
          typing.value = false
        },
        text.length * speed + 5
      )
    )
  },
  { immediate: true }
)
</script>

<template>
  <main class="max-w-2xl mx-auto p-6">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">CYOA</h1>
      <div class="flex gap-2">
        <Toast class="!w-2/3" />
        <Button icon="pi pi-box" @click="showInventory = true" />

        <!-- INVENTORY -->
        <Drawer v-model:visible="showInventory" header="Inventaire" position="bottom">
          <InventoryPanel />
        </Drawer>

        <Button icon="pi pi-refresh" @click="showRestartDialog = true" severity="contrast" />

        <Dialog
          v-model:visible="showRestartDialog"
          modal
          header="Recommencer"
          :style="{ width: '25rem', margin: '1.5rem' }"
        >
          <span>Recommencer l'histoire ?</span>
          <div class="flex justify-end gap-2 mt-8">
            <Button
              type="button"
              label="Annuler"
              severity="secondary"
              @click="showRestartDialog = false"
            ></Button>
            <Button type="button" label="Recommencer" @click="restart()"></Button>
          </div>
        </Dialog>
        <!-- <button class="px-3 py-1 border rounded" @click="load">Charger</button> -->
      </div>
    </header>

    <section class="bg-gray-100 rounded p-4 mb-4">
      <p class="whitespace-pre-line" v-html="shownText"></p>
    </section>

    <ul class="space-y-2">
      <li v-for="(ch, idx) in visibleChoices" :key="idx">
        <button
          class="w-full text-left px-4 py-3 border rounded hover:bg-gray-50 disabled:opacity-50"
          :disabled="typing || ch._enabled === false"
          @click="pick(ch)"
        >
          {{ ch.text }}
          <span v-if="ch._enabled === false" class="text-xs text-gray-500">(indisponible)</span>
        </button>
      </li>

      <li v-if="currentNode.choices.length === 0">
        <button class="px-4 py-3 border rounded" @click="restart">Fin — Rejouer</button>
      </li>
    </ul>

    <!-- <aside class="mt-8 text-sm text-gray-600">
      <h2 class="font-medium mb-1">Variables (debug)</h2>
      <pre class="bg-white border rounded p-3 overflow-auto">{{ vars }}</pre>
    </aside> -->
  </main>
</template>
