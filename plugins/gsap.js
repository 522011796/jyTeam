/*
 * GSAP 全局插件 — 注册 ScrollTrigger
 * 在客户端可用时初始化，避免 SSR 报错
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

export default ({ app }, inject) => {
  inject('gsap', gsap)
  inject('ScrollTrigger', ScrollTrigger)
}
