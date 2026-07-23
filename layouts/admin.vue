<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-header">
        <h1 class="admin-logo">全域救援
          <img
            v-if="$xcarEnabled()"
            src="~/static/images/xcar_red.png"
            alt="xcar"
            class="admin-logo-xcar"
          />
        </h1>
        <span class="admin-logo-sub">管理后台</span>
      </div>
      <nav class="admin-nav">
        <NuxtLink to="/admin" class="admin-nav-item" exact-active-class="active">
          <span class="nav-icon">◈</span> 仪表盘
        </NuxtLink>
        <NuxtLink to="/admin/missions" class="admin-nav-item" active-class="active">
          <span class="nav-icon">⊙</span> 行动记录
        </NuxtLink>
        <NuxtLink to="/admin/people" class="admin-nav-item" active-class="active">
          <span class="nav-icon">◎</span> 队员档案
        </NuxtLink>
        <NuxtLink to="/admin/capabilities" class="admin-nav-item" active-class="active">
          <span class="nav-icon">◉</span> 现场能力
        </NuxtLink>
        <NuxtLink to="/admin/journal" class="admin-nav-item" active-class="active">
          <span class="nav-icon">◔</span> 战地记录
        </NuxtLink>
      </nav>
      <div class="admin-sidebar-footer">
        <a href="/" target="_blank" class="admin-site-link">查看网站 →</a>
      </div>
    </aside>
    <main class="admin-main">
      <Nuxt />
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  middleware: 'auth'
}
</script>

<style>
/* 重置全局样式对 admin 的影响 */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
}

.admin-sidebar {
  width: 220px;
  background: #1a1a1a;
  color: #ccc;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.admin-sidebar-header {
  padding: 24px 20px 20px;
  border-bottom: 1px solid #333;
}

.admin-logo {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.admin-logo-xcar {
  height: 22px;
  width: auto;
  margin-left: 8px;
  vertical-align: middle;
  display: inline;
}

.admin-logo-sub {
  display: block;
  font-size: 11px;
  color: #888;
  margin-top: 4px;
  letter-spacing: 0.05em;
}

.admin-nav {
  flex: 1;
  padding: 12px 0;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 14px;
  color: #aaa;
  text-decoration: none;
  transition: all 150ms ease;
}

.admin-nav-item:hover { background: #2a2a2a; color: #ddd; }
.admin-nav-item.active { background: #333; color: #fff; border-right: 3px solid #c8b896; }

.nav-icon { font-size: 12px; width: 16px; text-align: center; }

.admin-sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #333;
}

.admin-site-link {
  font-size: 12px;
  color: #888;
  text-decoration: none;
  transition: color 150ms;
}
.admin-site-link:hover { color: #ccc; }

.admin-main {
  flex: 1;
  margin-left: 220px;
  padding: 32px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 60px;
  }
  .admin-sidebar-header { padding: 16px 8px; }
  .admin-logo { font-size: 14px; }
  .admin-logo-sub { display: none; }
  .admin-nav-item { padding: 10px 8px; justify-content: center; font-size: 0; }
  .nav-icon { font-size: 16px; }
  .admin-site-link { font-size: 0; }
  .admin-site-link::after { content: '→'; font-size: 14px; }
  .admin-main { margin-left: 60px; padding: 16px; }
}
</style>
