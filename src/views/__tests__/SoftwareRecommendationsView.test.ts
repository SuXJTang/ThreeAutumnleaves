import { describe, it, expect } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SoftwareRecommendationsView from '../SoftwareRecommendationsView.vue'

// 创建测试用的路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: '<div>Home</div>' },
    },
    {
      path: '/software-recommendations',
      name: 'software-recommendations',
      component: SoftwareRecommendationsView,
    },
  ],
})

// 创建一个全局组件存根，用于BackButton组件
const globalStubs = {
  stubs: {
    BackButton: true, // 使用自动生成的存根
  },
}

describe('SoftwareRecommendationsView', () => {
  it('renders properly', async () => {
    const wrapper = shallowMount(SoftwareRecommendationsView, {
      global: {
        plugins: [router],
        ...globalStubs,
      },
    })

    await flushPromises()
    expect(wrapper.find('.software-recommendations-view').exists()).toBe(true)
  })
})
