<template>
  <div class="space-y-5">
    <div>
      <h1 class="page-title">流量統計</h1>
      <p class="page-subtitle">從系統網卡資料讀取目前累計上傳與下載流量。</p>
    </div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <StatusCard label="Upload" :value="bytes(status?.traffic?.upload)" />
      <StatusCard label="Download" :value="bytes(status?.traffic?.download)" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import StatusCard from '../components/StatusCard.vue';
import { systemStatus } from '../api/system';

const status = ref(null);

function bytes(value = 0) {
  if (value > 1024 ** 3) return `${(value / 1024 ** 3).toFixed(2)} GB`;
  if (value > 1024 ** 2) return `${(value / 1024 ** 2).toFixed(2)} MB`;
  if (value > 1024) return `${(value / 1024).toFixed(2)} KB`;
  return `${value || 0} B`;
}

onMounted(async () => {
  status.value = (await systemStatus()).data;
});
</script>
