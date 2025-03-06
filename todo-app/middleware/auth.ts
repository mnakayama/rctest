import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // クライアントサイドでのみ実行
  if (process.client) {
    const authStore = useAuthStore();

    // ユーザー情報がまだ取得されていない場合は取得
    if (!authStore.isAuthenticated && !authStore.loading) {
      await authStore.fetchUser();
    }

    // 認証されていない場合はログインページにリダイレクト
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login');
    }
  }
});
