<template>
  <div class="space-y-5">
    <div>
      <h1 class="page-title">日誌</h1>
      <p class="page-subtitle">讀取 RelayPanel 與核心服務的 systemd journal。</p>
    </div>
    <div class="panel p-4">
      <div class="mb-3 flex gap-2">
        <select v-model="service" class="input max-w-48">
          <option value="relay-panel">relay-panel</option>
          <option value="xray">xray</option>
          <option value="sing-box">sing-box</option>
          <option value="realm">realm</option>
          <option value="gost">gost</option>
        </select>
        <button class="btn btn-primary" @click="load">讀取</button>
      </div>
      <pre class="min-h-96 overflow-auto bg-neutral-950 p-4 text-xs leading-6 text-neutral-100">{{ logs }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { systemLogs } from '../api/system';

const service = ref('relay-panel');
const logs = ref('');

async function load() {
  logs.value = (await systemLogs({ service: service.value, lines: 200 })).data.logs;
}
</script>
