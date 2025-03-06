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

  // CSS設定
  css: ['~/assets/css/main.css'],

  // Tailwind設定
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: false,
  },

  // Supabase設定
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/'],
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
      },
    },
  },

  // ランタイム設定
  runtimeConfig: {
    // サーバーサイド専用の設定
    apiSecret: process.env.API_SECRET,
    port: process.env.PORT || '3000',

    // クライアントサイドでも利用可能な設定
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    },
  },
})
