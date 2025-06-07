<template>
  <section class="category-section">
    <div class="container">
      <div class="category-wrapper">
        <!-- 左箭头 -->
        <button
          v-if="showLeftArrow"
          class="category-nav category-nav-left"
          @click="scrollCategories('left')"
        >
          ←
        </button>

        <!-- 分类列表 -->
        <div class="category-scroll">
          <div class="category-list">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
              :style="{ '--category-color': category.color }"
            >
              <div class="category-icon">{{ category.icon }}</div>
              <div class="category-name">{{ category.name }}</div>
              <div class="category-count">{{ getCategoryCount(category.id) }}</div>
            </div>
          </div>
        </div>

        <!-- 右箭头 -->
        <button
          v-if="showRightArrow"
          class="category-nav category-nav-right"
          @click="scrollCategories('right')"
        >
          →
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface Props {
  categories: Category[]
  selectedCategory: string
  getCategoryCount: (categoryId: string) => number
}

interface Emits {
  (e: 'select', categoryId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showLeftArrow = ref(false)
const showRightArrow = ref(false)

const selectCategory = (categoryId: string) => {
  emit('select', categoryId)
}

// 分类滚动
const scrollCategories = (direction: 'left' | 'right') => {
  const container = document.querySelector('.category-scroll')
  if (!container) return

  const scrollAmount = 200
  const currentScroll = container.scrollLeft

  if (direction === 'left') {
    container.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: 'smooth',
    })
  } else {
    container.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  // 监听分类滚动
  nextTick(() => {
    const categoryScroll = document.querySelector('.category-scroll')
    if (categoryScroll) {
      const updateArrows = () => {
        const { scrollLeft, scrollWidth, clientWidth } = categoryScroll
        showLeftArrow.value = scrollLeft > 0
        showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 1
      }

      categoryScroll.addEventListener('scroll', updateArrows)
      window.addEventListener('resize', updateArrows)
      updateArrows()
    }
  })
})
</script>

<style scoped>
/* 分类导航栏 */
.category-section {
  padding: 20px 0;
  background: #ffffff;
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
  gap: 8px;
  padding: 0 20px;
  min-width: max-content;
  align-items: center;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  min-width: 60px;
  position: relative;
  color: #666;
}

.category-item:hover {
  background: #f5f5f5;
  color: #333;
}

.category-item.active {
  background: #f0f9ff;
  color: #0ea5e9;
}

.category-icon {
  font-size: 18px;
  margin-bottom: 2px;
}

.category-name {
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  line-height: 1.2;
}

.category-count {
  font-size: 10px;
  opacity: 0.6;
  font-weight: 400;
}

/* 分类导航箭头 */
.category-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #666;
}

.category-nav:hover {
  background: #f5f5f5;
  border-color: #d1d5db;
}

.category-nav-left {
  left: 8px;
}

.category-nav-right {
  right: 8px;
}
</style>
