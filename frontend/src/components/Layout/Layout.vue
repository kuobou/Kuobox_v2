<template>
  <div class="min-h-screen">
    <Sidebar />
    <div class="md:pl-64">
      <Header />
      <main class="mx-auto max-w-7xl p-4 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
</script>
