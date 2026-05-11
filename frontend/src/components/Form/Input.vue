<template>
  <label class="block">
    <span class="mb-1 block text-xs font-medium text-neutral-500">{{ label }}</span>
    <input class="input" :value="modelValue" v-bind="$attrs" @input="$emit('update:modelValue', $event.target.value)" />
  </label>
</template>

<script setup>
defineProps({ label: String, modelValue: [String, Number] });
defineEmits(['update:modelValue']);
</script>
