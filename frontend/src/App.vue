<template>
  <router-view v-if="$route.path === '/login'" />
  <Layout v-else />
</template>

<script setup>
import Layout from './components/Layout/Layout.vue';
</script>
