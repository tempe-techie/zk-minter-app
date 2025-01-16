import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@wagmi/vue/nuxt'],
  compatibilityDate: '2025-01-16',
  runtimeConfig: {
    public: {
      testVar: "test",
      wcProjectId: process.env.NUXT_PUBLIC_WC_PROJECT_ID,
    }
  }
})