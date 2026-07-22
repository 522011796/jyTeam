<template>
  <section class="journal-wrap" ref="section">
    <div class="journal-section">
      <div class="journal-header" data-reveal>
        <span class="section-tag">{{ $t('home.journal_title') }}</span>
        <h2 class="section-title">{{ $t('home.journal_sub') }}</h2>
      </div>

      <div class="journal-grid">
        <NuxtLink
          v-for="(entry, index) in entries"
          :key="entry.id"
          :to="`/journal/${entry.id}`"
          class="journal-card"
          :data-reveal="true"
        >
          <div class="journal-card-image">
            <RescueImage :theme="entry.imageTheme || 'mountain'" />
            <div class="journal-placeholder">
              <span class="placeholder-number">#{{ entry.id }}</span>
            </div>
          </div>
          <div class="journal-card-content">
            <div class="journal-card-meta">
              <span class="journal-card-id">FIELD NOTES / {{ entry.id }}</span>
              <span class="journal-card-date">{{ entry.date }}</span>
            </div>
            <h3 class="journal-card-title">{{ entry.title }}</h3>
            <p class="journal-card-excerpt">{{ entry.excerpt }}</p>
            <span class="journal-card-link">{{ $t('journal.read_story') }} →</span>
          </div>
        </NuxtLink>
      </div>

      <div class="journal-cta" data-reveal>
        <NuxtLink to="/journal" class="cta-link">
          {{ $t('common.view_all') }} →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
import { journalEntries } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'JournalPreviewSection',
  components: { RescueImage },
  data() {
    return {
      entries: journalEntries
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
/* 外层全宽 */
.journal-wrap {
  width: 100%;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

/* 内层居中 */
.journal-section {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-4xl) var(--space-xl);
}

.journal-header {
  margin-bottom: var(--space-2xl);
}

.journal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.journal-card-image {
  aspect-ratio: 4 / 3;
  background: var(--color-bg-card);
  margin-bottom: var(--space-lg);
  overflow: hidden;
  position: relative;
}

.journal-card:hover .journal-card-image {
  transform: scale(1.02);
  transition: transform 600ms var(--ease-out-expo);
}
.journal-card { text-decoration: none; color: inherit; display: block; }

.journal-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(135deg, rgba(223, 255, 0, 0.02) 0%, transparent 50%),
    var(--color-bg-card);
}

.placeholder-number {
  font-family: var(--font-mono);
  font-size: 32px;
  color: rgba(243, 242, 237, 0.04);
}

.journal-card-content {
  padding: 0 var(--space-sm);
}

.journal-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.journal-card-id {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-accent);
}

.journal-card-date {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-dim);
}

.journal-card-title {
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.journal-card-excerpt {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: var(--space-lg);
}

.journal-card-link {
  font-family: var(--font-en);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text-dim);
  transition: color 300ms ease;
}

.journal-card:hover .journal-card-link {
  color: var(--color-accent);
}

.journal-cta {
  text-align: center;
}

@media (max-width: 1024px) {
  .journal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .journal-section {
    padding: var(--space-2xl) var(--space-md);
  }

  .journal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
