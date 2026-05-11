<template>
  <div class="min-h-screen">
    <Sidebar />
    <div class="pl-64">
      <Header />
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
</script>
