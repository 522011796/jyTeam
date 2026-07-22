<template>
  <section class="next-call" ref="section">
    <div class="next-bg">
      <div class="next-gradient-top"></div>
      <div class="next-gradient-bottom"></div>
    </div>

    <div class="next-content" data-reveal>
      <h2 class="next-title">{{ $t('home.next_title') }}</h2>
      <p class="next-subtitle">{{ $t('home.next_sub') }}</p>

      <p class="next-question">如果你也愿意出发。</p>

      <div class="next-actions">
        <a href="#" class="next-btn next-btn-primary">
          {{ $t('home.next_cta_join') }}
        </a>
        <a href="#" class="next-btn next-btn-secondary">
          {{ $t('home.next_cta_support') }}
        </a>
      </div>
    </div>

    <div class="next-bottom" data-reveal>
      <p class="next-bottom-text">{{ $t('home.next_bottom') }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NextCallSection',
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
.next-call {
  position: relative;
  padding: var(--space-4xl) 0;
  text-align: center;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.next-bg {
  position: absolute;
  inset: 0;
  background: var(--color-bg);
}

.next-gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to bottom, var(--color-bg-alt), transparent);
}

.next-gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to top, var(--color-bg), transparent);
}

.next-content {
  position: relative;
  z-index: 2;
  max-width: var(--container-narrow);
  padding: 0 var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.next-title {
  font-family: var(--font-en);
  font-size: clamp(40px, 7vw, 80px);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.next-subtitle {
  font-size: clamp(16px, 2vw, 22px);
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
}

.next-question {
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--space-2xl);
}

.next-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.next-btn {
  display: inline-block;
  padding: 14px 40px;
  font-family: var(--font-en);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all 300ms var(--ease-out-expo);
}

.next-btn-primary {
  background: var(--color-accent);
  color: var(--color-bg);
}

.next-btn-primary:hover {
  background: var(--color-accent-dim);
  transform: translateY(-2px);
}

.next-btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border-light);
}

.next-btn-secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: translateY(-2px);
}

.next-bottom {
  position: relative;
  z-index: 2;
  padding: 0 var(--space-xl);
}

.next-bottom-text {
  font-family: var(--font-zh);
  font-size: clamp(16px, 2vw, 22px);
  font-weight: 500;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .next-call {
    padding: var(--space-2xl) var(--space-md);
    min-height: 50vh;
  }

  .next-actions {
    flex-direction: column;
  }

  .next-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
