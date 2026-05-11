<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <StatusCard label="Upload" :value="bytes(status?.traffic?.upload)" />
    <StatusCard label="Download" :value="bytes(status?.traffic?.download)" />
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
