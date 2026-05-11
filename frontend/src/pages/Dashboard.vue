<template>
  <div class="space-y-5">
    <div>
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">服務狀態、系統健康度與核心控制集中在這裡。</p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatusCard label="Xray" :value="service('xray')" />
      <StatusCard label="sing-box" :value="service('sing-box')" />
      <StatusCard label="Realm" :value="service('realm')" />
      <StatusCard label="Gost" :value="service('gost')" />
    </div>

    <div class="panel overflow-hidden">
      <div class="flex items-center justify-between border-b border-black/10 px-5 py-4">
        <div>
          <h2 class="font-semibold text-neutral-950">服務控制</h2>
          <p class="mt-1 text-xs text-neutral-500">所有 systemctl 操作經由白名單 API 執行。</p>
        </div>
        <button class="btn" @click="refresh">刷新</button>
      </div>
      <div class="divide-y divide-black/10">
        <div v-for="name in services" :key="name" class="grid grid-cols-1 items-center gap-3 px-5 py-4 md:grid-cols-[1fr_auto]">
          <div>
            <div class="font-medium text-neutral-950">{{ name }}</div>
            <div class="mt-1 text-xs text-neutral-500">目前狀態：{{ service(name) }}</div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="btn" @click="act(name, 'start')">啟動</button>
            <button class="btn" @click="act(name, 'restart')">重啟</button>
            <button class="btn" @click="act(name, 'stop')">停止</button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel overflow-hidden">
      <div class="border-b border-black/10 px-5 py-4">
        <h2 class="font-semibold text-neutral-950">系統資訊</h2>
        <p class="mt-1 text-xs text-neutral-500">主機平台、負載、記憶體與磁碟摘要。</p>
      </div>
      <pre class="m-5 overflow-auto bg-neutral-950 p-4 text-xs leading-6 text-neutral-100">{{ infoText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import StatusCard from '../components/StatusCard.vue';
import { useSystemStore } from '../stores/system';
import { serviceAction } from '../api/system';

const system = useSystemStore();
const services = ['xray', 'sing-box', 'realm', 'gost'];
const infoText = computed(() => JSON.stringify(system.info || {}, null, 2));

function service(name) {
  return system.status?.services?.[name] || 'unknown';
}

async function refresh() {
  await system.refresh();
}

async function act(name, action) {
  await serviceAction(name, action);
  await refresh();
}

onMounted(refresh);
</script>
