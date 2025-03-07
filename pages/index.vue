<template>
  <div>
    <div v-if="userStore.isAuthenticated">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">TODOアプリへようこそ</h1>
        <p class="text-lg">{{ userStore.user?.name }}さん、今日も頑張りましょう！</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-xl">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">タスク管理</h2>
          <p class="mb-4">
            このアプリケーションでは、タスクの追加、編集、削除などの機能が利用できます。
            また、タスクのステータス管理や優先度の設定も可能です。
          </p>
          <div class="flex justify-center">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              タスク一覧を見る
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">TODOアプリへようこそ</h1>
        <p class="text-lg">効率的なタスク管理を始めましょう</p>
      </div>
      
      <div class="flex flex-col md:flex-row gap-4">
        <div class="bg-white rounded-lg shadow-xl flex-1">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">ログイン</h2>
            <p class="mb-4">
              すでにアカウントをお持ちの方は、ログインしてタスク管理を始めましょう。
            </p>
            <div class="flex justify-center">
              <NuxtLink to="/login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                ログイン
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-xl flex-1">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">新規登録</h2>
            <p class="mb-4">
              アカウントをお持ちでない方は、新規登録してタスク管理を始めましょう。
            </p>
            <div class="flex justify-center">
              <NuxtLink to="/register" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                新規登録
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

// ユーザーストア
const userStore = useUserStore()

// ページタイトルの設定
// @ts-ignore
useHead({
  title: 'ホーム - TODO App'
})

// 認証状態の初期化
onMounted(() => {
  userStore.initAuth()
})
</script>
