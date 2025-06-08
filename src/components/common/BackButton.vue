<template>
  <button @click="handleClick" class="back-button" :class="{ 'icon-only': iconOnly }">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
    <span v-if="!iconOnly">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  // 按钮文本
  text: {
    type: String,
    default: '返回',
  },
  // 是否只显示图标
  iconOnly: {
    type: Boolean,
    default: false,
  },
  // 返回的路径，如果提供则使用router.push
  to: {
    type: [String, Object],
    default: null,
  },
})

const emit = defineEmits(['click'])

import { useRouter } from 'vue-router'
const router = useRouter()

// 处理点击事件
const handleClick = () => {
  emit('click')

  if (props.to) {
    router.push(props.to)
  } else {
    router.back()
  }
}
</script>

<style scoped>
.back-button {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: white;
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 500;
}

.back-button.icon-only {
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 50%;
  justify-content: center;
}

.back-button:hover {
  background: #4caf50; /* 生机绿 */
  color: white;
  border-color: #4caf50;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.25);
}

.back-button svg {
  width: 20px;
  height: 20px;
  color: #4caf50; /* 生机绿 */
  transition: all 0.3s ease;
}

.back-button:not(.icon-only) svg {
  margin-right: 8px;
}

.back-button:hover svg {
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .back-button:not(.icon-only) {
    padding: 8px 12px;
    font-size: 13px;
  }

  .back-button svg {
    width: 18px;
    height: 18px;
  }
}
</style>
