<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// 卡片的属性定义
interface Props {
  id: string | number // 项目ID，用于导航到详情页
  type: string // 项目类型，如'3d-printing', 'ai-agent'等
  image: string // 卡片图片URL
  title: string // 项目标题
  description: string // 项目描述
  viewCount?: number // 浏览量（可选）
  likeCount?: number // 点赞数（可选）
  tags?: string[] // 标签（可选）
  year?: number // 年份（可选）
  author?: string // 作者（可选）
  routeName?: string // 自定义路由名称（可选，默认会根据type生成）
}

const props = withDefaults(defineProps<Props>(), {
  viewCount: 0,
  likeCount: 0,
  tags: () => [],
  routeName: '',
})

// 生成详情页路由
const router = useRouter()

// 计算路由名称
const detailRouteName = computed(() => {
  if (props.routeName) return props.routeName

  // 根据项目类型生成路由名称
  switch (props.type) {
    case '3d-printing':
      return '3d-printing-detail'
    case 'ai-agent':
      return 'ai-resource-detail'
    default:
      return `${props.type}-detail`
  }
})

// 点击卡片跳转到详情页
const navigateToDetail = () => {
  router.push({
    name: detailRouteName.value,
    params: { id: props.id },
  })
}

// 格式化数字显示（大于1000的显示为1k+）
const formatNumber = (num: number): string => {
  return num >= 1000 ? `${Math.floor(num / 1000)}k+` : String(num)
}
</script>

<template>
  <div class="project-card" @click="navigateToDetail">
    <div class="project-card-image">
      <img :src="image" :alt="title" />
    </div>

    <div class="project-card-content">
      <h3 class="project-card-title">{{ title }}</h3>
      <p class="project-card-description">{{ description }}</p>

      <div class="project-card-meta">
        <div v-if="year" class="project-card-year">
          {{ year }}
        </div>

        <div class="project-card-stats">
          <span v-if="viewCount > 0" class="view-count">
            <i class="icon-view"></i> {{ formatNumber(viewCount) }}
          </span>
          <span v-if="likeCount > 0" class="like-count">
            <i class="icon-like"></i> {{ formatNumber(likeCount) }}
          </span>
        </div>
      </div>

      <div v-if="tags.length" class="project-card-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.project-card-image {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 宽高比 */
  position: relative;
  overflow: hidden;
}

.project-card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-card-image img {
  transform: scale(1.05);
}

.project-card-content {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.project-card-title {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.project-card-description {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 0.85rem;
  color: #888;
}

.project-card-stats {
  display: flex;
  gap: 12px;
}

.view-count,
.like-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.project-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #666;
  font-size: 0.8rem;
}

/* 以下是生机绿和枯败黄的主题样式 */
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
</style>
