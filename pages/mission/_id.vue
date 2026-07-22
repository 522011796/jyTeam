<template>
  <div class="detail-page" ref="page">
    <div class="detail-back-bar">
      <NuxtLink to="/mission" class="detail-back-link">
        <span class="back-arrow">←</span>
        <span class="back-label">返回行动列表</span>
      </NuxtLink>
    </div>
    <section class="detail-hero">
      <div class="detail-hero-image">
        <RescueImage :theme="mission.imageTheme || 'mountain'" />
      </div>
      <div class="detail-hero-gradient"></div>
      <div class="detail-hero-content">
        <span class="detail-tag">MISSION #{{ mission.id }}</span>
        <h1 class="detail-title">{{ mission.type }}</h1>
        <p class="detail-subtitle">{{ mission.date }} · {{ mission.location.name }}</p>
        <div class="detail-status-row">
          <span class="detail-status completed">● {{ $t('mission.done') }}</span>
          <span class="detail-dur">{{ mission.duration }}</span>
          <span class="detail-mem">{{ mission.members }} 人</span>
        </div>
      </div>
    </section>

    <section class="detail-body" ref="body">
      <div class="detail-body-inner">
        <!-- 概述 -->
        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">概述</h2>
          <p class="detail-p">{{ mission.summary }}</p>
        </div>

        <!-- 时间线 -->
        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">行动时间线</h2>
          <div class="detail-timeline">
            <div class="dt-item">
              <div class="dt-dot"></div>
              <div class="dt-content">
                <span class="dt-time">{{ mission.timeline.callReceived }}</span>
                <span class="dt-label">{{ $t('mission.call_received') }}</span>
                <p class="dt-desc">{{ mission.detail.callSource }}</p>
              </div>
            </div>
            <div class="dt-item">
              <div class="dt-dot"></div>
              <div class="dt-content">
                <span class="dt-time">{{ mission.timeline.deployed }}</span>
                <span class="dt-label">{{ $t('mission.team_deployed') }}</span>
                <p class="dt-desc">{{ mission.detail.deployment }}</p>
              </div>
            </div>
            <div class="dt-item">
              <div class="dt-dot active"></div>
              <div class="dt-content">
                <span class="dt-time">{{ mission.timeline.located }}</span>
                <span class="dt-label">{{ $t('mission.target_located') }}</span>
                <p class="dt-desc">{{ mission.detail.rescue }}</p>
              </div>
            </div>
            <div class="dt-item">
              <div class="dt-dot"></div>
              <div class="dt-content">
                <span class="dt-time">{{ mission.timeline.returned }}</span>
                <span class="dt-label">{{ $t('mission.returned') }}</span>
                <p class="dt-desc">{{ mission.detail.evacuation }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 现场条件 -->
        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">现场条件</h2>
          <p class="detail-p">{{ mission.detail.conditions }}</p>
        </div>

        <!-- 搜索过程 -->
        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">搜索过程</h2>
          <p class="detail-p">{{ mission.detail.search }}</p>
        </div>

        <!-- 行动复盘 -->
        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">行动复盘</h2>
          <p class="detail-p">{{ mission.detail.afterAction }}</p>
        </div>

        <!-- 数据 -->
        <div class="detail-section detail-data-row" data-reveal>
          <div class="detail-data">
            <span class="dd-value">{{ mission.duration }}</span>
            <span class="dd-label">行动时长</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">{{ mission.members }}</span>
            <span class="dd-label">参与人数</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">{{ mission.location.name }}</span>
            <span class="dd-label">行动区域</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">SAFE</span>
            <span class="dd-label">最终结果</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { missions } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'MissionDetail',
  components: { RescueImage },
  data() {
    return {
      mission: {
        id: '',
        date: '',
        type: '',
        typeEn: '',
        timeline: { callReceived: '', deployed: '', located: '', returned: '' },
        duration: '',
        members: 0,
        status: 'completed',
        location: { name: '' },
        summary: '',
        imageTheme: 'mountain',
        detail: { callSource: '', conditions: '', deployment: '', search: '', rescue: '', evacuation: '', afterAction: '' }
      }
    }
  },
  mounted() {
    const id = this.$route.params.id
    this.mission = missions.find(m => m.id === id) || missions[0]
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

/* Back bar — sticky below header */
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

/* Hero */
.detail-hero {
  position: relative;
  width: 100%;
  height: 50vh;
  min-height: 360px;
  overflow: hidden;
}
.detail-hero-image { position: absolute; inset: 0; }
.detail-hero-gradient {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(to top, rgba(250,250,247,0.95) 0%, rgba(250,250,247,0.3) 50%, rgba(250,250,247,0.05) 100%);
}
.detail-hero-content {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
  padding: var(--space-2xl) var(--space-xl);
  max-width: var(--container-max); margin: 0 auto;
}
.detail-tag {
  font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.15em;
  color: var(--color-text); display: block; margin-bottom: var(--space-sm);
}
.detail-title {
  font-family: var(--font-zh); font-size: clamp(28px, 4vw, 48px); font-weight: 700;
  color: var(--color-text); margin-bottom: var(--space-sm);
}
.detail-subtitle { font-size: 14px; color: var(--color-text-muted); margin-bottom: var(--space-md); }
.detail-status-row { display: flex; align-items: center; gap: var(--space-lg); }
.detail-status {
  font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.1em;
}
.detail-status.completed { color: var(--color-text-muted); }
.detail-dur, .detail-mem {
  font-family: var(--font-mono); font-size: 12px; color: var(--color-text-muted);
}

/* Body */
.detail-body {
  background: var(--color-bg);
  padding: var(--space-2xl) 0 var(--space-4xl);
}
.detail-body-inner {
  max-width: var(--container-narrow); margin: 0 auto; padding: 0 var(--space-xl);
}
.detail-section {
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-2xl);
  border-bottom: 1px solid var(--color-border);
}
.detail-h2 {
  font-family: var(--font-en); font-size: 12px; font-weight: 600; letter-spacing: 0.15em;
  color: var(--color-text-dim); text-transform: uppercase; margin-bottom: var(--space-lg);
}
.detail-p { font-size: 16px; line-height: 1.85; color: var(--color-text-muted); }

/* Timeline */
.detail-timeline { display: flex; flex-direction: column; gap: 0; }
.dt-item { display: flex; gap: var(--space-lg); padding-bottom: var(--space-xl); position: relative; }
.dt-item:not(:last-child)::after {
  content: ''; position: absolute; left: 3px; top: 18px; bottom: 0;
  width: 1px; background: var(--color-border-light);
}
.dt-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--color-text-dim);
  margin-top: 6px; flex-shrink: 0;
}
.dt-dot.active { background: var(--color-text); }
.dt-content { flex: 1; }
.dt-time { font-family: var(--font-mono); font-size: 20px; font-weight: 500; color: var(--color-text); display: block; margin-bottom: 2px; }
.dt-label { font-size: 12px; color: var(--color-text-dim); display: block; margin-bottom: var(--space-sm); }
.dt-desc { font-size: 14px; line-height: 1.7; color: var(--color-text-muted); }

/* Data row */
.detail-data-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-lg);
  border-bottom: none; padding-top: var(--space-xl);
}
.detail-data { text-align: center; }
.dd-value { display: block; font-family: var(--font-mono); font-size: 20px; font-weight: 500; color: var(--color-text); }
.dd-label { display: block; font-size: 11px; color: var(--color-text-dim); margin-top: var(--space-xs); }

@media (max-width: 640px) {
  .detail-page { padding-top: 60px; }
  .detail-back-bar { top: 60px; padding: 8px var(--space-md); }
  .detail-data-row { grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }
  .detail-hero { height: 40vh; min-height: 280px; }
}
</style>
