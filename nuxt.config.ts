import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@wagmi/vue/nuxt'],
  compatibilityDate: '2025-01-16',
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          charset: 'utf-8',
        },
      ],
      link: [
        {
          // Bootstrap
          rel: 'stylesheet',
          href: '/css/bootstrap.css',
        },
        {
          // Bootstrap icons
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
        },
        {
          // Custom
          rel: 'stylesheet',
          href: '/css/custom.css',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
        },
      ],
    },
  },
  components: false,
  css: ['vue-toastification/dist/index.css'],
  runtimeConfig: {
    public: {
      blockExplorerBaseUrl: {
        300: 'https://sepolia.explorer.zksync.io',
        324: 'https://era.zksync.network',
      },
      favicon: '/img/favicon.svg',
      projectMetadataTitle: 'ZK Minter Launcher',
      projectDescription: 'A web3 app that helps you launch a ZK Capped Minter V2 smart contract via the official ZkCappedMinterV2Factory.sol contract.',
      projectUrl: 'https://zkminter.org',
      projectTwitter: '@PunkDomains',
      previewImage: '/img/preview.png',
      supportedChains: [
        { chainId: 324, networkName: 'ZKsync Era' },
        { chainId: 300, networkName: 'ZKsync Testnet' },
      ],
      testVar: "test",
      wcProjectId: process.env.NUXT_PUBLIC_WC_PROJECT_ID,
    }
  }
})