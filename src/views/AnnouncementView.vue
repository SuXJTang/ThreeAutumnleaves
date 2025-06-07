<template>
  <div class="announcement-view">
    <!-- 页面头部 -->
    <section class="announcement-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">公告通知</h1>
          <p class="hero-subtitle">及时了解最新动态，掌握重要信息</p>
        </div>
      </div>
    </section>

    <!-- 公告内容区域 -->
    <section class="announcement-content">
      <div class="container">
        <div class="announcement-layout">
          <!-- 公告筛选器 -->
          <div class="announcement-filters">
            <div class="filter-group">
              <button
                v-for="type in announcementTypes"
                :key="type.id"
                :class="['filter-btn', { active: activeType === type.id }]"
                @click="setActiveType(type.id)"
              >
                <span class="filter-icon">{{ type.icon }}</span>
                <span class="filter-name">{{ type.name }}</span>
                <span class="filter-count">{{ type.count }}</span>
              </button>
            </div>
          </div>

          <!-- 公告列表 -->
          <div class="announcements-list">
            <div
              v-for="announcement in filteredAnnouncements"
              :key="announcement.id"
              :class="[
                'announcement-card',
                announcement.type,
                { important: announcement.isImportant },
              ]"
              @click="openAnnouncement(announcement.id)"
            >
              <!-- 公告头部 -->
              <div class="announcement-header">
                <div class="announcement-meta">
                  <span class="announcement-type">{{ getTypeName(announcement.type) }}</span>
                  <span class="announcement-date">{{ formatDate(announcement.publishDate) }}</span>
                </div>
                <div class="announcement-badges">
                  <span v-if="announcement.isImportant" class="badge important">重要</span>
                  <span v-if="announcement.isTop" class="badge top">置顶</span>
                  <span v-if="announcement.isNew" class="badge new">新</span>
                </div>
              </div>

              <!-- 公告内容 -->
              <div class="announcement-body">
                <h3 class="announcement-title">{{ announcement.title }}</h3>
                <p class="announcement-summary">{{ announcement.summary }}</p>

                <!-- 公告标签 -->
                <div class="announcement-tags" v-if="announcement.tags.length > 0">
                  <span v-for="tag in announcement.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>

              <!-- 公告底部 -->
              <div class="announcement-footer">
                <div class="publisher-info">
                  <span class="publisher-name">{{ announcement.publisher }}</span>
                  <span class="publish-time">{{ formatTime(announcement.publishDate) }}</span>
                </div>
                <div class="announcement-stats">
                  <span class="stat-item">
                    <span class="stat-icon">👀</span>
                    <span class="stat-number">{{ announcement.views }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页器 -->
          <div class="pagination" v-if="totalPages > 1">
            <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              上一页
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const activeType = ref('all')
const currentPage = ref(1)
const pageSize = 10

// 公告类型数据
const announcementTypes = ref([
  { id: 'all', name: '全部', icon: '📋', count: 24 },
  { id: 'system', name: '系统公告', icon: '⚙️', count: 8 },
  { id: 'update', name: '更新日志', icon: '🔄', count: 6 },
  { id: 'event', name: '活动通知', icon: '🎉', count: 5 },
  { id: 'maintenance', name: '维护通知', icon: '🔧', count: 3 },
  { id: 'security', name: '安全提醒', icon: '🔒', count: 2 },
])

// 公告数据
const announcements = ref([
  {
    id: 1,
    type: 'system',
    title: '网站全新改版上线，欢迎体验新功能',
    summary:
      '经过数月的精心开发，我们的网站迎来了全新的改版。新版本采用了更现代的设计理念，优化了用户体验，增加了多项实用功能...',
    publisher: '系统管理员',
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 1256,
    isImportant: true,
    isTop: true,
    isNew: true,
    tags: ['重要更新', '功能升级', '用户体验'],
  },
  {
    id: 2,
    type: 'update',
    title: 'V2.1.0 版本更新 - 新增社区交流功能',
    summary:
      '本次更新新增了社区交流模块，用户可以在社区中发布话题、参与讨论、分享经验。同时优化了项目展示页面的性能...',
    publisher: '开发团队',
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    views: 892,
    isImportant: false,
    isTop: false,
    isNew: true,
    tags: ['版本更新', '新功能', '社区'],
  },
  {
    id: 3,
    type: 'event',
    title: '春季开发者大会即将举办，诚邀您的参与',
    summary:
      '我们将于下月举办春季开发者大会，届时将有技术分享、项目展示、经验交流等精彩环节。欢迎广大开发者朋友报名参加...',
    publisher: '活动组委会',
    publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    views: 634,
    isImportant: false,
    isTop: true,
    isNew: false,
    tags: ['活动', '开发者', '技术分享'],
  },
  {
    id: 4,
    type: 'maintenance',
    title: '系统维护通知 - 预计停机2小时',
    summary:
      '为了提升系统性能和稳定性，我们将于本周六凌晨2:00-4:00进行系统维护，期间网站将暂时无法访问，敬请谅解...',
    publisher: '运维团队',
    publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    views: 445,
    isImportant: true,
    isTop: false,
    isNew: false,
    tags: ['维护', '停机', '系统升级'],
  },
  {
    id: 5,
    type: 'security',
    title: '安全提醒：请及时更新您的账户密码',
    summary:
      '为了保障您的账户安全，建议您定期更新密码，并启用两步验证功能。如发现异常登录行为，请及时联系我们...',
    publisher: '安全团队',
    publishDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    views: 723,
    isImportant: true,
    isTop: false,
    isNew: false,
    tags: ['安全', '密码', '账户保护'],
  },
])

// 计算属性
const filteredAnnouncements = computed(() => {
  let filtered = announcements.value
  if (activeType.value !== 'all') {
    filtered = filtered.filter((announcement) => announcement.type === activeType.value)
  }

  // 排序：置顶 > 重要 > 新 > 时间
  filtered.sort((a, b) => {
    if (a.isTop !== b.isTop) return b.isTop ? 1 : -1
    if (a.isImportant !== b.isImportant) return b.isImportant ? 1 : -1
    if (a.isNew !== b.isNew) return b.isNew ? 1 : -1
    return b.publishDate.getTime() - a.publishDate.getTime()
  })

  // 分页
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let filtered = announcements.value
  if (activeType.value !== 'all') {
    filtered = filtered.filter((announcement) => announcement.type === activeType.value)
  }
  return Math.ceil(filtered.length / pageSize)
})

// 方法
const setActiveType = (typeId: string) => {
  activeType.value = typeId
  currentPage.value = 1
}

const getTypeName = (typeId: string) => {
  const type = announcementTypes.value.find((t) => t.id === typeId)
  return type ? type.name : '未知类型'
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  else if (days === 1) return '昨天'
  else if (days < 7) return `${days}天前`
  else return formatDate(date)
}

const openAnnouncement = (announcementId: number) => {
  console.log('打开公告:', announcementId)
  // 这里可以跳转到公告详情页
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// 生命周期
onMounted(() => {
  console.log('公告页面已加载')
})
</script>

<style scoped>
.announcement-view {
  min-height: 100vh;
  background: var(--color-background);
}

/* 页面头部 */
.announcement-hero {
  padding: calc(var(--header-height) + var(--spacing-2xl)) 0 var(--spacing-xl);
  background: var(--color-background);
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* 公告布局 */
.announcement-content {
  padding: 0 0 var(--spacing-2xl);
}

.announcement-layout {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* 公告筛选器 */
.announcement-filters {
  margin-bottom: var(--spacing-xl);
}

.filter-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-full);
  padding: var(--spacing-sm) var(--spacing-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.filter-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.filter-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.filter-icon {
  font-size: var(--font-size-base);
}

.filter-name {
  font-weight: 600;
}

.filter-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  min-width: 20px;
  text-align: center;
}

.filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
}

/* 公告列表 */
.announcements-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.announcement-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
}

.announcement-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.05), transparent);
  transition: left 0.6s ease;
}

.announcement-card:hover::before {
  left: 100%;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.3);
}

.announcement-card.important {
  border-left-color: #ef4444;
}

.announcement-card.system {
  border-left-color: #3b82f6;
}

.announcement-card.update {
  border-left-color: #10b981;
}

.announcement-card.event {
  border-left-color: #f59e0b;
}

.announcement-card.maintenance {
  border-left-color: #8b5cf6;
}

.announcement-card.security {
  border-left-color: #ef4444;
}

/* 公告头部 */
.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.announcement-meta {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.announcement-type {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 4px 12px;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
}

.announcement-date {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.announcement-badges {
  display: flex;
  gap: var(--spacing-xs);
}

.badge {
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.badge.important {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.badge.top {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.badge.new {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* 公告内容 */
.announcement-body {
  margin-bottom: var(--spacing-lg);
}

.announcement-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.3;
  transition: color 0.2s ease;
}

.announcement-card:hover .announcement-title {
  color: var(--color-primary);
}

.announcement-summary {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin: 0 0 var(--spacing-md) 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.announcement-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* 公告底部 */
.announcement-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.publisher-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.publisher-name {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: 600;
}

.publish-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.announcement-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.stat-icon {
  font-size: var(--font-size-sm);
}

/* 分页器 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border);
}

.page-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.page-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
}

.page-btn:disabled {
  background: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

.page-info {
  font-size: var(--font-size-base);
  color: var(--color-text);
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(34, 197, 94, 0.1);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .announcement-hero {
    padding: calc(var(--header-height) + var(--spacing-xl)) 0 var(--spacing-lg);
  }

  .hero-title {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .announcement-layout {
    padding: 0 var(--spacing-sm);
  }

  .filter-group {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }

  .filter-btn {
    flex-shrink: 0;
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .announcement-card {
    padding: var(--spacing-lg);
  }

  .announcement-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .announcement-meta {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .announcement-footer {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .pagination {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .page-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .announcement-title {
    font-size: var(--font-size-lg);
  }

  .announcement-summary {
    font-size: var(--font-size-sm);
  }

  .announcement-tags {
    gap: var(--spacing-xs);
  }

  .tag {
    font-size: var(--font-size-xs);
    padding: 1px 6px;
  }
}
</style>
