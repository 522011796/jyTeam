/**
 * xcar.png 显示开关插件
 *
 * 通过 localStorage 持久化，提供响应式状态：
 *   $xcarEnabled — 当前是否显示
 *   $toggleXcar — 切换开关
 */

import Vue from 'vue'

const KEY = 'xcar_enabled'

export default (ctx, inject) => {
  if (!process.client) {
    inject('xcarEnabled', false)
    inject('toggleXcar', () => {})
    return
  }

  const state = Vue.observable({
    enabled: localStorage.getItem(KEY) === 'true'
  })

  inject('xcarEnabled', () => state.enabled)
  inject('toggleXcar', (val) => {
    state.enabled = val
    localStorage.setItem(KEY, val ? 'true' : 'false')
  })
}
