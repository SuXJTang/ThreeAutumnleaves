<template>
  <div class="printing-card" @click="handleClick">
    <div class="card-image">
      <img :src="item.image" :alt="item.title" loading="lazy" />
      <div class="card-overlay">
        <div class="overlay-content">
          <span class="view-icon">👁️</span>
          <span class="download-icon">📥</span>
        </div>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ item.title }}</h3>
      <p class="card-description">{{ item.description }}</p>
      <div class="card-meta">
        <div class="card-author">{{ item.author }}</div>
        <div class="card-stats">
          <div class="stat-item">
            <span class="stat-icon">👁️</span>
            <span class="stat-value">{{ item.views }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📥</span>
            <span class="stat-value">{{ item.downloads }}</span>
          </div>
        </div>
      </div>
      <div class="card-tags">
        <span v-for="tag in item.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

interface Props {
  item: PrintingItem
}

interface Emits {
  (e: 'click', item: PrintingItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClick = () => {
  emit('click', props.item)
}
</script>

<style scoped>
.printing-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  margin-bottom: 16px;
  break-inside: avoid;
  display: inline-block;
}

.printing-card:hover {
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.printing-card.animate-in {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.card-image {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.printing-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.printing-card:hover .card-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  gap: 16px;
}

.view-icon,
.download-icon {
  font-size: 1.5rem;
  color: white;
  transition: transform 0.2s ease;
}

.view-icon:hover,
.download-icon:hover {
  transform: scale(1.2);
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px;
  line-height: 1.4;
}

.card-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.card-author {
  font-weight: 400;
}

.card-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 12px;
}

.stat-value {
  font-weight: 400;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 8px;
  background: #f5f5f5;
  color: #666;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 400;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
