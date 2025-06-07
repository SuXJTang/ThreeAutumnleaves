<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '扫描二维码',
  },
  qrCodeImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '请使用微信扫描下方二维码',
  },
})

const emit = defineEmits(['close'])

// 关闭模态框
const closeModal = () => {
  emit('close')
}

// 处理点击背景关闭
const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

// 禁用页面滚动
const disableScroll = () => {
  document.body.style.overflow = 'hidden'
}

// 恢复页面滚动
const enableScroll = () => {
  document.body.style.overflow = ''
}

// 监听show变化
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      disableScroll()
      document.addEventListener('keydown', handleKeyDown)
    } else {
      enableScroll()
      document.removeEventListener('keydown', handleKeyDown)
    }
  },
)

// 处理ESC键关闭
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">{{ description }}</p>
          <div class="qrcode-wrapper">
            <img :src="qrCodeImage" :alt="title" class="qrcode-image" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: scale-in 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(34, 197, 94, 0.2);
  background: linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(234, 179, 8, 0.1));
}

.modal-title {
  margin: 0;
  color: #22c55e;
  font-size: 22px;
  font-weight: bold;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 25px;
  text-align: center;
}

.modal-description {
  margin-bottom: 20px;
  color: #666;
  font-size: 16px;
}

.qrcode-wrapper {
  margin: 0 auto;
  width: 90%;
  max-width: 350px;
  padding: 20px;
  border: 2px dashed #eab308;
  border-radius: 8px;
  animation: float 4s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.qrcode-wrapper::after {
  content: '';
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  animation: shine 3s ease-in-out infinite;
}

.qrcode-image {
  width: 100%;
  height: auto;
  display: block;
}

.modal-footer {
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(34, 197, 94, 0.2);
}

.modal-button {
  background: linear-gradient(to right, #22c55e, #eab308);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 25px;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
}

.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(34, 197, 94, 0.3);
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  20%,
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-width: 400px;
  }

  .qrcode-wrapper {
    width: 90%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 95%;
    max-width: 350px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-body {
    padding: 20px 15px;
  }

  .qrcode-wrapper {
    width: 100%;
    max-width: 280px;
    padding: 15px;
  }

  .modal-button {
    padding: 8px 20px;
  }
}
</style>
