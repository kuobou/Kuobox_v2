<template>
  <div class="panel p-5">
    <div class="flex items-center justify-between">
      <div class="text-xs font-semibold uppercase text-neutral-500">{{ label }}</div>
      <div class="h-2 w-2 rounded-full" :class="dotClass"></div>
    </div>
    <div class="metric-value mt-4 text-3xl font-semibold tracking-normal text-neutral-950">{{ value }}</div>
    <div v-if="sub" class="mt-1 text-xs text-neutral-500">{{ sub }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ label: String, value: [String, Number], sub: String });

const dotClass = computed(() => {
  if (String(props.value).includes('inactive') || String(props.value).includes('failed')) return 'bg-red-500';
  if (String(props.value).includes('active')) return 'bg-emerald-500';
  return 'bg-neutral-300';
});
</script>
