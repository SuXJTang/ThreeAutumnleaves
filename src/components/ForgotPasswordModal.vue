<template>
  <div v-if="props.isVisible" class="forgot-password-modal-overlay" @click="closeModal">
    <div class="forgot-password-modal" @click.stop>
      <div class="forgot-password-header">
        <h2 class="forgot-password-title">
          {{ currentStep === 'email' ? '忘记密码' : '重置密码' }}
        </h2>
        <button class="close-btn" @click="closeModal">
          <span>&times;</span>
        </button>
      </div>

      <!-- 第一步：输入邮箱 -->
      <form
        v-if="currentStep === 'email'"
        @submit.prevent="handleSendCode"
        class="forgot-password-form"
      >
        <div class="step-indicator">
          <div class="step active">1</div>
          <div class="step-line"></div>
          <div class="step">2</div>
          <div class="step-line"></div>
          <div class="step">3</div>
        </div>

        <div class="form-description">
          <p>请输入您的邮箱地址，我们将向您发送验证码</p>
        </div>

        <div class="form-group">
          <label for="forgot-email" class="form-label">邮箱地址</label>
          <input
            id="forgot-email"
            v-model="forgotForm.email"
            type="email"
            class="form-input"
            placeholder="请输入注册时使用的邮箱"
            required
          />
        </div>

        <button type="submit" class="forgot-submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '发送中...' : '发送验证码' }}
        </button>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <!-- 第二步：输入验证码 -->
      <form
        v-if="currentStep === 'code'"
        @submit.prevent="handleVerifyCode"
        class="forgot-password-form"
      >
        <div class="step-indicator">
          <div class="step completed">✓</div>
          <div class="step-line completed"></div>
          <div class="step active">2</div>
          <div class="step-line"></div>
          <div class="step">3</div>
        </div>

        <div class="form-description">
          <p>
            验证码已发送至 <strong>{{ maskEmail(forgotForm.email) }}</strong>
          </p>
          <p class="countdown-text">{{ countdownText }}</p>
        </div>

        <div class="form-group">
          <label for="verification-code" class="form-label">验证码</label>
          <input
            id="verification-code"
            v-model="forgotForm.code"
            type="text"
            class="form-input code-input"
            placeholder="请输入6位验证码"
            maxlength="6"
            required
          />
        </div>

        <button type="submit" class="forgot-submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '验证中...' : '验证验证码' }}
        </button>

        <div class="resend-section">
          <button
            type="button"
            class="resend-btn"
            :disabled="countdown > 0"
            @click="handleResendCode"
          >
            {{ countdown > 0 ? `${countdown}秒后重发` : '重新发送' }}
          </button>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <!-- 第三步：重置密码 -->
      <form
        v-if="currentStep === 'reset'"
        @submit.prevent="handleResetPassword"
        class="forgot-password-form"
      >
        <div class="step-indicator">
          <div class="step completed">✓</div>
          <div class="step-line completed"></div>
          <div class="step completed">✓</div>
          <div class="step-line completed"></div>
          <div class="step active">3</div>
        </div>

        <div class="form-description">
          <p>请设置您的新密码</p>
        </div>

        <div class="form-group">
          <label for="new-password" class="form-label">新密码</label>
          <input
            id="new-password"
            v-model="forgotForm.newPassword"
            type="password"
            class="form-input"
            placeholder="请输入新密码（至少6位）"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirm-new-password" class="form-label">确认新密码</label>
          <input
            id="confirm-new-password"
            v-model="forgotForm.confirmPassword"
            type="password"
            class="form-input"
            placeholder="请再次输入新密码"
            required
          />
        </div>

        <button type="submit" class="forgot-submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '重置中...' : '重置密码' }}
        </button>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </form>

      <div class="forgot-password-footer">
        <p>想起密码了？ <a href="#" class="login-link" @click="switchToLogin">立即登录</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue'
import { authAPI } from '../utils/api'

// Props
interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  switchToLogin: []
  resetSuccess: []
}>()

// 响应式数据
const currentStep = ref<'email' | 'code' | 'reset'>('email')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const countdown = ref(0)
let countdownTimer: number | null = null

const forgotForm = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
})

// 计算属性
const countdownText = computed(() => {
  if (countdown.value > 0) {
    return `验证码将在 ${countdown.value} 秒后过期`
  }
  return '验证码有效期为5分钟'
})

// 邮箱掩码显示
const maskEmail = (email: string) => {
  if (!email) return ''
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  const maskedUsername =
    username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
  return `${maskedUsername}@${domain}`
}

// 开始倒计时
const startCountdown = (seconds: number = 60) => {
  countdown.value = seconds
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      countdownTimer = null
    }
  }, 1000)
}

// 关闭模态框
const closeModal = () => {
  emit('close')
  resetForm()
}

// 重置表单
const resetForm = () => {
  currentStep.value = 'email'
  forgotForm.email = ''
  forgotForm.code = ''
  forgotForm.newPassword = ''
  forgotForm.confirmPassword = ''
  errorMessage.value = ''
  successMessage.value = ''
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

// 切换到登录
const switchToLogin = () => {
  emit('switchToLogin')
}

// 发送验证码
const handleSendCode = async () => {
  if (!forgotForm.email) {
    errorMessage.value = '请输入邮箱地址'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotForm.email)) {
    errorMessage.value = '请输入有效的邮箱地址'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authAPI.sendResetCode({ email: forgotForm.email })
    currentStep.value = 'code'
    startCountdown(60)
  } catch (error: any) {
    if (error.response) {
      errorMessage.value = error.response.data.message || '发送验证码失败'
    } else {
      errorMessage.value = '网络连接失败，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}

// 重新发送验证码
const handleResendCode = async () => {
  await handleSendCode()
}

// 验证验证码
const handleVerifyCode = async () => {
  if (!forgotForm.code || forgotForm.code.length !== 6) {
    errorMessage.value = '请输入6位验证码'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authAPI.verifyResetCode({
      email: forgotForm.email,
      code: forgotForm.code,
    })
    currentStep.value = 'reset'
  } catch (error: any) {
    if (error.response) {
      errorMessage.value = error.response.data.message || '验证码错误或已过期'
    } else {
      errorMessage.value = '网络连接失败，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}

// 重置密码
const handleResetPassword = async () => {
  if (!forgotForm.newPassword || forgotForm.newPassword.length < 6) {
    errorMessage.value = '密码长度至少为6位'
    return
  }

  if (forgotForm.newPassword !== forgotForm.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authAPI.resetPassword({
      email: forgotForm.email,
      code: forgotForm.code,
      newPassword: forgotForm.newPassword,
    })

    successMessage.value = '密码重置成功！'

    setTimeout(() => {
      emit('resetSuccess')
      closeModal()
    }, 2000)
  } catch (error: any) {
    if (error.response) {
      errorMessage.value = error.response.data.message || '密码重置失败'
    } else {
      errorMessage.value = '网络连接失败，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
/* 继承登录模态框的基础样式 */
.forgot-password-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(12px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.forgot-password-modal {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.98) 25%,
    rgba(255, 255, 255, 0.95) 50%,
    rgba(248, 250, 252, 0.98) 75%,
    rgba(255, 255, 255, 0.95) 100%
  );
  background-size: 300% 300%;
  border-radius: var(--border-radius-xl);
  box-shadow:
    0 25px 80px rgba(34, 197, 94, 0.2),
    0 15px 40px rgba(0, 0, 0, 0.15),
    0 5px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(34, 197, 94, 0.1);
  width: 100%;
  max-width: 450px;
  margin: var(--spacing-md);
  animation:
    slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    cardGlow 4s ease-in-out infinite;
  border: 2px solid transparent;
  background-clip: padding-box;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.forgot-password-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(34, 197, 94, 0.15),
    rgba(74, 222, 128, 0.1),
    rgba(234, 179, 8, 0.15),
    transparent
  );
  animation: modalShimmer 4s ease-in-out infinite;
  z-index: 1;
}

.forgot-password-modal::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(
    45deg,
    rgba(34, 197, 94, 0.4) 0%,
    rgba(74, 222, 128, 0.3) 25%,
    rgba(234, 179, 8, 0.4) 50%,
    rgba(250, 204, 21, 0.3) 75%,
    rgba(34, 197, 94, 0.4) 100%
  );
  background-size: 400% 400%;
  border-radius: calc(var(--border-radius-xl) + 3px);
  z-index: -1;
  animation: borderGlow 5s ease-in-out infinite;
  filter: blur(1px);
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-30px) scale(0.9) rotateX(10deg);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02) rotateX(0deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes cardGlow {
  0%,
  100% {
    background-position: 0% 50%;
    box-shadow:
      0 25px 80px rgba(34, 197, 94, 0.2),
      0 15px 40px rgba(0, 0, 0, 0.15),
      0 5px 20px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      inset 0 -1px 0 rgba(34, 197, 94, 0.1);
  }
  50% {
    background-position: 100% 50%;
    box-shadow:
      0 30px 90px rgba(34, 197, 94, 0.25),
      0 20px 50px rgba(0, 0, 0, 0.2),
      0 8px 25px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 1),
      inset 0 -1px 0 rgba(34, 197, 94, 0.15);
  }
}

@keyframes modalShimmer {
  0% {
    left: -100%;
    opacity: 0;
  }
  50% {
    left: 50%;
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes borderGlow {
  0%,
  100% {
    background-position: 0% 50%;
    opacity: 0.7;
    transform: scale(1);
  }
  25% {
    background-position: 100% 25%;
    opacity: 0.9;
    transform: scale(1.01);
  }
  50% {
    background-position: 50% 100%;
    opacity: 1;
    transform: scale(1.02);
  }
  75% {
    background-position: 25% 0%;
    opacity: 0.9;
    transform: scale(1.01);
  }
}

/* 忘记密码模态框特有样式 */
.forgot-password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.forgot-password-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--color-background-secondary);
  color: var(--color-text);
}

.forgot-password-form {
  padding: var(--spacing-lg) var(--spacing-xl);
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-sm);
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
}

.step.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

.step.completed {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.step-line {
  width: 40px;
  height: 2px;
  background: var(--color-border);
  transition: all 0.3s ease;
}

.step-line.completed {
  background: var(--color-primary);
}

/* 表单描述 */
.form-description {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.form-description p {
  margin: var(--spacing-xs) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.form-description strong {
  color: var(--color-text);
  font-weight: 600;
}

.countdown-text {
  font-size: var(--font-size-xs) !important;
  color: var(--color-primary) !important;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.form-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: all 0.3s ease;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%);
  color: var(--color-text);
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow:
    0 2px 10px rgba(34, 197, 94, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow:
    0 0 0 3px rgba(34, 197, 94, 0.15),
    0 4px 20px rgba(34, 197, 94, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 1) 100%);
  transform: translateY(-1px);
}

.form-input:hover {
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow:
    0 2px 15px rgba(34, 197, 94, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.code-input {
  text-align: center;
  font-size: var(--font-size-lg);
  letter-spacing: 0.5em;
  font-weight: 600;
}

.forgot-submit-btn {
  width: 100%;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 50%,
    var(--color-primary) 100%
  );
  background-size: 200% 200%;
  color: white;
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  box-shadow:
    0 4px 20px rgba(34, 197, 94, 0.3),
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: buttonGradient 3s ease-in-out infinite;
  margin-bottom: var(--spacing-md);
}

.forgot-submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.forgot-submit-btn:hover::before {
  left: 100%;
}

.forgot-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background-position: 100% 0%;
  box-shadow:
    0 6px 25px rgba(34, 197, 94, 0.4),
    0 4px 15px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

@keyframes buttonGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.forgot-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 重发验证码区域 */
.resend-section {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.resend-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.resend-btn:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-primary-hover);
}

.resend-btn:disabled {
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.success-message {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.forgot-password-footer {
  padding: var(--spacing-md) var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.forgot-password-footer p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.login-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
  cursor: pointer;
}

.login-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .forgot-password-modal {
    margin: var(--spacing-sm);
    max-width: none;
  }

  .forgot-password-header,
  .forgot-password-form,
  .forgot-password-footer {
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
  }

  .step-indicator {
    gap: var(--spacing-xs);
  }

  .step {
    width: 28px;
    height: 28px;
    font-size: var(--font-size-xs);
  }

  .step-line {
    width: 30px;
  }

  .code-input {
    letter-spacing: 0.3em;
  }
}
</style>
