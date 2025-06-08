<template>
  <div class="user-orders-page">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <button @click="goBack" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M12 19L5 12L12 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        返回
      </button>
    </div>

    <div class="orders-container">
      <h1 class="page-title">我的订单</h1>

      <!-- 订单筛选 -->
      <div class="filter-section">
        <div class="filter-tabs">
          <button
            v-for="status in orderStatuses"
            :key="status.value"
            @click="currentFilter = status.value"
            :class="['filter-tab', { active: currentFilter === status.value }]"
          >
            {{ status.label }}
            <span v-if="getOrderCount(status.value) > 0" class="count-badge">
              {{ getOrderCount(status.value) }}
            </span>
          </button>
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="orders-list">
        <div v-if="filteredOrders.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>暂无订单</h3>
          <p>{{ getEmptyMessage() }}</p>
          <router-link to="/ai-agent" class="browse-btn">去逛逛</router-link>
        </div>

        <div v-else class="order-cards">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <h3 class="order-number">订单号：{{ order.orderNumber }}</h3>
                <p class="order-date">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="order-status" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </div>
            </div>

            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <div class="item-image">
                  <img v-if="item.image" :src="item.image" :alt="item.name" />
                  <div v-else class="default-image">{{ item.name.charAt(0) }}</div>
                </div>

                <div class="item-details">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-description">{{ item.description }}</p>
                  <div class="item-meta">
                    <span class="item-price">¥{{ item.price }}</span>
                    <span class="item-quantity">x{{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <span class="total-label">订单总额：</span>
                <span class="total-amount">¥{{ order.totalAmount }}</span>
              </div>

              <div class="order-actions">
                <button
                  v-if="order.status === 'pending'"
                  @click="payOrder(order)"
                  class="action-btn pay-btn"
                >
                  立即支付
                </button>

                <button
                  v-if="order.status === 'paid'"
                  @click="downloadOrder(order)"
                  class="action-btn download-btn"
                >
                  下载资源
                </button>

                <button
                  v-if="order.status === 'pending'"
                  @click="cancelOrder(order)"
                  class="action-btn cancel-btn"
                >
                  取消订单
                </button>

                <button @click="viewOrderDetail(order)" class="action-btn detail-btn">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore && filteredOrders.length > 0" class="load-more-section">
        <button @click="loadMoreOrders" :disabled="isLoading" class="load-more-btn">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 订单状态定义
const orderStatuses = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待支付' },
  { value: 'paid', label: '已支付' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
]

// 订单项类型定义
interface OrderItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image: string | null
}

// 订单类型定义
interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

// 状态管理
const orders = ref<Order[]>([])
const currentFilter = ref('all')
const isLoading = ref(false)
const hasMore = ref(true)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 计算属性
const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order) => order.status === currentFilter.value)
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取订单数量
const getOrderCount = (status: string) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter((order) => order.status === status).length
}

// 获取空状态消息
const getEmptyMessage = () => {
  const messages: Record<string, string> = {
    all: '您还没有任何订单',
    pending: '没有待支付的订单',
    paid: '没有已支付的订单',
    completed: '没有已完成的订单',
    cancelled: '没有已取消的订单',
  }
  return messages[currentFilter.value] || '暂无订单'
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    pending: 'status-pending',
    paid: 'status-paid',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
  }
  return classMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    completed: '已完成',
    cancelled: '已取消',
  }
  return textMap[status] || status
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// 支付订单
const payOrder = (order: Order) => {
  console.log(`正在处理订单 ${order.orderNumber} 的支付`)
  // TODO: 实现支付功能
  showMessage(`正在跳转到支付页面...`)
}

// 下载订单
const downloadOrder = (order: Order) => {
  // TODO: 实现下载功能
  showMessage(`开始下载订单 ${order.orderNumber} 的资源`)
}

// 取消订单
const cancelOrder = (order: Order) => {
  if (confirm('确定要取消这个订单吗？')) {
    // TODO: 调用API取消订单
    order.status = 'cancelled'
    showMessage('订单已取消')
  }
}

// 查看订单详情
const viewOrderDetail = (order: Order) => {
  // TODO: 跳转到订单详情页面
  console.log(`查看订单详情: ${order.orderNumber}`)
  router.push(`/user/orders/${order.id}`)
}

// 加载订单数据
const loadOrders = async () => {
  isLoading.value = true

  try {
    // TODO: 从API获取订单数据
    // 这里使用模拟数据
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD20241201001',
        status: 'paid',
        totalAmount: 99,
        createdAt: '2024-12-01T10:30:00Z',
        items: [
          {
            id: '1',
            name: 'AI写作大师',
            description: '专业的AI写作工具，提升写作效率',
            price: 99,
            quantity: 1,
            image: null,
          },
        ],
      },
      {
        id: '2',
        orderNumber: 'ORD20241130002',
        status: 'completed',
        totalAmount: 199,
        createdAt: '2024-11-30T15:20:00Z',
        items: [
          {
            id: '2',
            name: 'AI设计套件',
            description: '全套AI设计工具包',
            price: 199,
            quantity: 1,
            image: null,
          },
        ],
      },
      {
        id: '3',
        orderNumber: 'ORD20241129003',
        status: 'pending',
        totalAmount: 149,
        createdAt: '2024-11-29T09:15:00Z',
        items: [
          {
            id: '3',
            name: 'AI编程助手',
            description: '智能代码生成和优化工具',
            price: 149,
            quantity: 1,
            image: null,
          },
        ],
      },
    ]

    orders.value = mockOrders
    hasMore.value = false
  } catch (error: unknown) {
    showMessage('加载订单失败，请稍后重试', 'error')
    console.error('加载订单出错:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载更多订单
const loadMoreOrders = async () => {
  // TODO: 实现分页加载
  showMessage('暂无更多订单')
  hasMore.value = false
}

onMounted(() => {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    router.push('/')
    return
  }

  loadOrders()
})
</script>

<style scoped>
.user-orders-page {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
  position: relative;
}

.back-button-container {
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: none;
  color: var(--color-primary);
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    5px 5px 10px rgba(0, 0, 0, 0.05),
    -5px -5px 10px rgba(255, 255, 255, 0.8);
}

.back-button:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow:
    7px 7px 15px rgba(0, 0, 0, 0.05),
    -7px -7px 15px rgba(255, 255, 255, 0.9);
}

.orders-container {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  color: var(--color-text);
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.filter-section {
  background: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.filter-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-tab {
  background: #f5f5f5;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-tab:hover {
  background: #e0e0e0;
}

.filter-tab.active {
  background: var(--color-primary);
  color: white;
}

.count-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.filter-tab.active .count-badge {
  background: rgba(255, 255, 255, 0.3);
}

.empty-state {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 30px;
}

.browse-btn {
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
}

.browse-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 7px 7px 15px rgba(0, 0, 0, 0.15);
}

.order-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  border: none;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow:
    10px 10px 20px rgba(0, 0, 0, 0.08),
    -10px -10px 20px rgba(255, 255, 255, 1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e1e5e9;
}

.order-number {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 5px 0;
}

.order-date {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.order-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-paid {
  background: #d1ecf1;
  color: #0c5460;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.item-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.item-price {
  font-size: 16px;
  font-weight: bold;
  color: #667eea;
}

.item-quantity {
  font-size: 14px;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e1e5e9;
}

.total-label {
  font-size: 16px;
  color: #666;
}

.total-amount {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.order-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pay-btn {
  background: #4caf50;
  color: white;
}

.pay-btn:hover {
  background: #45a049;
}

.download-btn {
  background: #2196f3;
  color: white;
}

.download-btn:hover {
  background: #1976d2;
}

.cancel-btn {
  background: #f44336;
  color: white;
}

.cancel-btn:hover {
  background: #d32f2f;
}

.detail-btn {
  background: var(--color-primary);
  color: white;
}

.detail-btn:hover {
  background: var(--color-primary-hover);
}

.load-more-section {
  text-align: center;
  margin-top: 30px;
}

.load-more-btn {
  background: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  box-shadow:
    5px 5px 10px rgba(0, 0, 0, 0.05),
    -5px -5px 10px rgba(255, 255, 255, 0.8);
}

.load-more-btn:hover:not(:disabled) {
  background: white;
  transform: translateY(-2px);
  box-shadow:
    7px 7px 15px rgba(0, 0, 0, 0.08),
    -7px -7px 15px rgba(255, 255, 255, 0.9);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 12px;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #4caf50;
  color: white;
}

.message.error {
  background: #f44336;
  color: white;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .order-footer {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .order-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .filter-tabs {
    justify-content: center;
  }
}
</style>
