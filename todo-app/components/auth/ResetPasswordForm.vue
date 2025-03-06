<template>
  <div class="card w-full max-w-md bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl font-bold mb-6">パスワードリセット</h2>
      
      <div v-if="success" class="alert alert-success mb-4">
        <div class="flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <label>パスワードリセットのリンクをメールで送信しました。メールをご確認ください。</label>
        </div>
      </div>
      
      <form v-if="!success" @submit.prevent="handleSubmit">
        <div v-if="error" class="alert alert-error mb-4">
          <div class="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
            <label>{{ error }}</label>
          </div>
        </div>

        <p class="mb-4 text-sm">
          登録したメールアドレスを入力してください。パスワードリセット用のリンクをメールで送信します。
        </p>

        <div class="form-control">
          <label class="label">
            <span class="label-text">メールアドレス</span>
          </label>
          <input 
            type="email" 
            v-model="form.email" 
            placeholder="example@example.com" 
            class="input input-bordered" 
            :class="{ 'input-error': errors.email }"
            required
          />
          <label v-if="errors.email" class="label">
            <span class="label-text-alt text-error">{{ errors.email }}</span>
          </label>
        </div>

        <div class="form-control mt-6">
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            リセットリンクを送信
          </button>
        </div>

        <div class="text-center mt-4">
          <NuxtLink to="/auth/login" class="link link-primary">
            ログイン画面に戻る
          </NuxtLink>
        </div>
      </form>

      <div v-if="success" class="text-center mt-4">
        <NuxtLink to="/auth/login" class="btn btn-primary">
          ログイン画面に戻る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { resetPasswordSchema } from '~/utils/validation';
import type { ResetPasswordFormData } from '~/types';

const authStore = useAuthStore();

const form = reactive<ResetPasswordFormData>({
  email: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const errors = reactive<Record<string, string>>({});

const validateForm = () => {
  errors.email = '';
  
  try {
    resetPasswordSchema.parse(form);
    return true;
  } catch (err: any) {
    if (err.errors) {
      err.errors.forEach((e: any) => {
        if (e.path) {
          errors[e.path[0]] = e.message;
        }
      });
    }
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const result = await authStore.resetPassword(form.email);
    
    if (result.success) {
      success.value = true;
    } else {
      error.value = result.error as string;
    }
  } catch (err: any) {
    error.value = err.message || 'パスワードリセット処理中にエラーが発生しました';
  } finally {
    loading.value = false;
  }
};
</script>
