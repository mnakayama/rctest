import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  
  // ユーザー情報がまだ取得されていない場合は取得
  if (!authStore.isAuthenticated && !authStore.loading) {
    await authStore.fetchUser();
  }
  
  // 認証済みの場合はホームページにリダイレクト
  if (authStore.isAuthenticated) {
    return navigateTo('/');
  }
});
