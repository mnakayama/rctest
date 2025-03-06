<template>
  <div class="card w-full max-w-md bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl font-bold mb-6">ログイン</h2>
      
      <form @submit.prevent="handleSubmit">
        <div v-if="error" class="alert alert-error mb-4">
          <div class="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
            <label>{{ error }}</label>
          </div>
        </div>

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

        <div class="form-control">
          <label class="label">
            <span class="label-text">パスワード</span>
          </label>
          <input 
            type="password" 
            v-model="form.password" 
            placeholder="パスワード" 
            class="input input-bordered" 
            :class="{ 'input-error': errors.password }"
            required
          />
          <label v-if="errors.password" class="label">
            <span class="label-text-alt text-error">{{ errors.password }}</span>
          </label>
          <label class="label">
            <NuxtLink to="/auth/reset-password" class="label-text-alt link link-hover">
              パスワードをお忘れですか？
            </NuxtLink>
          </label>
        </div>

        <div class="form-control mt-6">
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            ログイン
          </button>
        </div>

        <div class="text-center mt-4">
          <p>
            アカウントをお持ちでないですか？
            <NuxtLink to="/auth/register" class="link link-primary">新規登録</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { loginSchema } from '~/utils/validation';
import type { LoginFormData } from '~/types';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive<LoginFormData>({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const errors = reactive<Record<string, string>>({});

const validateForm = () => {
  errors.email = '';
  errors.password = '';
  
  try {
    loginSchema.parse(form);
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
    const result = await authStore.login(form.email, form.password);
    
    if (result.success) {
      // ログイン成功
      router.push('/');
    } else {
      error.value = result.error as string;
    }
  } catch (err: any) {
    error.value = err.message || 'ログイン中にエラーが発生しました';
  } finally {
    loading.value = false;
  }
};
</script>
