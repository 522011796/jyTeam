<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">全域救援</h1>
        <p class="login-subtitle">管理后台</p>
      </div>

      <form class="login-form" @submit.prevent="login">
        <div class="form-field">
          <label class="field-label">账号</label>
          <input
            v-model="username"
            type="text"
            class="field-input"
            placeholder="请输入账号"
            autocomplete="username"
            :disabled="loading"
          />
        </div>

        <div class="form-field">
          <label class="field-label">密码</label>
          <input
            v-model="password"
            type="password"
            class="field-input"
            placeholder="请输入密码"
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>

        <div v-if="errorMsg" class="login-error">{{ errorMsg }}</div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  layout: 'empty',

  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errorMsg: ''
    }
  },

  mounted() {
    // 已登录则直接跳转
    if (process.client && localStorage.getItem('admin_token')) {
      const redirect = this.$route.query.redirect || '/admin'
      this.$router.replace(redirect)
    }
  },

  methods: {
    async login() {
      this.errorMsg = ''

      if (!this.username.trim()) {
        this.errorMsg = '请输入账号'
        return
      }
      if (!this.password) {
        this.errorMsg = '请输入密码'
        return
      }

      this.loading = true

      try {
        const res = await this.$api.post('/admin/auth', {
          username: this.username.trim(),
          password: this.password
        })

        if (res.token) {
          localStorage.setItem('admin_token', res.token)
          if (res.expiresAt) {
            localStorage.setItem('admin_token_expiry', String(res.expiresAt))
          }
          const redirect = this.$route.query.redirect || '/admin'
          this.$router.replace(redirect)
        } else {
          this.errorMsg = '登录失败，请重试'
        }
      } catch (e) {
        this.errorMsg = e.message || '账号或密码错误'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.login-card {
  width: 360px;
  max-width: 90vw;
  background: #fff;
  border-radius: 12px;
  padding: 40px 36px 36px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px;
  letter-spacing: 0.04em;
}

.login-subtitle {
  font-size: 13px;
  color: #999;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.field-input {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fafaf8;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  font-family: inherit;
  box-sizing: border-box;
}

.field-input:focus {
  outline: none;
  border-color: #999;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.06);
  background: #fff;
}

.field-input:disabled {
  background: #f0f0e8;
  color: #999;
}

.login-error {
  font-size: 13px;
  color: #d94a3a;
  text-align: center;
  padding: 8px 12px;
  background: #fce8e5;
  border-radius: 6px;
}

.login-btn {
  padding: 10px 0;
  margin-top: 6px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease;
  font-family: inherit;
}

.login-btn:hover { background: #333; }
.login-btn:disabled { background: #999; cursor: not-allowed; }
</style>
