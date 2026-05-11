<template>
  <aside class="fixed left-0 top-0 hidden h-screen w-64 border-r border-black/10 bg-white/70 backdrop-blur-2xl md:block">
    <div class="border-b border-black/10 px-5 py-5">
      <div class="flex items-center gap-3">
        <div class="grid h-8 w-8 place-items-center rounded-md bg-neutral-950 text-sm font-semibold text-white">R</div>
        <div>
          <div class="text-[15px] font-semibold text-neutral-950">RelayPanel</div>
          <div class="text-xs text-neutral-500">Landing / Relay / Hybrid</div>
        </div>
      </div>
    </div>
    <nav class="space-y-1 p-3 text-sm">
      <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="flex items-center justify-between rounded-md px-3 py-2.5 text-neutral-600 transition hover:bg-white hover:text-neutral-950" active-class="bg-white text-blue-600 shadow-sm ring-1 ring-black/5">
        <span>{{ item.label }}</span>
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
