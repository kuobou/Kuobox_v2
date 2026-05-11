<template>
  <div class="space-y-5">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatusCard label="Xray" :value="service('xray')" />
      <StatusCard label="sing-box" :value="service('sing-box')" />
      <StatusCard label="Realm" :value="service('realm')" />
      <StatusCard label="Gost" :value="service('gost')" />
    </div>

    <div class="panel p-4">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="font-semibold">服務控制</h2>
        <button class="btn" @click="refresh">刷新</button>
      </div>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div v-for="name in services" :key="name" class="rounded-md border border-slate-200 p-3">
          <div class="mb-3 font-medium">{{ name }}</div>
          <div class="flex gap-2">
            <button class="btn" @click="act(name, 'start')">啟動</button>
            <button class="btn" @click="act(name, 'restart')">重啟</button>
            <button class="btn" @click="act(name, 'stop')">停止</button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel p-4">
      <h2 class="mb-3 font-semibold">系統資訊</h2>
      <pre class="overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">{{ infoText }}</pre>
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
