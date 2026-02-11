<template>
  <aside class="flex flex-col h-full bg-white">
    <div class="p-4 bg-gray-50 border-b">
      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Vos Caractéristiques
      </h3>

      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="(config, key) in statConfigs"
          :key="key"
          class="flex flex-col items-center justify-center p-2 rounded-lg border shadow-sm transition-transform hover:scale-105"
          :class="config.bgClass"
        >
          <span class="text-xl mb-1">{{ config.icon }}</span>
          <span class="text-xs font-semibold uppercase opacity-70">{{ config.label }}</span>
          <span class="text-xl font-bold" :class="config.textClass">
            {{ stats[key] || 0 }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex-1 p-4 overflow-y-auto">
      <h3
        class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex justify-between items-center"
      >
        Sacoche
        <span class="text-gray-400 font-normal normal-case text-xs">
          {{ sortedInventory.length }} objet{{ sortedInventory.length > 1 ? 's' : '' }}
        </span>
      </h3>

      <div
        v-if="sortedInventory.length === 0"
        class="flex flex-col items-center justify-center py-10 text-gray-400 opacity-70"
      >
        <i class="pi pi-box text-4xl mb-2"></i>
        <p class="text-sm">Votre sac est vide.</p>
      </div>

      <ul v-else class="space-y-2">
        <li
          v-for="(item, index) in sortedInventory"
          :key="item?.id || index"
          class="group flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 hover:shadow-md transition-all bg-white"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
            >
              <i class="pi pi-tag text-xs"></i>
            </div>

            <div class="flex flex-col">
              <span class="font-medium text-gray-800">{{ displayName(item) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['use'])
const store = useStore()

// Récupération des données depuis le store
const inventory = computed(() => store.getters.inventory || [])
const stats = computed(() => store.getters.stats || {})

// Configuration visuelle des stats pour un rendu joli
const statConfigs = {
  FOR: {
    label: 'Force',
    icon: '💪',
    bgClass: 'bg-red-50 border-red-100 text-red-900',
    textClass: 'text-red-600',
  },
  DEX: {
    label: 'Dextérité',
    icon: '🏃',
    bgClass: 'bg-emerald-50 border-emerald-100 text-emerald-900',
    textClass: 'text-emerald-600',
  },
  INT: {
    label: 'Intelligence',
    icon: '🧠',
    bgClass: 'bg-indigo-50 border-indigo-100 text-indigo-900',
    textClass: 'text-indigo-600',
  },
}

// Tri alphabétique de l'inventaire
const sortedInventory = computed(() => {
  const list = Array.isArray(inventory.value) ? [...inventory.value] : []
  return list.sort((a, b) => {
    const nameA = displayName(a)
    const nameB = displayName(b)
    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' })
  })
})

function displayName(item) {
  if (typeof item === 'string') return item
  if (!item) return ''
  // Priorité : label > name > id > stringify
  return item.label || item.name || String(item.id ?? JSON.stringify(item))
}

function useItem(item) {
  emit('use', item)
}
</script>

<style scoped>
/* Scrollbar fine pour la liste d'inventaire si elle est très longue */
div::-webkit-scrollbar {
  width: 6px;
}
div::-webkit-scrollbar-track {
  background: #f1f1f1;
}
div::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
div::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
