import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

vi.mock('../src/config', () => ({
  loadConfig: vi.fn().mockResolvedValue(undefined),
  getConfig: vi.fn().mockReturnValue({}),
}))

describe('App', () => {
  it('mounts without error', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })
})
