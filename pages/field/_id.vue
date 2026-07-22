<template>
  <div class="detail-page" ref="page">
    <div class="detail-back-bar">
      <NuxtLink to="/field" class="detail-back-link">
        <span class="back-arrow">←</span>
        <span class="back-label">返回能力列表</span>
      </NuxtLink>
    </div>
    <section class="detail-hero">
      <div class="detail-hero-image">
        <RescueImage :theme="cap.imageTheme || 'mountain'" />
      </div>
      <div class="detail-hero-gradient"></div>
      <div class="detail-hero-content">
        <span class="detail-number">{{ cap.number }}</span>
        <h1 class="detail-title">{{ cap.title }}</h1>
        <p class="detail-subtitle">{{ cap.titleZh }}</p>
      </div>
    </section>

    <section class="detail-body" ref="body">
      <div class="detail-body-inner">
        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">概述</h2>
          <p class="detail-p" v-for="(p, i) in overviewParagraphs" :key="i">{{ p }}</p>
        </div>

        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">装备清单</h2>
          <p class="detail-p">{{ cap.detail.gear }}</p>
        </div>

        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">训练方式</h2>
          <p class="detail-p" v-for="(p, i) in trainingParagraphs" :key="i">{{ p }}</p>
        </div>

        <div class="detail-section detail-scenario" data-reveal>
          <h2 class="detail-h2">实战应用</h2>
          <blockquote class="scenario-quote">{{ cap.detail.scenario }}</blockquote>
        </div>

        <div class="detail-data-row" data-reveal>
          <div class="detail-data">
            <span class="dd-value">{{ cap.number }}</span>
            <span class="dd-label">能力编号</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">{{ cap.icon }}</span>
            <span class="dd-label">标识</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">FIELD</span>
            <span class="dd-label">系列</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">READY</span>
            <span class="dd-label">状态</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { capabilities } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'FieldDetail',
  components: { RescueImage },
  data() {
    return {
      cap: { detail: { overview: '', gear: '', training: '', scenario: '' }, title: '', titleZh: '', number: '', icon: '', imageTheme: 'mountain' }
    }
  },
  computed: {
    overviewParagraphs() {
      return (this.cap.detail.overview || '').split('\n').filter(Boolean)
    },
    trainingParagraphs() {
      return (this.cap.detail.training || '').split('\n').filter(Boolean)
    }
  },
  mounted() {
    const id = this.$route.params.id
    this.cap = capabilities.find(c => c.id === id) || capabilities[0]
    this.$nextTick(() => {
      this.setupReveal()
    })
  },
  methods: {
    setupReveal() {
      if (!process.client) return
      const reveals = this.$refs.body.querySelectorAll('[data-reveal]')
      reveals.forEach((el) => {
        this.$ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => el.classList.add('is-visible')
        })
      })
    }
  }
}
</script>

<style scoped>
.detail-page { padding-top: 72px; }

.detail-back-bar {
  position: sticky; top: 72px; z-index: 10;
  background: rgba(250,250,247,0.9); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  padding: 10px var(--space-xl);
}
.detail-back-link {
  display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
  font-family: var(--font-mono); font-size: 12px; color: var(--color-text);
  padding: 6px 12px; border-radius: var(--radius-sm);
  transition: background 200ms ease;
}
.detail-back-link:hover { background: var(--color-bg-hover); }
.back-arrow { font-size: 14px; }
.back-label { letter-spacing: 0.05em; }

.detail-hero {
  position: relative; width: 100%; height: 50vh; min-height: 360px; overflow: hidden;
}
.detail-hero-image { position: absolute; inset: 0; }
.detail-hero-gradient {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(to top, rgba(250,250,247,0.95) 0%, rgba(250,250,247,0.2) 50%, rgba(250,250,247,0.02) 100%);
}
.detail-hero-content {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
  padding: var(--space-2xl) var(--space-xl); max-width: var(--container-max); margin: 0 auto;
}
.detail-number {
  font-family: var(--font-mono); font-size: 13px; font-weight: 500; letter-spacing: 0.1em;
  color: var(--color-text); display: block; margin-bottom: var(--space-sm);
}
.detail-title {
  font-family: var(--font-en); font-size: clamp(32px, 5vw, 56px); font-weight: 700;
  letter-spacing: -0.02em; color: var(--color-text); margin-bottom: var(--space-sm);
}
.detail-subtitle { font-size: 14px; color: var(--color-text-muted); max-width: 560px; }

.detail-body { background: var(--color-bg); padding: var(--space-2xl) 0 var(--space-4xl); }
.detail-body-inner { max-width: var(--container-narrow); margin: 0 auto; padding: 0 var(--space-xl); }
.detail-section { margin-bottom: var(--space-2xl); padding-bottom: var(--space-2xl); border-bottom: 1px solid var(--color-border); }
.detail-h2 {
  font-family: var(--font-en); font-size: 12px; font-weight: 600; letter-spacing: 0.15em;
  color: var(--color-text-dim); text-transform: uppercase; margin-bottom: var(--space-lg);
}
.detail-p { font-size: 16px; line-height: 1.85; color: var(--color-text-muted); margin-bottom: var(--space-md); }

.detail-scenario { border-bottom: none; }
.scenario-quote {
  font-size: clamp(16px, 2vw, 20px); font-weight: 500; line-height: 1.7; color: var(--color-text);
  padding: var(--space-lg); background: var(--color-bg-hover); border-left: 2px solid var(--color-border-light);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.detail-data-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-lg); padding-top: var(--space-xl);
}
.detail-data { text-align: center; }
.dd-value { display: block; font-family: var(--font-mono); font-size: 20px; font-weight: 500; color: var(--color-text); }
.dd-label { display: block; font-size: 11px; color: var(--color-text-dim); margin-top: var(--space-xs); }

@media (max-width: 640px) {
  .detail-page { padding-top: 60px; }
  .detail-back-bar { top: 60px; padding: 8px var(--space-md); }
  .detail-hero { height: 40vh; min-height: 300px; }
  .detail-data-row { grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }
}
</style>
