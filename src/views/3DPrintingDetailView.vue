<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '@/components/common/BackButton.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

// 项目详情数据结构
interface ProjectDetail {
  id: string | number
  title: string
  description: string
  image: string
  author: string
  date: string
  content: string
  viewCount: number
  likeCount: number
  tags: string[]
  materials?: string[]
  printTime?: string
  printer?: string
  relatedProjects?: Array<{
    id: string | number
    title: string
    image: string
  }>
}

// 项目详情数据
const project = ref<ProjectDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// 模拟从API获取数据
const fetchProjectDetail = async (projectId: string) => {
  try {
    loading.value = true
    // 在实际应用中，这里应该是API调用
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟数据 - 在实际应用中会从API获取
    project.value = {
      id: projectId,
      title: '3D打印作品标题',
      description: '专业的3D建模和设计作品，展示了高品质的3D打印技术和创意。',
      image: '/src/assets/img/project-sample.jpg', // 实际使用时请替换为真实图片路径
      author: '设计师名称',
      date: '2023-05-15',
      content: `
        <p>这是一个详细的3D打印项目描述。在这里可以添加HTML内容，包括格式化文本、列表、表格等。</p>
        <p>这个项目采用了先进的3D打印技术，使用优质材料制作而成。设计过程中考虑了功能性和美观性的平衡。</p>
        <h3>设计理念</h3>
        <p>设计灵感来源于自然形态，通过参数化设计方法实现了复杂的几何结构。</p>
        <h3>制作过程</h3>
        <ul>
          <li>使用Fusion 360进行3D建模</li>
          <li>在Cura中进行切片处理</li>
          <li>使用Ender-3 S1打印机进行打印</li>
          <li>后期处理包括打磨、上色等工艺</li>
        </ul>
      `,
      viewCount: 1256,
      likeCount: 325,
      tags: ['艺术设计', '实用工具', '教育模型'],
      materials: ['PLA', 'PETG'],
      printTime: '15小时30分钟',
      printer: 'Ender-3 S1',
      relatedProjects: [
        { id: 'rel1', title: '相关项目1', image: '/src/assets/img/related1.jpg' },
        { id: 'rel2', title: '相关项目2', image: '/src/assets/img/related2.jpg' },
        { id: 'rel3', title: '相关项目3', image: '/src/assets/img/related3.jpg' },
      ],
    }
  } catch (err) {
    error.value = '加载项目详情失败，请稍后重试'
    console.error('Error fetching project details:', err)
  } finally {
    loading.value = false
  }
}

// 点赞功能
const isLiked = ref(false)
const toggleLike = () => {
  if (project.value) {
    if (isLiked.value) {
      project.value.likeCount -= 1
    } else {
      project.value.likeCount += 1
    }
    isLiked.value = !isLiked.value
    // 这里应该有一个API调用来保存点赞状态
  }
}

// 返回列表页
const goBack = () => {
  router.push('/3d-printing')
}

// 跳转到相关项目
const goToRelatedProject = (relatedId: string | number) => {
  router.push({
    name: '3d-printing-detail',
    params: { id: relatedId },
  })
}

// 生命周期钩子
onMounted(() => {
  fetchProjectDetail(id)
})
</script>

<template>
  <div class="detail-container">
    <!-- 使用通用返回按钮组件 -->
    <div class="back-button-container">
      <BackButton @click="goBack" text="返回列表" :icon-only="false" />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>正在加载项目详情...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <p>加载失败: {{ error }}</p>
      <button @click="fetchProjectDetail(id)" class="retry-button">重试</button>
    </div>

    <!-- 项目详情 -->
    <div v-else-if="project" class="project-detail">
      <!-- 项目头部信息 -->
      <div class="project-header">
        <h1 class="project-title">{{ project.title }}</h1>
        <div class="project-meta">
          <span class="author">作者: {{ project.author }}</span>
          <span class="date">发布日期: {{ project.date }}</span>
          <div class="stats">
            <span class="views"> <i class="icon-view"></i> {{ project.viewCount }} </span>
            <span class="likes" @click="toggleLike" :class="{ 'is-liked': isLiked }">
              <i class="icon-like"></i> {{ project.likeCount }}
            </span>
          </div>
        </div>
      </div>

      <!-- 项目主图 -->
      <div class="project-main-image">
        <img :src="project.image" :alt="project.title" />
      </div>

      <!-- 项目标签 -->
      <div class="project-tags">
        <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <!-- 项目详情信息 -->
      <div class="project-info">
        <div class="project-specs" v-if="project.materials || project.printTime || project.printer">
          <h3>技术规格</h3>
          <div class="specs-grid">
            <div class="spec-item" v-if="project.materials">
              <strong>材料:</strong>
              <span>{{ project.materials.join(', ') }}</span>
            </div>
            <div class="spec-item" v-if="project.printTime">
              <strong>打印时间:</strong>
              <span>{{ project.printTime }}</span>
            </div>
            <div class="spec-item" v-if="project.printer">
              <strong>打印机型号:</strong>
              <span>{{ project.printer }}</span>
            </div>
          </div>
        </div>

        <!-- 项目描述 -->
        <div class="project-description">
          <h2>项目描述</h2>
          <p>{{ project.description }}</p>
        </div>

        <!-- 项目内容（HTML） -->
        <div class="project-content">
          <div v-html="project.content"></div>
        </div>
      </div>

      <!-- 相关项目 -->
      <div
        class="related-projects"
        v-if="project.relatedProjects && project.relatedProjects.length"
      >
        <h2>相关项目</h2>
        <div class="related-grid">
          <div
            v-for="related in project.relatedProjects"
            :key="related.id"
            class="related-project-card"
            @click="goToRelatedProject(related.id)"
          >
            <div class="related-image">
              <img :src="related.image" :alt="related.title" />
            </div>
            <div class="related-title">{{ related.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

/* 返回按钮容器样式 */
.back-button-container {
  position: sticky;
  top: var(--spacing-lg);
  left: 0;
  padding: var(--spacing-lg);
  z-index: 10;
}

/* 加载和错误状态样式 */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 100%;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(34, 197, 94, 0.1);
  border-left-color: #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  color: var(--color-error);
}

.retry-button {
  margin-top: var(--spacing-md);
  padding: 8px 16px;
  background: white;
  border: 1px solid var(--color-error);
  border-radius: 50px;
  color: var(--color-error);
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: var(--color-error);
  color: white;
}

.project-detail {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.project-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.project-title {
  margin: 0 0 16px 0;
  font-size: 2rem;
  font-weight: 600;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.stats {
  display: flex;
  gap: 16px;
  margin-left: auto;
}

.views,
.likes {
  display: flex;
  align-items: center;
  gap: 4px;
}

.likes {
  cursor: pointer;
  transition: color 0.2s;
}

.likes.is-liked {
  color: #f44336;
}

.project-main-image {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 宽高比 */
  position: relative;
}

.project-main-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 24px;
  background-color: #f9f9f9;
}

.tag {
  padding: 4px 12px;
  border-radius: 16px;
  background-color: #4caf50; /* 生机绿 */
  color: white;
  font-size: 0.8rem;
}

.project-info {
  padding: 24px;
}

.project-specs {
  margin-bottom: 32px;
}

.project-specs h3 {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-description h2,
.project-content h2,
.related-projects h2 {
  margin: 32px 0 16px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.project-description p {
  margin: 0 0 16px 0;
  line-height: 1.6;
  color: #555;
}

.project-content {
  line-height: 1.7;
  color: #444;
}

.project-content :deep(h3) {
  margin: 24px 0 12px 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.project-content :deep(p) {
  margin: 0 0 16px 0;
}

.project-content :deep(ul) {
  margin: 0 0 16px 0;
  padding-left: 20px;
}

.project-content :deep(li) {
  margin-bottom: 8px;
}

.related-projects {
  padding: 24px;
  background-color: #f9f9f9;
  border-top: 1px solid #f0f0f0;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.related-project-card {
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.related-project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.related-image {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 宽高比 */
  position: relative;
}

.related-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-title {
  padding: 12px;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .project-title {
    font-size: 1.6rem;
  }

  .project-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .stats {
    margin-left: 0;
    margin-top: 8px;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .back-button-container {
    position: relative;
    top: 0;
    margin-bottom: 16px;
  }

  .btn-back {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}

/* 图标样式 */
.icon-view,
.icon-like {
  display: inline-block;
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.icon-view::before {
  content: '👁️';
}

.icon-like::before {
  content: '👍';
}

.likes.is-liked .icon-like::before {
  content: '❤️';
}
</style>
