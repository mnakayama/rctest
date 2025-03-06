// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // モジュールの設定
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/supabase'],

  // アプリケーション設定
  app: {
    head: {
      title: 'TODO App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  // 開発者ツール
  devtools: { enabled: true },

  // TypeScript設定
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // コンポーネント設定
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Supabase設定
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/'],
    },
  },

  // ランタイム設定
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },

  compatibilityDate: '2025-03-06',
})