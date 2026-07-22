<template>
  <section class="people-wrap" ref="section">
    <div class="people-section">
      <div class="people-header" data-reveal>
        <span class="section-tag">{{ $t('home.people_title') }}</span>
        <blockquote class="people-quote">
          {{ $t('home.people_sub') }}
        </blockquote>
      </div>

      <div class="people-grid" ref="grid">
        <NuxtLink
          v-for="(person, index) in people"
          :key="person.id"
          :to="`/people/${person.id}`"
          class="person-card"
          :data-reveal="true"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="person-image">
            <RescueImage :theme="person.imageTheme || 'portrait'" :src="person.image || ''" />
            <div class="person-placeholder">
              <span class="person-placeholder-number">{{ person.unit }}</span>
            </div>
          </div>
          <div class="person-info">
            <div class="person-meta">
              <span class="person-name">{{ person.name }}</span>
              <span class="person-name-en">{{ person.nameEn }}</span>
            </div>
            <span class="person-role">{{ person.role }} / {{ person.background }}</span>
            <p class="person-story">「{{ person.story.replace(/「|」/g, '') }}」</p>
            <span class="person-joined">JOINED {{ person.joined }}</span>
          </div>
        </NuxtLink>
      </div>

      <div class="people-variety" data-reveal>
        <span class="variety-label">{{ $t('home.people_variety') }}</span>
      </div>

      <div class="people-bottom" data-reveal>
        <p class="people-bottom-text">{{ $t('home.people_zh') }}</p>
      </div>

      <div class="people-cta" data-reveal>
        <NuxtLink to="/people" class="cta-link">
          {{ $t('common.view_all') }} →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
import { people } from '@/data'
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'PeopleSection',
  components: { RescueImage },
  data() {
    return {
      people: people.slice(0, 6)
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
.people-wrap {
  width: 100%;
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

/* 内层居中 */
.people-section {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-4xl) var(--space-xl);
}

.people-header {
  margin-bottom: var(--space-2xl);
}

.people-quote {
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 500;
  line-height: 1.6;
  color: var(--color-text);
  max-width: 700px;
  margin-top: var(--space-md);
}

.people-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.person-card {
  opacity: 0; display: block; text-decoration: none; color: inherit;
  transform: translateY(40px);
  transition: opacity 0.8s var(--ease-out-expo),
              transform 0.8s var(--ease-out-expo);
  transition-delay: var(--delay, 0s);
}

.person-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.person-image {
  aspect-ratio: 3 / 4;
  background: var(--color-bg-card);
  margin-bottom: var(--space-lg);
  overflow: hidden;
  position: relative;
}

.person-card:hover .person-image {
  transform: scale(1.02);
  transition: transform 600ms var(--ease-out-expo);
}

.person-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 50%, rgba(223, 255, 0, 0.03) 0%, transparent 60%),
    var(--color-bg-card);
}

.person-placeholder-number {
  font-family: var(--font-mono);
  font-size: 48px;
  font-weight: 500;
  color: rgba(243, 242, 237, 0.05);
}

.person-info {
  padding: 0 var(--space-sm);
}

.person-meta {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.person-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.person-name-en {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-dim);
  letter-spacing: 0.1em;
}

.person-role {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.person-story {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.person-joined {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-text-dim);
}

.people-variety {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.variety-label {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}

.people-bottom {
  text-align: center;
}

.people-bottom-text {
  font-family: var(--font-en);
  font-size: clamp(14px, 2vw, 20px);
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
}

.people-cta {
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
  .people-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .people-section {
    padding: var(--space-2xl) var(--space-md);
  }

  .people-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .person-image {
    aspect-ratio: 16 / 10;
  }
}
</style>
