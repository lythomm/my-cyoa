<template>
  <aside>
    <div v-if="sortedInventory.length === 0" class="text-sm text-gray-500">Aucun objet.</div>
    <ul v-else class="grid grid-cols-1 gap-2">
      <li
        v-for="item in sortedInventory"
        :key="item?.id || item"
        class="flex items-center justify-between"
      >
        <span>{{ displayName(item) }}</span>
        <!--
        <button
          class="text-sm px-2 py-1 border rounded hover:bg-gray-50"
          @click="useItem(item)"
        >
          Utiliser
        </button>
        -->
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['use'])
const store = useStore()

const inventory = computed(() => store.getters.inventory || [])

const sortedInventory = computed(() => {
  const list = Array.isArray(inventory.value) ? [...inventory.value] : []
  return list.sort((a, b) => {
    const nameA = typeof a === 'string' ? a : a && (a.name || String(a.id) || JSON.stringify(a))
    const nameB = typeof b === 'string' ? b : b && (b.name || String(b.id) || JSON.stringify(b))
    return String(nameA).localeCompare(String(nameB), undefined, { sensitivity: 'base' })
  })
})

function displayName(item) {
  if (typeof item === 'string') return item
  if (!item) return ''
  return item.name ?? String(item.id ?? JSON.stringify(item))
}

function useItem(item) {
  emit('use', item)
}
</script>
