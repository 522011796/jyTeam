<template>
  <div class="missions-admin">
    <!-- ========== Header ========== -->
    <header class="page-header">
      <div class="page-header-left">
        <h2 class="page-title">行动记录管理</h2>
        <span class="page-count">{{ missions.length }} 条行动</span>
      </div>
      <button class="btn-primary" @click="openCreate">
        <span class="btn-icon">+</span> 新增行动
      </button>
    </header>

    <!-- ========== Main Content ========== -->
    <div class="missions-layout">
      <!-- Left: Mission Table -->
      <section class="missions-list" :class="{ 'has-panel': editing }">
        <div v-if="loading" class="list-state">加载中...</div>
        <div v-else-if="missions.length === 0" class="list-state empty">
          <p>暂无行动记录</p>
          <button class="btn-link" @click="openCreate">创建第一条行动</button>
        </div>
        <table v-else class="missions-table">
          <thead>
            <tr>
              <th class="col-num">编号</th>
              <th class="col-type">类型</th>
              <th class="col-date">日期</th>
              <th class="col-location">地点</th>
              <th class="col-duration">时长</th>
              <th class="col-status">状态</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="mission in missions"
              :key="mission.id"
              class="mission-row"
              :class="{ selected: editing && formIdProp === mission.id }"
              @click="selectMission(mission)"
            >
              <td class="col-num">{{ mission.id }}</td>
              <td class="col-type">{{ mission.type }}</td>
              <td class="col-date">{{ mission.date }}</td>
              <td class="col-location">{{ mission.location && mission.location.name }}</td>
              <td class="col-duration">{{ mission.duration }}</td>
              <td class="col-status">
                <span class="status-tag" :class="mission.status">
                  {{ mission.status === 'completed' ? '已完成' : '进行中' }}
                </span>
              </td>
              <td class="col-action" @click.stop>
                <button class="btn-icon-only" title="编辑" @click="selectMission(mission)">&#9998;</button>
                <button class="btn-icon-only btn-danger" title="删除" @click="confirmRowDelete(mission)">&#10005;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Right: Edit Panel (slide-in drawer) -->
      <aside v-if="editing" class="edit-panel">
        <div class="panel-header">
          <h3>{{ isNew ? '新增行动记录' : '编辑行动 — #' + form.id }}</h3>
          <button class="btn-close" @click="cancelEdit">&times;</button>
        </div>

        <div class="panel-body">
          <!-- 基本信息 -->
          <div class="form-section">
            <h4 class="section-title">基本信息</h4>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">编号</label>
                <input class="form-input" type="text" v-model="form.id" placeholder="如 059" :disabled="!isNew" />
              </div>
              <div class="form-group">
                <label class="form-label">日期</label>
                <input class="form-input form-date" type="date" v-model="dateInput" />
              </div>
              <div class="form-group">
                <label class="form-label">任务类型</label>
                <select class="form-input form-select" v-model="form.type">
                  <option value="山域搜救">山域搜救</option>
                  <option value="水域搜救">水域搜救</option>
                  <option value="城市搜救">城市搜救</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">英文类型</label>
                <input class="form-input" type="text" v-model="form.typeEn" placeholder="MOUNTAIN RESCUE" />
              </div>
              <div class="form-group">
                <label class="form-label">状态</label>
                <select class="form-input form-select" v-model="form.status">
                  <option value="completed">已完成</option>
                  <option value="active">进行中</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">行动时长</label>
                <input class="form-input" type="text" v-model="form.duration" placeholder="11H 35M" />
              </div>
              <div class="form-group">
                <label class="form-label">参与人数</label>
                <input class="form-input" type="number" v-model.number="form.members" placeholder="7" />
              </div>
              <div class="form-group">
                <label class="form-label">图片主题</label>
                <select class="form-input form-select" v-model="form.imageTheme">
                  <option value="mountain">mountain</option>
                  <option value="forest">forest</option>
                  <option value="rain">rain</option>
                  <option value="night">night</option>
                  <option value="terrain">terrain</option>
                  <option value="portrait">portrait</option>
                </select>
              </div>
            </div>

            <div class="form-grid" style="margin-top: 14px;">
              <div class="form-group">
                <label class="form-label">地点名称</label>
                <input class="form-input" type="text" v-model="form.location.name" placeholder="如 南横山区" />
              </div>
              <div class="form-group"><!-- spacer --></div>
              <div class="form-group">
                <label class="form-label">地图横坐标 (0—100)</label>
                <input class="form-input" type="number" v-model.number="form.mapX" placeholder="48" min="0" max="100" />
              </div>
              <div class="form-group">
                <label class="form-label">地图纵坐标 (0—100)</label>
                <input class="form-input" type="number" v-model.number="form.mapY" placeholder="72" min="0" max="100" />
              </div>
            </div>

            <div class="form-group" style="margin-top: 14px;">
              <label class="form-label">一句话概述</label>
              <input class="form-input" type="text" v-model="form.summary" placeholder="简要概述本次行动" />
            </div>
          </div>

          <!-- 时间线 -->
          <div class="form-section">
            <h4 class="section-title">时间线</h4>
            <div class="form-grid form-grid-4">
              <div class="form-group">
                <label class="form-label">接获通报</label>
                <input class="form-input form-time" type="time" v-model="form.timeline.callReceived" />
              </div>
              <div class="form-group">
                <label class="form-label">队伍出发</label>
                <input class="form-input form-time" type="time" v-model="form.timeline.deployed" />
              </div>
              <div class="form-group">
                <label class="form-label">寻获目标</label>
                <input class="form-input form-time" type="time" v-model="form.timeline.located" />
              </div>
              <div class="form-group">
                <label class="form-label">安全返回</label>
                <input class="form-input form-time" type="time" v-model="form.timeline.returned" />
              </div>
            </div>
          </div>

          <!-- 正文内容 -->
          <div class="form-section">
            <h4 class="section-title">正文内容</h4>

            <div class="form-group">
              <label class="form-label">接获通报</label>
              <textarea class="form-textarea" v-model="form.detail.callSource" rows="3" placeholder="描述如何接到通报……"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">现场条件</label>
              <textarea class="form-textarea" v-model="form.detail.conditions" rows="3" placeholder="描述天气、地形、能见度等现场条件……"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">队伍部署</label>
              <textarea class="form-textarea" v-model="form.detail.deployment" rows="3" placeholder="描述队伍编组、携带装备……"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">搜索过程</label>
              <textarea class="form-textarea" v-model="form.detail.search" rows="4" placeholder="描述搜索策略、排查过程、关键发现……"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">救援经过</label>
              <textarea class="form-textarea" v-model="form.detail.rescue" rows="4" placeholder="描述找到目标后的处置、救援技术细节……"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">撤离</label>
              <textarea class="form-textarea" v-model="form.detail.evacuation" rows="3" placeholder="描述护送、转运、移交过程……"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">行动复盘</label>
              <textarea class="form-textarea" v-model="form.detail.afterAction" rows="3" placeholder="行动后的总结与改进建议……"></textarea>
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
import { missions as missionData } from '@/data'

export default {
  name: 'AdminMissions',

  layout: 'admin',

  data() {
    return {
      missions: [],
      loading: true,
      editing: false,
      isNew: false,
      saving: false,
      message: null,
      formIdProp: null,

      form: {
        id: '',
        date: '',
        type: '山域搜救',
        typeEn: '',
        status: 'completed',
        duration: '',
        members: 0,
        location: { name: '' },
        mapX: 50,
        mapY: 50,
        summary: '',
        imageTheme: 'mountain',
        timeline: {
          callReceived: '',
          deployed: '',
          located: '',
          returned: ''
        },
        detail: {
          callSource: '',
          conditions: '',
          deployment: '',
          search: '',
          rescue: '',
          evacuation: '',
          afterAction: ''
        }
      }
    }
  },

  mounted() {
    this.missions = missionData
    this.loading = false
  },

  computed: {
    dateInput: {
      get() { return (this.form.date || '').replace(/\./g, '-') },
      set(v) { this.form.date = (v || '').replace(/-/g, '.') }
    }
  },

  methods: {
    // ---- 选择 ----
    selectMission(mission) {
      this.isNew = false
      this.editing = true
      this.formIdProp = mission.id
      this.message = null

      this.form = {
        id: mission.id || '',
        date: mission.date || '',
        type: mission.type || '山域搜救',
        typeEn: mission.typeEn || '',
        status: mission.status || 'completed',
        duration: mission.duration || '',
        members: mission.members || 0,
        location: {
          name: mission.location ? (mission.location.name || '') : ''
        },
        mapX: mission.mapX != null ? mission.mapX : 50,
        mapY: mission.mapY != null ? mission.mapY : 50,
        summary: mission.summary || '',
        imageTheme: mission.imageTheme || 'mountain',
        timeline: {
          callReceived: mission.timeline ? (mission.timeline.callReceived || '') : '',
          deployed: mission.timeline ? (mission.timeline.deployed || '') : '',
          located: mission.timeline ? (mission.timeline.located || '') : '',
          returned: mission.timeline ? (mission.timeline.returned || '') : ''
        },
        detail: {
          callSource: mission.detail ? (mission.detail.callSource || '') : '',
          conditions: mission.detail ? (mission.detail.conditions || '') : '',
          deployment: mission.detail ? (mission.detail.deployment || '') : '',
          search: mission.detail ? (mission.detail.search || '') : '',
          rescue: mission.detail ? (mission.detail.rescue || '') : '',
          evacuation: mission.detail ? (mission.detail.evacuation || '') : '',
          afterAction: mission.detail ? (mission.detail.afterAction || '') : ''
        }
      }
    },

    // ---- 新增 ----
    openCreate() {
      this.isNew = true
      this.editing = true
      this.formIdProp = null
      this.message = null

      // 自动生成下一个 ID
      const maxId = this.missions.reduce((max, m) => {
        const num = parseInt((m.id || '').replace(/\D/g, ''), 10)
        return num > max ? num : max
      }, 0)
      const nextId = String(maxId + 1).padStart(3, '0')

      this.form = {
        id: nextId,
        date: '',
        type: '山域搜救',
        typeEn: '',
        status: 'completed',
        duration: '',
        members: 0,
        location: { name: '' },
        mapX: 50,
        mapY: 50,
        summary: '',
        imageTheme: 'mountain',
        timeline: { callReceived: '', deployed: '', located: '', returned: '' },
        detail: { callSource: '', conditions: '', deployment: '', search: '', rescue: '', evacuation: '', afterAction: '' }
      }
    },

    // ---- 取消 ----
    cancelEdit() {
      this.editing = false
      this.isNew = false
      this.formIdProp = null
      this.message = null
    },

    // ---- 保存 ----
    async save() {
      if (!this.form.id) { this.setMessage('请填写编号', 'error'); return }
      if (!this.form.date) { this.setMessage('请填写日期', 'error'); return }
      if (!this.form.location.name) { this.setMessage('请填写地点名称', 'error'); return }
      if (this.isNew && this.missions.some(m => m.id === this.form.id)) { this.setMessage('编号 ' + this.form.id + ' 已存在', 'error'); return }

      this.saving = true
      this.message = null

      try {
        await this.$api.post('/admin/missions', {
          id: this.form.id, date: this.form.date, type: this.form.type,
          typeEn: this.form.typeEn, status: this.form.status, duration: this.form.duration,
          members: this.form.members, location: { name: this.form.location.name },
          mapX: this.form.mapX, mapY: this.form.mapY,
          summary: this.form.summary, imageTheme: this.form.imageTheme,
          timeline: {
            callReceived: this.form.timeline.callReceived,
            deployed: this.form.timeline.deployed,
            located: this.form.timeline.located,
            returned: this.form.timeline.returned
          },
          detail: {
            callSource: this.form.detail.callSource,
            conditions: this.form.detail.conditions,
            deployment: this.form.detail.deployment,
            search: this.form.detail.search,
            rescue: this.form.detail.rescue,
            evacuation: this.form.detail.evacuation,
            afterAction: this.form.detail.afterAction
          }
        })

        this.setMessage('保存成功', 'success')
        this.isNew = false
        this.formIdProp = this.form.id
        await this.refreshData()
        this.editing = false
      } catch (e) {
        this.setMessage('保存失败：' + (e.message || '网络错误'), 'error')
      } finally {
        this.saving = false
      }
    },

    // ---- 删除 ----
    confirmRowDelete(mission) {
      if (!confirm('确定要删除行动 #' + mission.id + ' 吗？此操作不可撤销，对应的 Markdown 文件将被删除。')) return
      this.doDeleteById(mission.id)
    },

    confirmDelete() {
      if (!confirm('确定要删除行动 #' + this.form.id + ' 吗？此操作不可撤销。')) return
      this.doDeleteById(this.form.id)
    },

    async doDeleteById(id) {
      this.saving = true
      this.message = null
      try {
        await this.$api.delete('/admin/missions/' + id)
        this.editing = false
        this.isNew = false
        this.formIdProp = null
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
.missions-admin {
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
.missions-layout {
  display: flex;
  gap: 0;
  position: relative;
}

.missions-list {
  flex: 1;
  min-width: 0;
  transition: margin-right 300ms ease;
}
.missions-list.has-panel {
  margin-right: 580px;
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

.missions-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.missions-table thead {
  background: #fafaf8;
  border-bottom: 2px solid #e0dfd9;
}

.missions-table th {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.missions-table td {
  padding: 10px 14px;
  font-size: 14px;
  color: #444;
  vertical-align: middle;
  border-bottom: 1px solid #f0efe8;
}

.mission-row {
  cursor: pointer;
  transition: background 120ms ease;
}
.mission-row:hover { background: #fafaf8; }
.mission-row.selected { background: #f5f3eb; }
.mission-row.selected td { border-bottom-color: #e8e3d2; }

.col-num {
  width: 52px;
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 12px;
  color: #999;
}

.col-type {
  width: 84px;
  font-weight: 600;
  font-size: 13px;
  color: #333;
}

.col-date {
  width: 96px;
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 12px;
  color: #777;
}

.col-location {
  font-size: 13px;
  color: #333;
}

.col-duration {
  width: 80px;
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 12px;
  color: #777;
}

.col-status {
  width: 80px;
  white-space: nowrap;
}

.col-action {
  width: 90px;
  text-align: right;
  white-space: nowrap;
}

/* ---- 状态标签 ---- */
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.6;
  white-space: nowrap;
}

.status-tag.completed {
  background: #eaf7ea;
  color: #2e7d32;
}

.status-tag.active {
  background: #fff3e0;
  color: #e65100;
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

.form-grid-4 {
  grid-template-columns: 1fr 1fr 1fr 1fr;
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

/* ---- 原生日期 / 时间控件 ---- */
.form-date,
.form-time {
  cursor: pointer;
  min-height: 38px;
}
.form-date::-webkit-calendar-picker-indicator,
.form-time::-webkit-calendar-picker-indicator {
  opacity: 0.6;
  cursor: pointer;
}
.form-date::-webkit-calendar-picker-indicator:hover,
.form-time::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* ==============================
   Responsive
   ============================== */
@media (max-width: 1300px) {
  .missions-list.has-panel { margin-right: 480px; }
  .edit-panel { width: 480px; }
}

@media (max-width: 960px) {
  .missions-list.has-panel { margin-right: 0; }
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

@media (max-width: 700px) {
  .missions-table .col-duration,
  .missions-table .col-date { display: none; }
  .form-grid-4 { grid-template-columns: 1fr 1fr; }
}
</style>
