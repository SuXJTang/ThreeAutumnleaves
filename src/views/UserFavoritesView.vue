<template>
  <div class="user-favorites-page">
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

    <div class="favorites-container">
      <h1 class="page-title">我的收藏</h1>

      <!-- 收藏分类 -->
      <div class="category-section">
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.value"
            @click="currentCategory = category.value"
            :class="['category-tab', { active: currentCategory === category.value }]"
          >
            {{ category.label }}
            <span v-if="getFavoriteCount(category.value) > 0" class="count-badge">
              {{ getFavoriteCount(category.value) }}
            </span>
          </button>
        </div>
      </div>

      <!-- 收藏列表 -->
      <div class="favorites-list">
        <div v-if="filteredFavorites.length === 0" class="empty-state">
          <div class="empty-icon">❤️</div>
          <h3>暂无收藏</h3>
          <p>{{ getEmptyMessage() }}</p>
          <router-link to="/ai-agent" class="browse-btn">去发现好内容</router-link>
        </div>

        <div v-else class="favorites-grid">
          <div v-for="favorite in filteredFavorites" :key="favorite.id" class="favorite-card">
            <div class="favorite-image">
              <img v-if="favorite.image" :src="favorite.image" :alt="favorite.title" />
              <div v-else class="default-image">
                {{ favorite.title.charAt(0) }}
              </div>

              <!-- 收藏按钮 -->
              <button @click="removeFavorite(favorite)" class="favorite-btn active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>
            </div>

            <div class="favorite-content">
              <div class="favorite-category">{{ getCategoryLabel(favorite.category) }}</div>
              <h3 class="favorite-title">{{ favorite.title }}</h3>
              <p class="favorite-description">{{ favorite.description }}</p>

              <div class="favorite-meta">
                <span class="favorite-price" v-if="favorite.price > 0">¥{{ favorite.price }}</span>
                <span class="favorite-price free" v-else>免费</span>
                <span class="favorite-date">{{ formatDate(favorite.createdAt) }}</span>
              </div>

              <div class="favorite-actions">
                <button @click="viewItem(favorite)" class="action-btn view-btn">立即查看</button>
                <button @click="shareItem(favorite)" class="action-btn share-btn">分享</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 批量操作 -->
      <div v-if="filteredFavorites.length > 0" class="batch-actions">
        <div class="batch-controls">
          <label class="select-all">
            <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
            全选
          </label>

          <button v-if="selectedItems.length > 0" @click="batchRemove" class="batch-btn remove-btn">
            删除选中 ({{ selectedItems.length }})
          </button>

          <button v-if="selectedItems.length > 0" @click="batchShare" class="batch-btn share-btn">
            分享选中
          </button>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 收藏分类定义
const categories = [
  { value: 'all', label: '全部' },
  { value: 'ai-tools', label: 'AI工具' },
  { value: 'software', label: '软件推荐' },
  { value: '3d-printing', label: '3D打印' },
  { value: 'projects', label: '项目资源' },
]

// 收藏项类型定义
interface FavoriteItem {
  id: string
  title: string
  description: string
  category: string
  price: number
  image: string | null
  resourceId: string
  createdAt: string
}

// 状态管理
const favorites = ref<FavoriteItem[]>([])
const currentCategory = ref('all')
const selectedItems = ref<string[]>([])
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 计算属性
const filteredFavorites = computed(() => {
  if (currentCategory.value === 'all') {
    return favorites.value
  }
  return favorites.value.filter((favorite) => favorite.category === currentCategory.value)
})

const isAllSelected = computed(() => {
  return (
    filteredFavorites.value.length > 0 &&
    selectedItems.value.length === filteredFavorites.value.length
  )
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取收藏数量
const getFavoriteCount = (category: string) => {
  if (category === 'all') return favorites.value.length
  return favorites.value.filter((favorite) => favorite.category === category).length
}

// 获取空状态消息
const getEmptyMessage = () => {
  const messages: Record<string, string> = {
    all: '您还没有收藏任何内容',
    'ai-tools': '没有收藏的AI工具',
    software: '没有收藏的软件推荐',
    '3d-printing': '没有收藏的3D打印资源',
    projects: '没有收藏的项目资源',
  }
  return messages[currentCategory.value] || '暂无收藏'
}

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    'ai-tools': 'AI工具',
    software: '软件推荐',
    '3d-printing': '3D打印',
    projects: '项目资源',
  }
  return categoryMap[category] || category
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// 移除收藏
const removeFavorite = async (favorite: FavoriteItem) => {
  if (confirm('确定要取消收藏吗？')) {
    try {
      // TODO: 调用API移除收藏
      const index = favorites.value.findIndex((item) => item.id === favorite.id)
      if (index > -1) {
        favorites.value.splice(index, 1)
      }

      // 从选中列表中移除
      const selectedIndex = selectedItems.value.indexOf(favorite.id)
      if (selectedIndex > -1) {
        selectedItems.value.splice(selectedIndex, 1)
      }

      showMessage('已取消收藏')
    } catch (error: unknown) {
      console.error('移除收藏出错:', error)
      showMessage('操作失败，请稍后重试', 'error')
    }
  }
}

// 查看项目
const viewItem = (favorite: FavoriteItem) => {
  // 根据类型跳转到对应页面
  if (favorite.category === 'ai-tools') {
    router.push(`/ai-resource/${favorite.resourceId}`)
  } else if (favorite.category === '3d-printing') {
    router.push(`/3d-printing/${favorite.resourceId}`)
  } else {
    // 其他类型的处理
    showMessage('正在跳转...')
  }
}

// 分享项目
const shareItem = (favorite: FavoriteItem) => {
  // TODO: 实现分享功能
  if (navigator.share) {
    navigator.share({
      title: favorite.title,
      text: favorite.description,
      url: window.location.origin + `/ai-resource/${favorite.resourceId}`,
    })
  } else {
    // 复制链接到剪贴板
    const url = window.location.origin + `/ai-resource/${favorite.resourceId}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showMessage('链接已复制到剪贴板')
      })
      .catch((error: unknown) => {
        console.error('复制链接出错:', error)
        showMessage('复制链接失败', 'error')
      })
  }
}

// 切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = filteredFavorites.value.map((item) => item.id)
  }
}

// 批量删除
const batchRemove = async () => {
  if (confirm(`确定要删除选中的 ${selectedItems.value.length} 个收藏吗？`)) {
    try {
      // TODO: 调用API批量删除
      favorites.value = favorites.value.filter((item) => !selectedItems.value.includes(item.id))
      selectedItems.value = []
      showMessage('批量删除成功')
    } catch (error: unknown) {
      console.error('批量删除出错:', error)
      showMessage('删除失败，请稍后重试', 'error')
    }
  }
}

// 批量分享
const batchShare = () => {
  const selectedFavorites = favorites.value.filter((item) => selectedItems.value.includes(item.id))
  const shareText = selectedFavorites
    .map((item) => `${item.title}: ${item.description}`)
    .join('\n\n')

  if (navigator.share) {
    navigator.share({
      title: '我的收藏分享',
      text: shareText,
    })
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      showMessage('收藏内容已复制到剪贴板')
    })
  }
}

// 加载收藏数据
const loadFavorites = async () => {
  try {
    // TODO: 从API获取收藏数据
    // 这里使用模拟数据
    const mockFavorites: FavoriteItem[] = [
      {
        id: '1',
        title: 'AI写作大师',
        description: '专业的AI写作工具，提升写作效率',
        category: 'ai-tools',
        price: 99,
        image: null,
        resourceId: 'ai-writing-master',
        createdAt: '2024-12-01T10:30:00Z',
      },
      {
        id: '2',
        title: 'ChatGPT 免费版',
        description: 'OpenAI开发的对话式AI助手',
        category: 'ai-tools',
        price: 0,
        image: null,
        resourceId: 'chatgpt-free',
        createdAt: '2024-11-30T15:20:00Z',
      },
      {
        id: '3',
        title: '3D打印模型库',
        description: '精选3D打印模型资源',
        category: '3d-printing',
        price: 0,
        image: null,
        resourceId: '3d-models',
        createdAt: '2024-11-29T09:15:00Z',
      },
    ]

    favorites.value = mockFavorites
  } catch (error: unknown) {
    console.error('加载收藏出错:', error)
    showMessage('加载收藏失败，请稍后重试', 'error')
  }
}

onMounted(() => {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    router.push('/')
    return
  }

  loadFavorites()
})
</script>

<style scoped>
.user-favorites-page {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
  position: relative;
}

.back-button-container {
  position: relative;
  z-index: 1;
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
  background: white;
  transform: translateY(-2px);
  box-shadow:
    7px 7px 15px rgba(0, 0, 0, 0.05),
    -7px -7px 15px rgba(255, 255, 255, 0.9);
}

.favorites-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: var(--color-text);
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.category-section {
  background: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 25px;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.category-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.category-tab {
  background: #f5f5f5;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.03),
    -4px -4px 8px rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px rgba(255, 255, 255, 0.8);
}

.category-tab:hover {
  transform: translateY(-2px);
  box-shadow:
    6px 6px 12px rgba(0, 0, 0, 0.05),
    -6px -6px 12px rgba(255, 255, 255, 0.9),
    inset 1px 1px 1px rgba(255, 255, 255, 0.8);
}

.category-tab.active {
  background: var(--color-primary);
  color: white;
  box-shadow:
    inset 3px 3px 6px rgba(0, 0, 0, 0.1),
    inset -1px -1px 3px rgba(255, 255, 255, 0.3);
}

.count-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.empty-state {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 30px;
}

.browse-btn {
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
}

.browse-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 7px 7px 15px rgba(0, 0, 0, 0.15);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.favorite-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow:
    12px 12px 24px rgba(0, 0, 0, 0.06),
    -12px -12px 24px rgba(255, 255, 255, 0.95),
    inset 1px 1px 1px rgba(255, 255, 255, 1),
    inset -1px -1px 1px rgba(0, 0, 0, 0.05);
  border: none;
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.favorite-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  transition: opacity 0.3s ease;
  opacity: 0;
}

.favorite-card:hover {
  transform: translateY(-7px) rotateX(2deg) rotateY(-2deg);
  box-shadow:
    16px 16px 32px rgba(0, 0, 0, 0.08),
    -16px -16px 32px rgba(255, 255, 255, 1),
    inset 1px 1px 1px rgba(255, 255, 255, 1),
    inset -1px -1px 1px rgba(0, 0, 0, 0.05);
}

.favorite-card:hover::before {
  opacity: 1;
}

.favorite-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.favorite-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.1) 100%);
  z-index: 1;
}

.favorite-card:hover .favorite-image {
  transform: scale(1.03);
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.favorite-card:hover .favorite-image img {
  transform: scale(1.05);
}

.default-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
}

.default-image::before {
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

.favorite-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ccc;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.favorite-btn.active {
  color: #ff6b6b;
  animation: pulse 1s ease;
}

.favorite-btn:hover {
  background: white;
  transform: scale(1.15);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.favorite-content {
  padding: 20px;
  position: relative;
  z-index: 2;
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: -20px;
  box-shadow: 0 -8px 20px rgba(0, 0, 0, 0.05);
}

.favorite-category {
  background: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.favorite-card:hover .favorite-category {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
}

.favorite-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.favorite-card:hover .favorite-title {
  color: var(--color-primary);
}

.favorite-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.favorite-price {
  font-size: 16px;
  font-weight: bold;
  color: #667eea;
}

.favorite-price.free {
  color: #4caf50;
}

.favorite-date {
  font-size: 12px;
  color: #999;
}

.favorite-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  transform: translateY(5px);
  opacity: 0.9;
  transition: all 0.3s ease;
}

.favorite-card:hover .favorite-actions {
  transform: translateY(0);
  opacity: 1;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.view-btn {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 128, 0, 0.15);
}

.view-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 128, 0, 0.25);
}

.share-btn {
  background: #f5f5f5;
  color: #333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.share-btn:hover {
  background: #e8e8e8;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.action-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn:hover::after {
  opacity: 1;
  animation: ripple 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes ripple {
  0% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.batch-actions {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.batch-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
}

.batch-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.05),
    -4px -4px 8px rgba(255, 255, 255, 0.8);
}

.remove-btn {
  background: #ff6b6b;
  color: white;
}

.remove-btn:hover {
  background: #ff5252;
}

.batch-actions .share-btn {
  background: #4caf50;
  color: white;
}

.batch-actions .share-btn:hover {
  background: #45a049;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 12px;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #4caf50;
  color: white;
}

.message.error {
  background: #f44336;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .category-tabs {
    justify-content: flex-start;
  }

  .batch-controls {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
