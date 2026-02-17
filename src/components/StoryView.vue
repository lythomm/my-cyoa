<script setup>
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { story } from '../data/story'
import InventoryPanel from '../components/InventoryPanel.vue'
import { Button, Dialog, Drawer, useToast, Toast } from 'primevue'
import { itemsDb } from '../data/items'

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
const isDamageFlash = ref(false)

function clearTypewriterTimers() {
  while (timeouts.length) clearTimeout(timeouts.pop())
}

// Getters / state
const currentNode = computed(() => store.getters.currentNode)
const visibleChoices = computed(() => store.getters.visibleChoices)
const vars = computed(() => store.state.vars)
const stats = computed(() => store.getters.stats || {})

// --- NOUVELLE FONCTION : Calculer les prérequis manquants ---
function getMissingReasons(ch) {
  if (!ch.require || ch.require.length === 0) return ''

  // On récupère les variables actuelles
  const v = store.state.vars

  // On filtre pour garder uniquement les conditions qui NE SONT PAS remplies
  const missing = ch.require.filter((req) => {
    const currentVal = v[req.var]

    switch (req.op) {
      case '>=':
        return (Number(currentVal) || 0) < Number(req.value)
      case '<=':
        return (Number(currentVal) || 0) > Number(req.value)
      case '>':
        return (Number(currentVal) || 0) <= Number(req.value)
      case '<':
        return (Number(currentVal) || 0) >= Number(req.value)
      case '==':
        return currentVal !== req.value
      case '!=':
        return currentVal === req.value
      case 'includes':
        return !Array.isArray(currentVal) || !currentVal.includes(req.value)
      case 'truthy':
        return !currentVal
      case 'falsy':
        return !!currentVal
      default:
        return false
    }
  })

  // On formate le texte pour l'utilisateur
  return missing
    .map((req) => {
      // Cas spécifiques pour un affichage joli
      if (req.var === 'inventory' && req.op === 'includes') return `Objet : ${req.value}`
      if (req.var === 'FOR') return `Force ${req.value}`
      if (req.var === 'DEX') return `Dextérité ${req.value}`
      if (req.var === 'INT') return `Intelligence ${req.value}`

      // Fallback générique
      if (req.op === 'truthy') return `Condition : ${req.var}`
      return `${req.var} ${req.op.replace('>=', '≥')} ${req.value}`
    })
    .join(', ')
}

// Actions
function pick(ch) {
  if (ch.effects) {
    for (const effect of ch.effects) {
      if (effect?.var === 'inventory' && effect?.op === 'push') {
        // On récupère le vrai nom de l'objet via la base de données
        const itemData = itemsDb[effect.value]
        const itemName = itemData ? itemData.name : effect.value
        const itemIcon = itemData ? itemData.icon : ''

        toast.add({
          severity: 'success',
          summary: 'Nouvel objet obtenu',
          detail: `${itemIcon} ${itemName}`,
          life: 4000,
        })
      }
    }
  }
  store.dispatch('go', { to: ch.to, effects: ch.effects || [] })
}

function restart() {
  showRestartDialog.value = false
  store.dispatch('restart')
  router.replace({ path: '/' }) // ou name: 'home' selon ta config
}

// Watchers pour la navigation et l'effet machine à écrire
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

// Watcher pour détecter la baisse de HP
watch(
  () => stats.value.HP,
  (newHP, oldHP) => {
    if (newHP < oldHP) {
      isDamageFlash.value = true
      // On retire l'effet après 500ms (durée de l'animation)
      setTimeout(() => {
        isDamageFlash.value = false
      }, 500)
    }
  }
)
</script>

<template>
  <div v-if="isDamageFlash" class="damage-flash-overlay"></div>

  <main class="max-w-2xl mx-auto p-6 flex flex-col min-h-screen">
    <Toast class="!w-2/3" />

    <section class="bg-gray-100 rounded-lg p-6 mb-6 shadow-sm min-h-[150px]">
      <p class="whitespace-pre-line text-lg leading-relaxed text-gray-800" v-html="shownText"></p>
    </section>

    <ul class="space-y-3 pb-24 flex-1">
      <li v-for="(ch, idx) in visibleChoices" :key="idx">
        <button
          class="w-full text-left px-5 py-4 border-2 rounded-lg transition-all duration-200 relative overflow-hidden group"
          :class="[
            ch._enabled
              ? 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-800'
              : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-80',
          ]"
          :disabled="typing || ch._enabled === false"
          @click="pick(ch)"
        >
          <div class="space-y-2">
            <div class="font-medium">{{ ch.text }}</div>

            <div
              v-if="ch._enabled === false"
              class="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 w-auto"
            >
              🔒 {{ getMissingReasons(ch) }}
            </div>
          </div>
        </button>
      </li>

      <li v-if="currentNode && currentNode.choices.length === 0">
        <button
          class="w-full px-5 py-4 border-2 border-black bg-black text-white rounded-lg hover:bg-gray-800 font-bold"
          @click="restart"
        >
          Fin de l'histoire — Rejouer
        </button>
      </li>
    </ul>

    <div
      class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t shadow-lg px-6 py-4 z-10"
    >
      <div class="max-w-2xl mx-auto">
        <div
          class="flex justify-between items-center mb-4 text-sm font-bold p-2 rounded-md transition-all duration-300"
          :class="[
            stats.HP < 5
              ? 'bg-red-100 text-red-700 animate-pulse-slow shadow-lg'
              : 'bg-gray-100 text-gray-600',
          ]"
        >
          <div class="flex gap-1 items-center" v-if="stats.HP !== undefined">
            <i
              v-for="n in 10"
              :key="n"
              class="pi text-xs transition-transform duration-200"
              :class="[
                // Coeur plein vs vide
                n <= (stats.HP || 0) ? 'pi-heart-fill text-red-500' : 'pi-heart text-gray-300',
                // Animation si HP bas et coeur plein
                { 'animate-pulse': stats.HP < 5 && n <= stats.HP },
              ]"
            >
            </i>
          </div>

          <div :class="{ 'animate-bounce': stats.HP < 5 }">{{ stats.HP }} / 10</div>
        </div>

        <div class="flex justify-between items-center">
          <Button
            label="Inventaire"
            icon="pi pi-briefcase"
            @click="showInventory = true"
            severity="secondary"
            text
            :badge="vars.inventory?.length ? vars.inventory.length.toString() : null"
            badgeSeverity="contrast"
          />

          <Button
            icon="pi pi-refresh"
            @click="showRestartDialog = true"
            severity="danger"
            text
            rounded
            aria-label="Recommencer"
          />
        </div>
      </div>
    </div>

    <Drawer
      v-model:visible="showInventory"
      header="Inventaire"
      position="bottom"
      style="height: auto"
    >
      <InventoryPanel />
    </Drawer>

    <Dialog
      v-model:visible="showRestartDialog"
      modal
      header="Recommencer l'aventure ?"
      :style="{ width: '90vw', maxWidth: '400px' }"
    >
      <p class="text-gray-600 mb-6">Toute votre progression sera perdue.</p>
      <div class="flex justify-end gap-2">
        <Button label="Annuler" severity="secondary" text @click="showRestartDialog = false" />
        <Button label="Confirmer" severity="danger" @click="restart()" />
      </div>
    </Dialog>
  </main>
</template>

<style scoped>
/* L'overlay du flash */
.damage-flash-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none; /* Laisse passer les clics */
  box-shadow: inset 0 0 60px rgba(220, 38, 38, 0.8); /* Rouge intense sur les bords */
  animation: flash-animation 0.5s ease-out forwards;
}

@keyframes flash-animation {
  0% {
    opacity: 0;
    box-shadow: inset 0 0 20px rgba(220, 38, 38, 0);
  }
  20% {
    opacity: 1;
    box-shadow: inset 0 0 100px rgba(220, 38, 38, 1);
  }
  100% {
    opacity: 0;
    box-shadow: inset 0 0 40px rgba(220, 38, 38, 0);
  }
}

/* Ajout d'un petit style pour lisser l'apparition du texte si besoin */
.whitespace-pre-line {
  min-height: 1.5em;
}
/* Animation douce pour le pulse des HP bas */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
.animate-pulse-slow {
  animation: pulse-slow 2s infinite;
}
</style>
