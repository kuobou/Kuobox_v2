<template>
  <div class="panel p-4">
    <div class="text-xs font-medium text-slate-500">{{ label }}</div>
    <div class="mt-2 text-2xl font-semibold">{{ value }}</div>
    <div v-if="sub" class="mt-1 text-xs text-slate-500">{{ sub }}</div>
  </div>
</template>

<script setup>
defineProps({ label: String, value: [String, Number], sub: String });
</script>
