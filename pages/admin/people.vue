<template>
  <div class="people-admin">
    <!-- ========== Header ========== -->
    <header class="page-header">
      <div class="page-header-left">
        <h2 class="page-title">队员档案管理</h2>
        <span class="page-count">{{ people.length }} 名队员</span>
      </div>
      <button class="btn-primary" @click="openCreate">
        <span class="btn-icon">+</span> 新增队员
      </button>
    </header>

    <!-- ========== Main Content ========== -->
    <div class="people-layout">
      <!-- Left: People List -->
      <section class="people-list" :class="{ 'has-panel': editingPerson !== null }">
        <div v-if="loading" class="list-state">加载中...</div>
        <div v-else-if="people.length === 0" class="list-state empty">
          <p>暂无队员档案</p>
          <button class="btn-link" @click="openCreate">创建第一位队员</button>
        </div>
        <table v-else class="people-table">
          <thead>
            <tr>
              <th class="col-photo"></th>
              <th class="col-name">姓名</th>
              <th class="col-role">角色</th>
              <th class="col-unit">分队</th>
              <th class="col-joined">加入</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in people"
              :key="p.id"
              class="people-row"
              :class="{ selected: editingPerson && editingPerson.id === p.id }"
              @click="selectPerson(p)"
            >
              <td class="col-photo">
                <div class="avatar-thumb">
                  <img v-if="p.image" :src="p.image" alt="" @error="onImgError" />
                  <span v-else class="avatar-placeholder">{{ (p.name || '?').charAt(0) }}</span>
                </div>
              </td>
              <td class="col-name">
                <div class="name-main">{{ p.name }}</div>
                <div class="name-sub">{{ p.nameEn }}</div>
              </td>
              <td class="col-role">{{ p.role }}</td>
              <td class="col-unit">{{ p.unit }}</td>
              <td class="col-joined">{{ p.joined }}</td>
              <td class="col-actions" @click.stop>
                <button class="btn-icon-only" title="编辑" @click="selectPerson(p)">&#9998;</button>
                <button class="btn-icon-only btn-danger" title="删除" @click="confirmDelete(p)">&#10005;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Right: Edit Panel -->
      <aside v-if="editingPerson !== null" class="edit-panel">
        <div class="panel-header">
          <h3>{{ isNew ? '新增队员' : '编辑档案' }}</h3>
          <button class="btn-close" @click="closePanel">&times;</button>
        </div>

        <div class="panel-body">
          <!-- Photo Upload -->
          <div class="form-group photo-group">
            <label class="form-label">头像照片</label>
            <div class="photo-upload-area">
              <div class="photo-preview" @click="$refs.fileInput.click()">
                <img v-if="form.image" :src="form.image" alt="预览" />
                <div v-else class="photo-placeholder">
                  <span class="placeholder-icon">&#128247;</span>
                  <span class="placeholder-text">点击上传照片</span>
                </div>
                <div v-if="uploading" class="photo-uploading">上传中...</div>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="file-input-hidden"
                @change="handleImageUpload"
              />
              <div class="photo-actions">
                <button type="button" class="btn-sm" @click="$refs.fileInput.click()">
                  {{ form.image ? '更换照片' : '选择照片' }}
                </button>
                <button
                  v-if="form.image"
                  type="button"
                  class="btn-sm btn-sm-danger"
                  @click="form.image = ''"
                >移除</button>
              </div>
            </div>
          </div>

          <!-- Basic Info -->
          <div class="form-section">
            <h4 class="section-title">基本信息</h4>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">编号 <span class="required">*</span></label>
                <input v-model="form.id" class="form-input" placeholder="如 p07" :disabled="!isNew" />
              </div>
              <div class="form-group">
                <label class="form-label">分队</label>
                <select v-model="form.unit" class="form-input form-select">
                  <option value="">-- 选择分队 --</option>
                  <option value="管理分队">管理分队</option>
                  <option v-for="n in 10" :key="n" :value="String(n).padStart(2, '0')">
                    {{ String(n).padStart(2, '0') }} 分队
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">中文名 <span class="required">*</span></label>
                <input v-model="form.name" class="form-input" placeholder="队员中文名" />
              </div>
              <div class="form-group">
                <label class="form-label">英文名 / 拼音</label>
                <input v-model="form.nameEn" class="form-input" placeholder="如 A-ZHE" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">角色 <span class="required">*</span></label>
              <div class="role-combo">
                <select v-model="rolePreset" class="form-input form-select role-select" @change="onRolePresetChange">
                  <option value="">-- 选择角色 --</option>
                  <option value="队长">队长</option>
                  <option value="副队长">副队长</option>
                  <option value="分队长">分队长</option>
                  <option value="__custom__">自定义...</option>
                </select>
                <input
                  v-if="rolePreset === '__custom__'"
                  v-model="form.role"
                  class="form-input role-custom"
                  placeholder="输入自定义角色"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">背景简介</label>
              <input v-model="form.background" class="form-input" placeholder="一句话背景介绍" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">加入年份</label>
                <select v-model="form.joined" class="form-input form-select">
                  <option value="">-- 选择年份 --</option>
                  <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">视觉主题</label>
                <select v-model="form.imageTheme" class="form-input form-select">
                  <option value="portrait">人像 — portrait</option>
                  <option value="mountain">山岳 — mountain</option>
                  <option value="rain">雨 — rain</option>
                  <option value="night">夜 — night</option>
                  <option value="terrain">地形 — terrain</option>
                  <option value="forest">森林 — forest</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">一句话故事（引语）</label>
              <textarea
                v-model="form.story"
                class="form-textarea"
                rows="3"
                placeholder="一句有代表性的话，展示在队员卡片上"
              ></textarea>
            </div>
          </div>

          <!-- Detail Sections -->
          <div class="form-section">
            <h4 class="section-title">详细内容</h4>

            <div class="form-group">
              <label class="form-label">关于他/她</label>
              <textarea
                v-model="form.detail.bio"
                class="form-textarea"
                rows="5"
                placeholder="详细介绍队员的背景和经历"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">加入原因</label>
              <textarea
                v-model="form.detail.motivation"
                class="form-textarea"
                rows="4"
                placeholder="为什么加入救援队的故事"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">专业领域</label>
              <input
                v-model="form.detail.specialties"
                class="form-input"
                placeholder="如 高山地形判读、绳索救援、野外生存"
              />
            </div>

            <div class="form-group">
              <label class="form-label">常用装备</label>
              <input
                v-model="form.detail.equipment"
                class="form-input"
                placeholder="如 Garmin GPS、Petzl 头灯、对讲机"
              />
            </div>

            <div class="form-group">
              <label class="form-label">参与任务</label>
              <div class="multi-select-wrap" :class="{ open: missionsOpen }">
                <div class="multi-select-trigger" @click="missionsOpen = !missionsOpen">
                  <span v-if="selectedMissionLabels.length" class="multi-select-text">{{ selectedMissionLabels.join('、') }}</span>
                  <span v-else class="multi-select-placeholder">点击选择参与的任务...</span>
                  <span class="multi-select-arrow">&#9662;</span>
                </div>
                <div v-if="missionsOpen" class="multi-select-dropdown">
                  <div
                    v-for="m in missions"
                    :key="m.id"
                    class="multi-select-option"
                    :class="{ checked: isMissionSelected(m.id) }"
                    @click="toggleMission(m.id)"
                  >
                    <span class="multi-select-checkmark">{{ isMissionSelected(m.id) ? '&#9745;' : '&#9744;' }}</span>
                    <span class="multi-select-id">{{ m.id }}</span>
                    <span class="multi-select-name">{{ m.summary || m.type }}</span>
                  </div>
                  <div v-if="missions.length === 0" class="multi-select-empty">暂无任务数据</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">金句</label>
              <textarea
                v-model="form.detail.quote"
                class="form-textarea"
                rows="3"
                placeholder="一句代表性的引用"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Panel Footer -->
        <div class="panel-footer">
          <div v-if="saveMessage" class="save-message" :class="saveMessageType">{{ saveMessage }}</div>
          <div class="panel-actions">
            <button class="btn-cancel" @click="closePanel">取消</button>
            <button class="btn-primary" :disabled="saving" @click="savePerson">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal-dialog">
        <h4 class="modal-title">确认删除</h4>
        <p class="modal-body">
          确定要删除队员 <strong>{{ deleteTarget.name }}</strong>（{{ deleteTarget.id }}）吗？此操作不可撤销，对应的 Markdown 文件将被删除。
        </p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="deleteTarget = null">取消</button>
          <button class="btn-danger" :disabled="deleting" @click="doDelete">
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { people as peopleData, missions as missionsData } from '@/data'
import Vue from 'vue'

const EMPTY_FORM = () => ({
  id: '',
  name: '',
  nameEn: '',
  role: '',
  background: '',
  unit: '',
  joined: '',
  image: '',
  imageTheme: 'portrait',
  story: '',
  detail: {
    bio: '',
    motivation: '',
    specialties: '',
    equipment: '',
    selectedMissions: [],
    quote: ''
  }
})

export default {
  name: 'AdminPeoplePage',
  layout: 'admin',

  data() {
    return {
      people: [],
      missions: [],
      loading: true,
      editingPerson: null,
      isNew: false,
      form: EMPTY_FORM(),
      saving: false,
      saveMessage: '',
      saveMessageType: 'success',
      uploading: false,
      deleteTarget: null,
      deleting: false,
      missionsOpen: false,
      rolePreset: ''
    }
  },

  mounted() {
    this.people = peopleData
    this.missions = missionsData
    this.loading = false
    document.addEventListener('click', this.onDocClick)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onDocClick)
  },

  computed: {
    years() {
      const result = []
      for (let y = 2024; y <= 2035; y++) result.push(y)
      return result
    },
    selectedMissionLabels() {
      return (this.form.detail.selectedMissions || []).map(id => {
        const m = this.missions.find(mm => mm.id === id)
        return m ? `${id} ${m.type}` : id
      })
    }
  },

  methods: {
    // ========== Selection ==========
    selectPerson(person) {
      this.saveMessage = ''
      this.isNew = false
      this.editingPerson = person
      this.form = this.personToForm(person)
      this.syncRolePreset()
    },

    openCreate() {
      this.saveMessage = ''
      this.isNew = true
      this.editingPerson = {}
      this.form = EMPTY_FORM()
      this.rolePreset = ''
      // Auto-generate next ID
      const maxId = this.people.reduce((max, p) => {
        const num = parseInt((p.id || '').replace('p', ''), 10)
        return num > max ? num : max
      }, 0)
      this.form.id = 'p' + String(maxId + 1).padStart(2, '0')
    },

    closePanel() {
      this.editingPerson = null
      this.isNew = false
    },

    // ========== Form Conversion ==========
    personToForm(person) {
      const d = person.detail || {}
      return {
        id: person.id || '',
        name: person.name || '',
        nameEn: person.nameEn || '',
        role: person.role || '',
        background: person.background || '',
        unit: person.unit || '',
        joined: person.joined || '',
        image: person.image || '',
        imageTheme: person.imageTheme || 'portrait',
        story: person.story || '',
        detail: {
          bio: d.bio || '',
          motivation: d.motivation || '',
          specialties: d.specialties || '',
          equipment: d.equipment || '',
          selectedMissions: Array.isArray(d.missions) ? [...d.missions] : [],
          quote: d.quote || ''
        }
      }
    },

    formToPayload(form) {
      return {
        id: form.id,
        name: form.name,
        nameEn: form.nameEn,
        role: form.role,
        background: form.background,
        unit: form.unit,
        joined: form.joined,
        image: form.image,
        imageTheme: form.imageTheme,
        story: form.story,
        detail: {
          bio: form.detail.bio,
          motivation: form.detail.motivation,
          specialties: form.detail.specialties,
          equipment: form.detail.equipment,
          missions: form.detail.selectedMissions || [],
          quote: form.detail.quote
        }
      }
    },

    // ========== Image Upload ==========
    handleImageUpload(e) {
      const file = e.target.files[0]
      if (!file) return
      this.uploading = true
      const reader = new FileReader()
      reader.onload = (ev) => {
        // Send base64 to server for saving
        fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: ev.target.result, filename: file.name })
        })
          .then(r => r.json())
          .then(result => {
            if (result.success) {
              this.form.image = result.url
            } else {
              // Fallback: use base64 directly as preview, will be handled by API on save
              this.form.image = ev.target.result
              console.warn('Image upload returned unexpected response, using data URL:', result)
            }
            this.uploading = false
          })
          .catch(err => {
            console.error('Image upload failed:', err)
            // Still set preview from base64 so the user can see it
            this.form.image = ev.target.result
            this.uploading = false
          })
      }
      reader.readAsDataURL(file)
      // Reset input so re-selecting the same file triggers change
      e.target.value = ''
    },

    // ========== Save ==========
    async savePerson() {
      if (!this.form.id || !this.form.name) {
        this.setMessage('请至少填写编号和中文名', 'error')
        return
      }
      if (this.isNew && this.people.some(p => p.id === this.form.id)) {
        this.setMessage('编号 ' + this.form.id + ' 已存在', 'error')
        return
      }
      this.saving = true
      this.saveMessage = ''
      try {
        const payload = this.formToPayload(this.form)
        const res = await fetch('/api/admin/people', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.success) {
          this.setMessage(`保存成功${data.rebuilt ? '（已重编译）' : ''}`, 'success')
          this.isNew = false
          this.editingPerson = payload
          await this.refreshData()
        } else {
          this.setMessage('保存失败: ' + (data.error || '未知错误'), 'error')
        }
      } catch (e) {
        console.error('Save failed:', e)
        this.setMessage('保存失败: ' + e.message, 'error')
      } finally {
        this.saving = false
      }
    },

    // ========== Delete ==========
    confirmDelete(person) {
      this.deleteTarget = person
    },

    async doDelete() {
      if (!this.deleteTarget) return
      this.deleting = true
      try {
        const res = await fetch(`/api/admin/people/${this.deleteTarget.id}`, {
          method: 'DELETE'
        })
        const data = await res.json()
        if (data.success) {
          // If the deleted person was being edited, close panel
          if (this.editingPerson && this.editingPerson.id === this.deleteTarget.id) {
            this.closePanel()
          }
          this.deleteTarget = null
          this.setMessage('删除成功', 'success')
          await this.refreshData()
        } else {
          this.setMessage('删除失败: ' + (data.error || '未知错误'), 'error')
          this.deleteTarget = null
        }
      } catch (e) {
        console.error('Delete failed:', e)
        this.setMessage('删除失败: ' + e.message, 'error')
        this.deleteTarget = null
      } finally {
        this.deleting = false
      }
    },

    // ========== Role Combo ==========
    syncRolePreset() {
      const presets = ['队长', '副队长', '分队长']
      if (presets.includes(this.form.role)) {
        this.rolePreset = this.form.role
      } else if (this.form.role) {
        this.rolePreset = '__custom__'
      } else {
        this.rolePreset = ''
      }
    },

    onRolePresetChange() {
      if (this.rolePreset === '__custom__') {
        this.form.role = ''
      } else {
        this.form.role = this.rolePreset
      }
    },

    // ========== Mission Multi-select ==========
    isMissionSelected(id) {
      return (this.form.detail.selectedMissions || []).includes(id)
    },

    toggleMission(id) {
      const list = this.form.detail.selectedMissions || []
      const idx = list.indexOf(id)
      if (idx >= 0) {
        list.splice(idx, 1)
      } else {
        list.push(id)
      }
      this.$set(this.form.detail, 'selectedMissions', list)
    },

    // ========== Helpers ==========
    onDocClick(e) {
      if (this.$el && !this.$el.contains(e.target)) {
        this.missionsOpen = false
      }
    },

    async refreshData() {
      try {
        const data = await this.$api.get('/admin/items')
        if (data.people) {
          this.people = data.people
        }
        if (data.missions) {
          this.missions = data.missions
        }
      } catch (e) {
        console.error('刷新数据失败:', e)
      }
    },

    setMessage(msg, type) {
      this.saveMessage = msg
      this.saveMessageType = type
      if (type === 'success') {
        setTimeout(() => { if (this.saveMessage === msg) this.saveMessage = '' }, 4000)
      }
    },

    onImgError(e) {
      e.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
/* ==============================
   Page Layout
   ============================== */
.people-admin {
  max-width: 1400px;
  margin: 0 auto;
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

.btn-sm {
  padding: 4px 12px;
  background: #f0f0e8;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
}
.btn-sm:hover { background: #e0dfd9; }
.btn-sm-danger { color: #d94a3a; }
.btn-sm-danger:hover { background: #fce8e5; }

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
.btn-icon-only + .btn-icon-only {
  margin-left: 2px;
}
.btn-icon-only:hover { background: #f0f0e8; color: #333; border-color: #ddd; }
.btn-danger:hover { color: #d94a3a; background: #fce8e5; border-color: #f5c6cb; }

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

.btn-icon {
  font-weight: 700;
  font-size: 16px;
}

/* ==============================
   Layout: List + Panel
   ============================== */
.people-layout {
  display: flex;
  gap: 0;
  position: relative;
}

.people-list {
  flex: 1;
  min-width: 0;
  transition: margin-right 300ms ease;
}
.people-list.has-panel {
  margin-right: 480px;
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

.people-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.people-table thead {
  background: #fafaf8;
  border-bottom: 2px solid #e0dfd9;
}

.people-table th {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.people-table td {
  padding: 10px 14px;
  font-size: 14px;
  color: #444;
  vertical-align: middle;
  border-bottom: 1px solid #f0efe8;
}

.people-row {
  cursor: pointer;
  transition: background 120ms ease;
}
.people-row:hover { background: #fafaf8; }
.people-row.selected { background: #f5f3eb; }
.people-row.selected td { border-bottom-color: #e8e3d2; }

.col-photo { width: 52px; }
.col-name { min-width: 120px; }
.col-role { min-width: 140px; }
.col-unit { width: 60px; }
.col-joined { width: 60px; }
.col-actions { width: 90px; text-align: right; white-space: nowrap; }

/* Avatar Thumb */
.avatar-thumb {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: #e0dfd9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  font-size: 14px;
  font-weight: 700;
  color: #999;
}

.name-main { font-weight: 600; color: #1a1a1a; }
.name-sub { font-size: 12px; color: #aaa; margin-top: 1px; }

/* ==============================
   Edit Panel
   ============================== */
.edit-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
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
}
.save-message.success {
  background: #e6f4ea;
  color: #1e7e34;
}
.save-message.error {
  background: #fce8e5;
  color: #d94a3a;
}

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

.form-row {
  display: flex;
  gap: 12px;
}

.form-group {
  margin-bottom: 14px;
  flex: 1;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
}

.required { color: #d94a3a; }

.role-combo {
  display: flex;
  gap: 8px;
}
.role-select {
  flex: 0 0 160px;
  min-width: 0;
}
.role-custom {
  flex: 1;
  min-width: 0;
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
   Photo Upload
   ============================== */
.photo-group { margin-bottom: 20px; }

.photo-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.photo-preview {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0e8;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: border-color 150ms ease;
}
.photo-preview:hover { border-color: #999; }
.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #bbb;
}
.placeholder-icon { font-size: 28px; }
.placeholder-text { font-size: 12px; }

.photo-uploading {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.photo-actions {
  display: flex;
  gap: 8px;
}

.file-input-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* ==============================
   Multi-Select Dropdown
   ============================== */
.multi-select-wrap {
  position: relative;
}

.multi-select-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafaf8;
  cursor: pointer;
  min-height: 38px;
  box-sizing: border-box;
  transition: border-color 150ms ease;
  user-select: none;
}
.multi-select-wrap.open .multi-select-trigger {
  border-color: #999;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.06);
  background: #fff;
}

.multi-select-text {
  flex: 1;
  font-size: 13px;
  color: #333;
  line-height: 1.4;
}
.multi-select-placeholder {
  flex: 1;
  font-size: 13px;
  color: #aaa;
}

.multi-select-arrow {
  font-size: 10px;
  color: #999;
  transition: transform 150ms ease;
}
.multi-select-wrap.open .multi-select-arrow {
  transform: rotate(180deg);
}

.multi-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 240px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  z-index: 60;
}

.multi-select-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #444;
  transition: background 100ms ease;
}
.multi-select-option:hover {
  background: #f6f6f3;
}
.multi-select-option.checked {
  background: #f5f3eb;
}

.multi-select-checkmark {
  font-size: 14px;
  color: #999;
  flex-shrink: 0;
}
.multi-select-option.checked .multi-select-checkmark {
  color: #1a1a1a;
}

.multi-select-id {
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
}

.multi-select-name {
  font-size: 13px;
  color: #444;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multi-select-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}

/* ==============================
   Delete Modal
   ============================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 150ms ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-dialog {
  background: #fff;
  border-radius: 10px;
  padding: 28px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
}

.modal-title {
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
}

.modal-body {
  margin: 0 0 20px;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* ==============================
   Responsive
   ============================== */
@media (max-width: 1100px) {
  .people-list.has-panel { margin-right: 400px; }
  .edit-panel { width: 400px; }
}

@media (max-width: 860px) {
  .people-list.has-panel { margin-right: 0; }
  .edit-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e0dfd9;
    height: 60vh;
    top: auto;
    bottom: 0;
    border-radius: 16px 16px 0 0;
  }

  .people-table .col-unit,
  .people-table .col-joined { display: none; }

  .col-actions { width: 70px; }
}

@media (max-width: 600px) {
  .form-row { flex-direction: column; gap: 0; }
  .page-header { flex-direction: column; gap: 12px; align-items: flex-start; }

  .people-table .col-role { display: none; }
  .people-table .col-photo { width: 40px; }
}
</style>
