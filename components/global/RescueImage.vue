<template>
  <div class="rescue-img" :class="themeClass" :style="imgStyle">
    <img
      v-if="!imgError"
      :src="imgSrc"
      :alt="imgAlt"
      class="rescue-img__photo"
      loading="lazy"
      @error="onImgError"
    />
    <div class="rescue-img__terrain" v-if="imgError"></div>
    <div class="rescue-img__overlay"></div>
    <div class="rescue-img__label" v-if="showLabel">
      <span class="rescue-img__num" v-if="labelNum">{{ labelNum }}</span>
      <span class="rescue-img__icon" v-if="labelIcon">{{ labelIcon }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
/*
 * 救援主题图片组件
 * 使用 Unsplash 真实摄影作品，加载失败时回落 CSS 渐变。
 * theme: mountain / forest / rain / night / terrain / portrait
 * 也可通过 src prop 传入自定义图片地址。
 */

const fallbackGradients = {
  mountain: 'linear-gradient(175deg, #b8c6d4 0%, #8d9fb0 30%, #6b7d8e 60%, #4a5a68 100%)',
  forest:   'linear-gradient(165deg, #3a5a3a 0%, #2d4a2d 25%, #1a3a1a 55%, #0f2a0f 100%)',
  rain:     'linear-gradient(180deg, #5a6878 0%, #4a5a58 30%, #3a4a48 70%, #2a3a38 100%)',
  night:    'linear-gradient(170deg, #1a2a3a 0%, #0f1f2f 40%, #0a1520 70%, #050d15 100%)',
  terrain:  'linear-gradient(160deg, #c8b896 0%, #a89878 30%, #887860 60%, #685840 100%)',
  portrait: 'linear-gradient(165deg, #9a9a96 0%, #8a8a86 30%, #6a6a66 60%, #4a4a46 100%)'
}

/*
 * Unsplash 摄影作品 — 全部免费使用，无需署名（但建议署名以尊重摄影师）
 * 覆盖山地搜救、森林、雨夜、夜间、地形、人物等救援主题
 */
const themeImages = {
  mountain: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&fit=crop',
  forest:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80&fit=crop',
  rain:     'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&q=80&fit=crop',
  night:    'https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=1200&q=80&fit=crop',
  terrain:  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&fit=crop',
  portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&fit=crop'
}

export default {
  name: 'RescueImage',
  props: {
    theme: { type: String, default: 'mountain' },
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    width: { type: [String, Number], default: null },
    height: { type: [String, Number], default: null },
    labelNum: { type: String, default: '' },
    labelIcon: { type: String, default: '' },
    showLabel: { type: Boolean, default: false }
  },
  data() {
    return { imgError: false }
  },
  computed: {
    themeClass() {
      return `rescue-img--${this.theme}`
    },
    imgSrc() {
      return this.src || themeImages[this.theme] || themeImages.mountain
    },
    imgAlt() {
      return this.alt || this.theme
    },
    fallbackBg() {
      return fallbackGradients[this.theme] || fallbackGradients.mountain
    },
    imgStyle() {
      const style = {}
      if (this.width) style.width = typeof this.width === 'number' ? `${this.width}px` : this.width
      if (this.height) style.height = typeof this.height === 'number' ? `${this.height}px` : this.height
      return style
    }
  },
  methods: {
    onImgError() {
      this.imgError = true
    }
  }
}
</script>

<style scoped>
.rescue-img {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* 每个主题的 fallback 背景色 — 图片加载前/失败时可见 */
.rescue-img--mountain  { background: linear-gradient(175deg, #b8c6d4 0%, #8d9fb0 30%, #6b7d8e 60%, #4a5a68 100%); }
.rescue-img--forest    { background: linear-gradient(165deg, #3a5a3a 0%, #2d4a2d 25%, #1a3a1a 55%, #0f2a0f 100%); }
.rescue-img--rain      { background: linear-gradient(180deg, #5a6878 0%, #4a5a58 30%, #3a4a48 70%, #2a3a38 100%); }
.rescue-img--night     { background: linear-gradient(170deg, #1a2a3a 0%, #0f1f2f 40%, #0a1520 70%, #050d15 100%); }
.rescue-img--terrain   { background: linear-gradient(160deg, #c8b896 0%, #a89878 30%, #887860 60%, #685840 100%); }
.rescue-img--portrait  { background: linear-gradient(165deg, #9a9a96 0%, #8a8a86 30%, #6a6a66 60%, #4a4a46 100%); }

/* 真实图片 */
.rescue-img__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 800ms var(--ease-out-expo);
}

.rescue-img:hover .rescue-img__photo {
  transform: scale(1.04);
}

/* CSS 地形纹理 — 仅在图片加载失败时显示 */
.rescue-img__terrain {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      190deg,
      transparent,
      transparent 8px,
      rgba(255, 255, 255, 0.03) 8px,
      rgba(255, 255, 255, 0.03) 9px
    ),
    repeating-linear-gradient(
      175deg,
      transparent,
      transparent 15px,
      rgba(0, 0, 0, 0.04) 15px,
      rgba(0, 0, 0, 0.04) 16px
    );
  mask-image: radial-gradient(ellipse at 50% 70%, transparent 0%, black 100%);
}

/* 统一暗色叠加层 — 保证文字可读 */
.rescue-img__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.45) 100%);
  z-index: 1;
}

.rescue-img__label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.rescue-img__num {
  font-family: var(--font-mono);
  font-size: clamp(32px, 5vw, 64px);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.12);
  letter-spacing: 0.05em;
}

.rescue-img__icon {
  font-size: clamp(28px, 4vw, 48px);
  color: rgba(255, 255, 255, 0.15);
}

.rescue-img--portrait .rescue-img__overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.2) 100%);
}

.rescue-img--portrait .rescue-img__terrain {
  mask-image: radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%);
}
</style>
