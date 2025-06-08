<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
// AppFooter 移除，将在各个页面中单独引入
import BackToTop from './components/BackToTop.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import ForgotPasswordModal from './components/ForgotPasswordModal.vue'
import { apiUtils } from './utils/api'
import { useUserStore } from './stores/user'

// 用户类型定义
interface User {
  id: string | number
  username: string
  avatar?: string
  email?: string
  // 其他用户属性
}

// 获取路由实例
const router = useRouter()
const route = useRoute()

// 获取用户存储
const userStore = useUserStore()

// 模态框状态
const isLoginModalVisible = ref(false)
const isRegisterModalVisible = ref(false)
const isForgotPasswordModalVisible = ref(false)
const currentUser = computed(() => userStore.currentUser)

// 控制头部导航栏显示
const showHeader = computed(() => {
  // 在软件推荐页面和3D打印页面隐藏导航栏
  return route.name !== 'software-recommendations' && route.name !== '3d-printing'
})

// 初始化时检查登录状态
onMounted(() => {
  console.log('当前用户状态:', userStore.currentUser, userStore.isLoggedIn)
})

// 用户菜单状态
const isUserMenuVisible = ref(false)

// 显示登录模态框或用户菜单
const showLoginModal = () => {
  console.log('点击登录按钮，当前用户:', currentUser.value)
  if (currentUser.value) {
    // 如果已登录，切换用户菜单显示状态
    isUserMenuVisible.value = !isUserMenuVisible.value
    console.log('用户菜单状态:', isUserMenuVisible.value)
  } else {
    // 如果未登录，显示登录模态框
    console.log('用户未登录，显示登录模态框')
    isLoginModalVisible.value = true
    console.log('登录模态框状态:', isLoginModalVisible.value)
  }
}

// 关闭用户菜单
const closeUserMenu = () => {
  isUserMenuVisible.value = false
}

// 导航到指定路由
const navigateTo = (path: string) => {
  router.push(path)
  closeUserMenu()
}

// 关闭登录模态框
const closeLoginModal = () => {
  isLoginModalVisible.value = false
}

// 关闭注册模态框
const closeRegisterModal = () => {
  isRegisterModalVisible.value = false
}

// 关闭忘记密码模态框
const closeForgotPasswordModal = () => {
  isForgotPasswordModalVisible.value = false
}

// 显示注册模态框
const showRegisterModal = () => {
  isLoginModalVisible.value = false
  isRegisterModalVisible.value = true
}

// 显示忘记密码模态框
const showForgotPasswordModal = () => {
  isLoginModalVisible.value = false
  isForgotPasswordModalVisible.value = true
}

// 从注册切换到登录
const switchToLogin = () => {
  isRegisterModalVisible.value = false
  isForgotPasswordModalVisible.value = false
  isLoginModalVisible.value = true
}

// 处理登录成功
const handleLoginSuccess = (user: User) => {
  userStore.currentUser = user
  isLoginModalVisible.value = false
  console.log('登录成功:', user)
  // 这里可以添加登录成功后的逻辑，比如更新全局状态等
}

// 处理注册成功
const handleRegisterSuccess = (user: User) => {
  userStore.currentUser = user
  console.log('注册成功:', user)
  // 这里可以添加注册成功后的逻辑
}

// 处理忘记密码重置成功
const handleForgotPasswordSuccess = () => {
  console.log('密码重置成功')
  // 重置成功后切换到登录界面
  switchToLogin()
}

// 处理登出
const handleLogout = () => {
  apiUtils.clearAuthInfo()
  userStore.currentUser = null
  isUserMenuVisible.value = false
  console.log('用户已登出')
}
</script>

<template>
  <header class="app-header" v-if="showHeader">
    <div class="header-content">
      <div class="logo-section">
        <div class="logo">
          <img src="@/assets/img/logo.png" alt="三秋叶logo" />
        </div>
        <h1 class="app-title">三秋叶</h1>
      </div>

      <div class="nav-section">
        <nav class="nav">
          <RouterLink to="/" class="nav-link">首页</RouterLink>
          <RouterLink to="/projects" class="nav-link">项目合集</RouterLink>
          <RouterLink to="/community" class="nav-link">社区交流</RouterLink>
          <RouterLink to="/announcement" class="nav-link">公告</RouterLink>
        </nav>
        <div class="user-section">
          <button class="login-btn" @click="showLoginModal">
            <span v-if="currentUser" class="user-info">
              <div class="user-avatar-small">
                {{ currentUser.avatar || currentUser.username?.charAt(0).toUpperCase() }}
              </div>
              {{ currentUser.username }}
            </span>
            <span v-else>登录</span>
          </button>

          <!-- 用户下拉菜单 -->
          <div v-if="currentUser && isUserMenuVisible" class="user-menu" @click.stop>
            <div class="user-menu-header">
              <div class="user-avatar-large">
                {{ currentUser.avatar || currentUser.username?.charAt(0).toUpperCase() }}
              </div>
              <div class="user-details">
                <h4>{{ currentUser.username }}</h4>
                <p>{{ currentUser.email || '未设置邮箱' }}</p>
              </div>
            </div>

            <div class="user-menu-items">
              <div class="menu-item" @click="() => navigateTo('/user/profile')">
                <span class="menu-icon">👤</span>
                个人中心
              </div>

              <div class="menu-item" @click="() => navigateTo('/user/orders')">
                <span class="menu-icon">📦</span>
                我的订单
              </div>

              <div class="menu-item" @click="() => navigateTo('/user/favorites')">
                <span class="menu-icon">❤️</span>
                我的收藏
              </div>

              <div class="menu-item" @click="() => navigateTo('/user/settings')">
                <span class="menu-icon">⚙️</span>
                账户设置
              </div>

              <div class="menu-divider"></div>

              <button class="menu-item logout-item" @click="handleLogout">
                <span class="menu-icon">🚪</span>
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main @click="closeUserMenu">
    <RouterView />
  </main>

  <BackToTop />

  <!-- 登录模态框 -->
  <LoginModal
    :is-visible="isLoginModalVisible"
    @close="closeLoginModal"
    @login-success="handleLoginSuccess"
    @switch-to-register="showRegisterModal"
    @switch-to-forgot-password="showForgotPasswordModal"
  />

  <!-- 注册模态框 -->
  <RegisterModal
    :is-visible="isRegisterModalVisible"
    @close="closeRegisterModal"
    @register-success="handleRegisterSuccess"
    @switch-to-login="switchToLogin"
  />

  <!-- 忘记密码模态框 -->
  <ForgotPasswordModal
    :is-visible="isForgotPasswordModalVisible"
    @close="closeForgotPasswordModal"
    @switch-to-login="switchToLogin"
    @reset-success="handleForgotPasswordSuccess"
  />
</template>

<style scoped>
.app-header {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.92) 0%,
    rgba(74, 222, 128, 0.92) 25%,
    rgba(234, 179, 8, 0.92) 50%,
    rgba(250, 204, 21, 0.92) 75%,
    rgba(34, 197, 94, 0.92) 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 12s ease-in-out infinite;
  border-bottom: 3px solid rgba(34, 197, 94, 0.8);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow:
    0 6px 24px rgba(34, 197, 94, 0.25),
    0 3px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: shimmer 5s ease-in-out infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 三秋叶主题 - 移除暗色主题 */

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  padding: 0 var(--spacing-xl);
  max-width: 1280px;
  margin: 0 auto;
}

.nav-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 6px 16px rgba(34, 197, 94, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.logo img {
  width: 140%;
  height: 140%;
  object-fit: contain;
  border-radius: 50%;
  transform: scale(1.2);
  margin: -20%;
}

.logo:hover {
  transform: translateY(-2px) rotate(5deg);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: rgba(255, 255, 255, 0.98);
  margin: 0;
  letter-spacing: -0.01em;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.login-btn {
  /* 移除背景渐变，改为几乎透明的背景 */
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 1);
  /* 边框改为更细、更微妙 */
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  font-weight: 700;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;
  /* 简化阴影效果 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
  transform: scaleX(0);
  transition: transform 0.5s ease;
  /* 移除复杂的mask效果 */
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.8s ease;
  z-index: 2;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  /* 移除背景渐变，保持微妙 */
  background: rgba(255, 255, 255, 0.25);
  /* 边框更明显 */
  border-color: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
  /* 更明亮的阴影 */
  box-shadow:
    0 4px 12px rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.login-btn:hover::after {
  transform: scaleX(1);
}

.login-btn > span {
  position: relative;
  z-index: 3;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
}

.nav-link.router-link-exact-active {
  color: rgba(255, 255, 255, 1);
  text-decoration: none;
  font-weight: 700;
  position: relative;
  background: transparent;
  transform: translateY(0);
}

.nav-link.router-link-exact-active::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) scaleX(1);
  width: 35px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  opacity: 1;
}

.nav-link.router-link-exact-active:hover {
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.4),
    0 6px 12px rgba(0, 0, 0, 0.15);
}

main {
  flex: 1;
  min-height: calc(100vh - 200px); /* 确保内容区域有足够高度 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
    padding: 0 var(--spacing-md);
  }

  .logo-section {
    justify-content: center;
  }

  .nav-section {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .nav {
    justify-content: center;
    flex-wrap: wrap;
  }

  .login-btn {
    align-self: center;
    min-width: 100px;
    margin-top: 6px;
    /* 保持简洁设计 */
    background: rgba(255, 255, 255, 0.18);
    /* 更细的边框 */
    border: 1px solid rgba(255, 255, 255, 0.5);
    /* 简化阴影 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-weight: 700;
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .login-btn:hover,
  .login-btn:active {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  .app-header {
    padding: var(--spacing-sm) 0;
  }
}

.login-btn:focus,
.login-btn:focus-visible {
  outline: none;
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.1),
    0 2px 8px rgba(255, 255, 255, 0.25);
}

.login-btn:active {
  transform: translateY(1px);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
}

/* 用户菜单样式 */
.user-section {
  position: relative;
  z-index: 9999; /* 增加z-index确保其内容不被遮挡 */
}

.user-avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  z-index: 9999;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-menu-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
}

.user-details p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.user-menu-items {
  padding: 10px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
}

.menu-item:hover {
  background: #f8f9fa;
  color: #667eea;
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.menu-divider {
  height: 1px;
  background: #e9ecef;
  margin: 10px 0;
}

.logout-item {
  color: #dc3545;
}

.logout-item:hover {
  background: #fff5f5;
  color: #dc3545;
}

/* 响应式用户菜单 */
@media (max-width: 768px) {
  .user-menu {
    right: -10px;
    min-width: 250px;
  }

  .user-menu-header {
    padding: 15px;
  }

  .user-avatar-large {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>
