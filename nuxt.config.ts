// https://nuxt.com/docs/api/configuration/nuxt-config
// TypeScriptの型エラーを無視するためのコメント
// @ts-ignore
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: {
      level: 2 // 0-2
    }
  },

  runtimeConfig: {
    // サーバーサイド専用の機密変数
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
    
    // クライアント側に公開可能な変数
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000'
    }
  },

  typescript: {
    strict: true
  },

  compatibilityDate: '2025-03-06'
})