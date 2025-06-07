<template>
  <div v-if="props.isVisible" class="login-modal-overlay" @click="closeModal">
    <div class="login-modal" @click.stop>
      <div class="login-header">
        <h2 class="login-title">登录</h2>
        <button class="close-btn" @click="closeModal">
          <span>&times;</span>
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            class="form-input"
            placeholder="请输入用户名"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            class="form-input"
            placeholder="请输入密码"
            required
          />
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input v-model="loginForm.rememberMe" type="checkbox" class="checkbox" />
            <span class="checkbox-text">记住我</span>
          </label>
          <a href="#" class="forgot-password" @click="switchToForgotPassword">忘记密码？</a>
        </div>

        <button type="submit" class="login-submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '登录中...' : '登录' }}
        </button>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </form>

      <div class="login-footer">
        <p>还没有账号？ <a href="#" class="register-link" @click="switchToRegister">立即注册</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authAPI, apiUtils } from '../utils/api'

// Props
interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  loginSuccess: [user: any]
  switchToRegister: []
  switchToForgotPassword: []
}>()

// 响应式数据
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

// 关闭模态框
const closeModal = () => {
  emit('close')
  resetForm()
}

// 重置表单
const resetForm = () => {
  loginForm.username = ''
  loginForm.password = ''
  loginForm.rememberMe = false
  errorMessage.value = ''
  successMessage.value = ''
}

// 切换到注册
const switchToRegister = () => {
  emit('switchToRegister')
}

// 切换到忘记密码
const switchToForgotPassword = () => {
  emit('switchToForgotPassword')
}

// 处理登录
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    errorMessage.value = '请填写完整的登录信息'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // 使用我们的API工具进行登录
    const response = await authAPI.login({
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: loginForm.rememberMe,
    })

    // 登录成功
    const { user, token } = response.data

    // 保存认证信息
    apiUtils.saveAuthInfo(token, user)

    successMessage.value = '登录成功！'

    // 延迟后关闭模态框并触发成功事件
    setTimeout(() => {
      emit('loginSuccess', user)
      closeModal()
    }, 1500)
  } catch (error: any) {
    // 处理登录错误
    if (error.response) {
      // 服务器返回错误状态码
      errorMessage.value = error.response.data.message || '登录失败，请检查用户名和密码'
    } else if (error.request) {
      // 网络错误
      errorMessage.value = '网络连接失败，请检查网络连接'
    } else {
      // 其他错误
      errorMessage.value = '登录过程中发生错误，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-modal-overlay {
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

/* 移除背景复杂动效，使用简洁的毛玻璃效果 */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 移除背景动画，专注于卡片动效 */

.login-modal {
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
  max-width: 400px;
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

.login-modal::before {
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

.login-modal::after {
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

.login-header {
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

.login-title {
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

.login-form {
  padding: var(--spacing-lg) var(--spacing-xl);
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.checkbox {
  margin-right: var(--spacing-sm);
  accent-color: var(--color-primary);
}

.checkbox-text {
  color: var(--color-text-secondary);
}

.forgot-password {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.login-submit-btn {
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
}

.login-submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.login-submit-btn:hover::before {
  left: 100%;
}

.login-submit-btn:hover:not(:disabled) {
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

.login-submit-btn:disabled {
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

.login-footer {
  padding: var(--spacing-md) var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  text-align: center;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* 移除测试账号相关样式 */

.login-footer p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.register-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-modal {
    margin: var(--spacing-sm);
    max-width: none;
  }

  .login-header,
  .login-form,
  .login-footer {
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
  }

  .form-options {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
}
</style>
