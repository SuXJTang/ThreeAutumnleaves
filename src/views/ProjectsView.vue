<template>
  <div class="projects-view">
    <!-- 页面头部 -->
    <section class="projects-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">项目合集</h1>
          <p class="hero-subtitle">
            探索我们精心打造的项目，涵盖软件推荐、3D打印和AI智能体等前沿领域
          </p>
        </div>
      </div>
    </section>

    <!-- 项目卡片区域 -->
    <section class="projects-section">
      <div class="container">
        <div class="projects-grid">
          <!-- 软件推荐项目 -->
          <div
            class="project-card"
            data-project="software"
            @click="handleCardClick('software-recommendations')"
          >
            <div class="card-left">
              <div class="card-icon">
                <span class="icon">💻</span>
              </div>
              <h3 class="card-title">软件推荐</h3>
            </div>
            <div class="card-right">
              <p class="card-description">
                精选优质软件工具，涵盖开发、设计、办公等各个领域，帮助您提升工作效率，发现更好的数字化解决方案。
              </p>
            </div>
          </div>

          <!-- 3D打印项目 -->
          <div
            class="project-card"
            data-project="3d-printing"
            @click="handleCardClick('3d-printing')"
          >
            <div class="card-left">
              <div class="card-icon">
                <span class="icon">🖨️</span>
              </div>
              <h3 class="card-title">3D打印</h3>
            </div>
            <div class="card-right">
              <p class="card-description">
                从设计到制造的完整3D打印解决方案，包含模型设计、打印技巧、材料选择等专业知识，让创意变为现实。
              </p>
            </div>
          </div>

          <!-- AI Agent项目 -->
          <div class="project-card" data-project="ai-agent" @click="handleCardClick('ai-agent')">
            <div class="card-left">
              <div class="card-icon">
                <span class="icon">🤖</span>
              </div>
              <h3 class="card-title">AI Agent</h3>
            </div>
            <div class="card-right">
              <p class="card-description">
                智能代理系统开发与应用，探索人工智能在自动化、决策支持、智能交互等场景中的创新应用和实践。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 移除页脚 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 页面加载动画
onMounted(() => {
  // 添加页面加载动画
  const cards = document.querySelectorAll('.project-card')
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in')
    }, index * 200)
  })
})

// 卡片点击处理
const handleCardClick = (route: string) => {
  console.log(`跳转到${route}页面`)
  router.push({ name: route })
}
</script>

<style scoped>
.projects-view {
  min-height: 100vh;
  background: var(--color-background);
}

/* 页面头部 */
.projects-hero {
  padding: calc(var(--header-height) + var(--spacing-2xl)) 0 var(--spacing-2xl);
  background: var(--color-background);
}

/* 移除复杂的背景动画 */

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
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 项目区域 */
.projects-section {
  padding: var(--spacing-2xl) 0;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 75%;
  margin: 0 auto;
}

/* 项目卡片 */
.project-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  width: 100%;
  height: auto;
  min-height: 120px;
  cursor: pointer;
}

.project-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent);
  transition: left 0.6s ease;
}

.project-card:hover::before {
  left: 100%;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
}

/* 卡片左侧 */
.card-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex-shrink: 0;
}

/* 卡片右侧 */
.card-right {
  flex: 1;
}

.card-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
  flex-shrink: 0;
}

.card-icon .icon {
  font-size: 1.5rem;
}

/* 移除不需要的样式 */

.card-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.card-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* 移除不需要的复杂样式 */

/* 响应式设计 */
@media (max-width: 768px) {
  .projects-hero {
    padding: calc(var(--header-height) + var(--spacing-xl)) 0 var(--spacing-xl);
  }

  .hero-title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .projects-section {
    padding: var(--spacing-xl) 0;
  }

  .projects-grid {
    gap: var(--spacing-md);
    width: 90%;
  }

  .project-card {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .card-left {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .card-icon {
    width: 50px;
    height: 50px;
  }

  .card-icon .icon {
    font-size: 1.25rem;
  }

  .card-title {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .project-card {
    padding: var(--spacing-md);
  }

  .card-description {
    font-size: var(--font-size-sm);
  }
}

/* 特殊项目卡片样式 */
.project-card[data-project='software'] {
  border-color: rgba(59, 130, 246, 0.2);
}

.project-card[data-project='software']:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow:
    0 30px 80px rgba(59, 130, 246, 0.15),
    0 15px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.project-card[data-project='software'] .card-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow:
    0 10px 30px rgba(59, 130, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.project-card[data-project='3d-printing'] {
  border-color: rgba(168, 85, 247, 0.2);
}

.project-card[data-project='3d-printing']:hover {
  border-color: rgba(168, 85, 247, 0.4);
  box-shadow:
    0 30px 80px rgba(168, 85, 247, 0.15),
    0 15px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.project-card[data-project='3d-printing'] .card-icon {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  box-shadow:
    0 10px 30px rgba(168, 85, 247, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.project-card[data-project='ai-agent'] {
  border-color: rgba(34, 197, 94, 0.2);
}

.project-card[data-project='ai-agent']:hover {
  border-color: rgba(34, 197, 94, 0.4);
}

.project-card[data-project='ai-agent'] .card-icon {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
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

.project-card.animate-in {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
