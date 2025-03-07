import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  // すでに認証されている場合は、ホームページにリダイレクト
  if (userStore.isAuthenticated) {
    return navigateTo('/')
  }
})
