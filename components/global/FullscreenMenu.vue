<template>
  <transition name="menu">
    <div v-if="menuOpen" class="fullscreen-menu" ref="menu">
      <div class="menu-bg"></div>

      <nav class="menu-nav">
        <div class="menu-nav-inner">
          <ul class="menu-list">
            <li
              v-for="(item, index) in menuItems"
              :key="item.key"
              class="menu-item"
              :style="{ transitionDelay: menuOpen ? `${index * 80}ms` : '0ms' }"
            >
              <NuxtLink
                :to="item.to"
                class="menu-link"
                @click.native="closeMenu"
              >
                <span class="menu-number">{{ item.number }}</span>
                <span class="menu-label">{{ item.label }}</span>
                <span class="menu-label-zh">{{ item.labelZh }}</span>
              </NuxtLink>
            </li>
          </ul>

          <div class="menu-footer">
            <div class="menu-footer-links">
              <a href="#" class="menu-footer-link">{{ $t('nav.join') }}</a>
              <span class="menu-divider">/</span>
              <a href="#" class="menu-footer-link">{{ $t('nav.support') }}</a>
            </div>
            <p class="menu-footer-tagline">{{ $t('site.tagline') }}</p>
          </div>
        </div>
      </nav>

      <div class="menu-decoration">
        <div class="menu-coords">24°N 121°E</div>
        <div class="menu-status">
          <span class="status-text">{{ $t('site.status_ready') }}</span>
          <span class="status-dot"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'FullscreenMenu',
  data() {
    return {
      menuItems: []
    }
  },
  computed: {
    ...mapGetters(['menuOpen'])
  },
  watch: {
    menuOpen(val) {
      if (val) {
        document.body.style.overflow = 'hidden'
        this.populateMenuItems()
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  methods: {
    ...mapMutations(['closeMenu']),
    handleKeydown(e) {
      if (e.key === 'Escape') this.closeMenu()
    },
    populateMenuItems() {
      this.menuItems = [
        { key: 'mission', number: '01', label: 'MISSION', labelZh: '行动', to: '/mission' },
        { key: 'people', number: '02', label: 'PEOPLE', labelZh: '人', to: '/people' },
        { key: 'field', number: '03', label: 'FIELD', labelZh: '现场', to: '/field' },
        { key: 'journal', number: '04', label: 'JOURNAL', labelZh: '记录', to: '/journal' }
      ]
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydown)
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.fullscreen-menu {
  position: fixed;
  inset: 0;
  z-index: var(--z-menu);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.menu-bg {
  position: absolute;
  inset: 0;
  background: var(--color-bg);
  opacity: 0.98;
}

.menu-nav {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--container-narrow);
  padding: 0 var(--space-xl);
}

.menu-nav-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.menu-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 600ms var(--ease-out-expo),
              transform 600ms var(--ease-out-expo);
}

.fullscreen-menu .menu-item {
  opacity: 1;
  transform: translateY(0);
}

.menu-link {
  display: flex;
  align-items: baseline;
  gap: var(--space-lg);
  text-decoration: none;
  color: var(--color-text);
  padding: var(--space-sm) 0;
  transition: opacity 300ms ease;
}

.menu-link:hover {
  opacity: 0.5;
}

.menu-number {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  min-width: 40px;
}

.menu-label {
  font-family: var(--font-en);
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.menu-label-zh {
  font-family: var(--font-zh);
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 500;
  color: var(--color-text-muted);
  margin-left: auto;
}

.menu-footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}

.menu-footer-links {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.menu-footer-link {
  font-family: var(--font-en);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 300ms ease;
}

.menu-footer-link:hover {
  color: var(--color-accent);
}

.menu-divider {
  color: var(--color-text-dim);
  font-size: 12px;
}

.menu-footer-tagline {
  font-family: var(--font-zh);
  font-size: 14px;
  color: var(--color-text-dim);
}

.menu-decoration {
  position: absolute;
  bottom: var(--space-xl);
  right: var(--space-xl);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  z-index: 2;
}

.menu-coords {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--color-text-dim);
}

.menu-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-text {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-accent);
}

.status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-accent);
}

/* Mobile */
@media (max-width: 640px) {
  .menu-nav {
    padding: 0 var(--space-md);
  }

  .menu-link {
    gap: var(--space-md);
  }

  .menu-decoration {
    bottom: var(--space-md);
    right: var(--space-md);
  }
}
</style>
