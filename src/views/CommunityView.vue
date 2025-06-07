<template>
  <div class="community-view">
    <!-- 页面头部 -->
    <section class="community-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">社区交流</h1>
          <p class="hero-subtitle">与志同道合的朋友分享想法，探讨技术，共同成长</p>
        </div>
      </div>
    </section>

    <!-- 社区内容区域 -->
    <section class="community-content">
      <div class="container">
        <div class="community-layout">
          <!-- 左侧话题分类 -->
          <aside class="topic-sidebar">
            <div class="sidebar-header">
              <h3>话题分类</h3>
            </div>
            <div class="topic-categories">
              <button
                v-for="category in categories"
                :key="category.id"
                :class="['category-btn', { active: activeCategory === category.id }]"
                @click="setActiveCategory(category.id)"
              >
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}</span>
              </button>
            </div>
          </aside>

          <!-- 主要内容区域 -->
          <main class="discussion-main">
            <!-- 发布新话题按钮 -->
            <div class="new-topic-section">
              <button class="new-topic-btn" @click="showNewTopicModal = true">
                <span class="btn-icon">✏️</span>
                <span>发布新话题</span>
              </button>
            </div>

            <!-- 话题列表 -->
            <div class="topics-list">
              <div
                v-for="topic in filteredTopics"
                :key="topic.id"
                class="topic-card"
                @click="openTopic(topic.id)"
              >
                <div class="topic-main">
                  <div class="topic-left">
                    <div class="author-avatar-large">{{ topic.author.avatar }}</div>
                    <div class="topic-stats-vertical">
                      <div class="stat-item">
                        <span class="stat-number">{{ topic.replies }}</span>
                        <span class="stat-label">回复</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-number">{{ topic.likes }}</span>
                        <span class="stat-label">点赞</span>
                      </div>
                    </div>
                  </div>

                  <div class="topic-content">
                    <div class="topic-header">
                      <div class="topic-meta">
                        <span class="topic-category">{{ getCategoryName(topic.categoryId) }}</span>
                        <span class="topic-status" v-if="topic.isPinned">📌 置顶</span>
                        <span class="topic-time">{{ formatTime(topic.createdAt) }}</span>
                      </div>
                    </div>

                    <h3 class="topic-title">{{ topic.title }}</h3>
                    <p class="topic-excerpt">{{ topic.excerpt }}</p>

                    <div class="topic-footer">
                      <div class="author-info">
                        <span class="author-name">{{ topic.author.name }}</span>
                        <span class="topic-time-mobile">{{ formatTime(topic.createdAt) }}</span>
                      </div>
                      <div class="topic-engagement">
                        <span class="engagement-item">{{ topic.views }} 浏览</span>
                        <span class="engagement-item"
                          >最后回复 {{ formatTime(topic.createdAt) }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <!-- 右侧信息栏 -->
          <aside class="info-sidebar">
            <!-- 社区统计 -->
            <div class="stats-card">
              <h4>社区统计</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-number">1,234</span>
                  <span class="stat-label">总话题</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">5,678</span>
                  <span class="stat-label">总回复</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">890</span>
                  <span class="stat-label">活跃用户</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">156</span>
                  <span class="stat-label">今日新增</span>
                </div>
              </div>
            </div>

            <!-- 热门话题 -->
            <div class="hot-topics-card">
              <h4>热门话题</h4>
              <div class="hot-topics-list">
                <div v-for="hotTopic in hotTopics" :key="hotTopic.id" class="hot-topic-item">
                  <span class="hot-topic-title">{{ hotTopic.title }}</span>
                  <span class="hot-topic-heat">🔥 {{ hotTopic.heat }}</span>
                </div>
              </div>
            </div>

            <!-- 在线用户 -->
            <div class="online-users-card">
              <h4>在线用户</h4>
              <div class="online-users-list">
                <div v-for="user in onlineUsers" :key="user.id" class="online-user">
                  <span class="user-avatar">{{ user.avatar }}</span>
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-status">🟢</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- 发布新话题模态框 -->
    <div v-if="showNewTopicModal" class="modal-overlay" @click="closeNewTopicModal">
      <div class="new-topic-modal" @click.stop>
        <div class="modal-header">
          <h3>发布新话题</h3>
          <button class="close-btn" @click="closeNewTopicModal">×</button>
        </div>
        <form @submit.prevent="submitNewTopic" class="new-topic-form">
          <div class="form-group">
            <label>话题分类</label>
            <select v-model="newTopic.categoryId" required>
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>话题标题</label>
            <input v-model="newTopic.title" type="text" placeholder="请输入话题标题" required />
          </div>
          <div class="form-group">
            <label>话题内容</label>
            <textarea
              v-model="newTopic.content"
              placeholder="请输入话题内容"
              rows="6"
              required
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeNewTopicModal">取消</button>
            <button type="submit" class="submit-btn">发布话题</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const activeCategory = ref('all')
const showNewTopicModal = ref(false)

// 新话题表单数据
const newTopic = ref({
  categoryId: '',
  title: '',
  content: '',
})

// 话题分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: '📋', count: 156 },
  { id: 'tech', name: '技术讨论', icon: '💻', count: 45 },
  { id: 'project', name: '项目分享', icon: '🚀', count: 32 },
  { id: 'help', name: '求助问答', icon: '❓', count: 28 },
  { id: 'share', name: '经验分享', icon: '💡', count: 35 },
  { id: 'chat', name: '闲聊灌水', icon: '💬', count: 16 },
])

// 话题列表数据
const topics = ref([
  {
    id: 1,
    categoryId: 'tech',
    title: 'Vue 3 Composition API 最佳实践分享',
    excerpt:
      '最近在项目中深度使用了 Vue 3 的 Composition API，总结了一些最佳实践经验，希望能帮助到大家...',
    author: { name: '前端小王', avatar: '👨‍💻' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    replies: 23,
    views: 156,
    likes: 45,
    isPinned: true,
  },
  {
    id: 2,
    categoryId: 'project',
    title: '开源了一个轻量级的状态管理库',
    excerpt: '基于 Proxy 实现的轻量级状态管理库，支持 TypeScript，API 简洁易用...',
    author: { name: '开源爱好者', avatar: '🧑‍🔬' },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    replies: 18,
    views: 89,
    likes: 32,
    isPinned: false,
  },
  {
    id: 3,
    categoryId: 'help',
    title: '关于 TypeScript 泛型的问题求助',
    excerpt: '在使用 TypeScript 泛型时遇到了一些类型推导的问题，希望有经验的朋友能帮忙解答...',
    author: { name: 'TS新手', avatar: '🤔' },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    replies: 12,
    views: 67,
    likes: 8,
    isPinned: false,
  },
])

// 热门话题数据
const hotTopics = ref([
  { id: 1, title: 'AI 编程助手使用心得', heat: 128 },
  { id: 2, title: '前端性能优化实战', heat: 95 },
  { id: 3, title: '微服务架构设计', heat: 87 },
])

// 在线用户数据
const onlineUsers = ref([
  { id: 1, name: '小明', avatar: '👨', status: 'online' },
  { id: 2, name: '小红', avatar: '👩', status: 'online' },
  { id: 3, name: '小李', avatar: '🧑', status: 'online' },
])

// 计算属性
const filteredTopics = computed(() => {
  if (activeCategory.value === 'all') {
    return topics.value
  }
  return topics.value.filter((topic) => topic.categoryId === activeCategory.value)
})

// 方法
const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find((cat) => cat.id === categoryId)
  return category ? category.name : '未知分类'
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    const days = Math.floor(hours / 24)
    return `${days}天前`
  }
}

const openTopic = (topicId: number) => {
  console.log('打开话题:', topicId)
  // 这里可以跳转到话题详情页
}

const closeNewTopicModal = () => {
  showNewTopicModal.value = false
  newTopic.value = { categoryId: '', title: '', content: '' }
}

const submitNewTopic = () => {
  console.log('发布新话题:', newTopic.value)
  // 这里可以调用 API 发布话题
  closeNewTopicModal()
}

// 生命周期
onMounted(() => {
  console.log('社区页面已加载')
})
</script>

<style scoped>
.community-view {
  min-height: 100vh;
  background: var(--color-background);
}

/* 页面头部 */
.community-hero {
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

/* 社区布局 */
.community-content {
  padding: 0 0 var(--spacing-2xl);
}

.community-layout {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* 左侧话题分类 */
.topic-sidebar {
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}

.sidebar-header h3 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-lg);
  color: var(--color-text);
  font-weight: 600;
}

.topic-categories {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.category-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.category-btn:hover {
  background: rgba(34, 197, 94, 0.1);
}

.category-btn.active {
  background: var(--color-primary);
  color: white;
}

.category-icon {
  font-size: var(--font-size-base);
}

.category-name {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.category-count {
  font-size: var(--font-size-xs);
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: var(--border-radius-sm);
  min-width: 20px;
  text-align: center;
}

.category-btn.active .category-count {
  background: rgba(255, 255, 255, 0.2);
}

/* 主要内容区域 */
.discussion-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.new-topic-section {
  display: flex;
  justify-content: flex-end;
}

.new-topic-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.new-topic-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
}

/* 话题列表 */
.topics-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.topic-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid transparent;
}

.topic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.3);
  border-left-color: var(--color-primary);
}

.topic-main {
  display: flex;
  gap: var(--spacing-lg);
}

.topic-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
  width: 80px;
}

.author-avatar-large {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.topic-stats-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  text-align: center;
}

.topic-stats-vertical .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xs);
  background: rgba(34, 197, 94, 0.05);
  border-radius: var(--border-radius-md);
  min-width: 50px;
}

.topic-stats-vertical .stat-number {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.topic-stats-vertical .stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.topic-content {
  flex: 1;
  min-width: 0;
}

.topic-header {
  margin-bottom: var(--spacing-sm);
}

.topic-meta {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.topic-category {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 4px 10px;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
}

.topic-status {
  background: rgba(255, 193, 7, 0.1);
  color: #f59e0b;
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.topic-time {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}

.topic-time-mobile {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  display: none;
}

.topic-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.3;
  transition: color 0.2s ease;
}

.topic-card:hover .topic-title {
  color: var(--color-primary);
}

.topic-excerpt {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin: 0 0 var(--spacing-lg) 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.topic-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: 600;
}

.topic-engagement {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: right;
}

.engagement-item {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

/* 右侧信息栏 */
.info-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.stats-card,
.hot-topics-card,
.online-users-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}

.stats-card h4,
.hot-topics-card h4,
.online-users-card h4 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-base);
  color: var(--color-text);
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.stats-grid .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-sm);
  background: rgba(34, 197, 94, 0.05);
  border-radius: var(--border-radius-md);
}

.stats-grid .stat-number {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 2px;
}

.stats-grid .stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.hot-topics-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.hot-topic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.hot-topic-title {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-topic-heat {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-left: var(--spacing-sm);
}

.online-users-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.online-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.user-avatar {
  font-size: var(--font-size-base);
}

.user-name {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.user-status {
  font-size: var(--font-size-xs);
}

/* 发布新话题模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.new-topic-modal {
  background: white;
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-background-secondary);
  color: var(--color-text);
}

.new-topic-form {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.3s ease;
}

.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: transparent;
  border: 2px solid var(--color-border);
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-text-secondary);
}

.submit-btn {
  background: var(--color-primary);
  border: 2px solid var(--color-primary);
  color: white;
}

.submit-btn:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .community-layout {
    grid-template-columns: 200px 1fr 250px;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 968px) {
  .community-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .topic-sidebar {
    order: 2;
  }

  .discussion-main {
    order: 1;
  }

  .info-sidebar {
    order: 3;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }

  .topic-categories {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .category-btn {
    flex: 0 0 auto;
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .community-hero {
    padding: calc(var(--header-height) + var(--spacing-xl)) 0 var(--spacing-lg);
  }

  .hero-title {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .community-layout {
    padding: 0 var(--spacing-sm);
  }

  .topic-sidebar,
  .stats-card,
  .hot-topics-card,
  .online-users-card {
    padding: var(--spacing-md);
  }

  .topic-card {
    padding: var(--spacing-md);
  }

  .new-topic-btn {
    width: 100%;
    justify-content: center;
  }

  .new-topic-section {
    justify-content: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-sm);
  }

  .stats-grid .stat-item {
    padding: var(--spacing-xs);
  }

  .stats-grid .stat-number {
    font-size: var(--font-size-base);
  }

  .new-topic-modal {
    width: 95%;
    margin: var(--spacing-md);
  }

  .modal-header,
  .new-topic-form {
    padding: var(--spacing-md);
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .topic-main {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .topic-left {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .topic-stats-vertical {
    flex-direction: row;
    gap: var(--spacing-md);
  }

  .topic-stats-vertical .stat-item {
    min-width: 60px;
  }

  .topic-time {
    display: none;
  }

  .topic-time-mobile {
    display: inline;
  }

  .topic-footer {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .topic-engagement {
    text-align: left;
  }

  .info-sidebar {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
