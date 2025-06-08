<template>
  <div class="printing-view">
    <!-- 页面头部 -->
    <section class="page-hero">
      <div class="container">
        <!-- 使用通用返回按钮组件 -->
        <div class="back-button-container">
          <BackButton @click="goBack" :icon-only="false" />
        </div>

        <div class="hero-content">
          <h1 class="hero-title">3D打印作品展示</h1>
          <p class="hero-subtitle">探索创意的三维世界，从构思到实现</p>
        </div>
      </div>
    </section>

    <!-- 分类导航 -->
    <CategoryNav
      :categories="categories"
      :selected-category="selectedCategory"
      :get-category-count="getCategoryCount"
      @select="selectCategory"
    />

    <!-- 搜索和筛选栏 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-wrapper">
          <!-- 搜索框 -->
          <div class="search-box">
            <div class="search-input-wrapper">
              <svg
                class="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索3D模型、作者或标签..."
                class="search-input"
              />
              <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- 筛选选项 -->
          <div class="filter-options">
            <div class="sort-wrapper">
              <label class="sort-label">排序：</label>
              <select v-model="sortBy" class="sort-select">
                <option value="latest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="downloads">下载最多</option>
              </select>
            </div>

            <!-- 结果统计 -->
            <div class="results-count">共 {{ filteredItems.length }} 个作品</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 瀑布流内容区域 -->
    <section class="gallery-section">
      <div class="container">
        <div class="gallery-wrapper">
          <div ref="waterfallContainer" class="waterfall-container">
            <ProjectCard
              v-for="(item, index) in filteredItems"
              :key="item.id"
              :id="item.id"
              type="3d-printing"
              :image="item.image"
              :title="item.title"
              :description="item.description"
              :view-count="item.views"
              :like-count="item.downloads"
              :tags="item.tags"
              :author="item.author"
              :style="{ '--delay': index * 0.1 + 's' }"
              class="printing-card"
            />
          </div>
        </div>

        <!-- 调试信息 -->
        <div
          class="debug-info"
          style="text-align: center; padding: 20px; color: #666; font-size: 14px"
        >
          显示 {{ filteredItems.length }} / {{ allItems.length }} 个作品
          <span v-if="isLoading" style="color: #22c55e">（正在加载...）</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ProjectCard from '@/components/common/ProjectCard.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()

// 响应式数据
const selectedCategory = ref('all')
const searchQuery = ref('')
const sortBy = ref('latest')
const waterfallContainer = ref(null)

const isLoading = ref(false)
const currentPage = ref(3)
const itemsPerPage = 12

// 定义项目项类型
interface PrintingItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  author: string
  views: number
  downloads: number
  tags: string[]
}

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: '🎨', color: '#22c55e' },
  { id: '2d-to-3d', name: '2D转3D', icon: '🔄', color: '#3b82f6' },
  { id: 'ip-design', name: 'IP设计', icon: '🎭', color: '#8b5cf6' },
  { id: 'comfy-ui', name: 'ComfyUI', icon: '🖥️', color: '#f59e0b' },
  { id: 'ai-model', name: 'AI模型', icon: '🤖', color: '#ef4444' },
  { id: 'real-person', name: '真人3D', icon: '👨‍💼', color: '#06b6d4' },
  { id: 'character', name: '角色设计', icon: '👤', color: '#ec4899' },
  { id: 'game-asset', name: '游戏资产', icon: '🎮', color: '#10b981' },
  { id: 'architecture', name: '建筑设计', icon: '🏢', color: '#6366f1' },
  { id: 'product', name: '产品设计', icon: '📱', color: '#84cc16' },
  { id: 'jewelry', name: '珠宝设计', icon: '💎', color: '#f97316' },
  { id: 'vehicle', name: '载具模型', icon: '🚗', color: '#14b8a6' },
  { id: 'animation', name: '动画制作', icon: '🎬', color: '#a855f7' },
  { id: 'sketch-to-3d', name: '线稿3D', icon: '✏️', color: '#64748b' },
  { id: 'toy', name: '玩具模型', icon: '🧸', color: '#f43f5e' },
  { id: 'fantasy', name: '奇幻生物', icon: '🐉', color: '#7c3aed' },
  { id: 'mecha', name: '机甲模型', icon: '🤖', color: '#059669' },
  { id: 'miniature', name: '微缩模型', icon: '🏠', color: '#dc2626' },
])

// 作品数据
const items = ref<PrintingItem[]>([
  {
    id: 1,
    title: '2D转3D工作流程',
    description: '专业的2D图像转3D模型工作流程，适用于角色建模，支持多种输入格式',
    image: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
    category: '2d-to-3d',
    author: '三秋叶',
    views: 1234,
    downloads: 89,
    tags: ['工作流', '角色', '建模'],
  },
  {
    id: 2,
    title: 'IP设计：熊猫角色',
    description: '可爱的熊猫IP角色设计，包含完整的3D模型文件',
    image: 'https://picsum.photos/300/500?random=2',
    category: 'ip-design',
    author: '设计师A',
    views: 2156,
    downloads: 156,
    tags: ['IP', '熊猫', '角色'],
  },
  {
    id: 3,
    title: '线稿转3D模型教程',
    description: '从手绘线稿到3D模型的完整制作流程',
    image: 'https://picsum.photos/300/350?random=3',
    category: 'sketch-to-3d',
    author: '建模大师',
    views: 987,
    downloads: 67,
    tags: ['线稿', '教程', '建模'],
  },
  {
    id: 4,
    title: 'ComfyUI工作流',
    description: 'AI辅助的3D模型生成工作流程',
    image: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    category: 'comfy-ui',
    author: 'AI专家',
    views: 3421,
    downloads: 234,
    tags: ['ComfyUI', 'AI', '自动化'],
  },
  {
    id: 5,
    title: '真人转3D头像',
    description: '基于照片生成逼真的3D人物头像模型',
    image: 'https://picsum.photos/300/380?random=5',
    category: 'real-person',
    author: '肖像专家',
    views: 1876,
    downloads: 123,
    tags: ['真人', '头像', '肖像'],
  },
  {
    id: 6,
    title: '游戏角色建模',
    description: '适用于游戏的低面数角色模型',
    image: 'https://picsum.photos/300/420?random=6',
    category: 'game-asset',
    author: '游戏开发者',
    views: 2543,
    downloads: 189,
    tags: ['游戏', '角色', '低面数'],
  },
  {
    id: 7,
    title: '建筑可视化模型',
    description: '现代建筑的3D可视化模型',
    image: 'https://picsum.photos/300/360?random=7',
    category: 'architecture',
    author: '建筑师',
    views: 1654,
    downloads: 98,
    tags: ['建筑', '可视化', '现代'],
  },
  {
    id: 8,
    title: '产品原型设计',
    description: '电子产品的3D原型设计模型',
    image: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
    category: 'product',
    author: '产品设计师',
    views: 2187,
    downloads: 145,
    tags: ['产品', '原型', '电子'],
  },
  {
    id: 9,
    title: '珠宝设计模型',
    description: '精美的珠宝首饰3D设计模型',
    image: 'https://picsum.photos/300/320?random=9',
    category: 'jewelry',
    author: '珠宝设计师',
    views: 1432,
    downloads: 76,
    tags: ['珠宝', '首饰', '精美'],
  },
  {
    id: 10,
    title: '玩具模型设计',
    description: '儿童玩具的3D设计模型',
    image: 'https://picsum.photos/300/440?random=10',
    category: 'toy',
    author: '玩具设计师',
    views: 1789,
    downloads: 112,
    tags: ['玩具', '儿童', '设计'],
  },
  {
    id: 11,
    title: '载具模型合集',
    description: '各种载具的3D模型合集',
    image: 'https://picsum.photos/300/390?random=11',
    category: 'vehicle',
    author: '载具专家',
    views: 2876,
    downloads: 203,
    tags: ['载具', '汽车', '合集'],
  },
  {
    id: 12,
    title: '奇幻生物设计',
    description: '神话传说中的奇幻生物3D模型',
    image: 'https://picsum.photos/300/460?random=12',
    category: 'fantasy',
    author: '奇幻艺术家',
    views: 3214,
    downloads: 267,
    tags: ['奇幻', '生物', '神话'],
  },
  {
    id: 13,
    title: 'AI智能建模助手',
    description: '基于人工智能的3D建模辅助工具，提高建模效率',
    image: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
    category: 'ai-model',
    author: 'AI研究员',
    views: 2890,
    downloads: 198,
    tags: ['AI', '智能', '辅助'],
  },
  {
    id: 14,
    title: '手绘风格角色',
    description: '将手绘插画转换为3D角色模型的完整流程',
    image: 'https://picsum.photos/300/420?random=14',
    category: 'sketch-to-3d',
    author: '插画师小王',
    views: 1567,
    downloads: 134,
    tags: ['手绘', '插画', '角色'],
  },
  {
    id: 15,
    title: '现代家具设计',
    description: '简约现代风格的家具3D模型设计',
    image: 'https://picsum.photos/300/350?random=15',
    category: 'product',
    author: '家具设计师',
    views: 2134,
    downloads: 156,
    tags: ['家具', '现代', '简约'],
  },
])

// 所有可用的作品数据（模拟更大的数据集）
const allItems = ref<PrintingItem[]>([
  ...items.value,
  // 添加更多示例数据
  {
    id: 16,
    title: '机甲战士模型',
    description: '未来科幻风格的机甲战士3D模型',
    image: 'https://picsum.photos/300/400?random=16',
    category: 'mecha',
    author: '机甲设计师',
    views: 3456,
    downloads: 278,
    tags: ['机甲', '科幻', '战士'],
  },
  {
    id: 17,
    title: '微缩城市模型',
    description: '精致的微缩城市建筑群模型',
    image: 'https://picsum.photos/300/380?random=17',
    category: 'miniature',
    author: '微缩专家',
    views: 2134,
    downloads: 167,
    tags: ['微缩', '城市', '建筑'],
  },
  {
    id: 18,
    title: '动画角色绑定',
    description: '专业的3D角色绑定和动画制作流程',
    image: 'https://picsum.photos/300/450?random=18',
    category: 'animation',
    author: '动画师',
    views: 1987,
    downloads: 145,
    tags: ['动画', '绑定', '角色'],
  },
  {
    id: 19,
    title: '概念艺术转3D',
    description: '将概念艺术图转换为3D模型的工作流程',
    image: 'https://picsum.photos/300/420?random=19',
    category: '2d-to-3d',
    author: '概念艺术家',
    views: 2567,
    downloads: 189,
    tags: ['概念', '艺术', '转换'],
  },
  {
    id: 20,
    title: '智能材质生成',
    description: 'AI驱动的材质和纹理自动生成工具',
    image: 'https://picsum.photos/300/360?random=20',
    category: 'ai-model',
    author: 'AI材质专家',
    views: 3123,
    downloads: 234,
    tags: ['AI', '材质', '纹理'],
  },
])

// 生成更多数据到100个
const generateMoreItems = () => {
  const moreItems = []
  const categories = [
    '2d-to-3d',
    'ip-design',
    'comfy-ui',
    'ai-model',
    'real-person',
    'character',
    'game-asset',
    'architecture',
    'product',
    'jewelry',
    'vehicle',
    'animation',
    'sketch-to-3d',
    'toy',
    'fantasy',
    'mecha',
    'miniature',
  ]
  const authors = [
    '设计师A',
    '建模大师',
    'AI专家',
    '肖像专家',
    '游戏开发者',
    '建筑师',
    '产品设计师',
    '珠宝设计师',
    '玩具设计师',
    '载具专家',
    '奇幻艺术家',
    '机甲设计师',
    '微缩专家',
    '动画师',
    '概念艺术家',
    'AI材质专家',
    '三秋叶',
  ]

  const titles = [
    '高级建模技术',
    '材质渲染优化',
    '动画绑定教程',
    '场景设计指南',
    '角色造型设计',
    '环境光照设置',
    '纹理贴图制作',
    '模型优化技巧',
    '渲染引擎应用',
    '虚拟现实模型',
    '增强现实应用',
    '游戏资产制作',
    '电影级建模',
    '工业设计模型',
    '艺术雕塑创作',
    '建筑可视化',
    '产品原型设计',
    '珠宝首饰建模',
    '玩具模型设计',
    '载具建模技术',
    '奇幻角色设计',
    '机甲模型制作',
    '微缩场景搭建',
    '动画角色绑定',
    '概念设计转换',
  ]

  // GIF图片源 - 使用一些免费的GIF API
  const gifSources = [
    'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif', // 3D建模
    'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', // 设计过程
    'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', // 动画制作
    'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', // 渲染过程
    'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', // 建模工具
    'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', // 创意设计
    'https://media.giphy.com/media/26tn8zKqZNXOTTe36/giphy.gif', // 3D打印
    'https://media.giphy.com/media/3oKIPf3C7HqqYBVcCk/giphy.gif', // 角色动画
  ]

  for (let i = 21; i <= 100; i++) {
    const categoryIndex = (i - 21) % categories.length
    const authorIndex = (i - 21) % authors.length
    const titleIndex = (i - 21) % titles.length
    const height = 300 + (i % 200) // 300-500的随机高度

    // 每10个项目中有3个使用GIF图片
    const useGif = i % 10 <= 3
    const imageUrl = useGif
      ? gifSources[(i - 21) % gifSources.length]
      : `https://picsum.photos/300/${height}?random=${i}`

    moreItems.push({
      id: i,
      title: `${titles[titleIndex]} ${i}`,
      description: `专业的3D建模和设计作品，展示了${titles[titleIndex]}的精湛技艺和创新思维。`,
      image: imageUrl,
      category: categories[categoryIndex],
      author: authors[authorIndex],
      views: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 300) + 50,
      tags: ['3D建模', '设计', '创意'],
    })
  }

  return moreItems
}

// 完整的数据集（100个项目）
allItems.value = [...allItems.value, ...generateMoreItems()]

// 过滤和排序项目
const filteredItems = computed<PrintingItem[]>(() => {
  let filtered = allItems.value

  // 根据分类过滤
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((item) => item.category === selectedCategory.value)
  }

  // 根据搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  // 排序
  switch (sortBy.value) {
    case 'popular':
      filtered.sort((a, b) => b.views - a.views)
      break
    case 'downloads':
      filtered.sort((a, b) => b.downloads - a.downloads)
      break
    case 'latest':
    default:
      filtered.sort((a, b) => b.id - a.id)
      break
  }

  // 返回当前页面应该显示的数据
  return filtered.slice(0, currentPage.value * itemsPerPage)
})

// 方法
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  currentPage.value = 3 // 重置分页，显示前3页内容
  // 延迟重新布局，确保DOM更新完成
  setTimeout(() => {
    nextTick(() => {
      initWaterfall()
    })
  }, 50)
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取分类数量
const getCategoryCount = (categoryId: string) => {
  if (categoryId === 'all') {
    return allItems.value.length
  }
  return allItems.value.filter((item) => item.category === categoryId).length
}

// 无限滚动加载更多
const loadMoreItems = () => {
  if (isLoading.value) return

  const totalFilteredItems = (() => {
    let filtered = allItems.value

    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    return filtered.length
  })()

  const currentItemsCount = currentPage.value * itemsPerPage

  if (currentItemsCount < totalFilteredItems) {
    isLoading.value = true

    // 模拟加载延迟
    setTimeout(() => {
      currentPage.value++
      isLoading.value = false

      // 重新初始化瀑布流布局
      nextTick(() => {
        initWaterfall()
      })
    }, 300)
  }
}

// 监听滚动事件
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  // 当滚动到距离底部200px时加载更多
  if (scrollTop + windowHeight >= documentHeight - 200) {
    loadMoreItems()
  }
}

// CSS Columns瀑布流布局
const initWaterfall = () => {
  // CSS columns自动处理布局，只需要添加动画
  nextTick(() => {
    const printingCards = document.querySelectorAll('.printing-card')
    printingCards.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in')
      }, index * 30)
    })
  })
}

onMounted(() => {
  // 初始化瀑布流布局
  setTimeout(() => {
    initWaterfall()
  }, 100)

  // 监听页面滚动，实现无限滚动
  window.addEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.printing-view {
  min-height: 100vh;
  background: var(--color-background);
}

/* 页面头部 */
.page-hero {
  padding: var(--spacing-xl) 0; /* 降低上下内边距 */
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
  position: relative;
  overflow: hidden;
}

.page-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(22, 163, 74, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: clamp(2rem, 4vw, 3.5rem); /* 降低字体大小 */
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--spacing-md); /* 减少下边距 */
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: var(--font-size-base); /* 降低字体大小 */
  color: var(--color-text-secondary);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.4; /* 减小行高 */
}

/* 分类导航栏 */
.category-section {
  padding: var(--spacing-sm) 0;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.category-wrapper {
  position: relative;
}

.category-scroll {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-list {
  display: flex;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-lg);
  min-width: max-content;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
  border: 1px solid transparent;
  min-width: 70px;
  position: relative;
}

.category-item:hover {
  background: #e9ecef;
  border-color: var(--color-primary);
}

.category-item.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.category-icon {
  font-size: 1.2rem;
}

.category-name {
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  line-height: 1.2;
}

.category-count {
  font-size: 9px;
  opacity: 0.6;
  font-weight: 400;
}

/* 分类导航箭头 */
.category-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-nav:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-50%) scale(1.1);
}

.category-nav-left {
  left: 0;
}

.category-nav-right {
  right: 0;
}

/* 搜索和筛选栏 */
.filter-section {
  padding: 20px 0;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.filter-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
}

.search-box {
  flex: 1;
  max-width: 500px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  background: #ffffff;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: #999;
  pointer-events: none;
}

.clear-search {
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: #6b7280;
}

.clear-search svg {
  width: 16px;
  height: 16px;
}

.filter-options {
  display: flex;
  gap: 20px;
  align-items: center;
}

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f8f9fa;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.sort-select:focus {
  outline: none;
  border-color: #0ea5e9;
  background: #ffffff;
}

.results-count {
  font-size: 14px;
  color: #666;
  font-weight: 400;
  white-space: nowrap;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

/* 瀑布流画廊 */
.gallery-section {
  padding: 0;
  background: #ffffff;
}

.gallery-wrapper {
  position: relative;
}

.waterfall-container {
  column-count: auto;
  column-width: 300px;
  column-gap: 16px;
  width: 100%;
  min-height: 500px;
  margin: 0 auto;
  padding: 24px 20px;
  background: #ffffff;
}

/* 调试信息 */
.debug-info {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

/* 加载动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.service-item.animate-in {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 返回按钮容器 */
.back-button-container {
  position: absolute;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  z-index: 10;
}
</style>
