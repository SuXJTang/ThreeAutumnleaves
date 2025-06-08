import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// 暂时注释掉，以避免与Stagewise的冲突
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [
      vue(),
      vueJsx(),
      // 暂时禁用vue-devtools以避免与Stagewise可能的冲突
      // vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 优化Stagewise工具的服务器配置
    server: {
      // 允许WebSocket连接
      hmr: {
        // 确保WebSocket可以连接
        clientPort: 5173,
        // 允许跨源请求
        host: '0.0.0.0',
      },
      // 启用CORS
      cors: true,
      // 允许IP访问
      host: '0.0.0.0',
      // 监听所有文件变化
      watch: {
        usePolling: false,
      },
      // 开发服务器端口
      port: 5173,
      // WebSocket配置
      websocket: {
        // WebSocket使用的协议
        protocol: 'ws',
      },
      headers: {
        // 允许连接到Cursor的WebSocket
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    },
    // 添加Stagewise相关的环境变量
    define: {
      // 确保环境变量在客户端可用
      'import.meta.env.STAGEWISE_ENABLED': isDev,
      'import.meta.env.STAGEWISE_DEBUG': isDev,
    },
  }
})
