<template>
  <div class="resource-card" :class="{ premium: isPremium }">
    <div class="card-inner">
      <!-- 卡片头部 -->
      <div class="card-header">
        <div class="icon-container">
          <div class="resource-icon">
            <span class="icon">{{ icon }}</span>
          </div>
        </div>
        <div class="badge-container">
          <div class="resource-badge" :class="{ premium: isPremium }">
            <span class="badge-text">{{ isPremium ? '付费' : '免费' }}</span>
          </div>
        </div>
      </div>

      <!-- 卡片内容 -->
      <div class="card-content">
        <h3 class="resource-title">{{ title }}</h3>
        <p class="resource-description">{{ description }}</p>

        <!-- 功能特性 -->
        <div class="features-section" v-if="features && features.length">
          <ul class="feature-list">
            <li v-for="feature in features.slice(0, 3)" :key="feature" class="feature-item">
              <span class="feature-dot"></span>
              <span class="feature-text">{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 卡片底部 -->
      <div class="card-footer">
        <div class="price-section">
          <div v-if="isPremium && price" class="price-info">
            <span class="price-value">{{ price }}</span>
          </div>
          <div v-else class="free-info">
            <span class="free-text">免费使用</span>
          </div>
        </div>

        <button
          class="action-button"
          :class="{ 'premium-btn': isPremium, 'free-btn': !isPremium }"
          @click="handleAction"
        >
          <span>{{ actionText }}</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14m-7-7l7 7-7 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
  isPremium: boolean
  price?: string
  features?: string[]
  actionText?: string
  actionUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  actionText: '了解更多',
  features: () => [],
})

const emit = defineEmits<{
  action: [url?: string]
}>()

const handleAction = () => {
  emit('action', props.actionUrl)
}
</script>

<style scoped>
/* 主卡片容器 */
.resource-card {
  position: relative;
  height: 100%;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.resource-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.4) 0%,
    rgba(34, 197, 94, 0.2) 30%,
    rgba(34, 197, 94, 0.1) 70%,
    rgba(34, 197, 94, 0.05) 100%
  );
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask-composite: xor;
}

.resource-card.premium::before {
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.4) 0%,
    rgba(245, 158, 11, 0.2) 30%,
    rgba(245, 158, 11, 0.1) 70%,
    rgba(245, 158, 11, 0.05) 100%
  );
}

.card-inner {
  height: 100%;
  border-radius: 19px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0.75) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
}

.card-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.9) 50%,
    transparent 100%
  );
}

.resource-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1);
}

.resource-card:hover .card-inner {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 50%,
    rgba(255, 255, 255, 0.8) 100%
  );
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 12px 48px rgba(0, 0, 0, 0.12),
    0 6px 24px rgba(0, 0, 0, 0.06);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.icon-container {
  position: relative;
}

.resource-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34, 197, 94, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 2px 8px rgba(34, 197, 94, 0.1);
}

.resource-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.7) 50%,
    transparent 100%
  );
}

.resource-card.premium .resource-icon {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%);
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 2px 8px rgba(245, 158, 11, 0.1);
}

.resource-icon .icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

.badge-container {
  position: relative;
}

.resource-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.15) 100%);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 2px 6px rgba(34, 197, 94, 0.08);
}

.resource-badge.premium {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 2px 6px rgba(245, 158, 11, 0.08);
}

.badge-text {
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* 卡片内容 */
.card-content {
  flex: 1;
  margin-bottom: 20px;
}

.resource-title {
  font-size: 20px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.resource-description {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.5;
  margin-bottom: 16px;
}

.features-section {
  margin-top: 16px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
}

.feature-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.6);
  flex-shrink: 0;
}

.resource-card.premium .feature-dot {
  background: rgba(245, 158, 11, 0.6);
}

.feature-text {
  line-height: 1.4;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
}

.price-section {
  flex: 1;
}

.price-info {
  display: flex;
  align-items: center;
}

.price-value {
  font-size: 16px;
  font-weight: 700;
  color: rgba(245, 158, 11, 0.8);
  letter-spacing: -0.02em;
}

.free-info {
  display: flex;
  align-items: center;
}

.free-text {
  font-size: 14px;
  color: rgba(34, 197, 94, 0.8);
  font-weight: 600;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  transition: left 0.6s ease;
}

.action-button:hover::before {
  left: 100%;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.action-button:hover .arrow-icon {
  transform: translateX(2px);
}

.free-btn {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.15) 100%);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 2px 6px rgba(34, 197, 94, 0.08);
}

.free-btn:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%);
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 4px 12px rgba(34, 197, 94, 0.12);
}

.premium-btn {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 2px 6px rgba(245, 158, 11, 0.08);
}

.premium-btn:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.2) 100%);
  border-color: rgba(245, 158, 11, 0.4);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 4px 12px rgba(245, 158, 11, 0.12);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-inner {
    padding: 20px;
  }

  .card-header {
    margin-bottom: 16px;
  }

  .resource-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
  }

  .resource-icon .icon {
    font-size: 1.3rem;
  }

  .resource-title {
    font-size: 18px;
  }

  .resource-description {
    font-size: 13px;
  }

  .card-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .action-button {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
  }

  .price-section {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .resource-card {
    border-radius: 20px;
  }

  .card-inner {
    border-radius: 18px;
    padding: 16px;
  }

  .resource-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }

  .resource-icon .icon {
    font-size: 1.2rem;
  }

  .resource-badge {
    padding: 4px 8px;
    font-size: 11px;
  }

  .resource-title {
    font-size: 16px;
  }

  .resource-description {
    font-size: 12px;
  }

  .feature-item {
    font-size: 12px;
  }
}
</style>
