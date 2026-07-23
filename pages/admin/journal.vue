<template>
  <div class="journal-admin">
    <!-- ========== Header ========== -->
    <header class="page-header">
      <div class="page-header-left">
        <h2 class="page-title">战地记录管理</h2>
        <span class="page-count">{{ entries.length }} 条记录</span>
      </div>
      <button class="btn-primary" @click="startCreate">
        <span class="btn-icon">+</span> 新增记录
      </button>
    </header>

    <!-- ========== Main Content ========== -->
    <div class="journal-layout">
      <!-- Left: Table -->
      <section class="journal-list" :class="{ 'has-panel': editing }">
        <div v-if="loading" class="list-state">加载中...</div>
        <div v-else-if="entries.length === 0" class="list-state empty">
          <p>暂无记录</p>
          <button class="btn-link" @click="startCreate">创建第一条记录</button>
        </div>
        <table v-else class="journal-table">
          <thead>
            <tr>
              <th class="col-id">ID</th>
              <th class="col-title">标题</th>
              <th class="col-date">日期</th>
              <th class="col-excerpt">摘要</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in entries"
              :key="entry.id"
              class="journal-row"
              :class="{ selected: editing && form.id === entry.id }"
              @click="selectEntry(entry)"
            >
              <td class="col-id"><code>{{ entry.id }}</code></td>
              <td class="col-title">{{ entry.title }}</td>
              <td class="col-date">{{ entry.date }}</td>
              <td class="col-excerpt">{{ entry.excerpt }}</td>
              <td class="col-action" @click.stop>
                <button class="btn-icon-only" title="编辑" @click="selectEntry(entry)">&#9998;</button>
                <button class="btn-icon-only btn-danger" title="删除" @click="confirmRowDelete(entry)">&#10005;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Right: Edit Panel (slide-in drawer) -->
      <aside v-if="editing" class="edit-panel">
        <div class="panel-header">
          <h3>{{ isCreate ? '新增记录' : '编辑记录 — ' + form.id }}</h3>
          <button class="btn-close" @click="closeEdit">&times;</button>
        </div>

        <div class="panel-body">
          <!-- 基本信息 -->
          <div class="form-section">
            <h4 class="section-title">基本信息</h4>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">ID</label>
                <input v-model="form.id" type="text" class="form-input" placeholder="如 047" :disabled="!isCreate" />
              </div>
              <div class="form-group">
                <label class="form-label">日期</label>
                <input class="form-input form-date" type="date" v-model="dateInput" />
              </div>
              <div class="form-group">
                <label class="form-label">地点</label>
                <input v-model="form.location" type="text" class="form-input" placeholder="如 中港溪流域" />
              </div>
              <div class="form-group">
                <label class="form-label">关联任务</label>
                <select v-model="form.relatedMission" class="form-input form-select">
                  <option value="">-- 无关联 --</option>
                  <option v-for="m in missions" :key="m.id" :value="m.id">
                    {{ m.id }} — {{ m.type }}（{{ m.location && m.location.name }}）
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-top: 14px;">
              <label class="form-label">标题</label>
              <input v-model="form.title" type="text" class="form-input" placeholder="记录标题" />
            </div>

            <div class="form-group">
              <label class="form-label">摘要</label>
              <textarea v-model="form.excerpt" class="form-textarea" rows="2" placeholder="简短摘要，用于列表展示"></textarea>
            </div>

            <div class="form-grid" style="margin-top: 14px;">
              <div class="form-group">
                <label class="form-label">标签（逗号分隔）</label>
                <input v-model="tagsInput" type="text" class="form-input" placeholder="搜救纪录, 水域, 夜间" />
              </div>
              <div class="form-group">
                <label class="form-label">封面主题</label>
                <select v-model="form.imageTheme" class="form-input form-select">
                  <option value="mountain">mountain — 山岳</option>
                  <option value="night">night — 夜间</option>
                  <option value="rain">rain — 雨天</option>
                  <option value="forest">forest — 森林</option>
                  <option value="terrain">terrain — 地形</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 正文 — 区块编辑器 -->
          <div class="form-section">
            <h4 class="section-title">正文</h4>

            <!-- Block list -->
            <div class="block-list" v-if="form.blocks.length > 0">
              <div
                v-for="(block, index) in form.blocks"
                :key="block.id"
                class="block-card"
                :class="{
                  'block-card-text': block.type === 'text',
                  'block-card-image': block.type === 'image'
                }"
              >
                <!-- Block order indicator -->
                <div class="block-order">{{ index + 1 }}</div>

                <!-- Text block content -->
                <div v-if="block.type === 'text'" class="block-body">
                  <div class="block-body-header">
                    <span class="block-type-label">文字段落</span>
                  </div>
                  <textarea
                    v-model="block.content"
                    class="form-textarea block-textarea"
                    rows="5"
                    placeholder="输入文字内容..."
                  ></textarea>
                </div>

                <!-- Image block content -->
                <div v-if="block.type === 'image'" class="block-body">
                  <div class="block-body-header">
                    <span class="block-type-label">图片</span>
                    <span v-if="block.caption" class="block-caption-preview">{{ block.caption }}</span>
                  </div>
                  <div class="image-block-fields">
                    <div class="image-url-row">
                      <input
                        v-model="block.url"
                        type="text"
                        class="form-input"
                        placeholder="图片 URL（如 /images/content/xxx.jpg）"
                      />
                      <label class="btn-block-upload">
                        本地上传
                        <input
                          type="file"
                          accept="image/*"
                          class="upload-input-hidden"
                          @change="handleBlockImageUpload(index, $event)"
                        />
                      </label>
                    </div>
                    <input
                      v-model="block.caption"
                      type="text"
                      class="form-input"
                      placeholder="图片说明文字（可选）"
                      style="margin-top: 8px;"
                    />
                    <div v-if="block._uploading" class="block-upload-status">上传中...</div>
                    <div v-if="block._uploadError" class="block-upload-status block-upload-error">{{ block._uploadError }}</div>
                    <div v-if="block.url" class="block-image-preview">
                      <img :src="block.url" :alt="block.caption" />
                    </div>
                  </div>
                </div>

                <!-- Block actions -->
                <div class="block-footer">
                  <button
                    class="block-btn"
                    title="上移"
                    :disabled="index === 0"
                    @click="moveBlockUp(index)"
                  >&#9650;</button>
                  <button
                    class="block-btn"
                    title="下移"
                    :disabled="index === form.blocks.length - 1"
                    @click="moveBlockDown(index)"
                  >&#9660;</button>
                  <button
                    class="block-btn block-btn-del"
                    title="删除此块"
                    @click="removeBlock(index)"
                  >&#10005;</button>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else class="block-empty">
              暂无内容。点击下方按钮添加文字段落或图片。
            </div>

            <!-- Block Toolbar (placed at bottom for easy access) -->
            <div class="block-toolbar">
              <button class="btn-block-add" @click="addBlock('text')">
                <span class="block-add-icon">T</span> 添加文字段落
              </button>
              <button class="btn-block-add" @click="addBlock('image')">
                <span class="block-add-icon">&#9635;</span> 添加图片
              </button>
            </div>
          </div>
        </div>

        <!-- Panel Footer -->
        <div class="panel-footer">
          <div class="panel-actions">
            <button v-if="!isCreate" class="btn-danger-outline" :disabled="saving" @click="confirmDelete">删除</button>
            <button class="btn-cancel" @click="closeEdit">取消</button>
            <button class="btn-primary" :disabled="saving" @click="save">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Toast -->
    <div v-if="saveMessage" class="toast" :class="saveMessageType">{{ saveMessage }}</div>
  </div>
</template>

<script>
import { journalEntries as journalData, missions as missionsData } from '@/data'

export default {
  name: 'AdminJournal',
  layout: 'admin',

  data() {
    return {
      entries: [],
      missions: [],
      loading: true,

      editing: false,
      isCreate: false,
      form: this.emptyForm(),
      tagsInput: '',

      // block-level upload state (per-block)
      blockUploading: {},

      saving: false,
      saveMessage: '',
      saveMessageType: 'success'
    }
  },

  mounted() {
    this.entries = journalData
    this.missions = missionsData
    this.loading = false
  },

  computed: {
    dateInput: {
      get() { return (this.form.date || '').replace(/\./g, '-') },
      set(v) { this.form.date = (v || '').replace(/-/g, '.') }
    }
  },

  methods: {
    emptyForm() {
      return { id: '', date: '', title: '', location: '', excerpt: '', relatedMission: '', imageTheme: 'mountain', fullText: '', blocks: [] }
    },

    // ---- 区块编辑 ----

    /** 从 fullText + images 重建区块 */
    parseBlocks(fullText, images) {
      images = images || []
      const paragraphs = (fullText || '').split('\n').filter(p => p.trim())
      const blocks = []
      let idCounter = 1

      paragraphs.forEach((p, i) => {
        blocks.push({ id: idCounter++, type: 'text', content: p })
        const imgAfter = images.filter(im => im.after === i)
        imgAfter.forEach(im => {
          blocks.push({ id: idCounter++, type: 'image', url: im.src || '', caption: im.caption || '' })
        })
      })

      // 如果没有任何内容，给一个空文字块作为起点
      if (blocks.length === 0) {
        blocks.push({ id: idCounter++, type: 'text', content: '' })
      }

      return blocks
    },

    /** 将区块序列化为 Markdown 字符串 */
    blocksToMarkdown(blocks) {
      return blocks.map(b => {
        if (b.type === 'text') return b.content
        if (b.type === 'image') {
          const cap = b.caption || '图片'
          const url = b.url || ''
          return url ? `![${cap}](${url})` : ''
        }
        return ''
      }).filter(s => s !== '').join('\n\n')
    },

    addBlock(type) {
      const id = Math.max(0, ...this.form.blocks.map(b => b.id)) + 1
      const block = type === 'image'
        ? { id, type: 'image', url: '', caption: '' }
        : { id, type: 'text', content: '' }
      this.form.blocks.push(block)
    },

    removeBlock(index) {
      if (this.form.blocks.length <= 1) return // 至少保留一个块
      this.form.blocks.splice(index, 1)
    },

    moveBlockUp(index) {
      if (index === 0) return
      const arr = this.form.blocks
      const tmp = arr[index - 1]
      this.$set(arr, index - 1, arr[index])
      this.$set(arr, index, tmp)
    },

    moveBlockDown(index) {
      if (index >= this.form.blocks.length - 1) return
      const arr = this.form.blocks
      const tmp = arr[index + 1]
      this.$set(arr, index + 1, arr[index])
      this.$set(arr, index, tmp)
    },

    // ---- 区块内图片上传 ----

    handleBlockImageUpload(index, e) {
      const file = e.target.files[0]
      if (!file) return

      const block = this.form.blocks[index]
      this.$set(block, '_uploading', true)
      this.$set(block, '_uploadError', '')

      this.readFileAsDataURL(file).then(base64 => {
        return this.$api.post('/admin/upload-image', { image: base64, filename: file.name })
      }).then(res => {
        this.$set(block, 'url', res.url)
        this.$set(block, '_uploading', false)
      }).catch(err => {
        console.error('图片上传失败:', err)
        this.$set(block, '_uploadError', '上传失败: ' + (err.message || '网络错误'))
        this.$set(block, '_uploading', false)
      })

      // 重置 file input 以便重复选择同一文件
      e.target.value = ''
    },

    readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsDataURL(file)
      })
    },

    // ---- 选择 / 新增 ----

    selectEntry(entry) {
      this.isCreate = false
      const detail = entry.detail || {}
      const fullText = detail.fullText || entry.fullText || ''
      const images = detail.images || []

      this.form = {
        id: entry.id,
        date: entry.date || '',
        title: entry.title || '',
        location: entry.location || '',
        excerpt: entry.excerpt || '',
        relatedMission: entry.relatedMission || detail.relatedMission || '',
        imageTheme: entry.imageTheme || 'mountain',
        fullText: fullText,
        blocks: this.parseBlocks(fullText, images)
      }
      this.tagsInput = Array.isArray(entry.tags) ? entry.tags.join(', ') : ''
      this.editing = true
      this.clearMessage()
    },

    startCreate() {
      this.isCreate = true
      this.form = this.emptyForm()
      // 自动生成下一个 ID
      const maxId = this.entries.reduce((max, e) => {
        const num = parseInt((e.id || '').replace(/\D/g, ''), 10)
        return num > max ? num : max
      }, 0)
      const nextId = String(maxId + 1).padStart(3, '0')
      this.form.id = nextId
      // 新记录给一个空文字块作为起点
      this.form.blocks = [{ id: 1, type: 'text', content: '' }]
      this.tagsInput = ''
      this.editing = true
      this.clearMessage()
    },

    closeEdit() {
      this.editing = false
      this.isCreate = false
      this.form = this.emptyForm()
      this.clearMessage()
    },

    // ---- 保存 / 删除 ----

    async save() {
      if (!this.form.id) {
        this.showMessage('请输入 ID', 'error')
        return
      }

      if (this.isCreate && this.entries.some(e => e.id === this.form.id)) {
        this.showMessage('ID ' + this.form.id + ' 已存在', 'error')
        return
      }

      this.saving = true
      this.clearMessage()

      // 序列化区块为 Markdown
      const fullText = this.blocksToMarkdown(this.form.blocks)
      this.form.fullText = fullText

      const tags = this.tagsInput.split(/[,，]/).map(s => s.trim()).filter(Boolean)

      try {
        await this.$api.post('/admin/journal', {
          id: this.form.id,
          date: this.form.date,
          title: this.form.title,
          location: this.form.location,
          excerpt: this.form.excerpt,
          relatedMission: this.form.relatedMission,
          tags,
          imageTheme: this.form.imageTheme,
          detail: { fullText }
        })

        this.showMessage('保存成功', 'success')
        this.isCreate = false
        await this.refreshData()
        this.editing = false
      } catch (e) {
        console.error('保存失败:', e)
        this.showMessage('保存失败: ' + (e.message || '网络错误'), 'error')
      } finally {
        this.saving = false
      }
    },

    confirmRowDelete(entry) {
      if (!confirm(`确定删除记录 ${entry.id}（${entry.title}）？此操作不可撤销，对应的 Markdown 文件将被删除。`)) return
      this.doDeleteById(entry.id)
    },

    confirmDelete() {
      if (!confirm(`确定删除记录 ${this.form.id}？此操作不可撤销。`)) return
      this.doDeleteById(this.form.id)
    },

    async doDeleteById(id) {
      try {
        await this.$api.delete('/admin/journal/' + id)
        this.editing = false
        this.isCreate = false
        this.showMessage('删除成功', 'success')
        await this.refreshData()
      } catch (e) {
        this.showMessage('删除失败: ' + (e.message || '网络错误'), 'error')
      }
    },

    async refreshData() {
      try {
        const data = await this.$api.get('/admin/items')
        if (data.journalEntries) {
          this.entries = data.journalEntries
        }
        if (data.missions) {
          this.missions = data.missions
        }
      } catch (e) {
        console.error('刷新数据失败:', e)
      }
    },

    // --- 消息 ---
    showMessage(msg, type) {
      this.saveMessage = msg
      this.saveMessageType = type
      clearTimeout(this._msgTimer)
      this._msgTimer = setTimeout(() => { this.saveMessage = '' }, 4000)
    },

    clearMessage() {
      this.saveMessage = ''
      clearTimeout(this._msgTimer)
    }
  }
}
</script>

<style scoped>
/* ==============================
   Page Layout
   ============================== */
.journal-admin {
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

.btn-sm {
  padding: 6px 14px;
  font-size: 12px;
  background: #f0f0e8;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.btn-sm:hover { background: #e0dfd9; }

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
.journal-layout {
  display: flex;
  gap: 0;
  position: relative;
}

.journal-list {
  flex: 1;
  min-width: 0;
  transition: margin-right 300ms ease;
}
.journal-list.has-panel {
  margin-right: 540px;
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

.journal-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.journal-table thead {
  background: #fafaf8;
  border-bottom: 2px solid #e0dfd9;
}

.journal-table th {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.journal-table td {
  padding: 10px 14px;
  font-size: 14px;
  color: #444;
  vertical-align: middle;
  border-bottom: 1px solid #f0efe8;
}

.journal-row {
  cursor: pointer;
  transition: background 120ms ease;
}
.journal-row:hover { background: #fafaf8; }
.journal-row.selected { background: #f5f3eb; }
.journal-row.selected td { border-bottom-color: #e8e3d2; }

.col-id { width: 52px; }
.col-id code {
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 11px;
  color: #999;
}

.col-title {
  font-weight: 600;
  color: #1a1a1a;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-date {
  width: 100px;
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}

.col-excerpt {
  color: #888;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  width: 540px;
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

/* ---- 原生日期控件 ---- */
.form-date {
  cursor: pointer;
  min-height: 38px;
}
.form-date::-webkit-calendar-picker-indicator {
  opacity: 0.6;
  cursor: pointer;
}
.form-date::-webkit-calendar-picker-indicator:hover { opacity: 1; }

/* ==============================
   Block Editor
   ============================== */
.block-toolbar {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.btn-block-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  background: #fff;
  border: 1px solid #d0cfc7;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
}
.btn-block-add:hover {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #fff;
}
.btn-block-add:hover .block-add-icon {
  background: #444;
  color: #fff;
}

.block-add-icon {
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #e8e6dd;
  border-radius: 4px;
  color: #555;
  transition: all 150ms ease;
}

.block-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.block-card {
  position: relative;
  background: #fff;
  border: 1px solid #d0cfc7;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: box-shadow 150ms ease, border-color 150ms ease;
}
.block-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-color: #bbb;
}
.block-card-text {
  border-left: 4px solid #8b7355;
}
.block-card-image {
  border-left: 4px solid #5577aa;
}

/* ---- Block order number ---- */
.block-order {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  z-index: 2;
}

/* ---- Block body ---- */
.block-body {
  padding: 16px 14px 4px;
}

.block-body-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.block-type-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 4px;
  white-space: nowrap;
}
.block-card-text .block-type-label {
  background: #f2ede3;
  color: #6b5c44;
}
.block-card-image .block-type-label {
  background: #e4ecf5;
  color: #4a6491;
}

.block-caption-preview {
  font-size: 12px;
  color: #aaa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 260px;
}

/* ---- Block textarea ---- */
.block-textarea {
  min-height: 100px;
  background: #fafaf8;
  font-size: 14px;
  line-height: 1.7;
  resize: vertical;
}

/* ---- Image block ---- */
.image-block-fields {
  display: flex;
  flex-direction: column;
}

.image-url-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.image-url-row .form-input {
  flex: 1;
}

.btn-block-upload {
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  background: #f5f5f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: all 150ms ease;
  position: relative;
}
.btn-block-upload:hover {
  background: #e8e6dd;
  border-color: #ccc;
}

.upload-input-hidden {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0;
  cursor: pointer;
  font-size: 0;
}

.block-upload-status {
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}
.block-upload-error {
  color: #d94a3a;
}

.block-image-preview {
  margin-top: 10px;
  margin-bottom: 4px;
  border-radius: 6px;
  overflow: hidden;
  background: #eee;
  border: 1px solid #e0dfd9;
}
.block-image-preview img {
  width: 100%;
  display: block;
  object-fit: cover;
  max-height: 280px;
}

/* ---- Block footer (actions) ---- */
.block-footer {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  padding: 8px 12px;
  border-top: 1px solid #f0efe8;
  margin-top: 8px;
}

.block-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e0dfd9;
  border-radius: 5px;
  font-size: 11px;
  color: #999;
  cursor: pointer;
  transition: all 120ms ease;
  padding: 0;
}
.block-btn:hover:not(:disabled) {
  background: #f5f5f0;
  border-color: #ccc;
  color: #555;
}
.block-btn:disabled {
  color: #e0dfd9;
  border-color: #f0efe8;
  cursor: not-allowed;
}
.block-btn-del:hover:not(:disabled) {
  color: #d94a3a;
  background: #fce8e5;
  border-color: #f5c6cb;
}

.block-empty {
  text-align: center;
  padding: 32px 16px;
  color: #bbb;
  font-size: 13px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  background: #fafaf8;
}

/* ==============================
   Toast
   ============================== */
.toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  padding: 10px 24px;
  font-size: 13px;
  border-radius: 6px;
  z-index: 200;
  animation: toast-in 250ms ease;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.toast.success {
  background: #1a1a1a;
  color: #fff;
}

.toast.error {
  background: #d94a3a;
  color: #fff;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==============================
   Responsive
   ============================== */
@media (max-width: 1200px) {
  .journal-list.has-panel { margin-right: 460px; }
  .edit-panel { width: 460px; }
}

@media (max-width: 900px) {
  .journal-list.has-panel { margin-right: 0; }
  .edit-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e0dfd9;
    height: 75vh;
    top: auto;
    bottom: 0;
    border-radius: 16px 16px 0 0;
  }
}

@media (max-width: 700px) {
  .journal-table .col-date,
  .journal-table .col-excerpt { display: none; }
  .form-grid { grid-template-columns: 1fr; }
  .toast { left: 16px; right: 16px; bottom: 16px; text-align: center; }
}
</style>