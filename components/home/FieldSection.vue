<template>
  <section class="field-section" ref="section">
    <div class="field-header" data-reveal>
      <span class="section-tag">{{ $t('home.field_title') }}</span>
      <h2 class="section-title">{{ $t('home.field_sub') }}</h2>
    </div>

    <div class="field-scroll" ref="scrollContainer">
      <div class="field-track" ref="track">
        <NuxtLink
          v-for="(cap, index) in capabilities"
          :key="cap.id"
          :to="`/field/${cap.id}`"
          class="field-card"
          :data-reveal="true"
        >
          <div class="field-card-number">{{ cap.number }}</div>
          <div class="field-card-icon">{{ cap.icon }}</div>
          <h3 class="field-card-title">{{ cap.title }}</h3>
          <p class="field-card-desc">{{ cap.titleZh }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
import { capabilities } from '@/data'

export default {
  name: 'FieldSection',
  data() {
    return { capabilities }
  },
  mounted() {
    this.setupReveal()
    this.setupHorizontalScroll()
  },
  methods: {
    setupReveal() {
      if (!process.client) return
      const reveals = this.$refs.section.querySelectorAll('[data-reveal]')
      reveals.forEach((el) => {
        this.$ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => el.classList.add('is-visible')
        })
      })
    },
    setupHorizontalScroll() {
      if (!process.client || !this.$refs.scrollContainer) return
      const container = this.$refs.scrollContainer
      const track = this.$refs.track

      // 在桌面端启用横向滚动提示（实际滚动由原生 overflow-x 处理）
      if (window.innerWidth > 1024) {
        this.$gsap.fromTo(
          track,
          { x: 0 },
          {
            x: () => -(track.scrollWidth - container.clientWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          }
        )
      }
    }
  }
}
</script>

<style scoped>
.field-section {
  padding: var(--space-4xl) 0;
  background: var(--color-bg-alt);
}

.field-header {
  max-width: var(--container-max);
  margin: 0 auto var(--space-2xl);
  padding: 0 var(--space-xl);
}

.field-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 var(--space-xl);
  -ms-overflow-style: none;
  scrollbar-width: none;
  cursor: grab;
}

.field-scroll::-webkit-scrollbar {
  display: none;
}

.field-track {
  display: flex;
  gap: var(--space-xl);
  padding-bottom: var(--space-md);
  width: max-content;
}

.field-card {
  flex-shrink: 0; text-decoration: none; color: inherit; display: block;
  width: 300px;
  padding: var(--space-xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color 400ms ease, background 400ms ease;
}

.field-card:hover {
  border-color: var(--color-border-light);
  background: var(--color-bg-hover);
}

.field-card-number {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-lg);
}

.field-card-icon {
  font-size: 24px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.field-card-title {
  font-family: var(--font-en);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.field-card-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .field-track {
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: var(--space-md);
    width: auto;
  }

  .field-card {
    width: 260px;
  }
}

@media (max-width: 640px) {
  .field-section {
    padding: var(--space-2xl) 0;
  }

  .field-scroll {
    padding: 0 var(--space-md);
  }

  .field-card {
    width: 220px;
    padding: var(--space-lg);
  }
}
</style>
