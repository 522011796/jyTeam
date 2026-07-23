<template>
  <section class="mission-wrap" ref="section">
    <div class="mission-section">
      <div class="mission-header" data-reveal>
        <span class="section-tag">{{ $t('home.mission_title') }}</span>
        <blockquote class="mission-quote">
          {{ $t('home.mission_sub') }}
        </blockquote>
      </div>

      <div class="mission-grid" ref="grid">
        <NuxtLink
          v-for="(mission, index) in missions"
          :key="mission.id"
          :to="`/mission/${mission.id}`"
          class="mission-card"
          :data-reveal="true"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="mission-image">
            <RescueImage :theme="mission.imageTheme || 'mountain'" />
          </div>
          <div class="mission-info">
            <div class="mission-meta">
              <span class="mission-type">{{ mission.type }}</span>
              <span class="mission-id">MISSION #{{ mission.id }}</span>
            </div>
            <div class="mission-steps">
              <div class="step" v-for="(time, key) in mission.timeline" :key="key">
                <span class="step-time">{{ time }}</span>
                <span class="step-label">{{ stepLabels[key] }}</span>
              </div>
            </div>
            <div class="mission-footer-row">
              <span class="mission-date">{{ mission.date }}</span>
              <span class="mission-detail">{{ mission.duration }} · {{ mission.members }} 人</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="mission-bottom" data-reveal>
        <p class="mission-bottom-text">{{ missions.length }} 次行动，仍在继续</p>
      </div>

      <div class="mission-cta" data-reveal>
        <NuxtLink to="/mission" class="cta-link">
          {{ $t('common.view_all') }} →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
import { missions } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'MissionTimelineSection',
  components: { RescueImage },
  data() {
    return {
      missions: missions.filter(m => m.highlight).concat(missions.filter(m => !m.highlight)).slice(0, 3)
    }
  },
  computed: {
    stepLabels() {
      return {
        callReceived: this.$t('mission.call_received'),
        deployed: this.$t('mission.team_deployed'),
        located: this.$t('mission.target_located'),
        returned: this.$t('mission.returned')
      }
    }
  },
  mounted() {
    this.setupReveal()
  },
  methods: {
    setupReveal() {
      if (!process.client) return
      this.$nextTick(() => {
        const reveals = this.$refs.section.querySelectorAll('[data-reveal]')
        reveals.forEach((el) => {
          this.$ScrollTrigger.create({
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
/* 外层全宽 */
.mission-wrap {
  width: 100%;
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

/* 内层居中 */
.mission-section {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-4xl) var(--space-xl);
}

.mission-header {
  max-width: var(--container-max);
  margin: 0 auto var(--space-2xl);
  padding: 0 var(--space-xl);
}

.mission-quote {
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 500;
  line-height: 1.6;
  color: var(--color-text);
  max-width: 700px;
  margin-top: var(--space-md);
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.mission-card {
  opacity: 0;
  display: block;
  text-decoration: none;
  color: inherit;
  transform: translateY(40px);
  transition: opacity 0.8s var(--ease-out-expo),
              transform 0.8s var(--ease-out-expo);
  transition-delay: var(--delay, 0s);
}

.mission-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.mission-image {
  aspect-ratio: 3 / 4;
  background: var(--color-bg-card);
  margin-bottom: var(--space-lg);
  overflow: hidden;
  position: relative;
}

.mission-card:hover .mission-image {
  transform: scale(1.02);
  transition: transform 600ms var(--ease-out-expo);
}

.mission-info {
  padding: 0 var(--space-sm);
}

.mission-meta {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.mission-type {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.mission-id {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-dim);
  letter-spacing: 0.1em;
}

.mission-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.step-time {
  display: block;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 2px;
}

.step-label {
  display: block;
  font-size: 11px;
  color: var(--color-text-dim);
}

.mission-footer-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
}

.mission-date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
}

.mission-detail {
  font-size: 12px;
  color: var(--color-text-muted);
}

.mission-bottom {
  text-align: center;
}

.mission-bottom-text {
  font-family: var(--font-en);
  font-size: clamp(14px, 2vw, 20px);
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
}

.mission-cta {
  text-align: center;
  margin-top: var(--space-xl);
}

.cta-link {
  font-family: var(--font-en);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 300ms ease;
}

.cta-link:hover {
  color: var(--color-accent);
}

@media (max-width: 1024px) {
  .mission-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .mission-section {
    padding: var(--space-2xl) var(--space-md);
  }

  .mission-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .mission-image {
    aspect-ratio: 16 / 10;
  }

  .mission-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
