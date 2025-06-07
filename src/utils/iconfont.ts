/**
 * 阿里图标库工具
 *
 * 使用说明：
 * 1. 登录阿里图标库 https://www.iconfont.cn/
 * 2. 选择需要的图标添加到项目
 * 3. 在项目中选择Symbol方式生成在线链接
 * 4. 将生成的链接替换下方scriptUrl的值
 */

// 记录已加载的图标库链接
const loadedScripts: string[] = []

/**
 * 判断URL是否有效
 * @param url URL地址
 * @returns 是否有效
 */
function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false
  try {
    // 添加协议前缀（如果需要）
    let fullUrl = url
    if (url.startsWith('//')) {
      fullUrl = `${window.location.protocol}${url}`
    }
    new URL(fullUrl)
    return true
  } catch (e) {
    console.error('无效URL:', url, e)
    return false
  }
}

/**
 * 获取完整URL
 * @param url 原始URL
 * @returns 完整URL
 */
function getFullUrl(url: string): string {
  if (url.startsWith('//')) {
    return `${window.location.protocol}${url}`
  }
  return url
}

/**
 * 加载图标库脚本
 * @param scriptUrl 阿里图标库生成的Symbol链接
 * @returns Promise
 */
export function loadIconFont(scriptUrl: string): Promise<void> {
  // 如果已经加载过该脚本，直接返回成功
  if (loadedScripts.includes(scriptUrl)) {
    console.log('IconFont script 已加载过:', scriptUrl)
    return Promise.resolve()
  }

  console.log('开始加载IconFont脚本:', scriptUrl)

  return new Promise((resolve, reject) => {
    // 检查URL格式
    if (!isValidUrl(scriptUrl)) {
      console.error('IconFont URL无效:', scriptUrl)
      reject(new Error(`IconFont URL无效: ${scriptUrl}`))
      return
    }

    // 获取完整URL
    const url = getFullUrl(scriptUrl)
    console.log('完整URL:', url)

    // 检查是否已有相同URL的<script>标签
    const existingScript = document.querySelector(`script[src="${url}"]`)
    if (existingScript) {
      console.log('页面中已存在此脚本:', url)
      loadedScripts.push(scriptUrl)
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.crossOrigin = 'anonymous' // 添加跨域支持

    // 成功加载回调
    script.onload = () => {
      loadedScripts.push(scriptUrl)
      console.log('IconFont script 加载成功:', scriptUrl)
      resolve()
    }

    // 加载失败回调
    script.onerror = (e) => {
      console.error('IconFont script 加载失败:', scriptUrl, e)
      reject(new Error(`Failed to load IconFont script: ${scriptUrl}`))
    }

    document.head.appendChild(script)
  })
}

/**
 * 预设图标库链接
 * 已更新为新的图标库项目链接
 */
export const DEFAULT_ICON_URL = 'https://at.alicdn.com/t/c/font_4942439_zvzb6m54i8.js' // 使用HTTPS协议避免CORS问题

/**
 * 备用图标库链接
 * 如果默认链接无法加载，将尝试使用备用链接
 */
export const FALLBACK_ICON_URL = 'https://at.alicdn.com/t/c/font_4942439_zvzb6m54i8.js' // 带协议的完整URL

// 默认导出加载图标的函数
export default loadIconFont
