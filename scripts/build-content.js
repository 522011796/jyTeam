#!/usr/bin/env node

/**
 * build-content.js
 *
 * 读取 content/ 目录下所有 Markdown + YAML Frontmatter 文件，
 * 解析并生成 data/index.js（与现有结构完全兼容）。
 *
 * 用法：
 *   node scripts/build-content.js
 *
 * 内容目录结构：
 *   content/missions/*.md    — 行动记录
 *   content/people/*.md      — 队员档案
 *   content/capabilities/*.md — 现场能力
 *   content/journal/*.md     — 战地日志
 */

const fs = require('fs')
const path = require('path')

const CONTENT_DIR = path.join(__dirname, '..', 'content')
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'index.js')

// ==============================
// 简易 YAML Frontmatter 解析器
// ==============================

/**
 * 解析 YAML 风格的前置元数据
 * 支持：简单键值、双引号字符串、单层嵌套对象、JSON 数组
 */
function parseFrontmatter(yamlText) {
  const result = {}
  const lines = yamlText.split('\n')
  let currentParent = null
  let currentParentKey = null

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    // 跳过空行和纯注释行
    const trimmed = raw.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    // 嵌套属性（以空格或 tab 开头）
    if (raw.startsWith(' ') || raw.startsWith('\t')) {
      const inner = trimmed
      const colonIdx = inner.indexOf(':')
      if (colonIdx === -1) continue
      const key = inner.substring(0, colonIdx).trim()
      const value = parseValue(inner.substring(colonIdx + 1).trim())
      if (currentParent) {
        currentParent[key] = value
      }
      continue
    }

    // 顶层属性
    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue
    const key = trimmed.substring(0, colonIdx).trim()
    const rawValue = trimmed.substring(colonIdx + 1).trim()

    if (rawValue === '') {
      // 空值意味着接下来是嵌套对象
      currentParent = {}
      currentParentKey = key
      result[key] = currentParent
    } else {
      result[key] = parseValue(rawValue)
      currentParent = null
      currentParentKey = null
    }
  }

  return result
}

/**
 * 解析单个值：字符串、数字、布尔、数组
 */
function parseValue(val) {
  if (!val) return val

  // 双引号字符串
  if (val.startsWith('"') && val.endsWith('"')) {
    return val.slice(1, -1)
  }

  // JSON 数组 [a, b, c]
  if (val.startsWith('[') && val.endsWith(']')) {
    try {
      return JSON.parse(val)
    } catch (e) {
      return val.split(',').map(s => s.trim().replace(/^"|"$/g, ''))
    }
  }

  // 布尔值
  if (val === 'true') return true
  if (val === 'false') return false

  // 纯数字
  if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val)

  return val
}

// ==============================
// Markdown 正文解析
// ==============================

/**
 * 提取 ## 标题之间的内容段落
 * 返回 { sectionName: content } 映射
 *
 * 使用 split 按 \n##  分割，更可靠。
 */
function parseMarkdownSections(body) {
  const sections = {}
  // 移除开头的空白
  const cleaned = body.replace(/^\s+/, '')
  // 按 "## " 开头的行分割
  const parts = cleaned.split(/\n(?=## )/)
  for (const part of parts) {
    // 跳过空块
    if (!part.trim()) continue
    const firstNewline = part.indexOf('\n')
    let title, content
    if (firstNewline === -1) {
      title = part.replace(/^##\s+/, '').trim()
      content = ''
    } else {
      title = part.substring(0, firstNewline).replace(/^##\s+/, '').trim()
      content = part.substring(firstNewline).trim()
    }
    if (title) {
      sections[title] = content
    }
  }
  return sections
}

/**
 * 将正文按空行分割为段落
 */
function parseParagraphs(body) {
  return body
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
}

/**
 * 从正文中提取图片标记，支持两种格式：
 *
 * 1. 本地图片（标准 Markdown 语法）：
 *    ![图片说明](/images/content/journal-047-01.jpg)
 *
 * 2. Unsplash 主题图片（after 指定插在哪个段落之后）：
 *    ![图片说明](after:0, theme:mountain)
 */
function parseImages(body) {
  const images = []

  // 辅助：根据正文中的字符位置，计算在哪个段落之后
  function getParagraphIndex(charIndex) {
    const before = body.substring(0, charIndex)
    // 去掉行尾空白，避免把图片自身的段落分隔符算进去
    const trimmed = before.replace(/\n\s*$/, '')
    const breaks = (trimmed.match(/\n\s*\n/g) || []).length
    return breaks
  }

  // 匹配本地图片：![说明](路径)，路径以 / 开头
  const localRegex = /!\[(.+?)\]\((\/[^\s)]+\.(?:jpg|jpeg|png|webp|gif))\)/gi
  let match
  while ((match = localRegex.exec(body)) !== null) {
    images.push({
      after: getParagraphIndex(match.index),
      src: match[2],
      caption: match[1].trim()
    })
  }

  // 匹配 Unsplash 主题图片：![说明](after:N, theme:X)
  const themeRegex = /!\[(.+?)\]\(after:(\d+),\s*theme:(\w+)\)/g
  while ((match = themeRegex.exec(body)) !== null) {
    images.push({
      after: parseInt(match[2], 10),
      theme: match[3],
      caption: match[1].trim()
    })
  }

  return images
}

/**
 * 移除正文中的所有图片标记行，只保留纯文本
 */
function stripImages(body) {
  return body
    .replace(/!\[.+?\]\(after:\d+,\s*theme:\w+\)\n?/g, '')
    .replace(/!\[.+?\]\(\/[^\s)]+\.(?:jpg|jpeg|png|webp|gif)\)\n?/gi, '')
}

// ==============================
// 各类型映射规则
// ==============================

// 任务 → detail 字段映射
const MISSION_SECTION_MAP = {
  '接获通报': 'callSource',
  '现场条件': 'conditions',
  '队伍部署': 'deployment',
  '搜索过程': 'search',
  '救援经过': 'rescue',
  '撤离': 'evacuation',
  '行动复盘': 'afterAction'
}

function buildMissionDetail(sections) {
  const detail = {}
  for (const [title, key] of Object.entries(MISSION_SECTION_MAP)) {
    detail[key] = sections[title] || ''
  }
  return detail
}

// 队员 → detail 字段映射
function buildPersonDetail(sections) {
  const detail = {}
  // 关于她/他的段落
  for (const [title, content] of Object.entries(sections)) {
    if (title.startsWith('关于')) {
      detail.bio = content
    }
  }
  detail.motivation = sections['加入原因'] || ''
  detail.specialties = sections['专业领域'] || ''
  detail.equipment = sections['常用装备'] || ''
  // 参与任务 → 数组
  const missionsRaw = sections['参与任务'] || ''
  detail.missions = missionsRaw
    .split(/[,，、\s]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  detail.quote = sections['金句'] || ''
  return detail
}

// 能力 → detail 字段映射
const CAPABILITY_SECTION_MAP = {
  '概述': 'overview',
  '装备清单': 'gear',
  '训练方式': 'training',
  '实战案例': 'scenario'
}

function buildCapabilityDetail(sections) {
  const detail = {}
  for (const [title, key] of Object.entries(CAPABILITY_SECTION_MAP)) {
    detail[key] = sections[title] || ''
  }
  return detail
}

// 日志 → detail 字段
function buildJournalDetail(body, frontmatter) {
  const cleanBody = stripImages(body)
  const fullText = cleanBody.trim()
  const images = parseImages(body)
  return {
    fullText,
    relatedMission: frontmatter.relatedMission || '',
    tags: frontmatter.tags || [],
    images
  }
}

// ==============================
// 文件处理
// ==============================

/**
 * 读取并解析单个 .md 文件
 */
function parseFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')

  // 提取 frontmatter（第一个 --- 到第二个 --- 之间）
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!fmMatch) {
    console.warn(`[WARN] 未找到 frontmatter: ${filePath}`)
    return null
  }

  const frontmatter = parseFrontmatter(fmMatch[1])
  const body = raw.substring(fmMatch.index + fmMatch[0].length).trim()

  return { frontmatter, body, filePath }
}

/**
 * 处理一个目录下所有 .md 文件（跳过 _TEMPLATE.md）
 */
function processDir(dirName, handler) {
  const dir = path.join(CONTENT_DIR, dirName)
  if (!fs.existsSync(dir)) {
    console.warn(`[WARN] 目录不存在: ${dir}`)
    return []
  }

  const results = []
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== '_TEMPLATE.md')
    .sort()

  for (const file of files) {
    const filePath = path.join(dir, file)
    const parsed = parseFile(filePath)
    if (parsed) {
      const result = handler(parsed.frontmatter, parsed.body)
      if (result) {
        results.push(result)
      }
    }
  }

  return results
}

// ==============================
// 各类条目处理器
// ==============================

function handleMission(fm, body) {
  const sections = parseMarkdownSections(body)
  const detail = buildMissionDetail(sections)
  return {
    id: String(fm.id || ''),
    date: fm.date || '',
    type: fm.type || '',
    typeEn: fm.typeEn || '',
    timeline: fm.timeline || { callReceived: '', deployed: '', located: '', returned: '' },
    duration: fm.duration || '',
    members: fm.members || 0,
    status: fm.status || 'completed',
    location: fm.location || { name: '' },
    mapX: fm.mapX != null ? fm.mapX : (fm.location && fm.location.mapX) || 50,
    mapY: fm.mapY != null ? fm.mapY : (fm.location && fm.location.mapY) || 50,
    summary: fm.summary || '',
    imageTheme: fm.imageTheme || 'mountain',
    detail
  }
}

function handlePerson(fm, body) {
  const sections = parseMarkdownSections(body)
  const detail = buildPersonDetail(sections)
  return {
    id: fm.id || '',
    name: fm.name || '',
    nameEn: fm.nameEn || '',
    role: fm.role || '',
    background: fm.background || '',
    unit: fm.unit || '',
    joined: String(fm.joined || ''),
    story: fm.story || '',
    image: fm.image || '',
    imageTheme: fm.imageTheme || 'portrait',
    detail
  }
}

function handleCapability(fm, body) {
  const sections = parseMarkdownSections(body)
  const detail = buildCapabilityDetail(sections)
  return {
    id: fm.id || '',
    number: fm.number || '',
    title: fm.title || '',
    titleZh: fm.titleZh || '',
    icon: '◈',  // ◈
    imageTheme: fm.imageTheme || 'mountain',
    detail
  }
}

function handleJournal(fm, body) {
  const detail = buildJournalDetail(body, fm)
  return {
    id: fm.id || '',
    date: fm.date || '',
    title: fm.title || '',
    location: fm.location || '',
    excerpt: fm.excerpt || '',
    imageTheme: fm.imageTheme || 'mountain',
    detail
  }
}

// ==============================
// 主构建函数
// ==============================

function build() {
  console.log('[build-content] 开始从 content/ 构建 data/index.js ...\n')

  const missions = processDir('missions', handleMission)
  const people = processDir('people', handlePerson)
  const capabilities = processDir('capabilities', handleCapability)
  const journalEntries = processDir('journal', handleJournal)

  console.log(`  任务 (missions):      ${missions.length} 条`)
  console.log(`  队员 (people):        ${people.length} 人`)
  console.log(`  能力 (capabilities):  ${capabilities.length} 项`)
  console.log(`  日志 (journal):       ${journalEntries.length} 篇\n`)

  // 生成 data/index.js
  const output = `/*
 * 全域救援 — 完整数据
 *
 * ⚠️ 此文件由 scripts/build-content.js 自动生成
 * ⚠️ 请勿手动编辑 — 请在 content/ 目录中编辑对应的 .md 文件
 * ⚠️ 每次运行 node scripts/build-content.js 会覆盖此文件
 *
 * 内容目录：
 *   content/missions/*.md    — 行动记录
 *   content/people/*.md      — 队员档案
 *   content/capabilities/*.md — 现场能力
 *   content/journal/*.md     — 战地日志
 */

export const missions = ${JSON.stringify(missions, null, 2)}

export const people = ${JSON.stringify(people, null, 2)}

export const capabilities = ${JSON.stringify(capabilities, null, 2)}

export const journalEntries = ${JSON.stringify(journalEntries, null, 2)}
`

  // 确保 data 目录存在
  const dataDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8')
  console.log(`[build-content] ✅ 已生成 ${OUTPUT_FILE}`)
}


// 运行
build()
