<template>
  <header class="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
    <div>
      <div class="text-sm font-medium">Web Panel</div>
      <div class="text-xs text-slate-500">一鍵管理落地機協議與中轉轉發</div>
    </div>
    <button class="btn" @click="onLogout">登出</button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();

async function onLogout() {
  await auth.logout();
  router.push('/login');
}
</script>
