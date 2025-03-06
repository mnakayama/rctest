<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import RegisterForm from '~/components/auth/RegisterForm.vue';

useHead({
  title: '新規登録 - TODO List Manager',
});

definePageMeta({
  middleware: ['guest'],
  layout: 'auth',
});
</script>
