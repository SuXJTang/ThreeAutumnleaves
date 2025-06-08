<template>
  <div class="ai-agent-view">
    <!-- 页面头部 -->
    <section class="page-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">AI代理资源</h1>
          <p class="hero-subtitle">精选AI工具与资源，助力您的智能化工作流程</p>
        </div>
      </div>
    </section>

    <!-- 资源类型选择器 -->
    <section class="resource-selector">
      <div class="container">
        <div class="selector-tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'free' }"
            @click="loadResourceData('free')"
          >
            <span class="tab-icon">🆓</span>
            <span class="tab-text">免费资源</span>
            <span class="tab-count" v-if="freeResources.length">({{ freeResources.length }})</span>
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'premium' }"
            @click="loadResourceData('premium')"
          >
            <span class="tab-icon">💎</span>
            <span class="tab-text">付费资源</span>
            <span class="tab-count" v-if="premiumResources.length"
              >({{ premiumResources.length }})</span
            >
          </button>
        </div>
      </div>
    </section>

    <!-- 资源内容区域 -->
    <section class="resource-content">
      <div class="container">
        <!-- 当前选中的资源类型标题 -->
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">{{ activeTab === 'free' ? '🆓' : '💎' }}</span>
            {{ activeTab === 'free' ? '免费资源' : '付费资源' }}
          </h2>
        </div>

        <!-- 资源网格 -->
        <div class="resource-grid">
          <ResourceCard
            v-for="resource in currentResources"
            :key="resource.id"
            :title="resource.title"
            :description="resource.description"
            :icon="resource.icon"
            :is-premium="activeTab === 'premium'"
            :price="resource.price"
            :features="resource.features"
            :action-text="resource.actionText"
            :action-url="resource.actionUrl"
            @action="handleResourceAction"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ResourceCard from '@/components/ResourceCard.vue'

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

const router = useRouter()

// 状态管理
const activeTab = ref<'free' | 'premium'>('free')

// 资源数据
const freeResources = ref<Resource[]>([])
const premiumResources = ref<Resource[]>([])

// 当前显示的资源
const currentResources = computed(() => {
  return activeTab.value === 'free' ? freeResources.value : premiumResources.value
})

// 默认数据（作为备用）
const defaultFreeResources: Resource[] = [
  {
    id: 'chatgpt-free',
    title: 'ChatGPT 免费版',
    description: 'OpenAI推出的强大对话AI，支持文本生成、问答、代码编写等多种功能',
    icon: '🤖',
    features: ['自然语言对话', '代码生成与调试', '文本创作与编辑', '知识问答'],
    actionText: '立即查看',
    actionUrl: 'https://chat.openai.com',
  },
  {
    id: 'claude-free',
    title: 'Claude 免费版',
    description: 'Anthropic开发的AI助手，擅长长文本处理和深度分析',
    icon: '🧠',
    features: ['长文本分析', '代码审查', '学术写作', '逻辑推理'],
    actionText: '立即查看',
    actionUrl: 'https://claude.ai',
  },
  {
    id: 'gemini-free',
    title: 'Google Gemini',
    description: 'Google最新的多模态AI模型，支持文本、图像和代码处理',
    icon: '✨',
    features: ['多模态理解', '图像分析', '代码生成', '实时搜索'],
    actionText: '立即查看',
    actionUrl: 'https://gemini.google.com',
  },
  {
    id: 'huggingface',
    title: 'Hugging Face',
    description: '开源AI模型平台，提供大量免费的预训练模型和工具',
    icon: '🤗',
    features: ['开源模型库', '在线模型测试', '免费API调用', '社区支持'],
    actionText: '立即查看',
    actionUrl: 'https://huggingface.co',
  },
  {
    id: 'perplexity-free',
    title: 'Perplexity AI',
    description: '基于搜索的AI问答工具，提供实时信息和引用来源',
    icon: '🔍',
    features: ['实时搜索', '引用来源', '多语言支持', '学术研究'],
    actionText: '立即查看',
    actionUrl: 'https://perplexity.ai',
  },
  {
    id: 'poe-free',
    title: 'Poe by Quora',
    description: 'Quora推出的AI聊天平台，集成多个AI模型',
    icon: '💬',
    features: ['多模型访问', '对话历史', '社区分享', '移动应用'],
    actionText: '立即查看',
    actionUrl: 'https://poe.com',
  },
  {
    id: 'character-ai',
    title: 'Character.AI',
    description: '创建和与AI角色对话的平台，支持个性化AI助手',
    icon: '🎭',
    features: ['角色创建', '个性化对话', '创意写作', '娱乐互动'],
    actionText: '立即查看',
    actionUrl: 'https://character.ai',
  },
  {
    id: 'you-chat',
    title: 'You.com Chat',
    description: '集成搜索功能的AI聊天工具，提供准确的实时信息',
    icon: '🌐',
    features: ['搜索集成', '实时信息', '多模态输入', '隐私保护'],
    actionText: '立即查看',
    actionUrl: 'https://you.com',
  },
]

const defaultPremiumResources: Resource[] = [
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

// 加载资源数据
const loadResourceData = (type: 'free' | 'premium') => {
  activeTab.value = type

  // 直接使用默认数据
  if (type === 'free') {
    freeResources.value = defaultFreeResources
  } else {
    premiumResources.value = defaultPremiumResources
  }

  // 添加动画效果
  setTimeout(() => {
    const cards = document.querySelectorAll('.resource-card')
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in')
      }, index * 100)
    })
  }, 100)
}

// 处理资源操作
const handleResourceAction = (url?: string) => {
  // 对于付费资源，跳转到详情页面
  if (activeTab.value === 'premium') {
    // 从当前资源中找到对应的资源ID
    const currentResource = currentResources.value.find((resource) => resource.actionUrl === url)
    if (currentResource) {
      // 使用Vue Router跳转到资源详情页面
      router.push(`/ai-resource/${currentResource.id}`)
    }
  } else {
    // 免费资源直接跳转到外部链接
    if (url && url !== '#') {
      window.open(url, '_blank')
    }
  }
}

// 页面初始化
onMounted(() => {
  // 默认加载免费资源
  loadResourceData('free')
})
</script>

<style scoped>
.ai-agent-view {
  min-height: 100vh;
  background: var(--color-background);
}

/* 页面头部 */
.page-hero {
  padding: calc(var(--header-height) + var(--spacing-2xl)) 0 var(--spacing-2xl);
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
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
    radial-gradient(circle at 70% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, #22c55e 0%, #f59e0b 50%, #16a34a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 资源选择器 */
.resource-selector {
  padding: var(--spacing-xl) 0;
  background: rgba(248, 250, 252, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.selector-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  max-width: 600px;
  margin: 0 auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.tab-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.tab-button.active {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.2);
}

.tab-icon {
  font-size: 1.2em;
}

.tab-text {
  font-weight: 700;
}

.tab-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-left: var(--spacing-xs);
}

/* 资源内容区域 */
.resource-content {
  padding: var(--spacing-2xl) 0;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: 1.2em;
}

/* 资源网格 */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

/* 动画效果 */
.resource-card {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.resource-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}
</style>
