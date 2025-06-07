import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SoftwareRecommendationsView from '../SoftwareRecommendationsView.vue'

describe('SoftwareRecommendationsView', () => {
  it('renders properly', () => {
    const wrapper = mount(SoftwareRecommendationsView)
    expect(wrapper.find('.software-recommendations-view').exists()).toBe(true)
  })

  it('displays filter section', () => {
    const wrapper = mount(SoftwareRecommendationsView)
    expect(wrapper.find('.filter-section').exists()).toBe(true)
    expect(wrapper.find('.search-input').exists()).toBe(true)
  })

  it('displays software grid', () => {
    const wrapper = mount(SoftwareRecommendationsView)
    expect(wrapper.find('.software-grid').exists()).toBe(true)
  })

  it('displays software cards', () => {
    const wrapper = mount(SoftwareRecommendationsView)
    const cards = wrapper.findAll('.software-card')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('has platform filter buttons', () => {
    const wrapper = mount(SoftwareRecommendationsView)
    const platformTabs = wrapper.findAll('.platform-tab')
    expect(platformTabs.length).toBe(5) // all, windows, mac, android, ios
  })

  it('has category filter buttons', () => {
    const wrapper = mount(SoftwareRecommendationsView)
    const categoryTabs = wrapper.findAll('.category-tab')
    expect(categoryTabs.length).toBe(8) // all + 7 categories
  })
})
