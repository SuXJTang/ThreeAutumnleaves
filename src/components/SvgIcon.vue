<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadIconFont } from '@/utils/iconfont'
import { getFallbackIcon } from '@/utils/fallback-icons'

const svgLoaded = ref(false)
const svgError = ref(false)
const useFallback = ref(false)

const props = defineProps({
  // 图标名称，需要包含前缀 'icon-'
  name: {
    type: String,
    required: true,
  },
  // 图标颜色
  color: {
    type: String,
    default: '',
  },
  // 图标尺寸
  size: {
    type: String,
    default: '1em',
  },
  // 图标库URL
  scriptUrl: {
    type: String,
    default: 'https://at.alicdn.com/t/c/font_4942439_zvzb6m54i8.js',
  },
  // 备用图标 (Unicode字符)
  fallback: {
    type: String,
    default: '',
  },
})

// 获取备用Unicode图标
const getFallbackIcon = computed(() => {
  if (props.fallback) return props.fallback

  // 根据图标名称提供默认的备用图标
  const iconName = props.name.toLowerCase()
  if (iconName.includes('github')) return '🐙'
  if (iconName.includes('qq')) return '🐧'
  if (iconName.includes('weixin') || iconName.includes('wechat')) return '💬'
  if (iconName.includes('mail') || iconName.includes('email')) return '📧'
  if (iconName.includes('phone') || iconName.includes('mobile') || iconName.includes('shouji'))
    return '📱'
  if (iconName.includes('pc') || iconName.includes('computer')) return '💻'
  if (iconName.includes('mac')) return '🖥️'

  return '🔍' // 默认图标
})

// 获取备用图标内容
const fallbackIconContent = computed(() => {
  const cleanName = props.name.replace(/^icon-/, '').replace(/^#/, '')
  return getFallbackIcon(cleanName)
})

// 确保图标库加载
onMounted(async () => {
  // 如果有备用图标，优先使用备用图标（因为当前阿里图标库为空）
  if (fallbackIconContent.value) {
    console.log(`图标 ${props.name} 使用备用SVG图标`)
    useFallback.value = true
    return
  }

  if (props.scriptUrl) {
    try {
      await loadIconFont(props.scriptUrl)
      svgLoaded.value = true

      // 检查图标是否真的存在
      setTimeout(() => {
        const svgElement = document.querySelector(`#${iconName.value.replace('#', '')}`)
        if (!svgElement && fallbackIconContent.value) {
          console.warn(`图标 ${props.name} 在图标库中不存在，使用备用图标`)
          useFallback.value = true
        }
      }, 100)
    } catch (error) {
      console.error('Failed to load IconFont script:', error)
      svgError.value = true
      // 如果有备用图标，使用备用图标
      if (fallbackIconContent.value) {
        useFallback.value = true
      }
    }
  }
})

// 图标名称，如果用户提供的名称没有包含icon-前缀，则自动添加
const iconName = computed(() => {
  // 移除井号前缀，确保使用正确的格式
  const name = props.name.startsWith('icon-') ? props.name : `icon-${props.name}`
  return `#${name}`
})

// 图标样式
const iconStyle = computed(() => {
  return {
    width: props.size,
    height: props.size,
    fill: props.color || 'currentColor',
    overflow: 'hidden',
  }
})

// 备用图标样式
const fallbackStyle = computed(() => {
  return {
    fontSize: props.size,
    color: props.color || 'currentColor',
    lineHeight: '1',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

// 控制台输出调试信息
onMounted(() => {
  console.log(`SvgIcon: 尝试加载图标 ${props.name}，完整引用: ${iconName.value}`)
})
</script>

<template>
  <span class="icon-container">
    <!-- 使用备用SVG图标 -->
    <span
      v-if="useFallback && fallbackIconContent"
      v-html="fallbackIconContent"
      class="fallback-svg"
      :style="iconStyle"
    ></span>
    <!-- 阿里图标库SVG图标 -->
    <svg v-else-if="svgLoaded && !svgError" class="svg-icon" aria-hidden="true" :style="iconStyle">
      <use :xlink:href="iconName" />
    </svg>
    <!-- Unicode备用图标 -->
    <span v-else-if="props.fallback" class="fallback-icon" :style="fallbackStyle">
      {{ props.fallback }}
    </span>
    <!-- 默认占位符 -->
    <span v-else class="icon-placeholder" :style="fallbackStyle">?</span>
  </span>
</template>

<style scoped>
.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.svg-icon {
  vertical-align: middle;
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}

.fallback-icon {
  vertical-align: middle;
}

.fallback-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.fallback-svg svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.icon-placeholder {
  vertical-align: middle;
  opacity: 0.5;
}
</style>
