<template>
  <div class="mission-page" ref="page">
    <!-- 页头 -->
    <section class="page-hero">
      <div class="page-hero-content">
        <span class="page-tag">{{ $t('mission.title') }}</span>
        <h1 class="page-title">{{ $t('mission.subtitle') }}</h1>
      </div>

      <div class="page-hero-stats" data-reveal>
        <div class="hero-stat">
          <span class="hero-stat-value">48</span>
          <span class="hero-stat-label">{{ $t('mission.total') }}</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-value">17</span>
          <span class="hero-stat-label">{{ $t('mission.locations') }}</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-value">2024—</span>
          <span class="hero-stat-label">{{ $t('mission.period') }}</span>
        </div>
      </div>
    </section>

    <!-- 任务时间线 -->
    <section class="mission-timeline-full" ref="timeline">
      <h2 class="section-label" data-reveal>{{ $t('mission.timeline') }}</h2>

      <div class="timeline-list">
        <article
          v-for="mission in missions"
          :key="mission.id"
          class="timeline-entry"
          :data-reveal="true"
        >
          <div class="timeline-entry-marker">
            <span class="entry-dot" :class="{ active: mission.status === 'active' }"></span>
            <span class="entry-line"></span>
          </div>

          <div class="timeline-entry-content">
            <NuxtLink :to="`/mission/${mission.id}`" class="entry-link">
              <div class="entry-header">
                <div class="entry-meta">
                  <span class="entry-date">{{ mission.date }}</span>
                  <span class="entry-id">MISSION #{{ mission.id }}</span>
                </div>
                <span
                  class="entry-status"
                  :class="mission.status"
                >
                  ● {{ mission.status === 'active' ? $t('mission.active') : $t('mission.done') }}
                </span>
              </div>

              <h3 class="entry-type">{{ mission.type }}</h3>
              <p class="entry-summary">{{ mission.summary }}</p>

              <div class="entry-details">
                <div class="entry-detail">
                  <span class="detail-value">{{ mission.duration }}</span>
                  <span class="detail-label">{{ $t('mission.duration') }}</span>
                </div>
                <div class="entry-detail">
                  <span class="detail-value">{{ mission.members }}</span>
                  <span class="detail-label">{{ $t('mission.members') }}</span>
                </div>
                <div class="entry-detail">
                  <span class="detail-value">{{ mission.location.name }}</span>
                  <span class="detail-label">{{ $t('mission.map_title') }}</span>
                </div>
              </div>

              <div class="entry-image">
                <RescueImage :theme="mission.imageTheme || 'mountain'" />
              </div>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <!-- 地图 -->
    <section class="mission-map-full" ref="mapSection">
      <h2 class="section-label" data-reveal>{{ $t('mission.map_title') }}</h2>
      <div class="map-container" data-reveal>
        <svg class="topo-map-large" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          <g class="contours-large" opacity="0.06">
            <ellipse cx="400" cy="250" rx="360" ry="230" fill="none" stroke="#1A1A1A" stroke-width="0.5"/>
            <ellipse cx="400" cy="250" rx="290" ry="185" fill="none" stroke="#1A1A1A" stroke-width="0.5"/>
            <ellipse cx="400" cy="250" rx="220" ry="140" fill="none" stroke="#1A1A1A" stroke-width="0.5"/>
            <ellipse cx="400" cy="250" rx="150" ry="90" fill="none" stroke="#1A1A1A" stroke-width="0.5"/>
            <ellipse cx="400" cy="250" rx="80" ry="45" fill="none" stroke="#1A1A1A" stroke-width="0.5"/>
          </g>
          <g class="terrain-large" opacity="0.04">
            <path d="M0,320 Q120,180 240,300 Q360,420 480,240 Q600,110 720,280 Q780,350 800,300" fill="none" stroke="#1A1A1A" stroke-width="1"/>
            <path d="M0,370 Q150,230 280,340 Q400,450 500,300 Q620,180 740,320 Q770,350 800,330" fill="none" stroke="#1A1A1A" stroke-width="0.8"/>
            <path d="M0,420 Q200,280 320,380 Q420,470 520,350 Q640,240 760,370 Q780,390 800,380" fill="none" stroke="#1A1A1A" stroke-width="0.6"/>
          </g>
          <g class="markers-large">
            <circle v-for="(p, i) in mapDots" :key="i" :cx="p.x" :cy="p.y" r="3" fill="#1A1A1A" opacity="0.4">
              <animate attributeName="opacity" values="0.15;0.5;0.15" dur="2.5s" repeatCount="indefinite" :begin="`${i * 0.4}s`"/>
            </circle>
          </g>
        </svg>
      </div>
    </section>
  </div>
</template>

<script>
import { missions } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'MissionPage',
  components: { RescueImage },
  data() {
    return {
      missions,
      mapDots: Array.from({ length: 17 }, () => ({
        x: 100 + Math.random() * 600,
        y: 80 + Math.random() * 340
      }))
    }
  },
  mounted() {
    this.setupReveal()
  },
  methods: {
    setupReveal() {
      if (!process.client) return
      this.$nextTick(() => {
        const reveals = this.$refs.page.querySelectorAll('[data-reveal]')
        reveals.forEach((el) => {
          this.$ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: () => el.classList.add('is-visible')
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.mission-page {
  padding-top: 72px;
}

.page-hero {
  padding: var(--space-3xl) var(--space-xl) var(--space-2xl);
  max-width: var(--container-max);
  margin: 0 auto;
}

.page-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  display: block;
  margin-bottom: var(--space-md);
}

.page-title {
  font-family: var(--font-zh);
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--space-2xl);
}

.page-hero-stats {
  display: flex;
  gap: var(--space-2xl);
}

.hero-stat-value {
  display: block;
  font-family: var(--font-mono);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 500;
  color: var(--color-text);
  line-height: 1;
}

.hero-stat-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: var(--space-sm);
}

/* Timeline */
.mission-timeline-full {
  padding: var(--space-2xl) var(--space-xl);
  max-width: var(--container-max);
  margin: 0 auto;
}

.section-label {
  font-family: var(--font-en);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--color-text-dim);
  margin-bottom: var(--space-xl);
  text-transform: uppercase;
}

.timeline-list {
  display: flex;
  flex-direction: column;
}

.timeline-entry {
  display: flex;
  gap: var(--space-xl);
  padding-bottom: var(--space-xl);
}

.timeline-entry:last-child .entry-line {
  display: none;
}

.timeline-entry-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16px;
  flex-shrink: 0;
}

.entry-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-text-dim);
  margin-top: 6px;
}

.entry-dot.active {
  background: var(--color-accent);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0.3); }
  50% { box-shadow: 0 0 0 8px rgba(223, 255, 0, 0); }
}

.entry-line {
  width: 1px;
  flex: 1;
  background: var(--color-border-light);
  margin-top: var(--space-sm);
}

.timeline-entry-content {
  flex: 1;
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}
.entry-link { text-decoration: none; color: inherit; display: block; }
.entry-link:hover .entry-type { color: var(--color-accent-alt); transition: color 300ms ease; }

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.entry-date {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-muted);
}

.entry-id {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.05em;
  margin-left: var(--space-md);
}

.entry-status {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.entry-status.completed {
  color: var(--color-text-dim);
}

.entry-status.active {
  color: var(--color-accent);
}

.entry-type {
  font-family: var(--font-zh);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.entry-summary {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
  max-width: 600px;
}

.entry-details {
  display: flex;
  gap: var(--space-2xl);
  margin-bottom: var(--space-lg);
}

.entry-image {
  margin-top: var(--space-md);
  aspect-ratio: 16 / 9;
  max-height: 360px;
  overflow: hidden;
  border-radius: var(--radius-md);
  position: relative;
}

.detail-value {
  display: block;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.detail-label {
  display: block;
  font-size: 11px;
  color: var(--color-text-dim);
  margin-top: 2px;
}

/* Map */
.mission-map-full {
  padding: var(--space-2xl) var(--space-xl) var(--space-4xl);
  max-width: var(--container-max);
  margin: 0 auto;
}

.map-container {
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.topo-map-large {
  width: 100%;
  height: auto;
  max-height: 400px;
}

@media (max-width: 640px) {
  .mission-page {
    padding-top: 60px;
  }

  .page-hero {
    padding: var(--space-2xl) var(--space-md);
  }

  .mission-timeline-full {
    padding: var(--space-xl) var(--space-md);
  }

  .mission-map-full {
    padding: var(--space-xl) var(--space-md);
  }

  .entry-details {
    flex-wrap: wrap;
    gap: var(--space-lg);
  }
}
</style>
