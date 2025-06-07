<script setup lang="ts">
import { ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { ICON_FONT_URL } from '@/utils/icon-config'

// 联系方式数据
const contacts = ref([
  {
    icon: 'qq',
    text: '1557003690@qq.com',
    color: '#12B7F5',
    title: 'QQ邮箱',
  },
  {
    icon: 'weixin',
    text: 'ABC1557003690',
    color: '#07C160',
    title: '微信',
  },
])
</script>

<template>
  <div class="contact-icons">
    <div v-for="contact in contacts" :key="contact.icon" class="contact-item">
      <SvgIcon
        :name="contact.icon"
        :color="contact.color"
        size="18px"
        :scriptUrl="ICON_FONT_URL"
        class="contact-icon"
      />
      <span class="contact-text">{{ contact.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.contact-icons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-icon {
  flex-shrink: 0;
}

.contact-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}
</style>
