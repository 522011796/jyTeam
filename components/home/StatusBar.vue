<template>
  <section class="status-bar" ref="section">
    <div class="status-bar-inner">
      <div class="status-header" data-reveal>
        <span class="status-indicator-dot"></span>
        <h2 class="status-title">{{ $t('home.status_title') }}</h2>
      </div>

      <p class="status-desc" data-reveal>{{ $t('home.status_desc') }}</p>

      <div class="status-stats" ref="stats">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <span class="stat-value" :ref="`stat_${stat.key}`">0</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <div class="status-status-text" data-reveal>
        <span class="status-big-dot"></span>
        <span class="status-big-label">STANDBY</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'StatusBarSection',
  data() {
    return {
      stats: [
        { key: 'volunteers', value: 23, label: this.$t('home.volunteers') },
        { key: 'missions', value: 48, label: this.$t('home.missions_done') },
        { key: 'locations', value: 17, label: this.$t('home.locations') },
        { key: 'days', value: 365, label: this.$t('home.days_ready') }
      ]
    }
  },
  mounted() {
    this.setupObserver()
  },
  methods: {
    setupObserver() {
      if (!process.client) return

      const gsap = this.$gsap
      const ScrollTrigger = this.$ScrollTrigger

      ScrollTrigger.create({
        trigger: this.$refs.stats,
        start: 'top 80%',
        onEnter: () => {
          this.stats.forEach((stat) => {
            const el = this.$refs[`stat_${stat.key}`]
            if (el && el[0]) {
              gsap.fromTo(
                el[0],
                { textContent: 0 },
                {
                  textContent: stat.value,
                  duration: 1.5,
                  ease: 'power2.out',
                  snap: { textContent: 1 },
                  onUpdate() {
                    el[0].textContent = Math.round(this.targets()[0].textContent)
                  }
                }
              )
            }
          })
        }
      })

      // 复用公共的 data-reveal 动画
      this.$nextTick(() => {
        const reveals = this.$refs.section.querySelectorAll('[data-reveal]')
        reveals.forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => el.classList.add('is-visible')
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.status-bar {
  padding: var(--space-4xl) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-alt);
}

.status-bar-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-xl);
  text-align: center;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.status-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.5;
}

.status-title {
  font-family: var(--font-en);
  font-size: clamp(20px, 3vw, 32px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
}

.status-desc {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3xl);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.status-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-3xl);
  margin-bottom: var(--space-3xl);
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  min-width: 120px;
}

.stat-value {
  display: block;
  font-family: var(--font-mono);
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 500;
  line-height: 1;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.status-status-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}

.status-big-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.status-big-label {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .status-bar {
    padding: var(--space-2xl) 0;
  }

  .status-stats {
    gap: var(--space-xl);
  }

  .stat-item {
    min-width: 100px;
  }
}
</style>
