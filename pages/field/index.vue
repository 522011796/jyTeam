<template>
  <div class="field-page" ref="page">
    <section class="page-hero">
      <div class="page-hero-content">
        <span class="page-tag">{{ $t('field.title') }}</span>
        <h1 class="page-title">{{ $t('field.subtitle') }}</h1>
      </div>
    </section>

    <section class="field-list" ref="list">
      <NuxtLink
        v-for="(cap, index) in capabilities"
        :key="cap.id"
        :to="`/field/${cap.id}`"
        class="field-row"
        :class="{ 'field-row-reverse': index % 2 !== 0 }"
        :data-reveal="true"
      >
        <div class="field-row-visual">
          <div class="field-row-placeholder">
            <span class="field-row-number">{{ cap.number }}</span>
            <span class="field-row-icon">{{ cap.icon }}</span>
          </div>
        </div>

        <div class="field-row-content">
          <span class="field-row-num">{{ cap.number }}</span>
          <h3 class="field-row-title">{{ cap.title }}</h3>
          <p class="field-row-desc">{{ cap.titleZh }}</p>
        </div>
      </NuxtLink>
    </section>
  </div>
</template>

<script>
import { capabilities } from '@/data'

export default {
  name: 'FieldPage',
  data() {
    return { capabilities }
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
.field-page {
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

.field-list {
  padding: var(--space-2xl) var(--space-xl) var(--space-4xl);
  max-width: var(--container-max);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.field-row {
  display: grid; text-decoration: none; color: inherit;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: center;
  padding: var(--space-2xl) 0;
  border-top: 1px solid var(--color-border);
}
.field-row:hover .field-row-title { color: var(--color-accent-alt); transition: color 300ms ease; }

.field-row:last-child {
  border-bottom: 1px solid var(--color-border);
}

.field-row-visual {
  order: 0;
}

.field-row-reverse .field-row-visual {
  order: 1;
}

.field-row-reverse .field-row-content {
  order: 0;
}

.field-row-placeholder {
  aspect-ratio: 4 / 3;
  background:
    radial-gradient(circle at 50% 50%, rgba(223, 255, 0, 0.02) 0%, transparent 60%),
    var(--color-bg-alt);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
}

.field-row-number {
  font-family: var(--font-mono);
  font-size: 64px;
  font-weight: 500;
  color: rgba(243, 242, 237, 0.04);
}

.field-row-icon {
  font-size: 32px;
  color: var(--color-text-muted);
}

.field-row-num {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: var(--space-md);
}

.field-row-title {
  font-family: var(--font-en);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.field-row-desc {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .field-page {
    padding-top: 60px;
  }

  .page-hero,
  .field-list {
    padding-left: var(--space-md);
    padding-right: var(--space-md);
  }

  .field-row,
  .field-row-reverse {
    grid-template-columns: 1fr;
  }

  .field-row-reverse .field-row-visual {
    order: 0;
  }
}
</style>
