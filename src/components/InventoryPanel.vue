<template>
  <aside class="flex flex-col h-full max-h-[85vh] bg-white relative">
    <div class="p-4 bg-gray-50 border-b shrink-0">
      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Vos Caractéristiques
      </h3>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="(config, key) in statConfigs"
          :key="key"
          class="flex flex-col items-center justify-center p-2 rounded-lg border shadow-sm"
          :class="config.bgClass"
        >
          <span class="text-xl mb-1">{{ config.icon }}</span>
          <span class="text-xs font-semibold uppercase opacity-70">{{ config.label }}</span>
          <span class="text-xl font-bold" :class="config.textClass">{{ stats[key] || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="flex-1 p-4 overflow-y-auto max-h-[50vh] scroll-smooth">
      <h3
        class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex justify-between items-center sticky -top-4 bg-white z-10 py-3"
      >
        Sacoche
        <span class="text-gray-400 font-normal normal-case text-xs">
          {{ populatedInventory.length }} objet{{ populatedInventory.length > 1 ? 's' : '' }}
        </span>
      </h3>

      <div
        v-if="populatedInventory.length === 0"
        class="flex flex-col items-center justify-center py-10 text-gray-400 opacity-70"
      >
        <i class="pi pi-box text-4xl mb-2"></i>
        <p class="text-sm mt-2">Votre sac est vide.</p>
      </div>

      <ul v-else class="grid grid-cols-1 gap-3 pb-4">
        <li v-for="item in populatedInventory" :key="item.id">
          <button
            class="w-full flex items-center gap-3 p-3 border-l-4 rounded-lg transition-transform duration-100 bg-white text-left shadow-sm active:scale-[0.98]"
            :class="[
              getRarityConfig(item.rarity).borderClass,
              getRarityConfig(item.rarity).activeBgClass,
            ]"
            @click="openItemDetails(item)"
          >
            <div
              class="w-10 h-10 shrink-0 rounded flex items-center justify-center text-xl shadow-inner border"
              :class="[
                getRarityConfig(item.rarity).iconBgClass,
                getRarityConfig(item.rarity).borderClass,
              ]"
            >
              {{ item.icon || '📦' }}
            </div>

            <div class="flex flex-col flex-1">
              <span class="font-bold text-sm" :class="getRarityConfig(item.rarity).textClass">
                {{ item.name }}
              </span>
              <span class="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                {{ getRarityConfig(item.rarity).label }}
              </span>
            </div>

            <i class="pi pi-chevron-right text-gray-300 text-xs"></i>
          </button>
        </li>
      </ul>
    </div>

    <Dialog
      v-model:visible="isModalVisible"
      modal
      :header="selectedItem?.name || 'Détails'"
      :style="{ width: '90vw', maxWidth: '400px' }"
      :closable="true"
      :dismissableMask="true"
      appendTo="body"
    >
      <template #header>
        <div class="flex flex-col">
          <span
            class="text-xl font-bold"
            :class="selectedItem ? getRarityConfig(selectedItem.rarity).textClass : ''"
          >
            {{ selectedItem?.name }}
          </span>
          <span
            class="text-xs uppercase font-bold tracking-widest opacity-70"
            :class="selectedItem ? getRarityConfig(selectedItem.rarity).textClass : ''"
          >
            {{ selectedItem ? getRarityConfig(selectedItem.rarity).label : '' }}
          </span>
        </div>
      </template>

      <div v-if="selectedItem" class="flex flex-col items-center pt-6 pb-2">
        <div
          class="w-28 h-28 rounded-xl flex items-center justify-center text-6xl mb-8 relative border-2"
          :class="[
            getRarityConfig(selectedItem.rarity).iconBgClass,
            getRarityConfig(selectedItem.rarity).borderClass,
            getRarityConfig(selectedItem.rarity).glowClass,
          ]"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl pointer-events-none"
          ></div>
          {{ selectedItem.icon || '📦' }}
        </div>

        <p class="text-gray-700 text-center leading-relaxed text-base px-4 border-t pt-6 w-full">
          {{ selectedItem.description }}
        </p>
      </div>
    </Dialog>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { itemsDb } from '../data/items'
import Dialog from 'primevue/dialog'

const store = useStore()
const stats = computed(() => store.getters.stats || {})
const inventoryIds = computed(() => store.getters.inventory || [])

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

// Remplacement des hoverBgClass par activeBgClass pour le mobile
const rarityMap = {
  commun: {
    label: 'Commun',
    borderClass: 'border-gray-400',
    textClass: 'text-gray-700',
    iconBgClass: 'bg-gray-100',
    activeBgClass: 'active:bg-gray-200',
    glowClass: 'shadow-[0_0_15px_rgba(156,163,175,0.3)]',
  },
  peu_commun: {
    label: 'Peu Commun',
    borderClass: 'border-blue-400',
    textClass: 'text-blue-700',
    iconBgClass: 'bg-blue-50',
    activeBgClass: 'active:bg-blue-100',
    glowClass: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
  },
  rare: {
    label: 'Rare',
    borderClass: 'border-yellow-400',
    textClass: 'text-yellow-600',
    iconBgClass: 'bg-yellow-50',
    activeBgClass: 'active:bg-yellow-100',
    glowClass: 'shadow-[0_0_25px_rgba(234,179,8,0.5)]',
  },
  legendaire: {
    label: 'Légendaire',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-600',
    iconBgClass: 'bg-orange-50',
    activeBgClass: 'active:bg-orange-100',
    glowClass: 'shadow-[0_0_30px_rgba(249,115,22,0.6)]',
  },
  mythique: {
    label: 'Mythique',
    borderClass: 'border-fuchsia-500',
    textClass: 'text-fuchsia-600',
    iconBgClass: 'bg-fuchsia-50',
    activeBgClass: 'active:bg-fuchsia-100',
    glowClass: 'shadow-[0_0_35px_rgba(217,70,239,0.7)] animate-pulse',
  },
}

function getRarityConfig(rarityCode) {
  return rarityMap[rarityCode] || rarityMap['commun']
}

const populatedInventory = computed(() => {
  return inventoryIds.value
    .map((id) => {
      return (
        itemsDb[id] || {
          id: id,
          name: id,
          description: 'Cet objet est un mystère.',
          icon: '❓',
          rarity: 'commun',
        }
      )
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
})

const isModalVisible = ref(false)
const selectedItem = ref(null)

function openItemDetails(item) {
  selectedItem.value = item
  isModalVisible.value = true
}
</script>

<style scoped>
:deep(.p-dialog-header) {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}
:deep(.p-dialog-content) {
  padding-bottom: 2rem;
}
</style>
