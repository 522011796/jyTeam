<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <div class="header-info">
        <h2 class="dashboard-title">仪表盘</h2>
        <p class="dashboard-subtitle">内容管理总览</p>
      </div>
    </header>

    <div class="dashboard-grid">
      <NuxtLink to="/admin/missions" class="dashboard-card">
        <span class="card-stat">{{ missions.length }}<span class="card-unit"> 条</span></span>
        <span class="card-name">行动记录</span>
        <span class="card-en">MISSION</span>
      </NuxtLink>

      <NuxtLink to="/admin/people" class="dashboard-card">
        <span class="card-stat">{{ people.length }}<span class="card-unit"> 位</span></span>
        <span class="card-name">队员档案</span>
        <span class="card-en">PEOPLE</span>
      </NuxtLink>

      <NuxtLink to="/admin/capabilities" class="dashboard-card">
        <span class="card-stat">{{ capabilities.length }}<span class="card-unit"> 项</span></span>
        <span class="card-name">现场能力</span>
        <span class="card-en">CAPABILITIES</span>
      </NuxtLink>

      <NuxtLink to="/admin/journal" class="dashboard-card">
        <span class="card-stat">{{ journalEntries.length }}<span class="card-unit"> 篇</span></span>
        <span class="card-name">战地记录</span>
        <span class="card-en">JOURNAL</span>
      </NuxtLink>
    </div>

    <!-- 网站设置 -->
    <div class="settings-section">
      <h3 class="section-title">网站设置(皮肤主题)</h3>

      <!-- 皮肤主题 -->
      <div class="theme-grid">
        <button
          v-for="t in themes"
          :key="t.key"
          class="theme-card"
          :class="{ active: currentTheme === t.key }"
          @click="selectTheme(t.key)"
        >
          <span class="theme-preview">
            <span class="theme-swatch" :style="{ background: t.preview[0] }"></span>
            <span class="theme-swatch" :style="{ background: t.preview[1] }"></span>
          </span>
          <span class="theme-name">{{ t.name }}</span>
          <span class="theme-label">{{ t.label }}</span>
        </button>
      </div>

      <!-- Xcar 开关 -->
      <div class="dashboard-settings">
        <span class="settings-label">Xcar 标识</span>
        <span class="settings-note">网站页头旁显示 xcar.png</span>
        <button
          class="toggle-switch"
          :class="{ active: xcarOn }"
          @click="toggleXcar"
        >
          <span class="toggle-knob"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { missions, people, capabilities, journalEntries } from '@/data'

export default {
  name: 'AdminDashboard',
  layout: 'admin',
  data() {
    return {
      missions,
      people,
      capabilities,
      journalEntries,
      xcarOn: false,
      themes: [],
      currentTheme: 'default'
    }
  },
  mounted() {
    if (process.client) {
      this.xcarOn = localStorage.getItem('xcar_enabled') === 'true'
      this.themes = this.$themes
      this.currentTheme = this.$theme()
    }
  },
  methods: {
    toggleXcar() {
      this.xcarOn = !this.xcarOn
      this.$toggleXcar(this.xcarOn)
    },
    selectTheme(key) {
      this.currentTheme = key
      this.$setTheme(key)
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 100%;
}

/* ==============================
   Header
   ============================== */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.header-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.dashboard-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.dashboard-subtitle {
  font-size: 13px;
  color: #999;
  margin: 0;
}

/* ==============================
   Stat Cards — 4 in a row
   ============================== */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.dashboard-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: #fff;
  border: 1px solid #e8e5df;
  border-radius: 8px;
  padding: 20px 18px;
  text-decoration: none;
  color: inherit;
  transition: border-color 200ms ease, box-shadow 200ms ease;
  min-width: 0;
}

.dashboard-card:hover {
  border-color: #c8b896;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.card-stat {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 6px;
  white-space: nowrap;
}

.card-unit {
  font-size: 16px;
  font-weight: 400;
  color: #999;
  white-space: nowrap;
}

.card-name {
  font-size: 13px;
  color: #888;
  font-weight: 500;
  white-space: nowrap;
}

.card-en {
  font-size: 10px;
  color: #bbb;
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
  margin-top: 2px;
  text-transform: uppercase;
}

/* ==============================
   Settings
   ============================== */
.settings-section {
  margin-top: 36px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 14px;
}

/* Theme picker */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 14px;
  background: #fff;
  border: 1px solid #e8e5df;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 200ms ease, box-shadow 200ms ease;
  text-align: left;
  min-width: 0;
}

.theme-card:hover {
  border-color: #c8b896;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.theme-card.active {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 2px rgba(26,26,26,0.08);
}

.theme-preview {
  display: flex;
  gap: 0;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  height: 36px;
}

.theme-swatch {
  flex: 1;
  height: 100%;
}

.theme-name {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  white-space: nowrap;
}

.theme-label {
  font-size: 11px;
  color: #aaa;
  white-space: nowrap;
}

/* Xcar toggle */

.dashboard-settings {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  padding: 10px 14px;
  background: #fafaf8;
  border: 1px solid #e8e5df;
  border-radius: 8px;
  max-width: 440px;
}

.settings-label {
  font-size: 13px;
  font-weight: 700;
  color: #555;
}

.settings-note {
  font-size: 12px;
  color: #bbb;
  flex: 1;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #d0cfc7;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 200ms ease;
  flex-shrink: 0;
  padding: 0;
}

.toggle-switch.active {
  background: #2e7d32;
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: transform 200ms ease;
}

.toggle-switch.active .toggle-knob {
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-card {
    padding: 18px 12px;
  }

  .card-stat {
    font-size: 26px;
  }

  .theme-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-settings {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
