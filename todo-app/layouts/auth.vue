<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto py-8">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-3xl font-bold">
          {{ appName }}
        </NuxtLink>
      </div>
      
      <slot />
      
      <footer class="footer footer-center p-4 text-base-content mt-8">
        <div>
          <p>© {{ new Date().getFullYear() }} {{ appName }} - All rights reserved</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const appName = config.public.appName;
</script>
