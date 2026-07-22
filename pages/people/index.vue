<template>
  <div class="people-page" ref="page">
    <section class="page-hero">
      <div class="page-hero-content">
        <span class="page-tag">{{ $t('people.title') }}</span>
        <h1 class="page-title">{{ $t('people.subtitle') }}</h1>
        <blockquote class="page-quote">{{ $t('people.motto') }}</blockquote>
        <div class="page-stat">
          <span class="stat-big">23</span>
          <span class="stat-label">{{ $t('people.total') }}</span>
        </div>
      </div>
    </section>

    <section class="people-full-grid" ref="grid">
      <NuxtLink
        v-for="person in people"
        :key="person.id"
        :to="`/people/${person.id}`"
        class="person-full-card"
        :data-reveal="true"
      >
        <div class="person-full-image">
          <RescueImage :theme="person.imageTheme || 'portrait'" :src="person.image || ''" />
          <div class="person-full-placeholder">
            <span class="placeholder-unit">{{ person.unit }}</span>
          </div>
        </div>

        <div class="person-full-info">
          <div class="person-full-header">
            <div>
              <h3 class="person-full-name">{{ person.name }}</h3>
              <span class="person-full-name-en">{{ person.nameEn }}</span>
            </div>
            <span class="person-full-role-tag">{{ person.role }}</span>
          </div>

          <p class="person-full-story">{{ person.story }}</p>

          <div class="person-full-footer">
            <span class="person-full-background">{{ person.background }}</span>
            <span class="person-full-joined">JOINED {{ person.joined }}</span>
          </div>
        </div>
      </NuxtLink>
    </section>

    <section class="people-outro" data-reveal>
      <p class="outro-text">{{ $t('people.bottom') }}</p>
    </section>
  </div>
</template>

<script>
import { people } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'PeoplePage',
  components: { RescueImage },
  data() {
    return { people }
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
.people-page {
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
  margin-bottom: var(--space-lg);
}

.page-quote {
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 500;
  line-height: 1.6;
  color: var(--color-text);
  max-width: 700px;
  margin-bottom: var(--space-xl);
}

.page-stat {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
}

.stat-big {
  font-family: var(--font-mono);
  font-size: 48px;
  font-weight: 500;
  color: var(--color-text);
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-muted);
}

/* Full Grid */
.people-full-grid {
  padding: var(--space-2xl) var(--space-xl);
  max-width: var(--container-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2xl);
}

.person-full-card {
  display: flex; text-decoration: none; color: inherit;
  flex-direction: column;
  gap: var(--space-lg);
}

.person-full-image {
  aspect-ratio: 16 / 10;
  background: var(--color-bg-card);
  overflow: hidden;
  position: relative;
}

.person-full-card:hover .person-full-image {
  transform: scale(1.03);
  transition: transform 600ms var(--ease-out-expo);
}

.person-full-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 50%, rgba(223, 255, 0, 0.02) 0%, transparent 50%),
    var(--color-bg-card);
}

.placeholder-unit {
  font-family: var(--font-mono);
  font-size: 56px;
  font-weight: 500;
  color: rgba(243, 242, 237, 0.04);
}

.person-full-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.person-full-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
}

.person-full-name-en {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-dim);
  letter-spacing: 0.1em;
}

.person-full-role-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  padding: 4px 10px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
}

.person-full-story {
  font-size: 15px;
  line-height: 1.75;
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.person-full-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.person-full-background {
  font-size: 12px;
  color: var(--color-text-dim);
}

.person-full-joined {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-text-dim);
}

/* Outro */
.people-outro {
  padding: var(--space-3xl) var(--space-xl) var(--space-4xl);
  text-align: center;
  max-width: var(--container-max);
  margin: 0 auto;
}

.outro-text {
  font-family: var(--font-en);
  font-size: clamp(16px, 2.5vw, 24px);
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
}

@media (max-width: 640px) {
  .people-page {
    padding-top: 60px;
  }

  .page-hero,
  .people-full-grid {
    padding-left: var(--space-md);
    padding-right: var(--space-md);
  }

  .people-full-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}
</style>
