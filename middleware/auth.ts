import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  // 認証が必要なページにアクセスしようとしているが、認証されていない場合
  if (!userStore.isAuthenticated) {
    // ログインページにリダイレクト
    return navigateTo('/login')
  }
})
