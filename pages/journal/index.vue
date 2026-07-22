<template>
  <div class="journal-page" ref="page">
    <section class="page-hero">
      <div class="page-hero-content">
        <span class="page-tag">{{ $t('journal.title') }}</span>
        <h1 class="page-title">{{ $t('journal.subtitle') }}</h1>
      </div>
    </section>

    <section class="journal-list" ref="list">
      <NuxtLink
        v-for="entry in entries"
        :key="entry.id"
        :to="`/journal/${entry.id}`"
        class="journal-article"
        :data-reveal="true"
      >
        <div class="journal-article-image">
          <RescueImage :theme="entry.imageTheme || 'mountain'" />
          <div class="journal-article-placeholder">
            <span class="article-placeholder-num">#{{ entry.id }}</span>
          </div>
        </div>

        <div class="journal-article-content">
          <div class="article-meta">
            <span class="article-id">FIELD NOTES / {{ entry.id }}</span>
            <span class="article-date">{{ entry.date }}</span>
            <span class="article-location">{{ entry.location }}</span>
          </div>

          <h2 class="article-title">{{ entry.title }}</h2>

          <p class="article-excerpt">{{ entry.excerpt }}</p>

          <span class="article-link">{{ $t('journal.read_story') }} →</span>
        </div>
      </NuxtLink>
    </section>
  </div>
</template>

<script>
import { journalEntries } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'JournalPage',
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
      this.$nextTick(() => {
        const reveals = this.$refs.page.querySelectorAll('[data-reveal]')
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
.journal-page {
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
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 600;
  color: var(--color-text);
}

.journal-list {
  padding: var(--space-2xl) var(--space-xl) var(--space-4xl);
  max-width: var(--container-narrow);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.journal-article-image {
  aspect-ratio: 16 / 9;
  background: var(--color-bg-card);
  margin-bottom: var(--space-xl);
  overflow: hidden;
  position: relative;
}

.journal-article:hover .journal-article-image {
  transform: scale(1.03);
  transition: transform 600ms var(--ease-out-expo);
}

.journal-article { text-decoration: none; color: inherit; display: block; }

.journal-article-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(135deg, rgba(223, 255, 0, 0.02) 0%, transparent 60%),
    var(--color-bg-card);
}

.article-placeholder-num {
  font-family: var(--font-mono);
  font-size: 48px;
  color: rgba(243, 242, 237, 0.03);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.article-id {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-accent);
}

.article-date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-dim);
}

.article-location {
  font-size: 13px;
  color: var(--color-text-muted);
}

.article-title {
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.article-excerpt {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
  max-width: 650px;
}

.article-link {
  font-family: var(--font-en);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text-dim);
  transition: color 300ms ease;
}

.journal-article:hover .article-link {
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .journal-page {
    padding-top: 60px;
  }

  .page-hero,
  .journal-list {
    padding-left: var(--space-md);
    padding-right: var(--space-md);
  }

  .journal-list {
    gap: var(--space-2xl);
  }
}
</style>
