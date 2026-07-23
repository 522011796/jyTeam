/**
 * Admin 认证中间件
 *
 * 检查 localStorage 中是否存在有效 token，
 * 无 token 则重定向到 /admin/login
 */

export default function ({ redirect, route }) {
  // 登录页本身不做检查
  if (route.path === '/admin/login') return

  if (!process.client) return

  const token = localStorage.getItem('admin_token')
  if (!token) {
    const intended = route.fullPath
    const loginPath = intended ? `/admin/login?redirect=${encodeURIComponent(intended)}` : '/admin/login'
    return redirect(loginPath)
  }
}
