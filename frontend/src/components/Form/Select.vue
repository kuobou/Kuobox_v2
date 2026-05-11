<template>
  <label class="block">
    <span class="mb-1 block text-xs font-medium text-neutral-500">{{ label }}</span>
    <select class="input" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </label>
</template>

<script setup>
defineProps({ label: String, modelValue: [String, Number], options: Array });
defineEmits(['update:modelValue']);
</script>
