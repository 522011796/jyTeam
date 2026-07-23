<template>
  <div class="site-wrapper public-site" :class="{ 'menu-is-open': menuOpen }">
    <SiteHeader />
    <FullscreenMenu />
    <main class="site-main">
      <Nuxt />
    </main>
    <SiteFooter />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SiteHeader from '@/components/global/SiteHeader.vue'
import FullscreenMenu from '@/components/global/FullscreenMenu.vue'
import SiteFooter from '@/components/global/SiteFooter.vue'

export default {
  name: 'DefaultLayout',
  components: {
    SiteHeader,
    FullscreenMenu,
    SiteFooter
  },
  computed: {
    ...mapGetters(['menuOpen'])
  },
  mounted() {
    if (process.client) {
      // 初始化后标记加载完成
      this.$nextTick(() => {
        this.$store.commit('setLoading', false)
      })
    }
  }
}
</script>

<style scoped>
.site-wrapper {
  position: relative;
  min-height: 100vh;
  background: var(--color-bg);
}

.site-main {
  position: relative;
  z-index: var(--z-content);
}

.site-wrapper.menu-is-open .site-main {
  overflow: hidden;
}
</style>
