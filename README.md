# ThreeAutumnleaves (三秋叶)

这是一个基于Vue 3、TypeScript和Vite构建的个人网站项目，提供首页、项目合集、社区交流、公告等功能。项目采用雪白、生机绿、枯败黄的主题配色，打造清新自然的用户体验。

## 项目概述

三秋叶是一个功能丰富的个人网站，包含以下页面和功能：

- **首页**：网站主页，展示核心内容和导航
- **项目合集**：展示个人项目作品
- **社区交流**：用户讨论和互动平台
- **公告**：网站公告和更新信息
- **软件推荐**：推荐实用软件工具
- **3D打印**：3D打印相关内容
- **AI代理**：AI相关功能和工具

## 技术栈

- **前端框架**：Vue 3 (使用Composition API)
- **类型系统**：TypeScript
- **构建工具**：Vite
- **路由管理**：Vue Router
- **状态管理**：Pinia
- **HTTP客户端**：Axios
- **测试工具**：Vitest (单元测试)、Playwright (E2E测试)
- **代码规范**：ESLint、Prettier

## 主要功能

### 响应式设计

- 适配各种设备尺寸，从移动设备到桌面显示器
- 流畅的交互体验和动画效果

### 用户认证系统

- 完整的登录/注册功能
- 密码找回功能
- 用户信息管理

### 二维码弹窗系统

项目包含一个完善的二维码弹窗系统，可用于显示微信群、支付等场景的二维码图片。该功能：

- 使用Vue 3的Teleport技术实现，确保弹窗正确渲染在DOM树中
- 自动禁用背景滚动，提升用户体验
- 支持键盘ESC键关闭
- 包含过渡动画效果
- 响应式设计，适配不同设备

#### 使用方法

```vue
<script setup>
import { ref } from 'vue'
import QRCodeModalSimple from '@/components/QRCodeModalSimple.vue'

// 导入二维码图片
import qrCodeImage from '@/assets/img/your-qrcode.jpg'

// 控制弹窗显示状态
const showQRCode = ref(false)

// 显示二维码
const openQRCode = () => {
  showQRCode.value = true
}

// 关闭二维码
const closeQRCode = () => {
  showQRCode.value = false
}
</script>

<template>
  <!-- 触发按钮 -->
  <button @click="openQRCode">显示二维码</button>

  <!-- 二维码弹窗 -->
  <QRCodeModalSimple
    :show="showQRCode"
    title="扫码加入"
    :qr-code-image="qrCodeImage"
    description="请使用微信扫描下方二维码"
    @close="closeQRCode"
  />
</template>
```

### 模态框系统

项目实现了一套完整的模态框系统，包括：

- 基础模态框组件 (BaseModal)
- 登录模态框 (LoginModal)
- 注册模态框 (RegisterModal)
- 忘记密码模态框 (ForgotPasswordModal)
- 二维码模态框 (QRCodeModalSimple)

### 其他功能组件

- **返回顶部按钮**：方便用户快速回到页面顶部
- **落叶动画**：美观的视觉效果
- **SVG图标系统**：可扩展的图标组件
- **分类导航**：便捷的内容分类浏览

## 项目结构

```
src/
├── assets/         # 静态资源(CSS、图片等)
├── components/     # 可复用组件
├── composables/    # 组合式函数
├── router/         # 路由配置
├── stores/         # Pinia状态管理
├── utils/          # 工具函数
├── views/          # 页面视图组件
├── App.vue         # 根组件
└── main.ts         # 应用入口
```

## 开发工具

### Stagewise Toolbar

本项目集成了stagewise工具栏，用于AI辅助开发。工具栏：

- 仅在开发模式下显示
- 允许在Web应用中选择元素并留下评论
- 将前端UI连接到代码编辑器中的AI代理

集成在开发服务器启动时自动处理。

## 自定义配置

参见 [Vite配置参考](https://vite.dev/config/)。

## 项目设置

```sh
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查、编译和最小化生产环境构建
npm run build

# 使用Vitest运行单元测试
npm run test:unit

# 使用Playwright运行端到端测试
# 首次运行需安装浏览器
npx playwright install

# 运行端到端测试
npm run test:e2e

# 使用ESLint进行代码检查
npm run lint
```

## 主题色彩系统

项目使用三种主题色：

- **冰雪白**：主背景色，提供清爽简洁的视觉体验
- **生机绿**：主要强调色，象征生命力和活力
- **枯败黄**：次要强调色，象征秋叶的自然之美

这三种颜色组合形成了"三秋叶"的核心视觉标识。

## 贡献指南

欢迎提交问题报告和功能请求。如果您想贡献代码，请确保遵循项目的代码风格和提交消息规范。

## 许可证

[MIT](LICENSE)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Development Tools

### Stagewise Toolbar

This project integrates the stagewise toolbar for AI-assisted development. The toolbar:

- Appears only in development mode
- Allows selecting elements in the web app and leaving comments
- Connects frontend UI to code AI agents in your code editor

The integration is handled automatically when you run the development server.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
