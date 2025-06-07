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

    <!-- 免费资源板块 -->
    <section class="resource-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">🆓</span>
            免费资源
          </h2>
          <p class="section-description">优质免费AI工具，零成本体验智能化</p>
        </div>

        <div class="resource-grid">
          <ResourceCard
            v-for="resource in freeResources"
            :key="resource.id"
            :title="resource.title"
            :description="resource.description"
            :icon="resource.icon"
            :is-premium="false"
            :features="resource.features"
            :action-text="resource.actionText"
            :action-url="resource.actionUrl"
            @action="handleResourceAction"
          />
        </div>
      </div>
    </section>

    <!-- 付费资源板块 -->
    <section class="resource-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="title-icon">💎</span>
            付费资源
          </h2>
          <p class="section-description">专业级AI工具，解锁更强大的功能</p>
        </div>

        <div class="resource-grid">
          <ResourceCard
            v-for="resource in premiumResources"
            :key="resource.id"
            :title="resource.title"
            :description="resource.description"
            :icon="resource.icon"
            :is-premium="true"
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
import { ref, onMounted } from 'vue'
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

// 免费资源数据
const freeResources = ref<Resource[]>([
  {
    id: 'chatgpt-free',
    title: 'ChatGPT 免费版',
    description: 'OpenAI推出的强大对话AI，支持文本生成、问答、代码编写等多种功能',
    icon: '🤖',
    features: ['自然语言对话', '代码生成与调试', '文本创作与编辑', '知识问答'],
    actionText: '立即使用',
    actionUrl: 'https://chat.openai.com',
  },
  {
    id: 'claude-free',
    title: 'Claude 免费版',
    description: 'Anthropic开发的AI助手，擅长长文本处理和深度分析',
    icon: '🧠',
    features: ['长文本分析', '代码审查', '学术写作', '逻辑推理'],
    actionText: '开始体验',
    actionUrl: 'https://claude.ai',
  },
  {
    id: 'gemini-free',
    title: 'Google Gemini',
    description: 'Google最新的多模态AI模型，支持文本、图像和代码处理',
    icon: '✨',
    features: ['多模态理解', '图像分析', '代码生成', '实时搜索'],
    actionText: '免费试用',
    actionUrl: 'https://gemini.google.com',
  },
  {
    id: 'huggingface',
    title: 'Hugging Face',
    description: '开源AI模型平台，提供大量免费的预训练模型和工具',
    icon: '🤗',
    features: ['开源模型库', '在线模型测试', '免费API调用', '社区支持'],
    actionText: '探索模型',
    actionUrl: 'https://huggingface.co',
  },
])

// 付费资源数据
const premiumResources = ref<Resource[]>([
  {
    id: 'chatgpt-plus',
    title: 'ChatGPT Plus',
    description: 'ChatGPT的高级版本，提供更快的响应速度和GPT-4访问权限',
    icon: '🚀',
    price: '$20/月',
    features: ['GPT-4模型访问', '优先响应速度', '插件生态系统', '高级功能支持'],
    actionText: '立即订阅',
    actionUrl: 'https://chat.openai.com/plus',
  },
  {
    id: 'claude-pro',
    title: 'Claude Pro',
    description: 'Claude的专业版本，提供更高的使用限制和优先访问',
    icon: '💎',
    price: '$20/月',
    features: ['5倍使用量', '优先访问', '更长对话', '高级分析'],
    actionText: '升级Pro',
    actionUrl: 'https://claude.ai/pro',
  },
  {
    id: 'midjourney',
    title: 'Midjourney',
    description: '顶级AI图像生成工具，创造令人惊艳的艺术作品和设计',
    icon: '🎨',
    price: '$10-60/月',
    features: ['高质量图像生成', '多种艺术风格', '商业使用许可', '社区画廊'],
    actionText: '开始创作',
    actionUrl: 'https://midjourney.com',
  },
  {
    id: 'github-copilot',
    title: 'GitHub Copilot',
    description: 'AI编程助手，实时提供代码建议和自动补全',
    icon: '👨‍💻',
    price: '$10/月',
    features: ['AI代码补全', '多语言支持', 'IDE集成', '代码解释'],
    actionText: '开始编程',
    actionUrl: 'https://github.com/features/copilot',
  },
])

// 处理资源操作
const handleResourceAction = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

// 页面加载动画
onMounted(() => {
  const cards = document.querySelectorAll('.resource-card')
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in')
    }, index * 100)
  })
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

/* 资源板块 */
.resource-section {
  padding: var(--spacing-2xl) 0;
  position: relative;
}

.resource-section:nth-child(even) {
  background: rgba(0, 0, 0, 0.02);
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

.section-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .resource-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .page-hero {
    padding: calc(var(--header-height) + var(--spacing-xl)) 0 var(--spacing-xl);
  }

  .hero-title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .resource-section {
    padding: var(--spacing-xl) 0;
  }

  .section-title {
    font-size: var(--font-size-xl);
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .section-description {
    font-size: var(--font-size-base);
  }

  .resource-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .page-hero {
    padding: calc(var(--header-height) + var(--spacing-lg)) 0 var(--spacing-lg);
  }

  .resource-section {
    padding: var(--spacing-lg) 0;
  }

  .section-header {
    margin-bottom: var(--spacing-xl);
  }
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

.resource-card.animate-in {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
