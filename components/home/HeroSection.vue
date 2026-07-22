<template>
  <section class="hero" ref="hero">
    <div class="hero-bg">
      <RescueImage theme="mountain" />
      <div class="hero-gradient"></div>
    </div>

    <div class="hero-content" ref="heroContent">
      <div class="hero-eyebrow">
        <span class="hero-dot"></span>
        <span class="hero-status">{{ $t('site.status_ready') }}</span>
        <span class="hero-unit">{{ $t('site.name') }}</span>
        <span class="hero-location">{{ $t('site.location') }}</span>
      </div>

      <h1 class="hero-title">
        <span class="hero-title-line" ref="titleLine1">{{ $t('home.hero_title') }}</span>
      </h1>

      <p class="hero-subtitle" ref="heroSub">
        {{ $t('home.hero_sub') }}
      </p>

      <div class="hero-bottom" ref="heroBottom">
        <span class="hero-scroll">{{ $t('home.scroll') }}</span>
        <span class="hero-arrow">↓</span>
      </div>
    </div>
  </section>
</template>

<script>
import RescueImage from '@/components/global/RescueImage.vue'

export default {
  name: 'HeroSection',
  components: { RescueImage },
  mounted() {
    this.animateIn()
  },
  methods: {
    animateIn() {
      if (!process.client) return
      const { gsap } = this

      const tl = this.$gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        this.$refs.hero,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      )
        .fromTo(
          this.$refs.heroContent.querySelector('.hero-eyebrow'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.2'
        )
        .fromTo(
          this.$refs.heroContent.querySelector('.hero-title-line'),
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.3'
        )
        .fromTo(
          this.$refs.heroSub,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          this.$refs.heroBottom,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
    }
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    rgba(250, 250, 247, 0) 0%,
    rgba(250, 250, 247, 0.4) 55%,
    rgba(250, 250, 247, 0.92) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 var(--space-xl);
  max-width: var(--container-narrow);
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.hero-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: status-pulse 2s ease-in-out infinite;
}

.hero-status {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--color-accent);
}

.hero-unit {
  font-family: var(--font-en);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  padding-left: var(--space-md);
  border-left: 1px solid var(--color-border-light);
}

.hero-location {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-dim);
  letter-spacing: 0.05em;
}

.hero-title {
  margin-bottom: var(--space-xl);
  overflow: hidden;
}

.hero-title-line {
  font-family: var(--font-en);
  font-size: clamp(56px, 10vw, 140px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--color-text);
  text-transform: uppercase;
  display: block;
}

.hero-subtitle {
  font-family: var(--font-zh);
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 500;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-3xl);
}

.hero-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.hero-scroll {
  font-family: var(--font-en);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--color-text-dim);
  text-transform: uppercase;
}

.hero-arrow {
  font-size: 16px;
  color: var(--color-text-dim);
  animation: arrow-bounce 2s ease-in-out infinite;
}

@keyframes arrow-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(6px); opacity: 1; }
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

@media (max-width: 640px) {
  .hero {
    min-height: 100vh;
    min-height: 100dvh;
  }

  .hero-eyebrow {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .hero-unit {
    border-left: none;
    padding-left: 0;
  }
}
</style>
