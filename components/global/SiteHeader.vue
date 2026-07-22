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
        </NuxtLink>
      </div>

      <div class="header-center">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-label">{{ $t('site.status_ready') }}</span>
        </div>
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

export default {
  name: 'SiteHeader',
  computed: {
    ...mapGetters(['menuOpen'])
  },
  methods: {
    ...mapMutations(['toggleMenu', 'closeMenu']),
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
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
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
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-text);
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
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
