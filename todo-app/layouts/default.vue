<template>
  <div class="min-h-screen flex flex-col">
    <header class="navbar bg-base-100 shadow-md">
      <div class="container mx-auto">
        <div class="flex-1">
          <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">{{ appName }}</NuxtLink>
        </div>
        <div class="flex-none">
          <div v-if="isAuthenticated" class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img :src="userAvatar" alt="User avatar" />
              </div>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <NuxtLink to="/profile" class="justify-between">
                  プロファイル
                </NuxtLink>
              </li>
              <li><a @click="logout">ログアウト</a></li>
            </ul>
          </div>
          <div v-else class="flex gap-2">
            <NuxtLink to="/auth/login" class="btn btn-ghost">ログイン</NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn-primary">登録</NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow container mx-auto py-8 px-4">
      <slot />
    </main>

    <footer class="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>© {{ new Date().getFullYear() }} {{ appName }} - All rights reserved</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const appName = config.public.appName;
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userAvatar = computed(() => {
  return authStore.currentUser?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(authStore.currentUser?.display_name || authStore.currentUser?.email || 'User');
});

const logout = async () => {
  await authStore.logout();
  navigateTo('/auth/login');
};
</script>
