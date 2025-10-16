import { createStore } from 'vuex'
import { story } from '../data/story'

const SAVE_KEY = 'cya-save-v1'

function evaluateCondition(vars, c) {
  const v = vars[c.var]
  switch (c.op) {
    case 'truthy':
      return Boolean(v)
    case 'falsy':
      return !Boolean(v)
    case '==':
      return v === c.value
    case '!=':
      return v !== c.value
    case '>=':
      return Number(v) >= Number(c.value)
    case '<=':
      return Number(v) <= Number(c.value)
    case '>':
      return Number(v) > Number(c.value)
    case '<':
      return Number(v) < Number(c.value)
    case 'includes':
      return Array.isArray(v) && v.includes(c.value)
    default:
      return false
  }
}

function arrayIncludesById(arr, item) {
  if (!Array.isArray(arr)) return false
  const id = item && item.id
  return arr.some((x) => (x && x.id) === id)
}

function arrayRemoveById(arr, item) {
  if (!Array.isArray(arr)) return arr
  const id = item && item.id
  return arr.filter((x) => (x && x.id) !== id)
}

function applyEffect(vars, e) {
  const out = { ...vars }
  const current = out[e.var]
  switch (e.op) {
    case 'set':
      out[e.var] = e.value
      break
    case 'inc':
      out[e.var] = Number(current || 0) + 1
      break
    case 'dec':
      out[e.var] = Number(current || 0) - 1
      break
    case 'toggle':
      out[e.var] = !Boolean(current)
      break
    case 'push':
      out[e.var] = Array.isArray(current) ? [...current, e.value] : [e.value]
      break
    case 'remove':
      // support arrays d'objets inventaire via id
      out[e.var] = Array.isArray(current)
        ? typeof e.value === 'object' && e.value?.id != null
          ? arrayRemoveById(current, e.value)
          : current.filter((x) => x !== e.value)
        : current
      break
  }
  return out
}

export default createStore({
  state: {
    currentNodeId: story.start,
    vars: { ...(story.initialVars || {}) },
    history: [],
  },
  getters: {
    inventory: (state) => state.vars.inventory || [],
    currentNode: (state) => story.nodes[state.currentNodeId],
    visibleChoices: (state, getters) => {
      const node = getters.currentNode
      return node.choices.map((ch) => ({
        ...ch,
        _enabled: (ch.require || []).every((cond) => evaluateCondition(state.vars, cond)),
      }))
    },
  },
  mutations: {
    SET_NODE(state, id) {
      state.currentNodeId = id
    },
    SET_VARS(state, newVars) {
      state.vars = newVars
    },
    PUSH_HISTORY(state, id) {
      state.history.push(id)
    },
    RESET(state) {
      state.currentNodeId = story.start
      state.vars = { ...(story.initialVars || {}) }
      state.history = []
    },
  },
  actions: {
    go({ commit, state }, { to, effects = [] }) {
      commit('PUSH_HISTORY', state.currentNodeId)
      let nextVars = { ...state.vars }
      for (const e of effects) nextVars = applyEffect(nextVars, e)
      commit('SET_VARS', nextVars)
      commit('SET_NODE', to)
      this.dispatch('save')
    },
    restart({ commit, dispatch }) {
      commit('RESET')
      dispatch('save')
    },
    save({ state }) {
      const payload = {
        currentNodeId: state.currentNodeId,
        vars: state.vars,
        history: state.history,
      }
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
    },
    load({ commit }) {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return false
      try {
        const data = JSON.parse(raw)
        commit('SET_NODE', data.currentNodeId || story.start)
        commit('SET_VARS', data.vars || story.initialVars || {})
        // on pourrait restaurer l'historique si souhaité
        return true
      } catch {
        return false
      }
    },
    addItem({ state, commit, dispatch }, item) {
      const inv = Array.isArray(state.vars.inventory) ? state.vars.inventory : []
      const next = arrayIncludesById(inv, item) ? inv : [...inv, item]
      commit('SET_VARS', { ...state.vars, inventory: next })
      dispatch('save')
    },
    removeItem({ state, commit, dispatch }, item) {
      const inv = Array.isArray(state.vars.inventory) ? state.vars.inventory : []
      const next = arrayRemoveById(inv, item)
      commit('SET_VARS', { ...state.vars, inventory: next })
      dispatch('save')
    },
  },
})
