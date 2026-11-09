import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/Ascent/',
  title: 'Ascent',
  description: 'A Roblox Studio template for Eternal Towers of Hell-style fangames.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/Ascent/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#7c3aed' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Ascent' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'A Roblox Studio template for Eternal Towers of Hell-style fangames.',
      },
    ],
  ],
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Vexx3/Ascent', ariaLabel: 'Ascent on GitHub' },
      { icon: 'discord', link: 'https://discord.gg/TbqyC2hJRH', ariaLabel: 'Ascent Discord' },
    ],
    nav: [
      { text: 'Start Here', link: '/guide/getting-started' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'API', link: '/guide/api' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Get the kit', link: '/guide/getting-started#getting-the-kit' },
      {
        text: 'Plugin',
        link: 'https://create.roblox.com/store/asset/133971753175712/Ascent-Setup',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Start Here',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Studio Structure', link: '/guide/studio-structure' },
            { text: 'Configuration Reference', link: '/guide/configuration' },
            { text: 'Ascent Setup Plugin', link: '/guide/tower-setup-plugin' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          ],
        },
        {
          text: 'Towers',
          items: [
            { text: 'Building a Tower', link: '/guide/tower-setup' },
            { text: 'Winpads & Endings', link: '/guide/winpads-endings' },
            { text: 'Difficulties', link: '/guide/difficulties' },
            { text: 'Markers & Portals', link: '/guide/markers-portals' },
            { text: 'Client-Sided Objects', link: '/guide/client-objects' },
            { text: 'Tower Rushes', link: '/guide/tower-rushes' },
            { text: 'Practice & All Jumps', link: '/guide/practice-all-jumps' },
            { text: 'Saved Runs', link: '/guide/saved-runs' },
            { text: 'Modifiers', link: '/guide/modifiers' },
          ],
        },
        {
          text: 'Worlds & Hub',
          items: [
            { text: 'Worlds, Areas & Personal Servers', link: '/guide/worlds-personal-servers' },
            { text: 'The Hub (Ring Select)', link: '/guide/ring-select' },
          ],
        },
        {
          text: 'Rewards',
          items: [
            { text: 'Tickets & Shop', link: '/guide/ticket-shop' },
            { text: 'Cosmetics', link: '/guide/cosmetics' },
            { text: 'Game Passes', link: '/guide/game-passes' },
            { text: 'Player Elo', link: '/guide/elo' },
            { text: 'Badges', link: '/guide/badges' },
            { text: 'Tools', link: '/guide/boost-items' },
          ],
        },
        {
          text: 'Menus & Settings',
          items: [
            { text: 'UI & HUD', link: '/guide/ui-and-hud' },
            { text: 'Styling the Menu & HUD', link: '/guide/styling' },
            { text: 'Settings', link: '/guide/settings' },
          ],
        },
        {
          text: 'Chat & Staff',
          items: [
            { text: 'Chat', link: '/guide/chat' },
            { text: 'Announcements & Webhooks', link: '/guide/announcements-webhooks' },
            { text: 'Admin Commands', link: '/guide/commands' },
          ],
        },
        {
          text: 'For Developers',
          items: [
            { text: 'Hooking Into the Kit', link: '/guide/hooks' },
            { text: 'Adding a Saved Setting', link: '/guide/custom-settings' },
            { text: 'Extending the Kit', link: '/guide/extending-gameplay' },
            { text: 'API Reference', link: '/guide/api' },
            { text: 'Player Data', link: '/guide/player-data' },
          ],
        },
        {
          text: 'Updating',
          items: [
            { text: 'Updating Ascent', link: '/guide/updating' },
            { text: 'Moving an Old Kit Across', link: '/guide/migrating' },
            { text: 'Changelog', link: '/changelog' },
          ],
        },
      ],
    },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    editLink: {
      pattern: 'https://github.com/Vexx3/Ascent/edit/main/docs/:path',
      text: 'Suggest a change to this page',
    },
    footer: {
      message:
        'Ascent is an unofficial template for Eternal Towers of Hell-style fangames. Not affiliated with Eternal Towers of Hell or its developers.',
      copyright: 'Built for Roblox Studio.',
    },
    externalLinkIcon: true,
  },
})
