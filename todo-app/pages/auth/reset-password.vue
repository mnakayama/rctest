<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <ResetPasswordForm />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import ResetPasswordForm from '~/components/auth/ResetPasswordForm.vue';

useHead({
  title: 'パスワードリセット - TODO List Manager',
});

definePageMeta({
  middleware: ['guest'],
  layout: 'auth',
});
</script>
