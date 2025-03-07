<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-64px)]">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-center">ログイン</h2>

        <form @submit.prevent="handleLogin">
          <!-- エラーメッセージ -->
          <div
            v-if="userStore.error"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          >
            <span>{{ userStore.error }}</span>
          </div>

          <!-- メールアドレス -->
          <div class="mb-4">
            <label class="font-medium mb-1 block" for="email"
              >メールアドレス</label
            >
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

          <!-- パスワード -->
          <div class="mb-6">
            <label class="font-medium mb-1 block" for="password"
              >パスワード</label
            >
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

          <!-- ログインボタン -->
          <div class="mb-4">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              :disabled="userStore.isLoading"
            >
              <span
                v-if="userStore.isLoading"
                class="inline-block animate-spin mr-2"
                >&#8635;</span
              >
              ログイン
            </button>
          </div>

          <!-- 新規登録リンク -->
          <div class="text-center">
            <p>
              アカウントをお持ちでない方は
              <NuxtLink to="/register" class="text-blue-500 hover:text-blue-700"
                >新規登録</NuxtLink
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, definePageMeta, useHead, navigateTo } from '#imports';
import {
  required,
  email as emailValidator,
  minLength,
} from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useUserStore } from '../stores/user';

// フォームの状態
const email = ref('');
const password = ref('');

// ページメタデータ
definePageMeta({
  middleware: ['guest'],
});

// ユーザーストア
const userStore = useUserStore();

// バリデーションルール
const rules = {
  email: { required, email: emailValidator },
  password: { required, minLength: minLength(8) },
};

// Vuelidateの初期化
const v$ = useVuelidate(rules, { email, password });

// ログイン処理
const handleLogin = async () => {
  // バリデーションチェック
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  // ログイン処理
  const success = await userStore.login({
    email: email.value,
    password: password.value,
  });

  // ログイン成功時はホームページにリダイレクト
  if (success) {
    await navigateTo('/');
  }
};

// ページタイトルの設定
useHead({
  title: 'ログイン - TODO App',
});
</script>
