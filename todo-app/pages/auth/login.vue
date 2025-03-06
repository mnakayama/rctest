<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import LoginForm from '~/components/auth/LoginForm.vue';

useHead({
  title: 'ログイン - TODO List Manager',
});

definePageMeta({
  middleware: ['guest'],
  layout: 'auth',
});
</script>
