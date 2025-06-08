<template>
  <div class="software-recommendations-view">
    <!-- 使用通用返回按钮组件 -->
    <div class="back-button-container">
      <BackButton @click="goBack" :icon-only="false" />
    </div>

    <!-- 标题区域 -->
    <div class="title-section">
      <h1 class="main-title">三秋叶 软件推荐</h1>
      <p class="subtitle">
        精选优质软件工具，涵盖开发、设计、办公等各个领域，提升您的工作效率与数字体验
      </p>
    </div>

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 筛选区域 -->
      <section class="filter-section">
        <div class="filter-header">
          <h2 class="filter-title">软件筛选</h2>
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="search-input"
              placeholder="搜索软件..."
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- 平台筛选 -->
        <div class="platform-filters">
          <h3 class="filter-group-title">🖥️ 支持平台</h3>
          <div class="platform-tabs">
            <button
              v-for="platform in platforms"
              :key="platform.id"
              :class="['platform-tab', { active: selectedPlatform === platform.id }]"
              @click="selectPlatform(platform.id)"
            >
              <span>{{ platform.icon }}</span>
              <span>{{ platform.name }}</span>
            </button>
          </div>
        </div>

        <!-- 分类筛选 -->
        <div>
          <h3 class="filter-group-title">📂 软件分类</h3>
          <div class="category-tabs">
            <button
              v-for="category in categories"
              :key="category.id"
              :class="['category-tab', { active: selectedCategory === category.id }]"
              @click="selectCategory(category.id)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 结果统计 -->
      <div class="results-info">找到 {{ filteredSoftware.length }} 个软件符合条件</div>

      <!-- 软件卡片网格 -->
      <section class="software-grid" v-if="paginatedSoftware.length > 0">
        <div
          v-for="(software, index) in paginatedSoftware"
          :key="software.id"
          class="software-card"
          :style="{ '--i': index + 1 }"
          @click="handleSoftwareClick(software)"
        >
          <div class="software-icon">{{ software.icon }}</div>
          <h3 class="software-name">{{ software.name }}</h3>
          <p class="software-desc">{{ software.description }}</p>
          <div class="software-platforms">
            <span
              v-for="platform in software.platforms"
              :key="platform"
              :class="['platform-badge', getPlatformClass(platform)]"
            >
              {{ platform }}
            </span>
          </div>
          <div class="software-meta">
            <span>⭐ {{ software.rating }}</span>
            <span>📥 {{ software.downloads || 'N/A' }}</span>
          </div>
        </div>
      </section>

      <!-- 无结果提示 -->
      <div v-else class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>未找到匹配的软件</h3>
        <p>请尝试调整筛选条件或搜索关键词</p>
      </div>

      <!-- 分页控件 -->
      <div class="pagination">
        <button
          class="page-btn prev-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          «
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['page-btn', 'page-number', { active: page === currentPage }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="page-btn next-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          »
        </button>

        <!-- 页面跳转输入框 -->
        <div class="page-jump">
          <span class="jump-label">跳转到</span>
          <input
            v-model="jumpPageInput"
            type="text"
            class="jump-input"
            :placeholder="`1-${totalPages}`"
            :min="1"
            :max="totalPages"
            @keydown.enter="handlePageJump"
            @input="clearError"
          />
          <span class="jump-label">页</span>
          <button class="jump-btn" @click="handlePageJump">跳转</button>
        </div>

        <span class="page-total">共 {{ filteredSoftware.length }} 个软件，{{ totalPages }} 页</span>

        <!-- 提示信息 -->
        <div v-if="jumpError" class="jump-error">
          {{ jumpError }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// 类型定义
interface Software {
  id: number
  name: string
  description: string
  icon: string
  platforms: string[]
  category: string
  rating: number
  downloads?: string
  url?: string
}

interface Platform {
  id: string
  name: string
  icon: string
}

interface Category {
  id: string
  name: string
  icon: string
}

// 响应式数据
const selectedPlatform = ref('all')
const selectedCategory = ref('all')
const currentPage = ref(1)
const searchQuery = ref('')
const jumpPageInput = ref('')
const jumpError = ref('')
const itemsPerPage = 36 // 6x6 网格

// 监听jumpPageInput，确保只接受数字输入
watch(jumpPageInput, (newValue) => {
  if (newValue) {
    // 移除所有非数字字符
    const numericValue = newValue.replace(/\D/g, '')

    // 如果有变化，更新值
    if (numericValue !== newValue) {
      jumpPageInput.value = numericValue
    }

    // 防止首位出现多个0
    if (numericValue.length > 1 && numericValue[0] === '0') {
      jumpPageInput.value = numericValue.replace(/^0+/, '')
    }

    // 限制最大值不超过总页数
    const numValue = parseInt(numericValue)
    if (!isNaN(numValue) && numValue > totalPages.value) {
      jumpPageInput.value = String(totalPages.value)
    }
  }
})

// 平台数据
const platforms: Platform[] = [
  { id: 'all', name: '全部平台', icon: '🌟' },
  { id: 'windows', name: 'Windows', icon: '🪟' },
  { id: 'mac', name: 'macOS', icon: '🍎' },
  { id: 'android', name: 'Android', icon: '🤖' },
  { id: 'ios', name: 'iOS', icon: '📱' },
]

// 分类数据
const categories: Category[] = [
  { id: 'all', name: '全部', icon: '🌟' },
  { id: 'office', name: '办公', icon: '📝' },
  { id: 'design', name: '设计', icon: '🎨' },
  { id: 'development', name: '开发', icon: '⚡' },
  { id: 'multimedia', name: '多媒体', icon: '🎬' },
  { id: 'system', name: '系统', icon: '⚙️' },
  { id: 'social', name: '社交', icon: '💬' },
  { id: 'education', name: '教育', icon: '📚' },
  { id: 'browser', name: '浏览器', icon: '🌐' },
  { id: 'entertainment', name: '娱乐', icon: '🎮' },
]

// 软件数据
const softwareList: Software[] = [
  // 开发工具
  {
    id: 1,
    name: 'Notion',
    description: '全能工作空间，集笔记、知识库、项目管理于一体',
    icon: '📝',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'office',
    rating: 4.8,
    downloads: '50M+',
  },
  {
    id: 2,
    name: 'Figma',
    description: '协作设计工具，用于UI设计和原型制作',
    icon: '🎨',
    platforms: ['Windows', 'macOS'],
    category: 'design',
    rating: 4.7,
    downloads: '20M+',
  },
  {
    id: 3,
    name: 'VS Code',
    description: '强大的代码编辑器，支持多种编程语言',
    icon: '💻',
    platforms: ['Windows', 'macOS'],
    category: 'development',
    rating: 4.9,
    downloads: '100M+',
  },
  {
    id: 4,
    name: 'DevTools Resolver',
    description: '专业开发调试工具，提升开发效率',
    icon: '🔧',
    platforms: ['Windows', 'macOS'],
    category: 'development',
    rating: 4.6,
    downloads: '5M+',
  },
  {
    id: 5,
    name: 'Spotify',
    description: '音乐流媒体服务，享受高品质音乐体验',
    icon: '🎵',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'multimedia',
    rating: 4.5,
    downloads: '500M+',
  },
  {
    id: 6,
    name: 'Photoshop',
    description: '专业图像编辑软件，创意设计必备工具',
    icon: '🖼️',
    platforms: ['Windows', 'macOS'],
    category: 'design',
    rating: 4.8,
    downloads: '30M+',
  },

  // 第二行
  {
    id: 7,
    name: 'Slack',
    description: '团队协作沟通工具，提升工作效率',
    icon: '💬',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'office',
    rating: 4.4,
    downloads: '25M+',
  },
  {
    id: 8,
    name: 'Git',
    description: '分布式版本控制系统，代码管理必备',
    icon: '📊',
    platforms: ['Windows', 'macOS'],
    category: 'development',
    rating: 4.9,
    downloads: '80M+',
  },
  {
    id: 9,
    name: 'Excel',
    description: '电子表格软件，数据分析和处理工具',
    icon: '📈',
    platforms: ['Windows', 'macOS'],
    category: 'office',
    rating: 4.6,
    downloads: '200M+',
  },
  {
    id: 10,
    name: 'Postman',
    description: 'API开发测试工具，简化接口调试',
    icon: '🚀',
    platforms: ['Windows', 'macOS'],
    category: 'development',
    rating: 4.7,
    downloads: '15M+',
  },
  {
    id: 11,
    name: 'Chrome',
    description: '快速安全的网页浏览器',
    icon: '🌐',
    platforms: ['Windows', 'macOS', 'Android'],
    category: 'system',
    rating: 4.5,
    downloads: '1B+',
  },
  {
    id: 12,
    name: '1Password',
    description: '密码管理器，保护账户安全',
    icon: '🔐',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'system',
    rating: 4.8,
    downloads: '10M+',
  },

  // 第三行
  {
    id: 13,
    name: 'OBS Studio',
    description: '开源录屏直播软件，功能强大',
    icon: '🎥',
    platforms: ['Windows', 'macOS'],
    category: 'multimedia',
    rating: 4.6,
    downloads: '40M+',
  },
  {
    id: 14,
    name: 'Anki',
    description: '智能记忆卡片，高效学习工具',
    icon: '🧠',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'education',
    rating: 4.7,
    downloads: '8M+',
  },
  {
    id: 15,
    name: 'Steam',
    description: '游戏平台，海量游戏资源',
    icon: '🎮',
    platforms: ['Windows', 'macOS'],
    category: 'social',
    rating: 4.5,
    downloads: '120M+',
  },
  {
    id: 16,
    name: 'Obsidian',
    description: '知识管理工具，构建个人知识网络',
    icon: '🧩',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'education',
    rating: 4.8,
    downloads: '5M+',
  },
  {
    id: 17,
    name: 'Behance',
    description: '创意作品展示平台，设计师社区',
    icon: '🎨',
    platforms: ['Windows', 'macOS'],
    category: 'design',
    rating: 4.4,
    downloads: '15M+',
  },
  {
    id: 18,
    name: 'Canva',
    description: '在线设计工具，轻松创建精美设计',
    icon: '✨',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'design',
    rating: 4.6,
    downloads: '60M+',
  },

  // 第四行
  {
    id: 19,
    name: 'Docker',
    description: '容器化平台，简化应用部署',
    icon: '🐳',
    platforms: ['Windows', 'macOS'],
    category: 'development',
    rating: 4.7,
    downloads: '20M+',
  },
  {
    id: 20,
    name: 'Thunderbird',
    description: '开源邮件客户端，功能丰富',
    icon: '📧',
    platforms: ['Windows', 'macOS'],
    category: 'office',
    rating: 4.3,
    downloads: '12M+',
  },
  {
    id: 21,
    name: 'Audacity',
    description: '免费音频编辑软件，录音剪辑工具',
    icon: '🎵',
    platforms: ['Windows', 'macOS'],
    category: 'multimedia',
    rating: 4.5,
    downloads: '30M+',
  },
  {
    id: 22,
    name: 'Discord',
    description: '游戏社交平台，语音聊天工具',
    icon: '🎮',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'social',
    rating: 4.6,
    downloads: '150M+',
  },
  {
    id: 23,
    name: 'Lightroom',
    description: '专业照片编辑和管理软件',
    icon: '📸',
    platforms: ['Windows', 'macOS'],
    category: 'design',
    rating: 4.7,
    downloads: '18M+',
  },

  // 第五行
  {
    id: 24,
    name: 'VLC',
    description: '万能媒体播放器，支持多种格式',
    icon: '🎬',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'multimedia',
    rating: 4.8,
    downloads: '300M+',
  },
  {
    id: 25,
    name: 'Trello',
    description: '项目管理工具，看板式任务管理',
    icon: '📋',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'office',
    rating: 4.5,
    downloads: '35M+',
  },
  {
    id: 26,
    name: 'Duolingo',
    description: '语言学习应用，趣味学外语',
    icon: '🦉',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'education',
    rating: 4.6,
    downloads: '100M+',
  },
  {
    id: 27,
    name: 'TeamViewer',
    description: '远程控制软件，跨平台连接',
    icon: '🖥️',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'system',
    rating: 4.4,
    downloads: '50M+',
  },
  {
    id: 28,
    name: 'Power BI',
    description: '商业智能工具，数据可视化分析',
    icon: '📊',
    platforms: ['Windows'],
    category: 'office',
    rating: 4.5,
    downloads: '8M+',
  },
  {
    id: 29,
    name: 'Telegram',
    description: '安全即时通讯软件，隐私保护',
    icon: '💬',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'social',
    rating: 4.7,
    downloads: '700M+',
  },

  // 第六行
  {
    id: 30,
    name: 'Dropbox',
    description: '云存储服务，文件同步备份',
    icon: '☁️',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'system',
    rating: 4.4,
    downloads: '600M+',
  },
  {
    id: 31,
    name: 'Adobe XD',
    description: 'UI/UX设计工具，原型制作专家',
    icon: '🎨',
    platforms: ['Windows', 'macOS'],
    category: 'design',
    rating: 4.5,
    downloads: '12M+',
  },
  {
    id: 32,
    name: 'Wireshark',
    description: '网络协议分析工具，网络调试利器',
    icon: '🦈',
    platforms: ['Windows', 'macOS'],
    category: 'development',
    rating: 4.6,
    downloads: '3M+',
  },
  {
    id: 33,
    name: 'Khan Academy',
    description: '免费在线教育平台，知识学习',
    icon: '🎓',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'education',
    rating: 4.8,
    downloads: '50M+',
  },
  {
    id: 34,
    name: 'Blender',
    description: '3D建模动画软件，开源免费',
    icon: '🎭',
    platforms: ['Windows', 'macOS'],
    category: 'design',
    rating: 4.7,
    downloads: '25M+',
  },
  {
    id: 35,
    name: 'WhatsApp',
    description: '即时通讯应用，全球用户首选',
    icon: '💬',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'social',
    rating: 4.3,
    downloads: '2B+',
  },
  {
    id: 36,
    name: 'Coursera',
    description: '在线课程平台，专业技能学习',
    icon: '📚',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'education',
    rating: 4.6,
    downloads: '80M+',
  },

  // 第七行
  {
    id: 37,
    name: 'Figma',
    description: '协作式界面设计工具，团队设计首选',
    icon: '🎨',
    platforms: ['Windows', 'macOS', 'Web'],
    category: 'design',
    rating: 4.7,
    downloads: '15M+',
  },
  {
    id: 38,
    name: 'Notion',
    description: '全能工作空间，笔记、任务、数据库一体化',
    icon: '📝',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'office',
    rating: 4.6,
    downloads: '20M+',
  },
  {
    id: 39,
    name: 'Spotify',
    description: '全球领先的音乐流媒体平台',
    icon: '🎵',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'entertainment',
    rating: 4.5,
    downloads: '100M+',
  },
  {
    id: 40,
    name: 'Zoom',
    description: '视频会议和远程协作平台',
    icon: '📹',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'office',
    rating: 4.3,
    downloads: '50M+',
  },
  {
    id: 41,
    name: 'IntelliJ IDEA',
    description: '智能Java开发环境，提升编程效率',
    icon: '💻',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.8,
    downloads: '10M+',
  },
  {
    id: 42,
    name: 'Sketch',
    description: 'macOS专业UI/UX设计工具',
    icon: '✏️',
    platforms: ['macOS'],
    category: 'design',
    rating: 4.6,
    downloads: '5M+',
  },

  // 第八行
  {
    id: 43,
    name: 'Postman',
    description: 'API开发和测试平台',
    icon: '🚀',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.7,
    downloads: '8M+',
  },
  {
    id: 44,
    name: 'Evernote',
    description: '跨平台笔记应用，记录生活点滴',
    icon: '🐘',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'office',
    rating: 4.2,
    downloads: '25M+',
  },
  {
    id: 45,
    name: 'Netflix',
    description: '全球领先的视频流媒体服务',
    icon: '🎬',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'entertainment',
    rating: 4.4,
    downloads: '200M+',
  },
  {
    id: 46,
    name: 'GitHub Desktop',
    description: 'Git版本控制的图形化界面',
    icon: '🐙',
    platforms: ['Windows', 'macOS'],
    category: 'development',
    rating: 4.5,
    downloads: '12M+',
  },
  {
    id: 47,
    name: 'Microsoft Teams',
    description: '企业级协作和通信平台',
    icon: '👥',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'office',
    rating: 4.1,
    downloads: '60M+',
  },
  {
    id: 48,
    name: 'Unity',
    description: '跨平台游戏开发引擎',
    icon: '🎮',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.5,
    downloads: '3M+',
  },

  // 第九行
  {
    id: 49,
    name: 'Sublime Text',
    description: '轻量级代码编辑器，速度极快',
    icon: '📝',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.7,
    downloads: '5M+',
  },
  {
    id: 50,
    name: 'Twitch',
    description: '游戏直播和社区平台',
    icon: '📺',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'entertainment',
    rating: 4.3,
    downloads: '80M+',
  },
  {
    id: 51,
    name: 'Asana',
    description: '项目管理和团队协作工具',
    icon: '📋',
    platforms: ['Web', 'iOS', 'Android'],
    category: 'office',
    rating: 4.4,
    downloads: '15M+',
  },
  {
    id: 52,
    name: 'Slack',
    description: '团队协作沟通工具，提升工作效率',
    icon: '💬',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'office',
    rating: 4.4,
    downloads: '25M+',
  },
  {
    id: 53,
    name: 'Atom',
    description: '可定制的文本编辑器',
    icon: '⚛️',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.3,
    downloads: '8M+',
  },
  {
    id: 54,
    name: 'Skype',
    description: '视频通话和即时消息应用',
    icon: '📞',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'social',
    rating: 4.0,
    downloads: '100M+',
  },

  // 第十行
  {
    id: 55,
    name: 'Firefox',
    description: '开源网页浏览器，注重隐私',
    icon: '🦊',
    platforms: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'],
    category: 'browser',
    rating: 4.5,
    downloads: '200M+',
  },
  {
    id: 56,
    name: 'Edge',
    description: 'Microsoft现代网页浏览器',
    icon: '🌐',
    platforms: ['Windows', 'macOS', 'iOS', 'Android'],
    category: 'browser',
    rating: 4.3,
    downloads: '150M+',
  },
  {
    id: 57,
    name: 'Opera',
    description: '功能丰富的网页浏览器',
    icon: '🎭',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'browser',
    rating: 4.2,
    downloads: '50M+',
  },
  {
    id: 58,
    name: 'Brave',
    description: '注重隐私的快速浏览器',
    icon: '🦁',
    platforms: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'],
    category: 'browser',
    rating: 4.4,
    downloads: '30M+',
  },
  {
    id: 59,
    name: 'Vivaldi',
    description: '高度可定制的网页浏览器',
    icon: '🎨',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'browser',
    rating: 4.3,
    downloads: '5M+',
  },
  {
    id: 60,
    name: 'Safari',
    description: 'Apple的网页浏览器',
    icon: '🧭',
    platforms: ['macOS', 'iOS'],
    category: 'browser',
    rating: 4.2,
    downloads: '100M+',
  },

  // 第十一行
  {
    id: 61,
    name: 'Final Cut Pro',
    description: '专业视频编辑软件',
    icon: '🎬',
    platforms: ['macOS'],
    category: 'multimedia',
    rating: 4.6,
    downloads: '2M+',
  },
  {
    id: 62,
    name: 'Logic Pro',
    description: '专业音乐制作软件',
    icon: '🎵',
    platforms: ['macOS'],
    category: 'multimedia',
    rating: 4.7,
    downloads: '1M+',
  },
  {
    id: 63,
    name: 'GarageBand',
    description: '音乐创作入门软件',
    icon: '🎸',
    platforms: ['macOS', 'iOS'],
    category: 'multimedia',
    rating: 4.5,
    downloads: '10M+',
  },
  {
    id: 64,
    name: 'iMovie',
    description: '简单易用的视频编辑软件',
    icon: '📹',
    platforms: ['macOS', 'iOS'],
    category: 'multimedia',
    rating: 4.3,
    downloads: '20M+',
  },
  {
    id: 65,
    name: 'Keynote',
    description: 'Apple的演示文稿软件',
    icon: '📊',
    platforms: ['macOS', 'iOS'],
    category: 'office',
    rating: 4.5,
    downloads: '15M+',
  },
  {
    id: 66,
    name: 'Numbers',
    description: 'Apple的电子表格软件',
    icon: '📈',
    platforms: ['macOS', 'iOS'],
    category: 'office',
    rating: 4.2,
    downloads: '12M+',
  },

  // 第十二行
  {
    id: 67,
    name: 'Pages',
    description: 'Apple的文字处理软件',
    icon: '📄',
    platforms: ['macOS', 'iOS'],
    category: 'office',
    rating: 4.3,
    downloads: '18M+',
  },
  {
    id: 68,
    name: 'Xcode',
    description: 'iOS和macOS开发环境',
    icon: '🔨',
    platforms: ['macOS'],
    category: 'development',
    rating: 4.4,
    downloads: '5M+',
  },
  {
    id: 69,
    name: 'Android Studio',
    description: 'Android应用开发环境',
    icon: '🤖',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.5,
    downloads: '8M+',
  },
  {
    id: 70,
    name: 'PyCharm',
    description: 'Python开发集成环境',
    icon: '🐍',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.6,
    downloads: '6M+',
  },
  {
    id: 71,
    name: 'WebStorm',
    description: 'JavaScript开发环境',
    icon: '🌐',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.5,
    downloads: '4M+',
  },
  {
    id: 72,
    name: 'PhpStorm',
    description: 'PHP开发集成环境',
    icon: '🐘',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.4,
    downloads: '3M+',
  },

  // 第十三行
  {
    id: 73,
    name: 'Rider',
    description: '.NET开发集成环境',
    icon: '🏃',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.5,
    downloads: '2M+',
  },
  {
    id: 74,
    name: 'CLion',
    description: 'C/C++开发环境',
    icon: '⚡',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.4,
    downloads: '1M+',
  },
  {
    id: 75,
    name: 'GoLand',
    description: 'Go语言开发环境',
    icon: '🐹',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.5,
    downloads: '800K+',
  },
  {
    id: 76,
    name: 'RubyMine',
    description: 'Ruby开发集成环境',
    icon: '💎',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.3,
    downloads: '500K+',
  },
  {
    id: 77,
    name: 'DataGrip',
    description: '数据库管理工具',
    icon: '🗄️',
    platforms: ['Windows', 'macOS', 'Linux'],
    category: 'development',
    rating: 4.6,
    downloads: '1.5M+',
  },
  {
    id: 78,
    name: 'AppCode',
    description: 'iOS/macOS开发环境',
    icon: '📱',
    platforms: ['macOS'],
    category: 'development',
    rating: 4.2,
    downloads: '300K+',
  },
]

// 计算属性
const filteredSoftware = computed(() => {
  let filtered = softwareList

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (software) =>
        software.name.toLowerCase().includes(query) ||
        software.description.toLowerCase().includes(query),
    )
  }

  // 按平台筛选
  if (selectedPlatform.value !== 'all') {
    const platformName = platforms.find((p) => p.id === selectedPlatform.value)?.name
    if (platformName) {
      filtered = filtered.filter((software) => software.platforms.includes(platformName))
    }
  }

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((software) => software.category === selectedCategory.value)
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredSoftware.value.length / itemsPerPage)
})

const paginatedSoftware = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredSoftware.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (current >= total - 3) {
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
    }
  }

  return pages
})

// 方法
const selectPlatform = (platformId: string) => {
  selectedPlatform.value = platformId
  currentPage.value = 1
}

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
}

const goToPage = (page: number) => {
  console.log('goToPage 被调用，页码:', page, '总页数:', totalPages.value) // 调试日志

  // 确保页码在有效范围内
  const validPage = Math.max(1, Math.min(page, totalPages.value))

  if (validPage !== page) {
    console.log('页码被调整为有效值:', validPage)
  }

  if (validPage >= 1 && validPage <= totalPages.value) {
    console.log('页码有效，跳转到页面:', validPage) // 调试日志

    // 如果是同一页，刷新显示（增加反馈）
    if (currentPage.value === validPage) {
      console.log('已在当前页，执行刷新效果')
      // 添加视觉反馈
      const softwareGrid = document.querySelector('.software-grid')
      if (softwareGrid) {
        softwareGrid.classList.add('refresh-animation')
        setTimeout(() => {
          softwareGrid.classList.remove('refresh-animation')
        }, 500)
      }
    } else {
      // 设置新的页码
      currentPage.value = validPage
    }

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    console.log('页码无效') // 调试日志
  }
}

const handleSoftwareClick = (software: Software) => {
  console.log('点击软件:', software.name)
  // 这里可以添加跳转到软件详情页或外部链接的逻辑
  if (software.url) {
    window.open(software.url, '_blank')
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageJump = () => {
  // 清除之前的错误信息
  jumpError.value = ''

  // 如果输入为空，不做任何操作
  if (!jumpPageInput.value || jumpPageInput.value === '') {
    return
  }

  // 尝试转换为数字
  const pageNum = parseInt(jumpPageInput.value, 10)

  // 验证是否为有效数字
  if (isNaN(pageNum) || pageNum < 1) {
    jumpError.value = '请输入有效的页码数字'
    setTimeout(() => {
      jumpError.value = ''
    }, 3000)
    return
  }

  // 跳转到指定页面
  console.log('跳转到页面:', pageNum) // 添加调试日志
  goToPage(pageNum)
  jumpPageInput.value = ''
}

const clearError = () => {
  jumpError.value = ''
}

const getPlatformClass = (platform: string) => {
  const platformMap: { [key: string]: string } = {
    Windows: 'windows',
    macOS: 'mac',
    Android: 'android',
    iOS: 'ios',
    手机端: 'mobile',
    网页版: 'web',
  }
  return platformMap[platform] || 'default'
}

onMounted(() => {
  // 添加页面加载动画
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const animateCards = () => {
      setTimeout(() => {
        const cards = document.querySelectorAll('.software-card')
        if (cards && cards.length > 0) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in')
            }, index * 50)
          })
        }
      }, 100)
    }

    // 确保组件已挂载且DOM已更新
    nextTick(animateCards)
  }
})
</script>

<style scoped>
.software-recommendations-view {
  font-family:
    'SF Pro Display',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  line-height: 1.6;
  color: #2d3748;
  background: linear-gradient(135deg, #f5f9fc 0%, #e8f4f8 30%, #edf7ed 70%, #fdfbee 100%);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* 返回按钮样式 */
.back-button-container {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 200;
}

/* 标题区域样式 */
.title-section {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(250, 204, 21, 0.1) 100%);
  border: none;
  border-bottom: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 0;
  padding: 2rem 2rem 1.8rem;
  margin: 0;
  width: 100%;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.main-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.8rem;
  background: linear-gradient(135deg, #22c55e 0%, #eab308 50%, #22c55e 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textGradient 6s linear infinite;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.subtitle {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.5;
  max-width: 900px;
  margin: 0 auto;
  font-weight: 400;
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes textGradient {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* 主要内容区域 */
.main-content {
  padding: 1rem 0 1.5rem;
  max-width: 1800px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
  z-index: 1;
}

/* 筛选区域 */
.filter-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 18px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-size: 0.95rem;
  border: 2px solid rgba(72, 187, 120, 0.2);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: rgba(72, 187, 120, 0.5);
  box-shadow: 0 0 15px rgba(72, 187, 120, 0.15);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: #4a5568;
}

/* 平台筛选 */
.platform-filters {
  margin-bottom: 1.5rem;
}

.filter-group-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.platform-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.platform-tab {
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  text-decoration: none;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.platform-tab:hover {
  background: rgba(72, 187, 120, 0.1);
  border-color: rgba(72, 187, 120, 0.3);
  color: #2d3748;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.15);
}

.platform-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.category-tab {
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  text-decoration: none;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-tab:hover {
  background: rgba(72, 187, 120, 0.1);
  border-color: rgba(72, 187, 120, 0.3);
  color: #2d3748;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.15);
}

.category-tab.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.3);
}

.category-icon {
  font-size: 1.1rem;
}

/* 结果统计 */
.results-info {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  text-align: center;
  color: #4a5568;
  font-weight: 600;
}

/* 软件卡片网格 - 固定6*6布局 */
.software-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.8rem;
  margin-bottom: 3rem;
  transition: all 0.3s ease;
  justify-content: center;
}

/* 刷新动画样式 */
.refresh-animation {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 软件卡片 */
.software-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 0.8rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 180px;
  width: 100%;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  animation-delay: calc(0.05s * var(--i));
}

.software-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.software-card:hover::before {
  left: 100%;
}

.software-card:hover {
  transform: translateY(-8px) scale(1.05);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  border-color: rgba(72, 187, 120, 0.3);
}

/* 软件图标 */
.software-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 0.5rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
  transition: all 0.3s ease;
}

.software-card:hover .software-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.35);
}

/* 软件信息 */
.software-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.software-desc {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  height: 2.6em;
}

.software-platforms {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.platform-badge {
  padding: 0.2rem 0.4rem;
  font-size: 0.7rem;
  border-radius: 10px;
  color: white;
  font-weight: 600;
}

.platform-badge.windows {
  background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
}

.platform-badge.mac {
  background: linear-gradient(135deg, #000000 0%, #434343 100%);
}

.platform-badge.android {
  background: linear-gradient(135deg, #3ddc84 0%, #2aa366 100%);
}

.platform-badge.ios {
  background: linear-gradient(135deg, #007aff 0%, #0055b0 100%);
}

.platform-badge.mobile {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.platform-badge.web {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.software-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #718096;
  margin-top: auto;
}

.software-meta span {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 3rem 2rem;
  color: #718096;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-results h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: rgba(72, 187, 120, 0.1);
  color: #2d3748;
  transform: translateY(-1px);
}

.page-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: translateY(-1px);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  color: #a0aec0;
}

.prev-btn,
.next-btn {
  font-size: 1rem;
  font-weight: 700;
}

.page-total {
  color: #4a5568;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0 1rem;
  white-space: nowrap;
}

/* 页面跳转 */
.page-jump {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  position: relative;
}

.jump-label {
  color: #4a5568;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.jump-input {
  width: 60px;
  padding: 0.4rem 0.8rem;
  border: 2px solid rgba(72, 187, 120, 0.3);
  border-radius: 20px;
  font-size: 0.9rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.jump-input:focus {
  border-color: rgba(72, 187, 120, 0.6);
  box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.2);
  outline: none;
}

.jump-btn {
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(56, 161, 105, 0.3);
}

.jump-btn:hover {
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(56, 161, 105, 0.4);
}

.jump-btn:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(56, 161, 105, 0.3);
}

.jump-error {
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(247, 83, 83, 0.95);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  animation: fadeIn 0.3s ease forwards;
  z-index: 10;
  white-space: nowrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1800px) {
  .software-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 1500px) {
  .software-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1200px) {
  .software-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .software-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .search-box {
    width: 200px;
  }

  .filter-header {
    flex-direction: column;
    gap: 1rem;
  }

  .platform-tabs,
  .category-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.5rem;
  }

  .software-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .software-card {
    padding: 0.8rem;
    min-height: 160px;
  }

  .software-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .software-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .search-box {
    width: 100%;
  }
}
</style>
