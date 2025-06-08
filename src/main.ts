import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// 在开发模式下初始化Stagewise工具栏，但完全隐藏连接UI
if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
  // 添加样式来隐藏连接UI和连接弹窗
  const style = document.createElement('style')
  style.textContent = `
    /* 隐藏Stagewise所有连接相关的UI */
    .stagewise-connection-banner,
    .stagewise-connection-overlay,
    .stagewise-toolbar-menu-connection-status,
    .stagewise-connecting,
    .stagewise-connection-status,
    .stagewise-disconnected,
    [class*='stagewise-connection'],
    .stagewise-overlay,
    .stagewise-modal {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* 隐藏连接按钮上的文本 */
    .stagewise-toolbar-button span {
      display: none !important;
    }

    /* 保持按钮可见但更小巧 */
    .stagewise-toolbar-button {
      opacity: 0.7;
      transform: scale(0.8);
    }
  `
  document.head.appendChild(style)

  // 通过计时器持续移除连接UI元素
  const removeConnectionUI = () => {
    const selectors = [
      '.stagewise-connection-banner',
      '.stagewise-connection-overlay',
      '.stagewise-connecting',
      '.stagewise-connection-status',
      '.stagewise-disconnected',
      '.stagewise-overlay',
      '.stagewise-modal',
      '[class*="stagewise-connection"]',
    ]

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.remove()
      })
    })
  }

  // 定期检查并移除连接UI
  setInterval(removeConnectionUI, 100)

  // 延迟初始化，确保页面完全加载
  setTimeout(() => {
    // 动态导入以确保在生产环境中不包含
    import('@stagewise/toolbar-vue')
      .then(({ StagewiseToolbar }) => {
        try {
          // 创建容器元素
          const container = document.createElement('div')
          container.id = 'stagewise-toolbar-container'
          document.body.appendChild(container)

          // 详细的连接配置
          const stagewiseConfig = {
            plugins: [],
            debug: false, // 关闭调试模式
            hideConnection: true, // 隐藏连接UI
            ui: {
              hideConnectionBanner: true, // 隐藏连接横幅
              compact: true, // 使用紧凑模式
              connectionStatus: false, // 禁用连接状态显示
              showConnectionUI: false, // 禁止显示连接UI
            },
            ide: {
              type: 'cursor',
              forceConnect: true, // 强制连接
              reconnectAttempts: 0, // 不尝试重连
              reconnectDelay: 0,
              timeout: 2000,
              connection: {
                url: 'ws://localhost:5746',
                protocol: 'cursor-websocket-protocol',
                autoReconnect: false, // 禁用自动重连
                maxRetries: 0,
                retryInterval: 0,
                connectionTimeout: 2000,
                silent: true, // 静默模式
              },
            },
            logging: {
              level: 'error', // 只记录错误
              toConsole: false, // 不输出到控制台
            },
          }

          // 创建新的应用实例挂载工具栏
          const toolbarApp = createApp(StagewiseToolbar, {
            config: stagewiseConfig,
          })

          // 挂载工具栏
          toolbarApp.mount('#stagewise-toolbar-container')

          // 强制移除可能出现的连接UI
          removeConnectionUI()

          // 监听DOM变化，删除连接UI
          const observer = new MutationObserver(() => {
            removeConnectionUI()
          })

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          })

          // 添加全局对象以便调试
          ;(
            window as Window & typeof globalThis & { __STAGEWISE_DEBUG__: Record<string, unknown> }
          ).__STAGEWISE_DEBUG__ = {
            config: stagewiseConfig,
          }

          // 在应用加载后立即执行移除
          window.addEventListener('load', removeConnectionUI)
        } catch (error) {
          console.error('初始化Stagewise工具栏失败:', error)
        }
      })
      .catch((error) => {
        console.error('加载Stagewise模块失败:', error)
      })
  }, 1000)
}
