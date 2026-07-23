<template>
  <header class="site-header" ref="header">
    <div class="header-inner">
      <div class="header-left">
        <NuxtLink to="/" class="header-logo" @click.native="closeMenu">
          <!-- Logo 占位区域 — 矩形，替换 src 即可 -->
          <div class="logo-mark">
<!--            <svg viewBox="0 0 40 24" class="logo-svg" aria-label="全域救援">-->
<!--              <path d="M2 22 L12 6 L20 18 L28 4 L38 22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--              <circle cx="20" cy="4" r="2" fill="currentColor"/>-->
<!--            </svg>-->
            <img src="~/static/images/teamLogoMini.PNG">
          </div>
          <span class="logo-text">全域救援</span>
          <img
            v-if="$xcarEnabled()"
            src="~/static/images/xcar.png"
            alt="xcar"
            class="logo-xcar"
          />
        </NuxtLink>
      </div>

      <div class="header-center">
        <div class="status-indicator" @click="handleSecretTap">
          <span class="status-dot" :class="{ 'secret-ready': secretUnlocked }"></span>
          <span class="status-label">{{ $t('site.status_ready') }}</span>
        </div>
        <a
          v-if="secretUnlocked"
          href="/admin"
          target="_blank"
          class="secret-admin-link"
          title="管理后台"
        >管理</a>
      </div>

      <div class="header-right">
        <button
          class="menu-toggle"
          @click="toggleMenu"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
        >
          <span class="menu-toggle-text">{{ menuOpen ? $t('nav.close') : $t('nav.menu') }}</span>
          <span class="menu-toggle-icon" :class="{ open: menuOpen }">
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

const SECRET_STORAGE_KEY = 'admin_secret_unlocked'
const TAP_TARGET = 10
const TAP_TIMEOUT_MS = 3000

export default {
  name: 'SiteHeader',
  data() {
    return {
      secretCount: 0,
      secretTimer: null,
      secretUnlocked: false
    }
  },
  computed: {
    ...mapGetters(['menuOpen'])
  },
  methods: {
    ...mapMutations(['toggleMenu', 'closeMenu']),
    handleSecretTap() {
      if (this.secretUnlocked) return
      if (!process.client) return

      clearTimeout(this.secretTimer)
      this.secretCount++
      this.secretTimer = setTimeout(() => { this.secretCount = 0 }, TAP_TIMEOUT_MS)

      if (this.secretCount >= TAP_TARGET) {
        this.secretUnlocked = true
        localStorage.setItem(SECRET_STORAGE_KEY, '1')
      }
    },
    handleScroll() {
      if (!this.$refs.header) return
      if (window.scrollY > 50) {
        this.$refs.header.classList.add('scrolled')
      } else {
        this.$refs.header.classList.remove('scrolled')
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    if (process.client && localStorage.getItem(SECRET_STORAGE_KEY)) {
      this.secretUnlocked = true
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    clearTimeout(this.secretTimer)
  }
}
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  padding: 0 var(--space-xl);
  height: 72px;
  display: flex;
  align-items: center;
  transition: background 400ms var(--ease-out-expo);
}

.site-header.scrolled {
  background: rgba(250, 250, 247, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  width: 100%;
  max-width: var(--container-wide);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  flex: 0 0 auto;
  min-width: 140px;
}

.header-right {
  flex: 0 0 auto;
  text-align: right;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--color-text);
}

.logo-mark {
  width: 80px;
  height: 44px;
  border: 0px solid var(--color-text);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  transition: border-color 300ms ease;
}

.header-logo:hover .logo-mark {
  border-color: var(--color-accent-alt);
}

.logo-svg {
  width: 32px;
  height: 18px;
  color: var(--color-text);
}

.logo-text {
  font-family: var(--font-zh);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.logo-xcar {
  height: 20px;
  width: auto;
  margin-left: 6px;
  vertical-align: middle;
}

/* Status */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  cursor: default;
  user-select: none;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-text);
  animation: status-pulse 2s ease-in-out infinite;
}

.status-dot.secret-ready {
  background: #D32F2F;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* Secret admin link */
.secret-admin-link {
  display: inline-flex;
  align-items: center;
  margin-left: 16px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #D32F2F;
  border: 1px solid #D32F2F;
  text-decoration: none;
  transition: background 200ms ease, color 200ms ease;
}

.secret-admin-link:hover {
  background: #D32F2F;
  color: #fff;
}

/* Menu toggle */
.menu-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: var(--color-text);
  font-family: var(--font-en);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  transition: color 300ms ease;
}

.menu-toggle:hover {
  color: var(--color-accent-alt);
}

.menu-toggle-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 20px;
}

.menu-toggle-icon span {
  display: block;
  height: 1.5px;
  background: currentColor;
  transition: transform 300ms var(--ease-out-expo), opacity 200ms ease;
  transform-origin: center;
}

.menu-toggle-icon span:first-child { width: 20px; }
.menu-toggle-icon span:last-child { width: 14px; margin-left: auto; }

.menu-toggle-icon.open span:first-child {
  transform: translateY(2.75px) rotate(45deg);
  width: 20px;
}
.menu-toggle-icon.open span:last-child {
  transform: translateY(-2.75px) rotate(-45deg);
  width: 20px;
}

@media (max-width: 1024px) {
  .header-center { display: none; }
  .header-left, .header-right { min-width: auto; }
}

@media (max-width: 640px) {
  .site-header { padding: 0 var(--space-md); height: 60px; }
  .logo-text { font-size: 13px; }
  .logo-mark { width: 32px; height: 20px; }
  .logo-svg { width: 26px; height: 14px; }
  .menu-toggle-text { display: none; }
}
</style>
