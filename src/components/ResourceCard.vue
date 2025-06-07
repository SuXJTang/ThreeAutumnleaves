<template>
  <div class="resource-card" :class="{ 'premium': isPremium }">
    <div class="card-header">
      <div class="resource-icon">
        <span class="icon">{{ icon }}</span>
      </div>
      <div class="resource-badge" v-if="isPremium">
        <span class="badge-text">付费</span>
      </div>
      <div class="resource-badge free" v-else>
        <span class="badge-text">免费</span>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="resource-title">{{ title }}</h3>
      <p class="resource-description">{{ description }}</p>
      
      <div class="resource-features" v-if="features && features.length">
        <ul class="feature-list">
          <li v-for="feature in features" :key="feature" class="feature-item">
            <span class="feature-icon">✓</span>
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="resource-price" v-if="isPremium">
        <span class="price-text">{{ price }}</span>
      </div>
      <button 
        class="action-button" 
        :class="{ 'premium-button': isPremium, 'free-button': !isPremium }"
        @click="handleAction"
      >
        {{ actionText }}
      </button>
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
  features: () => []
})

const emit = defineEmits<{
  action: [url?: string]
}>()

const handleAction = () => {
  emit('action', props.actionUrl)
}
</script>

<style scoped>
.resource-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.resource-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.resource-card.premium::before {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.resource-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.resource-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
}

.resource-card.premium .resource-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
}

.resource-icon .icon {
  font-size: 1.5rem;
}

.resource-badge {
  padding: 4px 12px;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.resource-badge.free {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.card-content {
  flex: 1;
  margin-bottom: var(--spacing-lg);
}

.resource-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
}

.resource-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.resource-features {
  margin-top: var(--spacing-md);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.feature-icon {
  color: #22c55e;
  font-weight: bold;
  font-size: 0.8rem;
}

.resource-card.premium .feature-icon {
  color: #f59e0b;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.resource-price {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #f59e0b;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.free-button {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.free-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
}

.premium-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.premium-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resource-card {
    padding: var(--spacing-md);
  }
  
  .resource-icon {
    width: 50px;
    height: 50px;
  }
  
  .resource-icon .icon {
    font-size: 1.2rem;
  }
  
  .resource-title {
    font-size: var(--font-size-lg);
  }
  
  .card-footer {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .action-button {
    width: 100%;
  }
}
</style>
