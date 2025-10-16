import { createRouter, createWebHashHistory } from 'vue-router'
import StoryView from '../components/StoryView.vue'

const routes = [
  { path: '/', name: 'home', component: StoryView },
  // Lien partageable vers un nœud : /#/node/intro
  { path: '/node/:id', name: 'node', component: StoryView, props: true },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
