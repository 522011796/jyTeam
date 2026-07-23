/**
 * 管理后台 API 工具（纯 fetch 实现，零依赖）
 *
 * 注入 Vue.prototype.$api 对象：
 *   this.$api.get('/admin/items')
 *   this.$api.post('/admin/missions', data)
 *   this.$api.delete('/admin/missions/055')
 *
 * 自动携带 admin_token（如果已登录）
 */

const BASE = '/api'

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  if (process.client) {
    const token = localStorage.getItem('admin_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  return headers
}

async function request(method, path, data) {
  const opts = {
    method,
    headers: getAuthHeaders()
  }
  if (data) opts.body = JSON.stringify(data)

  const res = await fetch(BASE + path, opts)

  // 401 → token 无效，清除并重定向到登录页
  if (res.status === 401) {
    if (process.client) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_token_expiry')
      const loginPath = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search)
      window.location.href = loginPath
    }
    throw new Error('认证已过期，请重新登录')
  }

  const json = await res.json()
  if (!res.ok || json.error) {
    throw new Error(json.error || `HTTP ${res.status}`)
  }
  return json
}

const api = {
  get(path) { return request('GET', path) },
  post(path, data) { return request('POST', path, data) },
  delete(path) { return request('DELETE', path) }
}

export default ({ app }, inject) => {
  inject('api', api)
}
