<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="page-title">總覽</h1>
        <p class="page-subtitle">服務狀態與流量摘要。新手請從「中轉設定」開始。</p>
      </div>
      <div class="flex gap-2">
        <RouterLink to="/relays" class="btn btn-primary">建立中轉設定</RouterLink>
        <button class="btn" @click="refresh">刷新</button>
      </div>
    </div>

    <!-- 流量摘要 -->
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatusCard label="Upload" :value="bytes(traffic?.upload)" sub="累計上行" />
      <StatusCard label="Download" :value="bytes(traffic?.download)" sub="累計下行" />
      <StatusCard label="連線總量" :value="bytesSum" sub="Upload + Download" />
      <StatusCard label="主機" :value="host" :sub="platformText" />
    </div>

    <!-- 服務狀態（精簡為一行可點按） -->
    <div class="panel overflow-hidden">
      <div class="flex items-center justify-between border-b border-black/10 px-5 py-3">
        <div>
          <h2 class="font-semibold text-neutral-950">服務狀態</h2>
          <p class="mt-0.5 text-xs text-neutral-500">點任一服務可展開操作；尚未安裝會顯示為灰色。</p>
        </div>
      </div>
      <div class="divide-y divide-black/5">
        <div
          v-for="name in services"
          :key="name"
          class="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
        >
          <div class="flex items-center gap-3">
            <span class="inline-block h-2.5 w-2.5 rounded-full" :class="dotClass(name)"></span>
            <div>
              <div class="font-medium text-neutral-950">{{ name }}</div>
              <div class="text-xs text-neutral-500">{{ statusText(name) }}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn" @click="act(name, 'start')">啟動</button>
            <button class="btn" @click="act(name, 'restart')">重啟</button>
            <button class="btn" @click="act(name, 'stop')">停止</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import StatusCard from '../components/StatusCard.vue';
import { useSystemStore } from '../stores/system';
import { useToastStore } from '../stores/toast';
import { serviceAction } from '../api/system';

const system = useSystemStore();
const toast = useToastStore();
const services = ['xray', 'sing-box', 'realm', 'gost'];

const traffic = computed(() => system.status?.traffic || {});
const host = computed(() => system.info?.hostname || '—');
const platformText = computed(() => {
  const i = system.info || {};
  return i.platform ? `${i.platform} ${i.arch || ''}`.trim() : '系統資訊讀取中';
});

const bytesSum = computed(() => bytes((traffic.value?.upload || 0) + (traffic.value?.download || 0)));

function bytes(value = 0) {
  if (value > 1024 ** 3) return `${(value / 1024 ** 3).toFixed(2)} GB`;
  if (value > 1024 ** 2) return `${(value / 1024 ** 2).toFixed(2)} MB`;
  if (value > 1024) return `${(value / 1024).toFixed(2)} KB`;
  return `${value || 0} B`;
}

function statusText(name) {
  return system.status?.services?.[name] || '未知';
}

function dotClass(name) {
  const v = statusText(name);
  if (v === 'active') return 'bg-emerald-500';
  if (v === 'inactive' || v === 'failed') return 'bg-rose-500';
  return 'bg-neutral-300';
}

async function refresh() {
  try {
    await system.refresh();
  } catch {
    // 攔截器處理 toast
  }
}

async function act(name, action) {
  try {
    await serviceAction(name, action);
    toast.success(`${name} ${action} 成功`);
    await refresh();
  } catch {
    // 攔截器處理 toast
  }
}

onMounted(refresh);
</script>
