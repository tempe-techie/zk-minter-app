import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@wagmi/vue/nuxt'],
  css: [
    'v-calendar/style.css'
  ],
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
  runtimeConfig: {
    public: {
      blockExplorerBaseUrl: {
        300: 'https://sepolia.explorer.zksync.io',
        324: 'https://era.zksync.network',
      },
      chainCurrency: {
        300: 'ETH',
        324: 'ETH',
      },
      factoryAddress: {
        "300": "0x329CE320a0Ef03F8c0E01195604b5ef7D3Fb150E",
        "324": "0x0400E6bc22B68686Fb197E91f66E199C6b0DDD6a"
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
      zkTokenAddress: {
        300: '0xbE6B3B0668d40FA042E2209462ED660AAf5874c7',
        324: '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E',
      },
    }
  }
})