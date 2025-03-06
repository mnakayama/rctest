import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export default defineNuxtPlugin({
  name: 'prisma',
  enforce: 'pre',
  async setup() {
    const nuxtApp = useNuxtApp();

    // PrismaClientのインスタンスをサーバーサイドでのみ作成
    if (!prisma) {
      prisma = new PrismaClient({
        log:
          process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
      });
    }

    // nuxtAppにPrismaClientを追加
    nuxtApp.provide('prisma', prisma);

    // クライアントサイドでは空のオブジェクトを返す
    return {
      provide: {
        prisma: process.server ? prisma : {},
      },
    };
  },
});
