export default {
  ssr: false,
  target: 'static',

  server: {
    host: '0.0.0.0',
    port: 7777
  },

  // 管理后台 API 中间件（仅 dev 模式生效）
  serverMiddleware: [
    { path: '/api', handler: '~/server-middleware/admin.js' }
  ],

  head: {
    title: '全域救援 — Digital Basecamp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { hid: 'description', name: 'description', content: '全域救援 — 民间救援组织。有人呼救。我们出发。' }
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
    ]
  },

  css: [
    '@/assets/styles/variables.css',
    '@/assets/styles/typography.css',
    '@/assets/styles/transitions.css',
    '@/assets/styles/main.css'
  ],

  plugins: [
    '@/plugins/gsap',
    '@/plugins/api',
    '@/plugins/xcar'
  ],

  modules: [
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'zh', iso: 'zh-TW', name: '中文', file: 'zh.js' }
    ],
    defaultLocale: 'zh',
    lazy: true,
    langDir: 'i18n/',
    vueI18n: {
      fallbackLocale: 'zh'
    },
    detectBrowserLanguage: false,
    strategy: 'no_prefix'
  },

  loading: {
    color: '#1A1A1A',
    height: '1px',
    continuous: true
  },

  pageTransition: {
    name: 'page',
    mode: 'out-in'
  },

  build: {
    babel: {
      presets({ isServer }) {
        const targets = isServer
          ? { node: 'current' }
          : { esmodules: true }
        return [[
          '@nuxt/babel-preset-app',
          {
            targets,
            useBuiltIns: false
          }
        ]]
      }
    },
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.devtool = 'eval-source-map'
      }
    }
  }
}
