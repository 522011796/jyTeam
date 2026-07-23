<template>
  <div class="capabilities-admin">
    <!-- ========== Header ========== -->
    <header class="page-header">
      <div class="page-header-left">
        <h2 class="page-title">现场能力管理</h2>
        <span class="page-count">{{ capabilities.length }} 项能力</span>
      </div>
      <button class="btn-primary" @click="openCreate">
        <span class="btn-icon">+</span> 新增能力
      </button>
    </header>

    <!-- ========== Main Content ========== -->
    <div class="capabilities-layout">
      <!-- Left: Table -->
      <section class="capabilities-list" :class="{ 'has-panel': editing }">
        <div v-if="loading" class="list-state">加载中...</div>
        <div v-else-if="capabilities.length === 0" class="list-state empty">
          <p>暂无能力数据</p>
          <button class="btn-link" @click="openCreate">创建第一项能力</button>
        </div>
        <table v-else class="capabilities-table">
          <thead>
            <tr>
              <th class="col-num">编号</th>
              <th class="col-title">能力名称</th>
              <th class="col-title-zh">中文描述</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cap in capabilities"
              :key="cap.id"
              class="capability-row"
              :class="{ selected: editing && form.id === cap.id }"
              @click="selectCapability(cap)"
            >
              <td class="col-num">{{ cap.number }}</td>
              <td class="col-title">{{ cap.title }}</td>
              <td class="col-title-zh">{{ cap.titleZh }}</td>
              <td class="col-action" @click.stop>
                <button class="btn-icon-only" title="编辑" @click="selectCapability(cap)">&#9998;</button>
                <button class="btn-icon-only btn-danger" title="删除" @click="confirmRowDelete(cap)">&#10005;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Right: Edit Panel (slide-in drawer) -->
      <aside v-if="editing" class="edit-panel">
        <div class="panel-header">
          <h3>{{ isNew ? '新增能力' : '编辑能力 — ' + form.number }}</h3>
          <button class="btn-close" @click="cancelEdit">&times;</button>
        </div>

        <div class="panel-body">
          <!-- 基本信息 -->
          <div class="form-section">
            <h4 class="section-title">基本信息</h4>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">标识符</label>
                <input
                  class="form-input"
                  type="text"
                  :value="form.id"
                  @input="handleIdInput"
                  :disabled="!isNew"
                  placeholder="英文字母和数字，留空自动生成"
                />
                <span class="form-hint" v-if="isNew && form.title">根据标题自动生成，可直接修改</span>
              </div>
              <div class="form-group">
                <label class="form-label">编号</label>
                <input class="form-input" type="text" v-model="form.number" placeholder="如 09" />
              </div>
              <div class="form-group">
                <label class="form-label">英文标题</label>
                <input class="form-input" type="text" v-model="form.title" placeholder="如 COMMUNICATION" />
              </div>
              <div class="form-group">
                <label class="form-label">中文描述</label>
                <input class="form-input" type="text" v-model="form.titleZh" placeholder="中文能力描述" />
              </div>
              <div class="form-group">
                <label class="form-label">图片主题</label>
                <select class="form-input form-select" v-model="form.imageTheme">
                  <option value="mountain">mountain</option>
                  <option value="forest">forest</option>
                  <option value="night">night</option>
                  <option value="rain">rain</option>
                  <option value="terrain">terrain</option>
                  <option value="portrait">portrait</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 正文内容 -->
          <div class="form-section">
            <h4 class="section-title">正文内容</h4>

            <div class="form-group">
              <label class="form-label">概述</label>
              <textarea class="form-textarea" v-model="form.detail.overview" rows="4" placeholder="能力概述说明"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">装备清单</label>
              <textarea class="form-textarea" v-model="form.detail.gear" rows="3" placeholder="装备清单内容"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">训练方式</label>
              <textarea class="form-textarea" v-model="form.detail.training" rows="4" placeholder="训练方式说明"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">实战案例</label>
              <select v-model="form.scenarioMission" class="form-input form-select" style="margin-bottom: 8px;">
                <option value="">-- 选择关联任务（可选） --</option>
                <option v-for="m in missions" :key="m.id" :value="m.id">
                  {{ m.id }} — {{ m.type }}（{{ m.location && m.location.name }}）
                </option>
              </select>
              <textarea class="form-textarea" v-model="form.detail.scenario" rows="5" placeholder="描述该能力在实战中的应用场景..."></textarea>
            </div>
          </div>
        </div>

        <!-- Panel Footer -->
        <div class="panel-footer">
          <div v-if="message" class="save-message" :class="message.type">{{ message.text }}</div>
          <div class="panel-actions">
            <button v-if="!isNew" class="btn-danger-outline" :disabled="saving" @click="confirmDelete">删除</button>
            <button class="btn-cancel" @click="cancelEdit">取消</button>
            <button class="btn-primary" :disabled="saving" @click="save">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { capabilities as capabilityData, missions as missionsData } from '@/data'

export default {
  name: 'AdminCapabilities',

  layout: 'admin',

  data() {
    return {
      capabilities: [],
      missions: [],
      loading: true,
      editing: false,
      isNew: false,
      saving: false,
      message: null,
      idManuallyEdited: false,

      form: {
        id: '',
        number: '',
        title: '',
        titleZh: '',
        imageTheme: 'mountain',
        scenarioMission: '',
        detail: {
          overview: '',
          gear: '',
          training: '',
          scenario: ''
        }
      }
    }
  },

  mounted() {
    this.capabilities = capabilityData
    this.missions = missionsData
    this.loading = false
  },

  watch: {
    // 新增时，根据英文标题自动生成标识符（仅当未曾手动修改过）
    'form.title'(val) {
      if (this.isNew && !this.idManuallyEdited) {
        this.form.id = this.generateSlug(val)
      }
    }
  },

  methods: {
    // ---- 选择 ----
    selectCapability(cap) {
      this.isNew = false
      this.editing = true
      this.message = null
      this.idManuallyEdited = true // 编辑已有数据，不需要自动生成

      const rawScenario = cap.detail ? (cap.detail.scenario || '') : ''
      // 解析已有数据中的关联任务 ID（如 "关联任务 #058 山域搜救（南横山区）\n\n..."）
      const missionMatch = rawScenario.match(/^关联任务\s*#(\w+)/)
      const scenarioMission = missionMatch ? missionMatch[1] : ''
      // 如果有关联任务前缀，描述部分去掉前缀后显示
      const scenarioText = missionMatch ? rawScenario.substring(missionMatch[0].length).replace(/^\n+/, '') : rawScenario

      this.form = {
        id: cap.id || '',
        number: cap.number || '',
        title: cap.title || '',
        titleZh: cap.titleZh || '',
        imageTheme: cap.imageTheme || 'mountain',
        scenarioMission,
        detail: {
          overview: cap.detail ? (cap.detail.overview || '') : '',
          gear: cap.detail ? (cap.detail.gear || '') : '',
          training: cap.detail ? (cap.detail.training || '') : '',
          scenario: scenarioText
        }
      }
    },

    // ---- 新增 ----
    openCreate() {
      this.isNew = true
      this.editing = true
      this.message = null
      this.idManuallyEdited = false // 新记录，标题改变时自动生成

      // 自动递增编号
      const maxNum = this.capabilities.reduce((max, c) => {
        const num = parseInt((c.number || '').replace(/\D/g, ''), 10)
        return num > max ? num : max
      }, 0)
      const nextNum = String(maxNum + 1).padStart(2, '0')

      this.form = {
        id: '', number: nextNum, title: '', titleZh: '', imageTheme: 'mountain', scenarioMission: '',
        detail: { overview: '', gear: '', training: '', scenario: '' }
      }
    },

    // ---- 标识符处理 ----

    /** 限制输入：只允许小写英文字母、数字、连字符 */
    handleIdInput(e) {
      const raw = e.target.value
      const filtered = raw.toLowerCase().replace(/[^a-z0-9-]/g, '')
      this.form.id = filtered
      this.idManuallyEdited = true
    },

    /** 将英文标题转为合法标识符 */
    generateSlug(title) {
      return (title || '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    },

    // ---- 取消 ----
    cancelEdit() {
      this.editing = false
      this.isNew = false
      this.message = null
    },

    // ---- 保存 ----
    async save() {
      if (!this.form.number || !this.form.title) {
        this.setMessage('请填写编号和英文标题', 'error')
        return
      }

      // 标识符为空时自动从标题生成，并确保唯一
      if (!this.form.id) {
        let base = this.generateSlug(this.form.title)
        if (!base) base = 'cap' + this.form.number
        this.form.id = base
      }
      // 新增时如果标识符重复，自动追加后缀
      if (this.isNew && this.capabilities.some(c => c.id === this.form.id)) {
        let base = this.form.id.replace(/-\d+$/, '')
        let suffix = 2
        while (this.capabilities.some(c => c.id === this.form.id)) {
          this.form.id = base + '-' + suffix
          suffix++
        }
      }

      this.saving = true
      this.message = null

      try {
        // 组合实战案例：关联任务 + 描述
        let scenarioText = this.form.detail.scenario || ''
        if (this.form.scenarioMission) {
          const m = this.missions.find(mm => mm.id === this.form.scenarioMission)
          const prefix = m ? `关联任务 #${m.id} ${m.type}（${m.location && m.location.name}）` : `关联任务 #${this.form.scenarioMission}`
          scenarioText = prefix + '\n\n' + scenarioText
        }

        await this.$api.post('/admin/capabilities', {
          id: this.form.id,
          number: this.form.number,
          title: this.form.title,
          titleZh: this.form.titleZh,
          imageTheme: this.form.imageTheme,
          detail: {
            overview: this.form.detail.overview,
            gear: this.form.detail.gear,
            training: this.form.detail.training,
            scenario: scenarioText.trim()
          }
        })

        this.setMessage('保存成功', 'success')
        this.isNew = false
        await this.refreshData()
        this.editing = false
      } catch (e) {
        this.setMessage('保存失败：' + (e.message || '网络错误'), 'error')
      } finally {
        this.saving = false
      }
    },

    // ---- 删除 ----
    confirmRowDelete(cap) {
      if (!confirm('确定要删除能力 "' + (cap.title || cap.id) + '" 吗？此操作不可撤销，对应的 Markdown 文件将被删除。')) return
      this.doDeleteById(cap.id)
    },

    confirmDelete() {
      if (!confirm('确定要删除能力 "' + (this.form.title || this.form.id) + '" 吗？此操作不可撤销。')) return
      this.doDeleteById(this.form.id)
    },

    async doDeleteById(id) {
      this.saving = true
      this.message = null
      try {
        await this.$api.delete('/admin/capabilities/' + id)
        this.editing = false
        this.isNew = false
        this.setMessage('已删除', 'success')
        await this.refreshData()
      } catch (e) {
        this.setMessage('删除失败：' + (e.message || '网络错误'), 'error')
      } finally {
        this.saving = false
      }
    },

    async refreshData() {
      try {
        const data = await this.$api.get('/admin/items')
        if (data.capabilities) {
          this.capabilities = data.capabilities
        }
        if (data.missions) {
          this.missions = data.missions
        }
      } catch (e) {
        console.error('刷新数据失败:', e)
      }
    },

    // ---- 消息 ----
    setMessage(text, type) {
      this.message = { text, type }
      if (type === 'success') {
        setTimeout(() => { if (this.message && this.message.text === text) this.message = null }, 4000)
      }
    }
  }
}
</script>

<style scoped>
/* ==============================
   Page Layout
   ============================== */
.capabilities-admin {
  max-width: 100%;
}

/* ==============================
   Page Header
   ============================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0dfd9;
}

.page-header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.page-count {
  font-size: 13px;
  color: #999;
}

/* ==============================
   Buttons
   ============================== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease;
  font-family: inherit;
}
.btn-primary:hover { background: #333; }
.btn-primary:disabled { background: #999; cursor: not-allowed; }

.btn-cancel {
  padding: 8px 18px;
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
}
.btn-cancel:hover { background: #f5f5f0; color: #333; }

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: #d94a3a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
.btn-danger:hover { background: #c0392b; }
.btn-danger:disabled { background: #e8a89e; cursor: not-allowed; }

.btn-danger-outline {
  padding: 8px 18px;
  background: #fff;
  color: #d94a3a;
  border: 1px solid #d94a3a;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
  margin-right: auto;
}
.btn-danger-outline:hover { background: #fce8e5; }

.btn-icon {
  font-weight: 700;
  font-size: 16px;
}

.btn-link {
  background: none;
  border: none;
  color: #1a1a1a;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  padding: 0;
}

.btn-icon-only {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  color: #999;
  transition: all 150ms ease;
  vertical-align: middle;
}
.btn-icon-only + .btn-icon-only { margin-left: 2px; }
.btn-icon-only:hover { background: #f0f0e8; color: #333; border-color: #ddd; }
.btn-danger:hover { color: #d94a3a; background: #fce8e5; border-color: #f5c6cb; }

/* ==============================
   Layout: List + Panel
   ============================== */
.capabilities-layout {
  display: flex;
  gap: 0;
  position: relative;
}

.capabilities-list {
  flex: 1;
  min-width: 0;
  transition: margin-right 300ms ease;
}
.capabilities-list.has-panel {
  margin-right: 500px;
}

/* ==============================
   Table
   ============================== */
.list-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 14px;
}
.list-state.empty p { margin: 0 0 12px; }

.capabilities-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.capabilities-table thead {
  background: #fafaf8;
  border-bottom: 2px solid #e0dfd9;
}

.capabilities-table th {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.capabilities-table td {
  padding: 10px 14px;
  font-size: 14px;
  color: #444;
  vertical-align: middle;
  border-bottom: 1px solid #f0efe8;
}

.capability-row {
  cursor: pointer;
  transition: background 120ms ease;
}
.capability-row:hover { background: #fafaf8; }
.capability-row.selected { background: #f5f3eb; }
.capability-row.selected td { border-bottom-color: #e8e3d2; }

.col-num {
  width: 60px;
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 12px;
  color: #999;
}

.col-title {
  width: 200px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.02em;
  color: #333;
}

.col-title-zh {
  font-size: 13px;
  color: #777;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}

.col-action {
  width: 90px;
  text-align: right;
  white-space: nowrap;
}

/* ==============================
   Edit Panel (slide-in drawer)
   ============================== */
.edit-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 780px;
  height: 100vh;
  background: #fff;
  border-left: 1px solid #e0dfd9;
  box-shadow: -4px 0 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  z-index: 50;
  animation: slideIn 250ms ease;
}

@keyframes slideIn {
  from { transform: translateX(40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0dfd9;
  flex-shrink: 0;
}
.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.btn-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  transition: all 150ms ease;
}
.btn-close:hover { background: #f0f0e8; color: #333; }

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.panel-footer {
  padding: 16px 20px;
  border-top: 1px solid #e0dfd9;
  flex-shrink: 0;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.save-message {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 4px;
  margin-bottom: 10px;
}
.save-message.success { background: #e6f4ea; color: #1e7e34; }
.save-message.error { background: #fce8e5; color: #d94a3a; }

/* ==============================
   Form Elements
   ============================== */
.form-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0efe8;
}
.form-section:last-child { border-bottom: none; margin-bottom: 0; }

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 0;
}

.form-hint {
  font-size: 11px;
  color: #aaa;
  margin-top: 2px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fafaf8;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  font-family: inherit;
  box-sizing: border-box;
}
.form-input:focus {
  outline: none;
  border-color: #999;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.06);
  background: #fff;
}
.form-input:disabled {
  background: #f0f0e8;
  color: #999;
  cursor: not-allowed;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  cursor: pointer;
}

.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fafaf8;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  line-height: 1.6;
}
.form-textarea:focus {
  outline: none;
  border-color: #999;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.06);
  background: #fff;
}

/* ==============================
   Responsive
   ============================== */
@media (max-width: 1100px) {
  .capabilities-list.has-panel { margin-right: 420px; }
  .edit-panel { width: 420px; }
}

@media (max-width: 860px) {
  .capabilities-list.has-panel { margin-right: 0; }
  .edit-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e0dfd9;
    height: 70vh;
    top: auto;
    bottom: 0;
    border-radius: 16px 16px 0 0;
  }
}

@media (max-width: 600px) {
  .capabilities-table .col-title-zh { max-width: 200px; }
}
</style>
