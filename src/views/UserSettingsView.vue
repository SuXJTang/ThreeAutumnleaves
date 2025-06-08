<template>
  <div class="user-settings-page">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <button @click="goBack" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M12 19L5 12L12 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        返回
      </button>
    </div>

    <div class="settings-container">
      <div class="settings-layout">
        <!-- 侧边栏导航 -->
        <div class="settings-sidebar">
          <div class="user-profile">
            <div class="avatar">{{ profileForm.username?.charAt(0).toUpperCase() || 'U' }}</div>
            <div class="user-info">
              <h3>{{ profileForm.username || '未设置用户名' }}</h3>
              <p>{{ profileForm.email || '未设置邮箱' }}</p>
            </div>
          </div>

          <nav class="sidebar-nav">
            <button
              @click="activeSection = 'profile'"
              :class="['nav-item', { active: activeSection === 'profile' }]"
            >
              <span class="nav-icon">👤</span>
              <span>基本信息</span>
            </button>
            <button
              @click="activeSection = 'security'"
              :class="['nav-item', { active: activeSection === 'security' }]"
            >
              <span class="nav-icon">🔒</span>
              <span>密码安全</span>
            </button>
            <button
              @click="activeSection = 'preferences'"
              :class="['nav-item', { active: activeSection === 'preferences' }]"
            >
              <span class="nav-icon">⚙️</span>
              <span>偏好设置</span>
            </button>
            <button
              @click="activeSection = 'account'"
              :class="['nav-item', { active: activeSection === 'account' }]"
            >
              <span class="nav-icon">📊</span>
              <span>账户操作</span>
            </button>
          </nav>
        </div>

        <!-- 主内容区域 -->
        <div class="settings-content">
          <!-- 基本信息设置 -->
          <div v-show="activeSection === 'profile'" class="settings-panel">
            <h2 class="panel-title">基本信息</h2>

            <form @submit.prevent="updateProfile" class="settings-form">
              <div class="form-group">
                <label for="username" class="form-label">用户名</label>
                <input
                  id="username"
                  v-model="profileForm.username"
                  type="text"
                  class="form-input"
                  placeholder="请输入用户名"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">邮箱地址</label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  class="form-input"
                  placeholder="请输入邮箱地址"
                  required
                />
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">手机号码</label>
                <input
                  id="phone"
                  v-model="profileForm.phone"
                  type="tel"
                  class="form-input"
                  placeholder="请输入手机号码"
                />
              </div>

              <div class="form-group">
                <label for="bio" class="form-label">个人简介</label>
                <textarea
                  id="bio"
                  v-model="profileForm.bio"
                  class="form-textarea"
                  placeholder="介绍一下自己..."
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" class="submit-btn" :disabled="isUpdating">
                <span v-if="isUpdating" class="loading-spinner"></span>
                {{ isUpdating ? '保存中...' : '保存更改' }}
              </button>
            </form>
          </div>

          <!-- 密码修改 -->
          <div v-show="activeSection === 'security'" class="settings-panel">
            <h2 class="panel-title">密码安全</h2>

            <form @submit.prevent="changePassword" class="settings-form">
              <div class="form-group">
                <label for="current-password" class="form-label">当前密码</label>
                <input
                  id="current-password"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="form-input"
                  placeholder="请输入当前密码"
                  required
                />
              </div>

              <div class="form-group">
                <label for="new-password" class="form-label">新密码</label>
                <input
                  id="new-password"
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-input"
                  placeholder="请输入新密码"
                  required
                />
              </div>

              <div class="form-group">
                <label for="confirm-password" class="form-label">确认新密码</label>
                <input
                  id="confirm-password"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-input"
                  placeholder="请再次输入新密码"
                  required
                />
              </div>

              <button type="submit" class="submit-btn" :disabled="isChangingPassword">
                <span v-if="isChangingPassword" class="loading-spinner"></span>
                {{ isChangingPassword ? '修改中...' : '修改密码' }}
              </button>
            </form>
          </div>

          <!-- 偏好设置 -->
          <div v-show="activeSection === 'preferences'" class="settings-panel">
            <h2 class="panel-title">偏好设置</h2>

            <div class="preference-item">
              <div class="preference-info">
                <h3>邮件通知</h3>
                <p>接收订单状态、新产品等通知邮件</p>
              </div>
              <label class="toggle-switch">
                <input v-model="preferences.emailNotifications" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>推送通知</h3>
                <p>接收浏览器推送通知</p>
              </div>
              <label class="toggle-switch">
                <input v-model="preferences.pushNotifications" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>自动下载</h3>
                <p>购买后自动开始下载</p>
              </div>
              <label class="toggle-switch">
                <input v-model="preferences.autoDownload" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>深色模式</h3>
                <p>使用深色主题界面</p>
              </div>
              <label class="toggle-switch">
                <input v-model="preferences.darkMode" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <button @click="savePreferences" class="submit-btn" :disabled="isSavingPreferences">
              <span v-if="isSavingPreferences" class="loading-spinner"></span>
              {{ isSavingPreferences ? '保存中...' : '保存偏好' }}
            </button>
          </div>

          <!-- 账户操作 -->
          <div v-show="activeSection === 'account'" class="settings-panel">
            <h2 class="panel-title">账户操作</h2>

            <div class="action-cards">
              <div class="action-card">
                <div class="action-icon">📤</div>
                <h3>导出我的数据</h3>
                <p>下载您的个人数据和活动历史记录的副本</p>
                <button @click="exportData" class="action-btn export-btn">导出数据</button>
              </div>

              <div class="action-card danger-card">
                <div class="action-icon">🗑️</div>
                <h3>删除账户</h3>
                <p>永久删除您的账户和所有相关数据</p>
                <button @click="confirmDeleteAccount" class="action-btn delete-btn">
                  删除账户
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功/错误消息 -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const activeSection = ref('profile') // 默认激活的部分

// 表单数据
const profileForm = reactive({
  username: '',
  email: '',
  phone: '',
  bio: '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const preferences = reactive({
  emailNotifications: true,
  pushNotifications: false,
  autoDownload: true,
  darkMode: false,
})

// 状态管理
const isUpdating = ref(false)
const isChangingPassword = ref(false)
const isSavingPreferences = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// 更新个人资料
const updateProfile = async () => {
  isUpdating.value = true

  try {
    // TODO: 调用API更新用户信息
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API调用

    showMessage('个人信息更新成功！')
  } catch (error) {
    showMessage('更新失败，请稍后重试', 'error')
  } finally {
    isUpdating.value = false
  }
}

// 修改密码
const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showMessage('两次输入的密码不一致', 'error')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    showMessage('新密码长度至少6位', 'error')
    return
  }

  isChangingPassword.value = true

  try {
    // TODO: 调用API修改密码
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API调用

    // 清空表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    showMessage('密码修改成功！')
  } catch (error) {
    showMessage('密码修改失败，请检查当前密码', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

// 保存偏好设置
const savePreferences = async () => {
  isSavingPreferences.value = true

  try {
    // TODO: 调用API保存偏好设置
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API调用

    showMessage('偏好设置保存成功！')
  } catch (error) {
    showMessage('保存失败，请稍后重试', 'error')
  } finally {
    isSavingPreferences.value = false
  }
}

// 导出数据
const exportData = () => {
  // TODO: 实现数据导出功能
  showMessage('数据导出功能开发中...')
}

// 确认删除账户
const confirmDeleteAccount = () => {
  if (confirm('确定要删除账户吗？此操作不可恢复！')) {
    if (confirm('请再次确认删除账户，所有数据将永久丢失！')) {
      deleteAccount()
    }
  }
}

// 删除账户
const deleteAccount = async () => {
  try {
    // TODO: 调用API删除账户
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API调用

    userStore.logout()
    router.push('/')
    showMessage('账户已删除')
  } catch (error) {
    showMessage('删除失败，请稍后重试', 'error')
  }
}

// 初始化数据
const initializeData = () => {
  if (userStore.currentUser) {
    profileForm.username = userStore.currentUser.username || ''
    profileForm.email = userStore.currentUser.email || ''
    // TODO: 从API获取完整的用户信息和偏好设置
  }
}

onMounted(() => {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    router.push('/')
    return
  }

  initializeData()
})
</script>

<style scoped>
.user-settings-page {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.back-button-container {
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: none;
  color: var(--color-primary);
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    5px 5px 10px rgba(0, 0, 0, 0.05),
    -5px -5px 10px rgba(255, 255, 255, 0.8);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow:
    7px 7px 15px rgba(0, 0, 0, 0.05),
    -7px -7px 15px rgba(255, 255, 255, 0.9);
}

.settings-container {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-layout {
  display: flex;
  gap: 30px;
}

/* 侧边栏样式 */
.settings-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.user-profile {
  padding: 25px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.user-info h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.user-info p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.sidebar-nav {
  padding: 15px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 25px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 16px;
  color: #555;
  transition: all 0.3s ease;
  cursor: pointer;
  gap: 12px;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.03);
  color: var(--color-primary);
}

.nav-item.active {
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  font-weight: 600;
  position: relative;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: var(--color-primary);
}

.nav-icon {
  font-size: 20px;
}

/* 内容区域样式 */
.settings-content {
  flex: 1;
}

.settings-panel {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.panel-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 0;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(var(--color-primary-rgb), 0.3);
  align-self: flex-start;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(var(--color-primary-rgb), 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.preference-item:last-child {
  border-bottom: none;
  margin-bottom: 20px;
}

.preference-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.preference-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* 账户操作卡片 */
.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.5),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow:
    10px 10px 20px rgba(0, 0, 0, 0.08),
    -10px -10px 20px rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
}

.danger-card {
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.action-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.action-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #333;
}

.action-card p {
  color: #666;
  margin: 0 0 20px;
  font-size: 14px;
}

.action-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn {
  background: #4ecdc4;
  color: white;
  box-shadow: 0 4px 10px rgba(78, 205, 196, 0.3);
}

.export-btn:hover {
  background: #45b7aa;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(78, 205, 196, 0.4);
}

.delete-btn {
  background: #ff6b6b;
  color: white;
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
}

.delete-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 107, 107, 0.4);
}

.message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 12px;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.message.success {
  background: var(--color-primary);
  color: white;
}

.message.error {
  background: #ff6b6b;
  color: white;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .settings-layout {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .sidebar-nav {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }

  .nav-item {
    padding: 10px 15px;
    white-space: nowrap;
  }

  .nav-item.active::before {
    height: 4px;
    width: 100%;
    top: auto;
    bottom: 0;
    left: 0;
  }
}

@media (max-width: 768px) {
  .action-cards {
    grid-template-columns: 1fr;
  }

  .preference-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .settings-panel {
    padding: 20px;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>
