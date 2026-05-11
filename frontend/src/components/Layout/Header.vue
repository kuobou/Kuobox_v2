<template>
  <header class="sticky top-0 z-10 border-b border-black/10 bg-white/70 px-4 backdrop-blur-2xl md:px-8">
    <div class="flex h-16 items-center justify-between">
      <div>
        <div class="text-sm font-semibold text-neutral-950">Web Panel</div>
        <div class="text-xs text-neutral-500">一鍵管理落地機協議與中轉轉發</div>
      </div>
      <button class="btn" @click="onLogout">登出</button>
    </div>
    <nav class="flex gap-2 overflow-x-auto pb-3 text-sm md:hidden">
      <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="shrink-0 rounded-md px-3 py-2 text-neutral-600" active-class="bg-white text-blue-600 shadow-sm ring-1 ring-black/5">
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const items = [
  { to: '/', label: 'Dashboard' },
  { to: '/nodes', label: '節點' },
  { to: '/protocols', label: '協議' },
  { to: '/relays', label: '中轉' },
  { to: '/traffic', label: '流量' },
  { to: '/logs', label: '日誌' },
  { to: '/settings', label: '設定' }
];

async function onLogout() {
  await auth.logout();
  router.push('/login');
}
</script>
