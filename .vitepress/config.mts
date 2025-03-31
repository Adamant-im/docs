import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ADAMANT Node',
  description: 'ADAMANT Documentation',
  /* prettier-ignore */
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/icons/site.webmanifest' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/android-chrome-192x192.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icons/android-chrome-512x512.png' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    outline: 'deep',
    editLink: {
      pattern: 'https://github.com/adamant-im/docs/edit/main/:path',
    },
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Installation', link: '/installation' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'Testnet', link: '/testnet' },
        ],
      },
      {
        text: 'Essentials',
        items: [
          {
            text: 'Generating Account',
            link: '/essentials/generating-account',
          },
          {
            text: 'Signing Transactions',
            link: '/essentials/signing-transactions',
          },
          {
            text: 'Encrypting & Decrypting Messages',
            link: '/essentials/encrypting-messages',
          },
          {
            text: 'Storing Data in KVS',
            link: '/essentials/storing-data-in-kvs',
          },
          {
            text: 'Working with Contact List',
            link: '/essentials/working-with-contact-list',
          },
        ],
      },
      {
        text: 'API Specifications',
        items: [
          { text: 'Transactions', link: '/api/transaction-types' },
          { text: 'Message Types', link: '/api/message-types' },
          {
            text: 'Transactions Query Language',
            link: '/api/transactions-query-language',
          },
          { text: 'WebSocket', link: '/api/websocket' },
        ],
      },
      {
        text: 'API Endpoints',
        items: [
          { text: 'Accounts', link: '/api-endpoints/accounts' },
          { text: 'Blocks', link: '/api-endpoints/blocks' },
          { text: 'Chats and Chatrooms', link: '/api-endpoints/chatrooms' },
          { text: 'Delegates', link: '/api-endpoints/delegates' },
          { text: 'Node & Blockchain', link: '/api-endpoints/blockchain' },
          {
            text: 'States: Key-Value Storage',
            link: '/api-endpoints/kvs',
          },
          { text: 'Transactions', link: '/api-endpoints/transactions' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Swift (iOS)', link: '/examples/swift' },
          { text: 'Java', link: '/examples/java' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/adamant-im/adamant' },
    ],
  },
});
