<template>
  <button class="btn" :class="{ 'btn-primary': primary }">
    <slot />
  </button>
</template>

<script setup>
defineProps({ primary: Boolean });
</script>
