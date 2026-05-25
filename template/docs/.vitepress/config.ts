import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '[[ project_name ]]',
  description: '[[ project_description ]]',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Getting Started', link: '/guide' }],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/[[ github_username ]]/[[ github_repo ]]' },
    ],
  },
})
