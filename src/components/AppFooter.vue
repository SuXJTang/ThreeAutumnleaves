<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="container-narrow">
        <!-- 主要内容区域 -->
        <div class="footer-main">
          <!-- 品牌信息 -->
          <div class="footer-brand">
            <div class="footer-logo">
              <div class="logo">
                <img src="@/assets/img/logo.png" alt="三秋叶logo" />
              </div>
              <h3 class="brand-name">三秋叶</h3>
            </div>
            <p class="brand-description">
              一个热爱技术与文学的开发者，用代码编织梦想，用文字记录生活。
            </p>
            <div class="social-links">
              <a
                href="https://github.com/ThreeAutumnleaves"
                class="social-link"
                title="GitHub"
                target="_blank"
              >
                <SvgIcon name="icon-GitHub" size="18px" color="#fff" fallback="🐙" />
              </a>
              <a href="#" class="social-link" title="微博">
                <span class="social-icon">📱</span>
              </a>
              <a href="#" class="social-link" title="邮箱">
                <span class="social-icon">📧</span>
              </a>
              <a href="#" class="social-link" title="微信">
                <span class="social-icon">💬</span>
              </a>
            </div>
          </div>

          <!-- 快速链接 -->
          <div class="footer-links">
            <div class="link-group">
              <h4 class="link-title">站点导航</h4>
              <ul class="link-list">
                <li><RouterLink to="/" class="footer-link">首页</RouterLink></li>
                <li><RouterLink to="/projects" class="footer-link">项目合集</RouterLink></li>
                <li><RouterLink to="/community" class="footer-link">社区交流</RouterLink></li>
                <li><RouterLink to="/announcement" class="footer-link">公告</RouterLink></li>
              </ul>
            </div>

            <div class="link-group">
              <h4 class="link-title">快速链接</h4>
              <ul class="link-list">
                <li><a href="#" class="footer-link">免费资源</a></li>
                <li><a href="#" class="footer-link">付费资源</a></li>
                <li><a href="#" class="footer-link">知识库</a></li>
                <li><a href="#" class="footer-link">RSS订阅</a></li>
                <li><a href="#" class="footer-link">社群介绍</a></li>
              </ul>
            </div>

            <div class="link-group">
              <h4 class="link-title">联系方式</h4>
              <ul class="link-list">
                <li class="contact-item">
                  <SvgIcon
                    name="icon-qq"
                    class="contact-icon"
                    size="18px"
                    color="#12B7F5"
                    fallback="🐧"
                  />
                  <span class="contact-text">1557003690@qq.com</span>
                </li>
                <li class="contact-item">
                  <SvgIcon
                    name="icon-weixin"
                    class="contact-icon"
                    size="18px"
                    color="#07C160"
                    fallback="💬"
                  />
                  <span class="contact-text">ABC1557003690</span>
                </li>
                <li class="contact-item">
                  <SvgIcon
                    name="icon-GitHub"
                    class="contact-icon"
                    size="18px"
                    color="#333"
                    fallback="🐙"
                  />
                  <span class="contact-text">ThreeAutumnleaves</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 诗词引用部分已移除 -->

        <!-- 底部信息 -->
        <div class="footer-bottom">
          <div class="copyright">
            <p>&copy; {{ currentYear }} 三秋叶. 保留所有权利.</p>
          </div>
          <div class="footer-meta">
            <span class="meta-item">最后更新: {{ lastUpdate }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { loadIconFont } from '@/utils/iconfont'

const currentYear = computed(() => new Date().getFullYear())
const lastUpdate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
})

// 图标加载状态
const iconsLoaded = ref(false)

// 确保图标库加载
onMounted(async () => {
  try {
    console.log('AppFooter: 开始加载图标库')
    await loadIconFont('https://at.alicdn.com/t/c/font_4942439_zvzb6m54i8.js')
    console.log('AppFooter: 图标库加载成功')
    iconsLoaded.value = true
  } catch (error) {
    console.error('AppFooter: 图标库加载失败', error)
  }
})
</script>

<style scoped>
.app-footer {
  background: #000000;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: auto;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.footer-content {
  padding: var(--spacing-lg) 0 var(--spacing-md);
}

.footer-main {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  align-items: start;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.footer-logo .logo {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-sm);
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.footer-logo .logo img {
  width: 160%;
  height: 160%;
  object-fit: contain;
  border-radius: 50%;
  transform: scale(1.2);
  margin: -20%;
}

.brand-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: white;
  margin: 0;
}

.brand-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  margin-bottom: var(--spacing-md);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.social-icon {
  font-size: 1.1rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.link-group {
  display: flex;
  flex-direction: column;
}

.link-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: white;
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--color-primary);
  position: relative;
}

.link-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--color-secondary);
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: var(--font-size-sm);
}

.footer-link:hover {
  color: var(--color-primary);
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
  cursor: default;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.contact-icon {
  font-size: 1rem;
}

.contact-text {
  color: rgba(255, 255, 255, 0.8);
}

/* 诗词引用样式已移除 */

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.copyright p {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
  margin: 0;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
}

.meta-divider {
  color: rgba(255, 255, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 250px 1fr;
    gap: var(--spacing-xl);
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }

  .footer-bottom {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .footer-meta {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .social-links {
    justify-content: center;
  }

  .link-title {
    font-size: var(--font-size-base);
  }
}
</style>
