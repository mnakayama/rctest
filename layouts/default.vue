<template>
  <div>
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-blue-600">TODO App</NuxtLink>
        <div v-if="userStore.isAuthenticated">
          <div class="relative">
            <button @click="isDropdownOpen = !isDropdownOpen" class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
              <span class="text-lg font-bold">{{ userInitial }}</span>
            </button>
            <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a @click="userStore.logout" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                ログアウト
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="container mx-auto py-6 px-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const isDropdownOpen = ref(false)

// ユーザー名の頭文字を取得
const userInitial = computed(() => {
  if (!userStore.user?.name) return '?'
  return userStore.user.name.charAt(0).toUpperCase()
})
</script>
