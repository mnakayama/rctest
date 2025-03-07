<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-64px)]">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-center">新規ユーザー登録</h2>
        
        <form @submit.prevent="handleRegister">
          <!-- エラーメッセージ -->
          <div v-if="userStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{{ userStore.error }}</span>
          </div>
          
          <!-- メールアドレス -->
          <div class="mb-4">
            <label class="font-medium mb-1 block" for="email">メールアドレス</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="border border-gray-300 rounded w-full py-2 px-3"
              placeholder="example@example.com"
              required
              :disabled="userStore.isLoading"
            />
            <div v-if="v$.email.$error" class="text-red-500 text-sm mt-1">
              {{ v$.email.$errors[0].$message }}
            </div>
          </div>
          
          <!-- 名前 -->
          <div class="mb-4">
            <label class="font-medium mb-1 block" for="name">名前</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="border border-gray-300 rounded w-full py-2 px-3"
              placeholder="名前を入力"
              required
              :disabled="userStore.isLoading"
            />
            <div v-if="v$.name.$error" class="text-red-500 text-sm mt-1">
              {{ v$.name.$errors[0].$message }}
            </div>
          </div>
          
          <!-- パスワード -->
          <div class="mb-4">
            <label class="font-medium mb-1 block" for="password">パスワード</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="border border-gray-300 rounded w-full py-2 px-3"
              placeholder="パスワードを入力"
              required
              :disabled="userStore.isLoading"
            />
            <div v-if="v$.password.$error" class="text-red-500 text-sm mt-1">
              {{ v$.password.$errors[0].$message }}
            </div>
          </div>
          
          <!-- パスワード確認 -->
          <div class="mb-6">
            <label class="font-medium mb-1 block" for="passwordConfirm">パスワード確認</label>
            <input
              id="passwordConfirm"
              v-model="passwordConfirm"
              type="password"
              class="border border-gray-300 rounded w-full py-2 px-3"
              placeholder="パスワードを再入力"
              required
              :disabled="userStore.isLoading"
            />
            <div v-if="v$.passwordConfirm.$error" class="text-red-500 text-sm mt-1">
              {{ v$.passwordConfirm.$errors[0].$message }}
            </div>
          </div>
          
          <!-- 登録ボタン -->
          <div class="mb-4">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              :disabled="userStore.isLoading"
            >
              <span v-if="userStore.isLoading" class="inline-block animate-spin mr-2">&#8635;</span>
              登録する
            </button>
          </div>
          
          <!-- ログインリンク -->
          <div class="text-center">
            <p>
              すでにアカウントをお持ちの方は
              <NuxtLink to="/login" class="text-blue-500 hover:text-blue-700">ログイン</NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { useUserStore } from '~/stores/user'

// ゲストミドルウェアを適用
// @ts-ignore
definePageMeta({
  middleware: ['guest']
})

// ユーザーストア
const userStore = useUserStore()

// フォームの状態
const email = ref('')
const name = ref('')
const password = ref('')
const passwordConfirm = ref('')

// バリデーションルール
const rules = {
  email: { required, email },
  name: { required, minLength: minLength(2) },
  password: { required, minLength: minLength(8) },
  passwordConfirm: {
    required,
    sameAsPassword: sameAs(computed(() => password.value))
  }
}

// Vuelidateの初期化
const v$ = useVuelidate(rules, { email, name, password, passwordConfirm })

// 登録処理
const handleRegister = async () => {
  // バリデーションチェック
  const isValid = await v$.value.$validate()
  if (!isValid) return
  
  // 登録処理
  const success = await userStore.register({
    email: email.value,
    name: name.value,
    password: password.value
  })
  
  // 登録成功時はホームページにリダイレクト
  if (success) {
    // @ts-ignore
    navigateTo('/')
  }
}

// ページタイトルの設定
// @ts-ignore
useHead({
  title: '新規ユーザー登録 - TODO App'
})
</script>
