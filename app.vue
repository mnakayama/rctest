<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';

// アプリケーションのエントリーポイント
const userStore = useUserStore();

// 認証状態の初期化
onMounted(() => {
  userStore.initAuth();
});
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
