<template>
  <div class="detail-page" ref="page">
    <div class="detail-back-bar">
      <NuxtLink to="/people" class="detail-back-link">
        <span class="back-arrow">←</span>
        <span class="back-label">返回队员列表</span>
      </NuxtLink>
    </div>
    <section class="detail-hero">
      <div class="detail-hero-image">
        <RescueImage :theme="person.imageTheme || 'portrait'" :src="person.image || ''" />
      </div>
      <div class="detail-hero-gradient"></div>
      <div class="detail-hero-content">
        <div class="person-head">
          <div>
            <h1 class="detail-title">{{ person.name }}</h1>
            <span class="detail-name-en">{{ person.nameEn }} / UNIT {{ person.unit }}</span>
          </div>
          <span class="detail-role-tag">{{ person.role }}</span>
        </div>
        <p class="detail-quote">{{ person.story }}</p>
      </div>
    </section>

    <section class="detail-body" ref="body">
      <div class="detail-body-inner">
        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">关于 {{ person.name }}</h2>
          <p class="detail-p" v-for="(p, i) in bioParagraphs" :key="i">{{ p }}</p>
        </div>

        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">加入原因</h2>
          <p class="detail-p" v-for="(p, i) in motivationParagraphs" :key="i">{{ p }}</p>
        </div>

        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">专业领域</h2>
          <p class="detail-p">{{ person.detail.specialties }}</p>
        </div>

        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">常用装备</h2>
          <p class="detail-p">{{ person.detail.equipment }}</p>
        </div>

        <div class="detail-section" data-reveal>
          <h2 class="detail-h2">参与任务</h2>
          <div class="person-missions">
            <div
              v-for="m in personMissions"
              :key="m.id"
              class="person-mission-item"
            >
              <span class="pm-id">MISSION #{{ m.id }}</span>
              <span class="pm-type">{{ m.type }}</span>
              <span class="pm-date">{{ m.date }}</span>
              <NuxtLink :to="`/mission/${m.id}`" class="pm-link">查看详情 →</NuxtLink>
            </div>
          </div>
        </div>

        <div class="detail-section detail-quote-block" data-reveal>
          <blockquote class="big-quote">{{ person.detail.quote }}</blockquote>
        </div>

        <div class="detail-data-row" data-reveal>
          <div class="detail-data">
            <span class="dd-value">{{ person.joined }}</span>
            <span class="dd-label">加入年份</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">{{ person.detail.missions.length }}</span>
            <span class="dd-label">参与行动</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">{{ person.background.split('，')[0] || person.background }}</span>
            <span class="dd-label">专业背景</span>
          </div>
          <div class="detail-data">
            <span class="dd-value">UNIT {{ person.unit }}</span>
            <span class="dd-label">所属分队</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { people, missions } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'PeopleDetail',
  components: { RescueImage },
  data() {
    return {
      person: {
        detail: { bio: '', motivation: '', specialties: '', equipment: '', missions: [], quote: '' },
        background: '',
        joined: '',
        unit: '',
        name: '',
        nameEn: '',
        role: '',
        imageTheme: 'portrait',
        story: ''
      }
    }
  },
  computed: {
    bioParagraphs() {
      return (this.person.detail.bio || '').split('\n').filter(Boolean)
    },
    motivationParagraphs() {
      return (this.person.detail.motivation || '').split('\n').filter(Boolean)
    },
    personMissions() {
      return (this.person.detail.missions || []).map(mid => missions.find(m => m.id === mid)).filter(Boolean)
    }
  },
  mounted() {
    const id = this.$route.params.id
    this.person = people.find(p => p.id === id) || people[0]
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
  position: relative; width: 100%; height: 55vh; min-height: 380px; overflow: hidden;
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
.person-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-md); margin-bottom: var(--space-md); }
.detail-title { font-family: var(--font-zh); font-size: clamp(32px, 5vw, 56px); font-weight: 700; color: var(--color-text); }
.detail-name-en { font-family: var(--font-mono); font-size: 12px; color: var(--color-text-dim); letter-spacing: 0.1em; display: block; margin-top: 4px; }
.detail-role-tag {
  font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.1em; color: var(--color-text);
  padding: 6px 14px; border: 1px solid var(--color-border-light); border-radius: var(--radius-sm);
}
.detail-quote { font-size: clamp(16px, 2vw, 22px); font-weight: 500; line-height: 1.6; color: var(--color-text-muted); max-width: 600px; margin-top: var(--space-md); }

.detail-body { background: var(--color-bg); padding: var(--space-2xl) 0 var(--space-4xl); }
.detail-body-inner { max-width: var(--container-narrow); margin: 0 auto; padding: 0 var(--space-xl); }
.detail-section { margin-bottom: var(--space-2xl); padding-bottom: var(--space-2xl); border-bottom: 1px solid var(--color-border); }
.detail-h2 {
  font-family: var(--font-en); font-size: 12px; font-weight: 600; letter-spacing: 0.15em;
  color: var(--color-text-dim); text-transform: uppercase; margin-bottom: var(--space-lg);
}
.detail-p { font-size: 16px; line-height: 1.85; color: var(--color-text-muted); margin-bottom: var(--space-md); }

.person-missions { display: flex; flex-direction: column; gap: 0; }
.person-mission-item {
  display: flex; align-items: center; gap: var(--space-lg); padding: var(--space-md) 0;
  border-bottom: 1px solid var(--color-border); flex-wrap: wrap;
}
.person-mission-item:last-child { border-bottom: none; }
.pm-id { font-family: var(--font-mono); font-size: 12px; font-weight: 500; color: var(--color-text); min-width: 110px; }
.pm-type { font-size: 14px; color: var(--color-text); min-width: 90px; }
.pm-date { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); flex: 1; }
.pm-link { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.05em; color: var(--color-text-dim); text-decoration: none; }
.pm-link:hover { color: var(--color-text); }

.detail-quote-block { border-bottom: none; text-align: center; padding-top: var(--space-xl); }
.big-quote { font-size: clamp(18px, 2.5vw, 24px); font-weight: 500; line-height: 1.6; color: var(--color-text); }

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
  .person-mission-item { flex-direction: column; align-items: flex-start; gap: var(--space-xs); }
}
</style>
