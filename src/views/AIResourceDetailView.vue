<template>
  <div class="ai-resource-detail">
    <!-- 导航栏 -->
    <nav class="detail-nav">
      <div class="nav-container">
        <BackButton @click="goBack" :icon-only="false" />
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="main-content" v-if="resource">
      <!-- 产品头部 -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <div class="product-badge">{{ resource.price }}</div>
            <div class="product-icon">
              <span>{{ resource.icon }}</span>
            </div>
            <h1 class="product-title">{{ resource.title }}</h1>
            <p class="product-subtitle">{{ resource.description }}</p>
            <div class="hero-actions">
              <button class="btn-primary" @click="handleView">
                立即查看
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14m-7-7l7 7-7 7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button class="btn-secondary" @click="handleTrial">免费试用</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能特性 -->
      <section class="features-section">
        <div class="section-container">
          <h2 class="section-title">核心功能</h2>
          <div class="features-grid">
            <div v-for="feature in resource.features" :key="feature" class="feature-item">
              <div class="feature-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span class="feature-text">{{ feature }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 产品详情 -->
      <section class="details-section">
        <div class="section-container">
          <div class="details-grid">
            <div class="detail-card">
              <h3 class="detail-title">产品介绍</h3>
              <p class="detail-content">{{ getProductIntro(resource.id) }}</p>
            </div>
            <div class="detail-card">
              <h3 class="detail-title">适用场景</h3>
              <ul class="detail-list">
                <li v-for="scenario in getScenarios(resource.id)" :key="scenario">
                  {{ scenario }}
                </li>
              </ul>
            </div>
            <div class="detail-card">
              <h3 class="detail-title">技术规格</h3>
              <ul class="detail-list">
                <li v-for="spec in getSpecs(resource.id)" :key="spec">{{ spec }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 购买区域 -->
      <section class="purchase-section">
        <div class="section-container">
          <div class="purchase-card">
            <div class="purchase-content">
              <h3 class="purchase-title">开始使用 {{ resource.title }}</h3>
              <p class="purchase-subtitle">一次性付费，永久使用，无月费负担</p>
              <div class="price-info">
                <span class="current-price">{{ resource.price }}</span>
                <span class="original-price">¥{{ getOriginalPrice(resource.price || '¥0') }}</span>
                <span class="discount-badge">限时优惠</span>
              </div>
              <div class="purchase-actions">
                <button class="btn-purchase" @click="handleView">
                  立即查看
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14m-7-7l7 7-7 7"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button class="btn-trial" @click="handleTrial">免费试用</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 未找到状态 -->
    <main class="main-content" v-else>
      <div class="not-found">
        <div class="not-found-content">
          <div class="not-found-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h2 class="not-found-title">资源未找到</h2>
          <p class="not-found-text">抱歉，您访问的资源不存在或已被移除。</p>
          <button class="btn-back" @click="goBack">返回资源列表</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '@/components/common/BackButton.vue'

// 资源数据类型定义
interface Resource {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  actionText: string
  actionUrl?: string
  price?: string
}

const route = useRoute()
const router = useRouter()

// 当前资源
const resource = ref<Resource | null>(null)

// 资源数据（与AIAgentView中的数据保持一致）
const premiumResources: Resource[] = [
  {
    id: 'ai-writing-pro',
    title: 'AI写作大师',
    description: '专业的AI写作工具，支持多种文体创作和智能润色功能',
    icon: '✍️',
    price: '¥299',
    features: ['多文体写作', '智能润色', '原创检测', '永久使用'],
    actionText: '立即查看',
    actionUrl: '#',
  },
  {
    id: 'ai-design-suite',
    title: 'AI设计套件',
    description: '集成多种AI设计工具，包含logo设计、海报制作、图标生成等',
    icon: '🎨',
    price: '¥599',
    features: ['Logo设计', '海报制作', '图标生成', '商用授权'],
    actionText: '立即查看',
    actionUrl: '#',
  },
  {
    id: 'ai-code-assistant',
    title: 'AI编程助手',
    description: '智能代码生成和优化工具，支持多种编程语言',
    icon: '👨‍💻',
    price: '¥399',
    features: ['代码生成', '智能补全', '错误检测', '性能优化'],
    actionText: '立即查看',
    actionUrl: '#',
  },
  {
    id: 'ai-video-editor',
    title: 'AI视频编辑器',
    description: '智能视频剪辑工具，自动生成字幕、转场和特效',
    icon: '🎬',
    price: '¥799',
    features: ['智能剪辑', '自动字幕', '特效生成', '批量处理'],
    actionText: '立即查看',
    actionUrl: '#',
  },
  {
    id: 'ai-data-analyzer',
    title: 'AI数据分析师',
    description: '智能数据分析和可视化工具，快速生成专业报告',
    icon: '📈',
    price: '¥499',
    features: ['数据分析', '图表生成', '报告制作', '趋势预测'],
    actionText: '立即查看',
    actionUrl: '#',
  },
  {
    id: 'ai-translator-pro',
    title: 'AI翻译专家',
    description: '专业级AI翻译工具，支持多语言实时翻译和文档翻译',
    icon: '🌍',
    price: '¥199',
    features: ['实时翻译', '文档翻译', '语音翻译', '专业术语'],
    actionText: '立即查看',
    actionUrl: '#',
  },
  {
    id: 'ai-voice-studio',
    title: 'AI语音工作室',
    description: '智能语音合成和处理工具，支持多种音色和语言',
    icon: '🎵',
    price: '¥699',
    features: ['语音合成', '音色定制', '语音克隆', '批量生成'],
    actionText: '立即查看',
    actionUrl: '#',
  },
  {
    id: 'ai-image-enhancer',
    title: 'AI图像增强器',
    description: '专业的AI图像处理工具，支持超分辨率、去噪、修复等功能',
    icon: '🖼️',
    price: '¥399',
    features: ['超分辨率', '智能去噪', '图像修复', '风格转换'],
    actionText: '立即查看',
    actionUrl: '#',
  },
]

// 获取产品介绍
const getProductIntro = (id: string): string => {
  const intros: Record<string, string> = {
    'ai-writing-pro':
      '基于先进的GPT技术，为用户提供专业的写作辅助服务。支持小说、论文、商业文案等多种文体，内置智能润色和原创检测功能，是写作者的得力助手。',
    'ai-design-suite':
      '集成多种AI设计工具的综合套件，包含Logo设计、海报制作、图标生成等功能。采用最新的AI图像生成技术，让设计变得简单高效。',
    'ai-code-assistant':
      '智能编程助手，支持Python、JavaScript、Java等主流编程语言。提供代码生成、智能补全、错误检测等功能，大幅提升开发效率。',
    'ai-video-editor':
      '基于AI技术的智能视频编辑工具，支持自动剪辑、字幕生成、特效添加等功能。让视频制作变得简单专业。',
    'ai-data-analyzer':
      '专业的数据分析工具，支持多种数据格式导入，自动生成图表和分析报告。适合商业分析、学术研究等场景。',
    'ai-translator-pro':
      '基于神经网络的专业翻译工具，支持100+语言互译，提供实时翻译、文档翻译、语音翻译等功能。',
    'ai-voice-studio':
      '专业的AI语音合成工具，支持多种音色和语言，提供语音克隆、批量生成等高级功能。',
    'ai-image-enhancer':
      '专业的AI图像处理工具，支持超分辨率放大、智能去噪、图像修复等功能，让图片质量得到显著提升。',
  }
  return intros[id] || '暂无详细介绍'
}

// 获取适用场景
const getScenarios = (id: string): string[] => {
  const scenarios: Record<string, string[]> = {
    'ai-writing-pro': ['内容创作', '学术写作', '商业文案', '小说创作', '新闻报道'],
    'ai-design-suite': ['品牌设计', '营销物料', '社交媒体', '网站设计', '印刷品设计'],
    'ai-code-assistant': ['Web开发', '移动应用', '数据科学', '机器学习', '系统开发'],
    'ai-video-editor': ['短视频制作', '教育培训', '营销推广', '娱乐内容', '企业宣传'],
    'ai-data-analyzer': ['商业分析', '市场研究', '学术研究', '财务分析', '运营分析'],
    'ai-translator-pro': ['商务翻译', '学术翻译', '网站本地化', '文档翻译', '实时沟通'],
    'ai-voice-studio': ['有声读物', '广告配音', '教育培训', '游戏配音', '智能客服'],
    'ai-image-enhancer': ['摄影后期', '电商产品', '印刷出版', '网站优化', '社交媒体'],
  }
  return scenarios[id] || []
}

// 获取技术规格
const getSpecs = (id: string): string[] => {
  const specs: Record<string, string[]> = {
    'ai-writing-pro': [
      '支持中英文写作',
      '最大文档长度：50万字',
      '内置10+写作模板',
      '支持多格式导出',
    ],
    'ai-design-suite': [
      '输出分辨率：最高4K',
      '支持PNG/JPG/SVG格式',
      '内置1000+设计模板',
      '商用授权',
    ],
    'ai-code-assistant': ['支持20+编程语言', 'IDE插件支持', '代码质量检测', '团队协作功能'],
    'ai-video-editor': ['支持4K视频处理', '最大时长：2小时', '50+特效模板', '多格式导出'],
    'ai-data-analyzer': ['支持Excel/CSV/JSON', '最大数据量：100万行', '30+图表类型', 'API接口支持'],
    'ai-translator-pro': ['支持100+语言', '翻译准确率：95%+', '实时翻译', 'API接口'],
    'ai-voice-studio': ['支持50+音色', '音质：48kHz/16bit', '批量处理', '情感语调调节'],
    'ai-image-enhancer': ['最大分辨率：8K', '支持批量处理', '多种算法选择', 'GPU加速'],
  }
  return specs[id] || []
}

// 获取原价（用于显示折扣）
const getOriginalPrice = (currentPrice: string): string => {
  if (!currentPrice) return '0'
  const price = parseInt(currentPrice.replace('¥', ''))
  return (price * 1.5).toString()
}

// 返回上一页
const goBack = () => {
  router.push('/ai-agent')
}

// 处理查看
const handleView = () => {
  alert('查看功能开发中...')
  // 查看也可能触发购买流程
  handlePurchase()
}

// 处理购买
const handlePurchase = () => {
  alert('购买功能开发中...')
}

// 处理试用
const handleTrial = () => {
  alert('试用功能开发中...')
}

// 页面初始化
onMounted(() => {
  const resourceId = route.params.id as string
  resource.value = premiumResources.find((r) => r.id === resourceId) || null
})
</script>

<style scoped>
/* 基础样式 */
.ai-resource-detail {
  min-height: 100vh;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 导航栏 */
.detail-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
}

/* 主要内容 */
.main-content {
  padding-top: 64px;
}

/* Hero区域 */
.hero-section {
  padding: 80px 0 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-content {
  position: relative;
}

.product-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.product-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.product-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.product-subtitle {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 40px;
  line-height: 1.5;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 按钮样式 */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 功能特性区域 */
.features-section {
  padding: 80px 0;
  background: white;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  color: #111827;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.feature-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.feature-check {
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.feature-text {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

/* 详情区域 */
.details-section {
  padding: 80px 0;
  background: #f9fafb;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.detail-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.detail-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
}

.detail-content {
  font-size: 16px;
  line-height: 1.6;
  color: #6b7280;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-list li {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 12px;
  padding-left: 24px;
  position: relative;
  line-height: 1.5;
}

.detail-list li::before {
  content: '•';
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

/* 购买区域 */
.purchase-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.purchase-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.purchase-content {
  position: relative;
}

.purchase-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.purchase-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
}

.price-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 36px;
  font-weight: 800;
  color: #667eea;
}

.original-price {
  font-size: 20px;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-badge {
  padding: 4px 12px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.purchase-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-purchase {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-purchase:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-trial {
  padding: 16px 32px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-trial:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

/* 未找到状态 */
.not-found {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.not-found-content {
  text-align: center;
  max-width: 400px;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.not-found-text {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
  line-height: 1.5;
}

.btn-back {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }

  .hero-section {
    padding: 60px 0 80px;
  }

  .hero-container {
    padding: 0 16px;
  }

  .product-title {
    font-size: 36px;
  }

  .product-subtitle {
    font-size: 18px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
  }

  .section-container {
    padding: 0 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .purchase-card {
    padding: 32px 24px;
    margin: 0 16px;
  }

  .purchase-title {
    font-size: 24px;
  }

  .current-price {
    font-size: 32px;
  }

  .purchase-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-purchase,
  .btn-trial {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .product-icon {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }

  .product-title {
    font-size: 28px;
  }

  .product-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .detail-card {
    padding: 24px;
  }

  .purchase-card {
    padding: 24px 16px;
  }
}
</style>
