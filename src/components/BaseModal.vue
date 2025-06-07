<script setup lang="ts">
import { ref, onBeforeUnmount, watch, toRef } from 'vue'

// 定义属性
const props = defineProps({
  show: {
    type: [Boolean, Object],
    required: true,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

// 转换show属性为ref
const showRef = toRef(props, 'show')

// 定义事件
const emit = defineEmits(['close'])

// 模态框容器引用
const modalContainer = ref<HTMLElement | null>(null)

// 关闭模态框
const closeModal = () => {
  emit('close')
}

// 处理ESC键关闭
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
  }
}

// 处理点击背景关闭
const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

// 禁用页面滚动
const disableScroll = () => {
  // 保存当前滚动位置
  const scrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.top = `-${scrollY}px`
  document.body.style.overflow = 'hidden'
  document.body.dataset.scrollPosition = scrollY.toString()
}

// 恢复页面滚动
const enableScroll = () => {
  const scrollY = parseInt(document.body.dataset.scrollPosition || '0')
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.top = ''
  document.body.style.overflow = ''
  window.scrollTo(0, scrollY)
}

// 监听show变化，控制滚动行为
watch(showRef, (newValue) => {
  if (newValue) {
    disableScroll()
    setTimeout(() => {
      document.addEventListener('keydown', handleKeyDown)
    }, 100)
  } else {
    enableScroll()
    document.removeEventListener('keydown', handleKeyDown)
  }
})

// 组件卸载前清理
onBeforeUnmount(() => {
  if (showRef.value) {
    enableScroll()
    document.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <Teleport to="#modals">
    <transition name="modal-fade">
      <div v-if="showRef" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-container" ref="modalContainer" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-button modal-button-close" @click="closeModal">关闭</button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 0;
  box-sizing: border-box;
}

.modal-container {
  background-color: white;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: auto;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(34, 197, 94, 0.2);
  background: linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(234, 179, 8, 0.1));
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-primary, #22c55e);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.modal-close:hover {
  color: var(--color-primary, #22c55e);
  background-color: rgba(34, 197, 94, 0.1);
  transform: rotate(90deg);
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  max-height: 60vh;
}

.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(34, 197, 94, 0.2);
  background: linear-gradient(to left, rgba(34, 197, 94, 0.05), rgba(234, 179, 8, 0.05));
}

.modal-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-button-close {
  background: linear-gradient(
    to right,
    var(--color-primary, #22c55e),
    var(--color-secondary, #eab308)
  );
  color: white;
  border: none;
  margin-left: 0.5rem;
}

.modal-button-close:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 自定义滚动条 */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(34, 197, 94, 0.05);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.3);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.5);
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    max-width: 450px;
  }
}
</style>
