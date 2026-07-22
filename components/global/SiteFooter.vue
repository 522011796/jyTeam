<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="footer-dot">●</span>
          <span class="footer-name">{{ $t('footer.copyright') }}</span>
          <p class="footer-desc">{{ $t('footer.description') }}</p>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <h4 class="footer-col-title">{{ $t('footer.quick_links') }}</h4>
            <NuxtLink to="/mission" class="footer-link">MISSION</NuxtLink>
            <NuxtLink to="/people" class="footer-link">PEOPLE</NuxtLink>
            <NuxtLink to="/field" class="footer-link">FIELD</NuxtLink>
            <NuxtLink to="/journal" class="footer-link">JOURNAL</NuxtLink>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">{{ $t('footer.connect') }}</h4>
            <a href="#" class="footer-link">{{ $t('footer.join') }}</a>
            <a href="#" class="footer-link">{{ $t('footer.support') }}</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span class="footer-copy">&copy; 2024—2026 全域救援</span>
        <span class="footer-coords">{{ $t('site.location') }}</span>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter'
}
</script>

<style scoped>
.site-footer {
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border);
  padding: var(--space-3xl) var(--space-xl) var(--space-xl);
}

.footer-inner {
  max-width: var(--container-max);
  margin: 0 auto;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2xl);
  margin-bottom: var(--space-2xl);
}

.footer-brand {
  max-width: 300px;
}

.footer-dot {
  color: var(--color-accent);
  font-size: 8px;
  margin-right: 6px;
}

.footer-name {
  font-family: var(--font-en);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-text);
}

.footer-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: var(--space-md);
  line-height: 1.7;
}

.footer-links {
  display: flex;
  gap: var(--space-3xl);
}

.footer-col-title {
  font-family: var(--font-en);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--color-text-dim);
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}

.footer-link {
  display: block;
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: 4px 0;
  transition: color 300ms ease;
}

.footer-link:hover {
  color: var(--color-accent);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-dim);
  letter-spacing: 0.05em;
}

/* Mobile */
@media (max-width: 640px) {
  .site-footer {
    padding: var(--space-2xl) var(--space-md) var(--space-lg);
  }

  .footer-top {
    flex-direction: column;
    gap: var(--space-xl);
  }

  .footer-links {
    gap: var(--space-xl);
  }

  .footer-bottom {
    flex-direction: column;
    gap: var(--space-sm);
    align-items: flex-start;
  }
}
</style>
