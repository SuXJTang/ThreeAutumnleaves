import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('发送请求:', config.method?.toUpperCase(), config.url)

    // 如果有token，添加到请求头
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('收到响应:', response.status, response.data)
    return response
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应错误:', error.response?.status, error.response?.data)

    // 处理常见的HTTP错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('authToken')
          localStorage.removeItem('userInfo')
          break
        case 403:
          // 禁止访问
          console.error('访问被禁止')
          break
        case 404:
          // 资源不存在
          console.error('请求的资源不存在')
          break
        case 500:
          // 服务器内部错误
          console.error('服务器内部错误')
          break
        default:
          console.error('请求失败:', error.response.data?.message || '未知错误')
      }
    } else if (error.request) {
      // 网络错误
      console.error('网络连接失败，请检查网络连接')
    }

    return Promise.reject(error)
  },
)

// 模拟API响应（用于开发环境）
const mockApiResponse = (url: string, data: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === '/api/login') {
        // 模拟登录API
        const { username, password } = data

        if (username === 'admin' && password === '123456') {
          resolve({
            data: {
              success: true,
              message: '登录成功',
              user: {
                id: 1,
                username: 'admin',
                email: 'admin@example.com',
                avatar: '🍂',
                role: 'admin',
              },
              token: 'mock-jwt-token-' + Date.now(),
            },
          })
        } else if (username === 'user' && password === '123456') {
          resolve({
            data: {
              success: true,
              message: '登录成功',
              user: {
                id: 2,
                username: 'user',
                email: 'user@example.com',
                avatar: '🌿',
                role: 'user',
              },
              token: 'mock-jwt-token-' + Date.now(),
            },
          })
        } else {
          reject({
            response: {
              status: 401,
              data: {
                success: false,
                message: '用户名或密码错误',
              },
            },
          })
        }
      } else if (url === '/api/register') {
        // 模拟注册API
        const { username, email, password } = data

        // 模拟用户名已存在的情况
        if (username === 'admin' || username === 'user') {
          reject({
            response: {
              status: 409,
              data: {
                success: false,
                message: '用户名已存在，请选择其他用户名',
              },
            },
          })
          return
        }

        // 模拟邮箱已存在的情况
        if (email === 'admin@example.com' || email === 'user@example.com') {
          reject({
            response: {
              status: 409,
              data: {
                success: false,
                message: '邮箱已被注册，请使用其他邮箱',
              },
            },
          })
          return
        }

        // 注册成功
        resolve({
          data: {
            success: true,
            message: '注册成功',
            user: {
              id: Date.now(),
              username: username,
              email: email,
              avatar: '🌱',
              role: 'user',
            },
            token: 'mock-jwt-token-' + Date.now(),
          },
        })
      } else if (url === '/api/forgot-password/send-code') {
        // 模拟发送重置密码验证码
        const { email } = data

        // 模拟邮箱不存在的情况
        if (!['admin@example.com', 'user@example.com'].includes(email)) {
          reject({
            response: {
              status: 404,
              data: {
                success: false,
                message: '该邮箱未注册，请检查邮箱地址',
              },
            },
          })
          return
        }

        // 发送成功
        resolve({
          data: {
            success: true,
            message: '验证码已发送到您的邮箱',
          },
        })
      } else if (url === '/api/forgot-password/verify-code') {
        // 模拟验证重置密码验证码
        const { email, code } = data

        // 模拟验证码错误
        if (code !== '123456') {
          reject({
            response: {
              status: 400,
              data: {
                success: false,
                message: '验证码错误或已过期',
              },
            },
          })
          return
        }

        // 验证成功
        resolve({
          data: {
            success: true,
            message: '验证码验证成功',
          },
        })
      } else if (url === '/api/forgot-password/reset') {
        // 模拟重置密码
        const { email, code, newPassword } = data

        // 模拟验证码错误
        if (code !== '123456') {
          reject({
            response: {
              status: 400,
              data: {
                success: false,
                message: '验证码错误或已过期',
              },
            },
          })
          return
        }

        // 重置成功
        resolve({
          data: {
            success: true,
            message: '密码重置成功',
          },
        })
      } else {
        reject({
          response: {
            status: 404,
            data: {
              success: false,
              message: 'API接口不存在',
            },
          },
        })
      }
    }, 1000) // 模拟网络延迟
  })
}

// 重写axios的post方法以使用模拟数据（仅在开发环境）
if (import.meta.env.DEV) {
  const originalPost = api.post
  api.post = async (url: string, data?: any, config?: any) => {
    try {
      // 尝试真实请求
      return await originalPost.call(api, url, data, config)
    } catch (error: any) {
      // 如果真实请求失败，使用模拟数据
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        console.log('使用模拟API响应:', url)
        return await mockApiResponse(url, data)
      }
      throw error
    }
  }
}

// 导出API实例
export default api

// 导出常用的API方法
export const authAPI = {
  // 登录
  login: (credentials: { username: string; password: string; rememberMe?: boolean }) =>
    api.post('/login', credentials),

  // 注册
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/register', userData),

  // 发送重置密码验证码
  sendResetCode: (data: { email: string }) => api.post('/forgot-password/send-code', data),

  // 验证重置密码验证码
  verifyResetCode: (data: { email: string; code: string }) =>
    api.post('/forgot-password/verify-code', data),

  // 重置密码
  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    api.post('/forgot-password/reset', data),

  // 登出
  logout: () => api.post('/logout'),

  // 获取用户信息
  getUserInfo: () => api.get('/user/info'),

  // 刷新token
  refreshToken: () => api.post('/auth/refresh'),
}

// 用户相关API
export const userAPI = {
  // 获取用户资料
  getProfile: () => api.get('/user/profile'),

  // 更新用户资料
  updateProfile: (data: any) => api.put('/user/profile', data),

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.put('/user/password', data),
}

// 工具函数
export const apiUtils = {
  // 保存认证信息
  saveAuthInfo: (token: string, user: any) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userInfo', JSON.stringify(user))
  },

  // 清除认证信息
  clearAuthInfo: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
  },

  // 获取保存的用户信息
  getSavedUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  },

  // 检查是否已登录
  isLoggedIn: () => {
    return !!localStorage.getItem('authToken')
  },
}
