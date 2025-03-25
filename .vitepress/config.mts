import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ADAMANT Node',
  description: 'ADAMANT Documentation',
  themeConfig: {
    logo: '/logo.svg',
    outline: 'deep',
    // https://vitepress.dev/reference/default-theme-config
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/installation' },
          { text: 'Configuration', link: '/configuration' },
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
