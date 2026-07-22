<template>
  <section class="map-section" ref="section">
    <div class="map-header" data-reveal>
      <span class="section-tag">{{ $t('home.map_title') }}</span>
      <h2 class="section-title">{{ $t('home.map_sub') }}</h2>
    </div>

    <!-- 地点索引卡片 -->
    <div class="location-grid" ref="grid">
      <div
        v-for="(loc, index) in locationCards"
        :key="loc.name"
        class="location-card"
        :data-reveal="true"
      >
        <!-- 卡片顶部装饰线 -->
        <div class="location-card-line"></div>

        <!-- 地名 + 编号 -->
        <div class="location-card-head">
          <span class="location-card-index">{{ padIndex(index + 1) }}</span>
          <h3 class="location-card-name">{{ loc.name }}</h3>
        </div>

        <!-- 数据行 -->
        <div class="location-card-stats">
          <div class="location-stat">
            <span class="location-stat-value">{{ loc.count }}</span>
            <span class="location-stat-label">次行动</span>
          </div>
          <div class="location-stat">
            <span class="location-stat-value">{{ loc.latest.date }}</span>
            <span class="location-stat-label">最近</span>
          </div>
          <div class="location-stat">
            <span class="location-stat-value">#{{ loc.latest.id }}</span>
            <span class="location-stat-label">任务编号</span>
          </div>
        </div>

        <!-- 最近任务摘要 -->
        <p class="location-card-summary">{{ loc.latest.summary }}</p>

        <!-- 查看按钮 -->
        <NuxtLink :to="`/mission/${loc.latest.id}`" class="location-card-link">
          查看任务详情 →
        </NuxtLink>
      </div>
    </div>

    <!-- 底部统计条 -->
    <div class="location-footer" data-reveal>
      <div class="location-footer-inner">
        <span class="lf-stat"><strong>{{ totalMissions }}</strong> 次任务</span>
        <span class="lf-divider">/</span>
        <span class="lf-stat"><strong>{{ locationCards.length }}</strong> 个地点</span>
        <span class="lf-divider">/</span>
        <span class="lf-stat"><strong>2024—2026</strong></span>
      </div>
    </div>

    <div class="map-cta" data-reveal>
      <NuxtLink to="/mission" class="cta-link">
        {{ $t('common.view_all') }} →
      </NuxtLink>
    </div>
  </section>
</template>

<script>
import { missions } from '@/data'

export default {
  name: 'MissionMapSection',
  data() {
    return {
      locationCards: []
    }
  },
  computed: {
    totalMissions() {
      return missions.length
    }
  },
  created() {
    // 按地点聚合任务
    const grouped = {}
    missions.forEach(m => {
      const key = m.location.name
      if (!grouped[key]) {
        grouped[key] = { name: key, missions: [] }
      }
      grouped[key].missions.push(m)
    })

    this.locationCards = Object.values(grouped).map(g => {
      const sorted = g.missions.sort((a, b) => b.date.localeCompare(a.date))
      return {
        name: g.name,
        count: g.missions.length,
        latest: sorted[0]
      }
    })
  },
  mounted() {
    this.setupReveal()
  },
  methods: {
    padIndex(n) {
      return String(n).padStart(2, '0')
    },
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
.map-section {
  padding: var(--space-4xl) 0;
  background: var(--color-bg);
}

.map-header {
  max-width: var(--container-max);
  margin: 0 auto var(--space-2xl);
  padding: 0 var(--space-xl);
}

/* 卡片网格 */
.location-grid {
  max-width: var(--container-max);
  margin: 0 auto var(--space-3xl);
  padding: 0 var(--space-xl);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  border-top: 1px solid var(--color-border);
}

.location-card {
  background: var(--color-bg);
  padding: var(--space-xl) var(--space-xl) var(--space-lg);
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--color-border);
}
.location-card:nth-child(odd) {
  border-right: 1px solid var(--color-border);
}

/* 顶部细线 — editorial 风格 */
.location-card-line {
  width: 24px;
  height: 1px;
  background: var(--color-text);
  margin-bottom: var(--space-lg);
}

.location-card-head {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.location-card-index {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-dim);
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.location-card-name {
  font-family: var(--font-zh);
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

/* 数据行 */
.location-card-stats {
  display: flex;
  gap: var(--space-xl);
  margin-bottom: var(--space-lg);
}

.location-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.location-stat-value {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
}

.location-stat-label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--color-text-dim);
  text-transform: uppercase;
}

/* 任务摘要 */
.location-card-summary {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
  flex: 1;
}

/* 链接 */
.location-card-link {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
  text-decoration: none;
  align-self: flex-start;
  transition: color 200ms ease;
}

.location-card:hover .location-card-link {
  color: var(--color-text);
}

/* 底部统计条 */
.location-footer {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

.location-footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-border);
}

.lf-stat {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.lf-stat strong {
  color: var(--color-text);
  font-weight: 500;
}

.lf-divider {
  color: var(--color-text-dim);
  font-size: 10px;
}

.map-cta {
  text-align: center;
  margin-top: var(--space-lg);
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
  .map-section {
    padding: var(--space-2xl) 0;
  }

  .location-grid {
    grid-template-columns: 1fr;
    padding: 0 var(--space-md);
  }
  .location-card:nth-child(odd) {
    border-right: none;
  }

  .map-header {
    padding: 0 var(--space-md);
  }

  .location-footer {
    padding: 0 var(--space-md);
  }

  .location-card {
    padding: var(--space-lg);
  }
}
</style>
