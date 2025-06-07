import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, apiUtils } from '../utils/api'

// 用户类型定义
interface User {
  id: string | number
  username: string
  email?: string
  avatar?: string
  role?: string
}

// 定义用户认证Store
export const useUserStore = defineStore('user', () => {
  // 响应式状态
  const currentUser = ref<User | null>(null)
  const isLoggedIn = computed(() => !!currentUser.value)

  // 初始化时从本地存储加载用户信息
  const initializeFromStorage = () => {
    const savedUser = apiUtils.getSavedUserInfo()
    if (savedUser && apiUtils.isLoggedIn()) {
      currentUser.value = savedUser as User
      console.log('用户已从本地存储加载:', savedUser)
    }
  }

  // 登录操作
  const login = async (username: string, password: string, rememberMe: boolean) => {
    try {
      const response = await authAPI.login({
        username,
        password,
        rememberMe,
      })

      const { user, token } = response.data

      // 保存认证信息
      apiUtils.saveAuthInfo(token, user)
      currentUser.value = user

      return { success: true, user }
    } catch (error: any) {
      console.error('登录失败:', error)
      return {
        success: false,
        error: error.response?.data?.message || '登录失败，请检查用户名和密码',
      }
    }
  }

  // 注册操作
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({
        username,
        email,
        password,
      })

      const { user, token } = response.data

      // 保存认证信息
      apiUtils.saveAuthInfo(token, user)
      currentUser.value = user

      return { success: true, user }
    } catch (error: any) {
      console.error('注册失败:', error)
      return {
        success: false,
        error: error.response?.data?.message || '注册失败，请稍后重试',
      }
    }
  }

  // 登出操作
  const logout = () => {
    apiUtils.clearAuthInfo()
    currentUser.value = null
  }

  // 重置密码
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      const response = await authAPI.resetPassword({
        email,
        code,
        newPassword,
      })

      return { success: true, message: response.data.message }
    } catch (error: any) {
      console.error('重置密码失败:', error)
      return {
        success: false,
        error: error.response?.data?.message || '重置密码失败，请稍后重试',
      }
    }
  }

  // 获取当前用户
  const getUser = computed(() => currentUser.value)

  // 返回Store的状态和方法
  return {
    currentUser,
    isLoggedIn,
    getUser,
    login,
    register,
    logout,
    resetPassword,
    initializeFromStorage,
  }
})
