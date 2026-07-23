/**
 * 全域救援 — 管理后台 API 中间件
 *
 * 处理 content/*.md 文件的 CRUD、图片上传、自动重编译。
 * 所有接口前缀: /api/admin/
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { execSync } = require('child_process')

const CONTENT_DIR = path.join(__dirname, '..', 'content')
const IMAGES_DIR = path.join(__dirname, '..', 'static', 'images', 'content')
const BUILD_SCRIPT = path.join(__dirname, '..', 'scripts', 'build-content.js')

// ==============================
// 认证配置
// ==============================

const AUTH_SECRET = 'jy-team-rescue-admin-2026-v2'
const VALID_CREDENTIALS = { username: 'admin', password: '123321' }
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000 // 24 小时

/**
 * 生成签名 token
 * 格式: base64url(username:expiry:hmac)
 */
function generateToken(username) {
  const expiry = Date.now() + TOKEN_TTL_MS
  const payload = `${username}:${expiry}`
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url')
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

/**
 * 验证 token，成功返回 username，失败返回 null
 */
function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const parts = decoded.split(':')
    if (parts.length !== 3) return null
    const [username, expiryStr, sig] = parts
    const expiry = parseInt(expiryStr, 10)
    if (Date.now() > expiry) return null
    const expected = crypto.createHmac('sha256', AUTH_SECRET).update(`${username}:${expiryStr}`).digest('base64url')
    if (sig !== expected) return null
    return username
  } catch { return null }
}

/**
 * 从请求中提取并验证 token
 */
function authenticate(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || ''
  const m = authHeader.match(/^Bearer\s+(.+)$/i)
  if (!m) return null
  return verifyToken(m[1])
}

// ==============================
// 工具函数
// ==============================

/** 解析 JSON 请求体 */
function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(body)) }
      catch { resolve({}) }
    })
  })
}

/** 发送 JSON 响应 */
function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data, null, 2))
}

/** 确保目录存在 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

/** 生成 YAML 字符串 */
function toYaml(obj, indent = 0) {
  let out = ''
  const pad = '  '.repeat(indent)
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined || val === '') continue
    if (typeof val === 'object' && !Array.isArray(val)) {
      out += `${pad}${key}:\n`
      out += toYaml(val, indent + 1)
    } else if (Array.isArray(val)) {
      const items = val.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(', ')
      out += `${pad}${key}: [${items}]\n`
    } else if (typeof val === 'number') {
      out += `${pad}${key}: ${val}\n`
    } else if (typeof val === 'boolean') {
      out += `${pad}${key}: ${val}\n`
    } else {
      out += `${pad}${key}: "${String(val).replace(/"/g, '\\"')}"\n`
    }
  }
  return out
}

/** 保存 base64 图片到 static/images/content/ */
function saveBase64Image(dataUrl, filename) {
  ensureDir(IMAGES_DIR)
  const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/)
  if (!matches) throw new Error('无效的 base64 图片数据')
  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
  const name = filename || `upload-${Date.now()}.${ext}`
  const filePath = path.join(IMAGES_DIR, name)
  fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'))
  return `/images/content/${name}`
}

/** 执行内容重编译 */
function rebuildContent() {
  try {
    execSync(`node ${BUILD_SCRIPT}`, { cwd: path.join(__dirname, '..'), timeout: 10000 })
    return true
  } catch (e) {
    console.error('[admin] build-content 失败:', e.message)
    return false
  }
}

// ==============================
// 各内容类型的 .md 文件生成
// ==============================

const CONTENT_GENERATORS = {
  missions(data) {
    const fm = {
      id: data.id,
      date: data.date,
      type: data.type,
      typeEn: data.typeEn || '',
      timeline: data.timeline || { callReceived: '', deployed: '', located: '', returned: '' },
      duration: data.duration || '',
      members: data.members || 0,
      status: data.status || 'completed',
      location: data.location || { name: '' },
      mapX: data.mapX,
      mapY: data.mapY,
      summary: data.summary || '',
      imageTheme: data.imageTheme || 'mountain'
    }
    const detail = data.detail || {}
    const body = [
      '## 接获通报', '', detail.callSource || '',
      '', '## 现场条件', '', detail.conditions || '',
      '', '## 队伍部署', '', detail.deployment || '',
      '', '## 搜索过程', '', detail.search || '',
      '', '## 救援经过', '', detail.rescue || '',
      '', '## 撤离', '', detail.evacuation || '',
      '', '## 行动复盘', '', detail.afterAction || ''
    ].join('\n')
    return `---\n${toYaml(fm)}---\n\n${body}\n`
  },

  people(data) {
    const fm = {
      id: data.id,
      name: data.name,
      nameEn: data.nameEn || '',
      role: data.role || '',
      background: data.background || '',
      unit: data.unit || '',
      joined: data.joined || '',
      image: data.image || '',
      imageTheme: data.imageTheme || 'portrait',
      story: data.story || ''
    }
    const detail = data.detail || {}
    const about = detail.bio || ''
    const body = [
      `## 关于${data.name && data.name.length >= 1 ? (data.name.slice(-1)) : '他'}`, '', about,
      '', '## 加入原因', '', detail.motivation || '',
      '', '## 专业领域', '', detail.specialties || '',
      '', '## 常用装备', '', detail.equipment || '',
      '', '## 参与任务', '', Array.isArray(detail.missions) ? detail.missions.join(', ') : (detail.missions || ''),
      '', '## 金句', '', detail.quote || ''
    ].join('\n')
    return `---\n${toYaml(fm)}---\n\n${body}\n`
  },

  capabilities(data) {
    const fm = {
      id: data.id,
      number: data.number || '',
      title: data.title || '',
      titleZh: data.titleZh || '',
      imageTheme: data.imageTheme || 'mountain'
    }
    const detail = data.detail || {}
    const body = [
      '## 概述', '', detail.overview || '',
      '', '## 装备清单', '', detail.gear || '',
      '', '## 训练方式', '', detail.training || '',
      '', '## 实战案例', '', detail.scenario || ''
    ].join('\n')
    return `---\n${toYaml(fm)}---\n\n${body}\n`
  },

  journal(data) {
    const fm = {
      id: data.id,
      date: data.date || '',
      title: data.title || '',
      location: data.location || '',
      excerpt: data.excerpt || '',
      relatedMission: data.relatedMission || '',
      tags: data.tags || [],
      imageTheme: data.imageTheme || 'mountain'
    }
    const body = (data.detail && data.detail.fullText) ? data.detail.fullText : (data.body || '')
    return `---\n${toYaml(fm)}---\n\n${body}\n`
  }
}

// 类型 → 子目录映射
const TYPE_DIR_MAP = {
  missions: 'missions',
  people: 'people',
  capabilities: 'capabilities',
  journal: 'journal'
}

// ==============================
// 路由处理
// ==============================

async function handleRequest(req, res) {
  // CORS（开发时需要）
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  const url = req.url.replace(/\/$/, '') // 去掉尾部斜杠
  const parts = url.split('/').filter(Boolean) // ['admin', 'missions'] 或 ['admin', 'missions', '055']

  // ==============================
  // 认证接口
  // ==============================

  // POST /api/admin/auth — 登录
  if (req.method === 'POST' && parts.length === 2 && parts[0] === 'admin' && parts[1] === 'auth') {
    try {
      const data = await parseBody(req)
      if (data.username === VALID_CREDENTIALS.username && data.password === VALID_CREDENTIALS.password) {
        const token = generateToken(data.username)
        return json(res, { success: true, token, expiresAt: Date.now() + TOKEN_TTL_MS })
      }
      return json(res, { error: '账号或密码错误' }, 401)
    } catch (e) {
      return json(res, { error: e.message }, 500)
    }
  }

  // POST /api/admin/auth/verify — 验证 token 是否有效
  if (req.method === 'POST' && parts.length === 3 && parts[0] === 'admin' && parts[1] === 'auth' && parts[2] === 'verify') {
    const user = authenticate(req)
    return json(res, { valid: !!user, username: user || null })
  }

  // ==============================
  // 以下接口需要认证
  // ==============================

  // GET /api/admin/items — 获取所有内容数据
  if (req.method === 'GET' && parts.length === 2 && parts[0] === 'admin' && parts[1] === 'items') {
    try {
      const dataPath = path.join(__dirname, '..', 'data', 'index.js')
      // 直接读取生成好的 data/index.js 内容并解析
      const raw = fs.readFileSync(dataPath, 'utf-8')
      // 简单的 JS 解析：提取 export const 数组
      const result = {}
      const types = ['missions', 'people', 'capabilities', 'journalEntries']
      for (const type of types) {
        const regex = new RegExp(`export const ${type} = (\\[[\\s\\S]*?\\n\\])`, 'm')
        const match = raw.match(regex)
        if (match) {
          try {
            result[type] = eval(match[1])
          } catch (e) {
            result[type] = []
          }
        }
      }
      return json(res, result)
    } catch (e) {
      return json(res, { error: e.message }, 500)
    }
  }

  // GET /api/admin/:type — 获取某类型所有条目
  if (req.method === 'GET' && parts.length === 2 && parts[0] === 'admin' && TYPE_DIR_MAP[parts[1]]) {
    try {
      const dir = path.join(CONTENT_DIR, TYPE_DIR_MAP[parts[1]])
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== '_TEMPLATE.md')
      const items = files.map(f => {
        const raw = fs.readFileSync(path.join(dir, f), 'utf-8')
        const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
        const id = f.replace('.md', '')
        return { id, filename: f, raw }
      })
      return json(res, items)
    } catch (e) {
      return json(res, { error: e.message }, 500)
    }
  }

  // POST /api/admin/:type — 创建或更新条目
  if (req.method === 'POST' && parts.length === 2 && parts[0] === 'admin' && TYPE_DIR_MAP[parts[1]]) {
    const user = authenticate(req)
    if (!user) return json(res, { error: '未授权' }, 401)
    try {
      const data = await parseBody(req)
      const type = parts[1]
      const generator = CONTENT_GENERATORS[type]
      if (!generator) return json(res, { error: '未知类型' }, 400)
      if (!data.id) return json(res, { error: '缺少 id 字段' }, 400)

      const dir = path.join(CONTENT_DIR, TYPE_DIR_MAP[type])
      ensureDir(dir)
      const filePath = path.join(dir, `${data.id}.md`)
      const content = generator(data)
      fs.writeFileSync(filePath, content, 'utf-8')

      // 重编译
      const ok = rebuildContent()
      return json(res, { success: true, id: data.id, rebuilt: ok })
    } catch (e) {
      return json(res, { error: e.message }, 500)
    }
  }

  // DELETE /api/admin/:type/:id — 删除条目
  if (req.method === 'DELETE' && parts.length === 3 && parts[0] === 'admin' && TYPE_DIR_MAP[parts[1]]) {
    const user = authenticate(req)
    if (!user) return json(res, { error: '未授权' }, 401)
    try {
      const type = parts[1]
      const id = parts[2]
      const dir = path.join(CONTENT_DIR, TYPE_DIR_MAP[type])
      const filePath = path.join(dir, `${id}.md`)
      if (!fs.existsSync(filePath)) {
        return json(res, { error: '文件不存在' }, 404)
      }
      fs.unlinkSync(filePath)
      const ok = rebuildContent()
      return json(res, { success: true, id, rebuilt: ok })
    } catch (e) {
      return json(res, { error: e.message }, 500)
    }
  }

  // POST /api/admin/upload-image — 上传图片
  if (req.method === 'POST' && parts.length === 2 && parts[0] === 'admin' && parts[1] === 'upload-image') {
    const user = authenticate(req)
    if (!user) return json(res, { error: '未授权' }, 401)
    try {
      const data = await parseBody(req)
      if (!data.image) return json(res, { error: '缺少 image 字段' }, 400)
      const url = saveBase64Image(data.image, data.filename || null)
      return json(res, { success: true, url })
    } catch (e) {
      return json(res, { error: e.message }, 500)
    }
  }

  // POST /api/admin/rebuild — 手动重编译
  if (req.method === 'POST' && parts.length === 2 && parts[0] === 'admin' && parts[1] === 'rebuild') {
    const user = authenticate(req)
    if (!user) return json(res, { error: '未授权' }, 401)
    const ok = rebuildContent()
    return json(res, { success: ok })
  }

  // 404
  json(res, { error: 'Not Found' }, 404)
}

module.exports = (req, res, next) => {
  // Nuxt serverMiddleware with path '/api' strips the /api prefix from req.url
  if (req.url.startsWith('/admin')) {
    return handleRequest(req, res)
  }
  next()
}
