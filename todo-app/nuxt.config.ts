// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt'],

  runtimeConfig: {
    // サーバーサイド専用の機密変数
    csrfSecret: process.env.NUXT_CSRF_SECRET,

    // PostgreSQL接続情報
    postgres: {
      host: process.env.POSTGRES_HOST || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT as string) || 5432,
      database: process.env.POSTGRES_DB || 'postgres',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
    },

    // クライアント側に公開可能な変数
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'TODO List Manager',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },
  app: {
    head: {
      title: process.env.NUXT_PUBLIC_APP_NAME || 'TODO List Manager',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '詳細なTODOリスト管理アプリケーション',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  nitro: {
    externals: {
      inline: ['@prisma/client'],
    },
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin':
            process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "connect-src 'self'",
            "font-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
          ].join('; '),
        },
      },
    },
  },
  typescript: {
    strict: true,
  },
  tailwindcss: {
    config: {
      plugins: [require('daisyui')],
      daisyui: {
        themes: ['light', 'dark'],
      },
    },
  },
});
