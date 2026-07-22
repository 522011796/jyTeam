/*
 * Vuex Store — 全局状态管理
 * 管理菜单开关、当前语言、任务数据等全局状态
 */
export const state = () => ({
  menuOpen: false,
  locale: 'zh',
  siteLoading: true
})

export const mutations = {
  toggleMenu(state) {
    state.menuOpen = !state.menuOpen
  },
  closeMenu(state) {
    state.menuOpen = false
  },
  setLocale(state, locale) {
    state.locale = locale
  },
  setLoading(state, value) {
    state.siteLoading = value
  }
}

export const getters = {
  menuOpen: state => state.menuOpen,
  locale: state => state.locale,
  siteLoading: state => state.siteLoading
}

export const actions = {
  nuxtServerInit({ commit }) {
    commit('setLoading', false)
  }
}
