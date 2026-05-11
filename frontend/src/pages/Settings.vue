<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">設定</h1>
      <p class="page-subtitle">管理設定備份，更新與卸載保留給伺服器腳本執行。</p>
    </div>

    <div class="panel p-4">
      <h2 class="mb-2 font-semibold">備份 / 還原</h2>
      <div class="flex gap-2">
        <button class="btn btn-primary" @click="createBackup">建立備份</button>
        <button class="btn" @click="loadBackups">刷新列表</button>
      </div>
      <ul class="mt-4 text-sm">
        <li v-for="backup in backups" :key="backup" class="border-t border-black/5 py-2">{{ backup }}</li>
      </ul>
    </div>
    <div class="panel p-4 text-sm text-neutral-600">
      更新與卸載請使用伺服器上的 scripts/update.sh 與 scripts/uninstall.sh。
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import client from '../api/client';

const backups = ref([]);

async function loadBackups() {
  backups.value = (await client.get('/backup/list')).data.backups;
}

async function createBackup() {
  await client.post('/backup/create');
  await loadBackups();
}
</script>
