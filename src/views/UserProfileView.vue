<template>
  <div class="user-profile-page">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <button @click="goBack" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

    <div class="profile-container">
      <!-- 用户信息头部卡片 -->
      <div class="profile-header-card">
        <div class="profile-background">
          <div class="background-pattern"></div>
        </div>

        <div class="profile-content">
          <div class="avatar-section">
            <div class="user-avatar">
              <img
                v-if="userStore.currentUser?.avatar"
                :src="userStore.currentUser.avatar"
                :alt="userStore.currentUser.username"
              />
              <div v-else class="default-avatar">
                {{ userStore.currentUser?.username?.charAt(0).toUpperCase() }}
              </div>
              <div class="avatar-status"></div>
            </div>
            <button class="change-avatar-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
              更换头像
            </button>
          </div>

          <div class="user-info">
            <h1 class="username">{{ userStore.currentUser?.username }}</h1>
            <p class="user-email">{{ userStore.currentUser?.email || '未设置邮箱' }}</p>
            <div class="user-badges">
              <span class="role-badge" :class="getRoleClass(userStore.currentUser?.role)">
                {{ getRoleText(userStore.currentUser?.role) }}
              </span>
              <span class="join-badge"> 加入 1 天 </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作网格 -->
      <div class="quick-actions-grid">
        <router-link to="/user/orders" class="action-card orders">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 7L12 3L4 7L12 11L20 7Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 12L12 16L20 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 17L12 21L20 17"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="card-content">
            <h3>我的订单</h3>
            <p>{{ userStats.totalOrders }} 个订单</p>
          </div>
          <div class="card-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </router-link>

        <router-link to="/user/favorites" class="action-card favorites">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61A5.5 5.5 0 0 0 16 2A5.5 5.5 0 0 0 12 4A5.5 5.5 0 0 0 8 2A5.5 5.5 0 0 0 3.16 4.61C1.84 5.95 1.84 8.05 3.16 9.39L12 18.23L20.84 9.39C22.16 8.05 22.16 5.95 20.84 4.61Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="card-content">
            <h3>我的收藏</h3>
            <p>{{ userStats.totalFavorites }} 个收藏</p>
          </div>
          <div class="card-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </router-link>

        <router-link to="/user/settings" class="action-card settings">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15A3 3 0 1 0 12 9A3 3 0 0 0 12 15Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19.4 15A1.65 1.65 0 0 0 19 14.3L20.25 12.82A1.65 1.65 0 0 0 20.25 11.18L19 9.7A1.65 1.65 0 0 0 19.4 9A1.65 1.65 0 0 0 18.75 7.25L16.93 6.86A1.65 1.65 0 0 0 15.18 5.11L14.79 3.29A1.65 1.65 0 0 0 12.82 2.25A1.65 1.65 0 0 0 11.18 2.25L9.21 3.29A1.65 1.65 0 0 0 7.46 5.11L5.64 6.86A1.65 1.65 0 0 0 4.6 9A1.65 1.65 0 0 0 5 9.7L3.75 11.18A1.65 1.65 0 0 0 3.75 12.82L5 14.3A1.65 1.65 0 0 0 4.6 15A1.65 1.65 0 0 0 5.25 16.75L7.07 17.14A1.65 1.65 0 0 0 8.82 18.89L9.21 20.71A1.65 1.65 0 0 0 11.18 21.75A1.65 1.65 0 0 0 12.82 21.75L14.79 20.71A1.65 1.65 0 0 0 16.54 18.89L18.36 17.14A1.65 1.65 0 0 0 19.4 15Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="card-content">
            <h3>账户设置</h3>
            <p>个人信息管理</p>
          </div>
          <div class="card-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </router-link>

        <div class="action-card downloads" @click="showDownloadHistory">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 15V3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="card-content">
            <h3>下载记录</h3>
            <p>{{ userStats.totalDownloads }} 次下载</p>
          </div>
          <div class="card-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- 统计信息卡片 -->
      <div class="stats-section">
        <div class="stats-header">
          <h2>数据概览</h2>
          <p>您的使用统计和活动数据</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 4H18A2 2 0 0 1 20 6V18A2 2 0 0 1 18 20H6A2 2 0 0 1 4 18V6A2 2 0 0 1 6 4H8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="8"
                  y="2"
                  width="8"
                  height="4"
                  rx="1"
                  ry="1"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ userStats.totalOrders }}</div>
              <div class="stat-label">总订单数</div>
              <div class="stat-trend">+12% 本月</div>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 15V3"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ userStats.totalDownloads }}</div>
              <div class="stat-label">下载次数</div>
              <div class="stat-trend">+8% 本月</div>
            </div>
          </div>

          <div class="stat-card warning">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.84 4.61A5.5 5.5 0 0 0 16 2A5.5 5.5 0 0 0 12 4A5.5 5.5 0 0 0 8 2A5.5 5.5 0 0 0 3.16 4.61C1.84 5.95 1.84 8.05 3.16 9.39L12 18.23L20.84 9.39C22.16 8.05 22.16 5.95 20.84 4.61Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ userStats.totalFavorites }}</div>
              <div class="stat-label">收藏数量</div>
              <div class="stat-trend">+5% 本月</div>
            </div>
          </div>

          <div class="stat-card info">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2V6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 18V22"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.93 4.93L7.76 7.76"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.24 16.24L19.07 19.07"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 12H6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18 12H22"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.93 19.07L7.76 16.24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.24 7.76L19.07 4.93"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">¥{{ userStats.totalSpent }}</div>
              <div class="stat-label">累计消费</div>
              <div class="stat-trend">+15% 本月</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 退出登录按钮 -->
      <div class="logout-section">
        <button @click="handleLogout" class="logout-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 17L21 12L16 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          退出登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 用户统计数据
const userStats = ref({
  totalOrders: 0,
  totalDownloads: 0,
  totalFavorites: 0,
  totalSpent: 0,
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取角色文本
const getRoleText = (role?: string) => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    vip: 'VIP用户',
    user: '普通用户',
  }
  return roleMap[role || 'user'] || '普通用户'
}

// 获取角色样式类
const getRoleClass = (role?: string) => {
  const classMap: Record<string, string> = {
    admin: 'role-admin',
    vip: 'role-vip',
    user: 'role-user',
  }
  return classMap[role || 'user'] || 'role-user'
}

// 格式化加入日期
const formatJoinDate = (dateString?: string) => {
  if (!dateString) return '新用户'

  // 使用当前日期作为默认值，防止类型错误
  let joinDate = new Date()
  try {
    joinDate = dateString ? new Date(dateString) : new Date()
  } catch (e) {
    console.error('日期格式解析错误:', e)
  }

  const now = new Date()
  const diffTime = Math.abs(now.getTime() - joinDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) {
    return `加入 ${diffDays} 天`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `加入 ${months} 个月`
  } else {
    const years = Math.floor(diffDays / 365)
    return `加入 ${years} 年`
  }
}

// 显示下载记录
const showDownloadHistory = () => {
  // TODO: 实现下载记录功能
  console.log('显示下载记录')
}

// 处理退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/')
  }
}

// 加载用户统计数据
const loadUserStats = async () => {
  try {
    // TODO: 从API获取用户统计数据
    // 这里使用模拟数据
    userStats.value = {
      totalOrders: 12,
      totalDownloads: 45,
      totalFavorites: 23,
      totalSpent: 299,
    }
  } catch (error) {
    console.error('加载用户统计失败:', error)
  }
}

onMounted(() => {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    router.push('/')
    return
  }

  loadUserStats()
})
</script>

<style scoped>
.user-profile-page {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 24px;
}

.back-button-container {
  margin-bottom: 24px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: none;
  color: var(--color-primary);
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
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

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 用户信息头部卡片 */
.profile-header-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow:
    10px 10px 20px rgba(0, 0, 0, 0.05),
    -10px -10px 20px rgba(255, 255, 255, 0.9),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.profile-background {
  height: 120px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
}

.profile-content {
  padding: 32px;
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-top: -60px;
  position: relative;
  z-index: 1;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.7),
    inset 1px 1px 1px rgba(255, 255, 255, 0.2);
  position: relative;
  background: white;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 700;
  position: relative;
  overflow: hidden;
}

.default-avatar::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  top: -50%;
  left: -50%;
  animation: shimmer 6s infinite linear;
}

@keyframes shimmer {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.avatar-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.change-avatar-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: var(--color-primary);
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    5px 5px 10px rgba(0, 0, 0, 0.05),
    -5px -5px 10px rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
}

.change-avatar-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    7px 7px 15px rgba(0, 0, 0, 0.05),
    -7px -7px 15px rgba(255, 255, 255, 0.9),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
}

.user-info {
  flex: 1;
  padding-top: 60px;
}

.username {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.user-email {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.user-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow:
    3px 3px 6px rgba(0, 0, 0, 0.05),
    -3px -3px 6px rgba(255, 255, 255, 0.8);
}

.role-badge.role-admin {
  background: #fecaca;
  color: #b91c1c;
}

.role-badge.role-vip {
  background: #fef3c7;
  color: #b45309;
}

.role-badge.role-user {
  background: #e0f2fe;
  color: #0369a1;
}

.join-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow:
    3px 3px 6px rgba(0, 0, 0, 0.05),
    -3px -3px 6px rgba(255, 255, 255, 0.8);
}

/* 快捷操作网格 */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.action-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.action-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  transition: opacity 0.3s ease;
  opacity: 0;
}

.action-card:hover {
  transform: translateY(-5px) rotateX(2deg) rotateY(-2deg);
  box-shadow:
    12px 12px 24px rgba(0, 0, 0, 0.07),
    -12px -12px 24px rgba(255, 255, 255, 0.9),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
}

.action-card:hover::before {
  opacity: 1;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
  transition: all 0.3s ease;
  box-shadow:
    inset 2px 2px 5px rgba(0, 0, 0, 0.05),
    inset -2px -2px 5px rgba(255, 255, 255, 0.8);
}

.action-card.orders .card-icon {
  background: #e0f2fe;
  color: #0369a1;
}

.action-card.favorites .card-icon {
  background: #fecaca;
  color: #b91c1c;
}

.action-card.settings .card-icon {
  background: #f1f5f9;
  color: #475569;
}

.action-card.downloads .card-icon {
  background: #dcfce7;
  color: #16a34a;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.card-content p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.card-arrow {
  color: #94a3b8;
  transition: all 0.3s ease;
}

.action-card:hover .card-arrow {
  color: #334155;
  transform: translateX(4px);
}

/* 统计信息部分 */
.stats-section {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 32px;
}

.stats-header {
  text-align: center;
  margin-bottom: 32px;
}

.stats-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.stats-header p {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow:
    6px 6px 12px rgba(0, 0, 0, 0.03),
    -6px -6px 12px rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.9),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow:
    5px 5px 10px rgba(0, 0, 0, 0.05),
    -5px -5px 10px rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
}

.stat-card.primary .stat-icon {
  color: #0369a1;
}

.stat-card.success .stat-icon {
  color: #16a34a;
}

.stat-card.warning .stat-icon {
  color: #ca8a04;
}

.stat-card.info .stat-icon {
  color: #0284c7;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.stat-trend {
  font-size: 12px;
  color: #16a34a;
  font-weight: 500;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend::before {
  content: '↑';
  display: inline-block;
}

/* 退出登录部分 */
.logout-section {
  text-align: center;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #fee2e2;
  color: #b91c1c;
  border: none;
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    6px 6px 12px rgba(0, 0, 0, 0.05),
    -6px -6px 12px rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
}

.logout-btn:hover {
  background: #fecaca;
  transform: translateY(-2px);
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.07),
    -8px -8px 16px rgba(255, 255, 255, 0.9),
    inset 1px 1px 1px rgba(255, 255, 255, 1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .quick-actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .user-profile-page {
    padding: 16px;
  }

  .profile-container {
    gap: 20px;
  }

  .profile-content {
    flex-direction: column;
    text-align: center;
    padding: 24px;
    margin-top: -40px;
  }

  .user-info {
    padding-top: 20px;
  }

  .username {
    font-size: 24px;
  }

  .user-badges {
    justify-content: center;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-number {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .profile-background {
    height: 100px;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
  }

  .default-avatar {
    font-size: 40px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-card {
    padding: 20px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
