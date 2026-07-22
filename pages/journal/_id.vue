<template>
  <div class="detail-page" ref="page">
    <div class="detail-back-bar">
      <NuxtLink to="/journal" class="detail-back-link">
        <span class="back-arrow">←</span>
        <span class="back-label">返回记录列表</span>
      </NuxtLink>
    </div>
    <section class="detail-hero">
      <div class="detail-hero-image">
        <RescueImage :theme="entry.imageTheme || 'mountain'" />
      </div>
      <div class="detail-hero-gradient"></div>
      <div class="detail-hero-content">
        <span class="detail-tag">FIELD NOTES / {{ entry.id }}</span>
        <h1 class="detail-title">{{ entry.title }}</h1>
        <p class="detail-subtitle">{{ entry.date }} · {{ entry.location }}</p>
        <div class="detail-tags" v-if="entry.detail && entry.detail.tags">
          <span v-for="tag in tagList" :key="tag" class="detail-tag-item">{{ tag }}</span>
        </div>
      </div>
    </section>

    <article class="detail-body" ref="body">
      <div class="detail-body-inner">
        <div class="detail-section article-content" data-reveal>
          <template v-for="(block, bi) in articleBlocks">
            <p class="detail-p" v-if="block.type === 'text'" :key="'t' + bi">{{ block.content }}</p>
            <figure class="article-figure" v-else :key="'i' + bi">
              <div class="article-figure-img">
                <RescueImage v-if="block.theme" :theme="block.theme" />
                <img v-else :src="block.src" :alt="block.caption" class="article-figure-local" />
              </div>
              <figcaption class="article-figcaption" v-if="block.caption">{{ block.caption }}</figcaption>
            </figure>
          </template>
        </div>

        <div class="detail-section detail-related" data-reveal v-if="relatedMission">
          <h2 class="detail-h2">相关任务</h2>
          <NuxtLink :to="`/mission/${relatedMission.id}`" class="related-card">
            <span class="related-id">MISSION #{{ relatedMission.id }}</span>
            <span class="related-type">{{ relatedMission.type }}</span>
            <span class="related-date">{{ relatedMission.date }}</span>
            <span class="related-link">查看详情 →</span>
          </NuxtLink>
        </div>

        <div class="detail-section" data-reveal>
          <div class="detail-data-row">
            <div class="detail-data">
              <span class="dd-value">{{ entry.location }}</span>
              <span class="dd-label">地点</span>
            </div>
            <div class="detail-data">
              <span class="dd-value">{{ entry.date }}</span>
              <span class="dd-label">日期</span>
            </div>
            <div class="detail-data">
              <span class="dd-value">FIELD NOTES</span>
              <span class="dd-label">系列</span>
            </div>
            <div class="detail-data">
              <span class="dd-value">#{{ entry.id }}</span>
              <span class="dd-label">编号</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { journalEntries, missions } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'JournalDetail',
  components: { RescueImage },
  data() {
    return {
      entry: {
        detail: { fullText: '', relatedMission: '', tags: '', images: [] },
        location: '',
        date: '',
        id: '',
        title: '',
        imageTheme: 'mountain'
      }
    }
  },
  computed: {
    tagList() {
      const tags = this.entry.detail.tags
      if (!tags) return []
      if (Array.isArray(tags)) return tags
      return String(tags).split(/,，/).map(s => s.trim()).filter(Boolean)
    },
    articleBlocks() {
      const paragraphs = (this.entry.detail.fullText || '').split('\n').filter(p => p.trim())
      const images = this.entry.detail.images || []
      const blocks = []

      paragraphs.forEach((p, i) => {
        blocks.push({ type: 'text', content: p })
        const imgAfter = images.filter(im => im.after === i)
        imgAfter.forEach(im => {
          blocks.push({
            type: 'image',
            theme: im.theme || null,
            src: im.src || null,
            caption: im.caption
          })
        })
      })

      return blocks
    },
    relatedMission() {
      if (!this.entry.detail.relatedMission) return null
      return missions.find(m => m.id === this.entry.detail.relatedMission) || null
    }
  },
  mounted() {
    const id = this.$route.params.id
    this.entry = journalEntries.find(e => e.id === id) || journalEntries[0]
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
.detail-tag {
  font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.15em;
  color: var(--color-text); display: block; margin-bottom: var(--space-sm);
}
.detail-title {
  font-family: var(--font-zh); font-size: clamp(28px, 4vw, 48px); font-weight: 700;
  color: var(--color-text); margin-bottom: var(--space-sm); max-width: 700px;
}
.detail-subtitle { font-size: 14px; color: var(--color-text-muted); margin-bottom: var(--space-md); }
.detail-tags { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
.detail-tag-item {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.05em; color: var(--color-text-muted);
  padding: 4px 10px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);
}

.detail-body { background: var(--color-bg); padding: var(--space-2xl) 0 var(--space-4xl); }
.detail-body-inner { max-width: var(--container-narrow); margin: 0 auto; padding: 0 var(--space-xl); }
.detail-section { margin-bottom: var(--space-2xl); padding-bottom: var(--space-2xl); border-bottom: 1px solid var(--color-border); }
.detail-h2 {
  font-family: var(--font-en); font-size: 12px; font-weight: 600; letter-spacing: 0.15em;
  color: var(--color-text-dim); text-transform: uppercase; margin-bottom: var(--space-lg);
}
.detail-p { font-size: 16px; line-height: 1.85; color: var(--color-text-muted); margin-bottom: var(--space-md); }

.article-content { border-bottom: none; }
.article-figure { margin: var(--space-xl) 0; }
.article-figure-img {
  position: relative; aspect-ratio: 16 / 9; overflow: hidden; border-radius: var(--radius-md);
  background: var(--color-bg-alt);
}
.article-figure-local {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
.article-figcaption {
  font-size: 12px; color: var(--color-text-dim); text-align: center; margin-top: var(--space-sm);
  font-style: italic;
}

.detail-related { border-bottom: none; padding-bottom: 0; }
.related-card {
  display: flex; align-items: center; gap: var(--space-lg); padding: var(--space-md) var(--space-lg);
  background: var(--color-bg-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md);
  text-decoration: none; flex-wrap: wrap;
}
.related-id { font-family: var(--font-mono); font-size: 12px; font-weight: 500; color: var(--color-text); min-width: 110px; }
.related-type { font-size: 14px; color: var(--color-text); min-width: 90px; }
.related-date { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-muted); flex: 1; }
.related-link { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.05em; color: var(--color-text-dim); }
.related-card:hover { border-color: var(--color-border-light); }
.related-card:hover .related-link { color: var(--color-text); }

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
  .related-card { flex-direction: column; align-items: flex-start; gap: var(--space-sm); }
}
</style>
