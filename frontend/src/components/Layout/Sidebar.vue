<template>
  <aside class="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white">
    <div class="border-b border-slate-200 px-5 py-4">
      <div class="text-lg font-semibold">RelayPanel</div>
      <div class="text-xs text-slate-500">Landing / Relay / Hybrid</div>
    </div>
    <nav class="p-3 text-sm">
      <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" active-class="bg-blue-50 text-blue-700">
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
const items = [
  { to: '/', label: 'Dashboard' },
  { to: '/nodes', label: '節點管理' },
  { to: '/protocols', label: '協議管理' },
  { to: '/relays', label: '中轉規則' },
  { to: '/traffic', label: '流量統計' },
  { to: '/logs', label: '日誌' },
  { to: '/settings', label: '設定' }
];
</script>
