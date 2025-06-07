<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import QRCodeModalSimple from '@/components/QRCodeModalSimple.vue'

// 导入二维码图片
import jinjiequnImage from '@/assets/img/jinjiequn.jpg'
import mianfeiqunImage from '@/assets/img/mianfeiqun.jpg'

// 二维码模态框状态
const showPaidQRCode = ref(false)
const showFreeQRCode = ref(false)

// 显示付费群二维码
const openPaidQRCode = () => {
  showPaidQRCode.value = true
}

// 显示免费群二维码
const openFreeQRCode = () => {
  showFreeQRCode.value = true
}

// 关闭付费群二维码
const closePaidQRCode = () => {
  showPaidQRCode.value = false
}

// 关闭免费群二维码
const closeFreeQRCode = () => {
  showFreeQRCode.value = false
}
</script>

<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-line">三秋叶</span>
            <span class="title-line">解落三秋叶，能开二月花</span>
          </h1>
          <p class="hero-subtitle">一个热爱技术与文学的开发者，用代码编织梦想，用文字记录生活</p>
          <div class="hero-actions">
            <RouterLink to="/projects" class="btn btn-primary">项目合集</RouterLink>
            <RouterLink to="/community" class="btn btn-secondary">社区交流</RouterLink>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-leaves">
            <div class="leaf leaf-1">🍂</div>
            <div class="leaf leaf-2">🍁</div>
            <div class="leaf leaf-3">🍃</div>
          </div>
          <!-- 三秋叶头像 -->
          <div class="avatar-container">
            <div class="avatar-square">
              <div class="avatar-inner">
                <div class="avatar-logo">
                  <img src="@/assets/img/sanqiuye.png" class="logo-image" alt="三秋叶标志" />
                </div>
                <div class="colored-text">
                  <span class="green">三</span><span class="yellow">秋</span
                  ><span class="white">叶</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目合集简介 -->
    <section class="about-preview">
      <div class="page-container">
        <div class="section-header">
          <h2 class="section-title">项目合集</h2>
          <p class="section-subtitle">技术与诗意的结合</p>
        </div>

        <div class="project-showcase">
          <div class="project-card">
            <div class="project-icon">💻</div>
            <h3 class="project-title">软件推荐</h3>
            <p class="project-desc">精选优质软件工具，提升工作效率，发现更好的数字化解决方案</p>
            <RouterLink to="/projects" class="project-link"
              >了解更多 <span class="arrow">→</span></RouterLink
            >
          </div>

          <div class="project-card">
            <div class="project-icon">🖨️</div>
            <h3 class="project-title">3D打印</h3>
            <p class="project-desc">3D打印解决方案，包含模型设计、打印技巧和材料选择等专业知识</p>
            <RouterLink to="/projects" class="project-link"
              >了解更多 <span class="arrow">→</span></RouterLink
            >
          </div>

          <div class="project-card">
            <div class="project-icon">🤖</div>
            <h3 class="project-title">AI Agent</h3>
            <p class="project-desc">智能代理系统开发与应用，探索AI在自动化、决策支持中的创新应用</p>
            <RouterLink to="/projects" class="project-link"
              >了解更多 <span class="arrow">→</span></RouterLink
            >
          </div>
        </div>
      </div>
    </section>

    <!-- AIGC学习社区 -->
    <section class="community-section">
      <div class="page-container community-container">
        <div class="community-content">
          <h2 class="community-title">准备开始您的AI学习之旅？</h2>
          <p class="community-description">加入AIGC实操基地，与志同道合的朋友一起学习成长</p>

          <div class="community-actions">
            <button @click="openPaidQRCode" class="btn btn-primary btn-sm">立即加入付费社群</button>
            <button @click="openFreeQRCode" class="btn btn-outline btn-sm">免费交流群</button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- 页脚 -->
  <AppFooter />

  <!-- 付费群二维码模态框 -->
  <QRCodeModalSimple
    :show="showPaidQRCode"
    title="加入付费社群"
    :qr-code-image="jinjiequnImage"
    description="请使用微信扫描下方二维码加入付费社群"
    @close="closePaidQRCode"
  />

  <!-- 免费群二维码模态框 -->
  <QRCodeModalSimple
    :show="showFreeQRCode"
    title="加入免费交流群"
    :qr-code-image="mianfeiqunImage"
    description="请使用微信扫描下方二维码加入免费交流群"
    @close="closeFreeQRCode"
  />
</template>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* 英雄区域 */
.hero-section {
  min-height: 50vh;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.1) 0%,
    rgba(234, 179, 8, 0.1) 50%,
    rgba(248, 250, 252, 0.1) 100%
  );
  display: flex;
  align-items: center;
  position: relative;
  padding: var(--spacing-lg) 0;
  transition: background 0.3s ease;
}

.hero-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-secondary),
    var(--color-accent)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% {
    filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 15px rgba(34, 197, 94, 0.6));
  }
}

.title-line {
  display: block;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  font-weight: 500;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.floating-leaves {
  position: relative;
  width: 300px;
  height: 300px;
}

.leaf {
  position: absolute;
  font-size: 3rem;
  animation: float 6s ease-in-out infinite;
}

.leaf-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.leaf-2 {
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.leaf-3 {
  bottom: 20%;
  left: 50%;
  animation-delay: 4s;
}

/* 三秋叶头像样式 */
.avatar-container {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  pointer-events: auto;
}

.avatar-square {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.4), rgba(234, 179, 8, 0.4));
  border: 3px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.avatar-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 2;
  padding: 1rem;
  position: relative;
  text-align: center;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  white-space: pre-line;
  letter-spacing: 1px;
  color: #e2e8f0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.avatar-square::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  animation: shine 3.5s infinite;
  z-index: 1;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.avatar-logo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.logo-image {
  width: 110px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.avatar-square:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.colored-text {
  display: flex;
  justify-content: center;
}

.colored-text .green {
  color: #22c55e; /* 绿色 */
}

.colored-text .yellow {
  color: #eab308; /* 黄色 */
}

.colored-text .white {
  color: #ffffff; /* 白色 */
}

/* 区域样式 */
.about-preview,
.community-section {
  padding: var(--spacing-md) 0;
}

.community-section {
  padding: 0;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.08), rgba(234, 179, 8, 0.08));
  transition: background 0.3s ease;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(34, 197, 94, 0.1);
  border-bottom: 1px solid rgba(234, 179, 8, 0.1);
  display: flex;
  align-items: center;
  min-height: 180px;
}

.community-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.community-section::before {
  content: '🍂';
  position: absolute;
  top: 10px;
  right: 5%;
  font-size: 2rem;
  opacity: 0.2;
  z-index: 1;
}

.community-content {
  padding: 2rem var(--spacing-md);
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.community-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.community-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.4;
}

.community-actions {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-md);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-outline:hover {
  background: rgba(34, 197, 94, 0.1);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 2px;
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  font-weight: 500;
  margin-bottom: 0;
}

/* 关于我内容 */
.about-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 项目展示部分 */
.project-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 2rem auto 0;
}

.project-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
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
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
}

.project-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
  color: white;
  transition: all 0.3s ease;
}

.project-card:hover .project-icon {
  transform: scale(1.1) rotate(5deg);
}

.project-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
}

.project-desc {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
  flex-grow: 1;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: all 0.3s ease;
}

.project-link .arrow {
  transition: transform 0.3s ease;
}

.project-link:hover .arrow {
  transform: translateX(5px);
}

.project-link:hover {
  color: var(--color-primary-hover);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .project-showcase {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .project-showcase {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .project-card {
    padding: var(--spacing-lg);
  }

  .project-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
}

.about-main {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--spacing-lg);
  align-items: center;
}

.about-text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.text-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.intro-text {
  font-size: var(--font-size-lg);
  line-height: 1.5;
  color: var(--color-text);
  font-weight: 500;
  margin: 0;
}

.detail-text {
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0;
}

.about-action {
  margin-top: var(--spacing-sm);
}

.learn-more-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.2);
}

.learn-more-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3);
}

.learn-more-btn .arrow {
  transition: transform 0.3s ease;
}

.learn-more-btn:hover .arrow {
  transform: translateX(4px);
}

.about-stats {
  position: relative;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xl);
  background: var(--color-background-card);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
  color: inherit;
}

.stat-item.clickable {
  cursor: pointer;
  user-select: none;
  border: 3px solid #ff0000 !important; /* 红色边框用于调试 */
  background: rgba(255, 0, 0, 0.1) !important; /* 红色背景用于调试 */
}

.stat-item.clickable:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.2);
  border-color: var(--color-primary);
}

.stat-item.clickable:active {
  transform: translateY(-4px) scale(1.01);
}

/* 暂时移除伪元素，测试点击功能 */

/* 移除旧的悬停效果，使用新的可点击样式 */

.stat-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.stat-item.clickable:hover .stat-icon {
  opacity: 1;
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .about-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .about-stats {
    order: -1;
  }

  .stats-grid {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat-item {
    min-width: 200px;
    flex: 1;
  }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .about-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    text-align: center;
  }

  .about-text {
    gap: var(--spacing-lg);
  }

  .intro-text {
    font-size: var(--font-size-lg);
  }

  .stats-grid {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .stat-item {
    min-width: auto;
    padding: var(--spacing-lg);
  }

  .stat-item.clickable:hover {
    transform: translateY(-4px);
  }

  .hero-actions {
    justify-content: center;
  }

  .floating-leaves {
    width: 200px;
    height: 200px;
  }

  .leaf {
    font-size: 2rem;
  }

  .community-content {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .community-title {
    font-size: 2.2rem;
  }

  .community-description {
    font-size: var(--font-size-base);
  }

  .avatar-container {
    position: relative;
    margin-top: var(--spacing-xl);
    right: auto;
    top: auto;
    display: flex;
    justify-content: center;
  }

  .avatar-square {
    width: 150px;
    height: 150px;
  }

  .avatar-text {
    font-size: 1.5rem;
  }

  .avatar-logo {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .stat-number {
    font-size: var(--font-size-2xl);
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .learn-more-btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-sm);
  }
}
</style>
