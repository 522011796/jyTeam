<template>
  <section class="mission-wrap" ref="section">
    <div class="mission-section">
      <div class="mission-header" data-reveal>
        <span class="section-tag">MISSION</span>
        <h2 class="section-title">{{ $t('home.mission_sub') }}</h2>
      </div>

      <div class="mission-timeline" ref="timeline">
        <div
          v-for="(mission, index) in missions"
          :key="mission.id"
          class="timeline-item"
          :data-reveal="true"
        >
          <div class="timeline-marker">
            <span class="marker-dot"></span>
            <span class="marker-line"></span>
          </div>

          <div class="timeline-content">
            <NuxtLink :to="`/mission/${mission.id}`" class="timeline-content-link">
              <div class="timeline-meta">
                <span class="meta-date">{{ mission.date }}</span>
                <span class="meta-id">MISSION #{{ mission.id }}</span>
              </div>

              <h3 class="timeline-type">{{ mission.type }}</h3>

              <div class="timeline-steps">
                <div class="step" v-for="(time, key) in mission.timeline" :key="key">
                  <span class="step-time">{{ time }}</span>
                  <span class="step-label">{{ stepLabels[key] }}</span>
                </div>
              </div>

              <div class="timeline-footer">
                <span class="timeline-duration">{{ mission.duration }}</span>
                <span class="timeline-members">{{ mission.members }} 人</span>
                <span class="timeline-status completed">● {{ $t('home.completed') }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
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

export default {
  name: 'MissionTimelineSection',
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
      const reveals = this.$refs.section.querySelectorAll('[data-reveal]')
      reveals.forEach((el) => {
        this.$ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => el.classList.add('is-visible')
        })
      })
    }
  }
}
</script>

<style scoped>
/* 外层全宽容器 */
.mission-wrap {
  width: 100%;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

/* 内层居中容器 */
.mission-section {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-4xl) var(--space-xl);
}

.section-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  display: block;
  margin-bottom: var(--space-md);
}

.section-title {
  font-family: var(--font-en);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-2xl);
}

.mission-timeline {
  position: relative;
  margin-bottom: var(--space-2xl);
}

.timeline-item {
  display: flex;
  gap: var(--space-xl);
  padding-bottom: var(--space-2xl);
  position: relative;
}

.timeline-item:last-child .marker-line {
  display: none;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 20px;
}

.marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
  margin-top: 8px;
}

.marker-line {
  width: 1px;
  flex: 1;
  background: var(--color-border-light);
  margin-top: var(--space-sm);
}

.timeline-content {
  flex: 1;
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}
.timeline-content-link { text-decoration: none; color: inherit; display: block; }
.timeline-content-link:hover .timeline-type { color: var(--color-text-muted); transition: color 300ms ease; }

.timeline-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}

.meta-date {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-muted);
}

.meta-id {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.timeline-type {
  font-family: var(--font-zh);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.timeline-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.step-time {
  display: block;
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 2px;
}

.step-label {
  display: block;
  font-size: 11px;
  color: var(--color-text-dim);
}

.timeline-footer {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.timeline-duration {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
}

.timeline-members {
  font-size: 13px;
  color: var(--color-text-muted);
}

.timeline-status {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.timeline-status.completed {
  color: var(--color-text-dim);
}

.mission-cta {
  text-align: center;
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

@media (max-width: 640px) {
  .mission-section {
    padding: var(--space-2xl) var(--space-md);
  }

  .timeline-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }

  .timeline-type {
    font-size: 22px;
  }
}
</style>
