<template>
  <div class="space-y-5">
    <div>
      <h1 class="page-title">協議管理</h1>
      <p class="page-subtitle">透過模板產生 Xray 落地協議設定，資料寫入 SQLite，設定輸出到 storage/configs。</p>
    </div>

    <form class="panel grid grid-cols-1 gap-3 p-4 md:grid-cols-4" @submit.prevent="save">
      <Select v-model="type" label="協議" :options="protocols" />
      <Input v-model="form.name" label="節點名稱" />
      <Input v-model="form.server_host" label="外網 IP / Domain" />
      <Input v-model="form.port" label="Port" type="number" />
      <Input v-model="form.server_name" label="Server Name" />
      <Input v-model="form.reality_private_key" label="REALITY Private Key" />
      <Input v-model="form.reality_public_key" label="REALITY Public Key" />
      <Input v-model="form.dest" label="Dest" />
      <Input v-model="form.fingerprint" label="Fingerprint" />
      <label class="flex items-end gap-2 text-sm">
        <input v-model="form.apply" type="checkbox" />
        套用並重啟 Xray
      </label>
      <div class="md:col-span-4">
        <button class="btn btn-primary">建立協議</button>
      </div>
    </form>

    <div class="panel overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-neutral-50 text-left text-xs text-neutral-500">
          <tr><th class="p-3">Protocol</th><th>Port</th><th>UUID</th><th>v2rayN</th><th>Config</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-black/5">
            <td class="p-3">{{ item.protocol }}</td>
            <td>{{ item.port }}</td>
            <td class="font-mono text-xs">{{ item.uuid }}</td>
            <td>
              <button v-if="item.share_link" class="btn" @click="copy(item.share_link)">複製</button>
              <span v-else class="text-xs text-neutral-400">未生成</span>
            </td>
            <td class="font-mono text-xs">{{ item.config_path }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="lastShare" class="panel p-4">
      <div class="mb-2 flex items-center justify-between gap-3">
        <h2 class="font-semibold text-neutral-950">v2rayN 分享連結</h2>
        <button class="btn btn-primary" @click="copy(lastShare)">複製連結</button>
      </div>
      <input class="input font-mono text-xs" :value="lastShare" readonly />
    </div>

    <pre v-if="lastConfig" class="panel overflow-auto p-4 text-xs leading-6">{{ lastConfig }}</pre>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import Input from '../components/Form/Input.vue';
import Select from '../components/Form/Select.vue';
import { createProtocol, listProtocols } from '../api/protocols';

const type = ref('vless-reality');
const items = ref([]);
const lastConfig = ref('');
const lastShare = ref('');
const form = reactive({
  name: 'RelayPanel',
  server_host: window.location.hostname || '',
  port: 443,
  server_name: 'www.microsoft.com',
  dest: 'www.microsoft.com:443',
  fingerprint: 'chrome',
  reality_private_key: '',
  reality_public_key: '',
  apply: false
});
const protocols = [
  { label: 'VLESS + REALITY', value: 'vless-reality' },
  { label: 'VLESS TCP', value: 'vless-tcp' },
  { label: 'Trojan', value: 'trojan' },
  { label: 'Shadowsocks', value: 'shadowsocks' }
];

async function load() {
  items.value = (await listProtocols()).data.protocols;
}

async function save() {
  const { data } = await createProtocol(type.value, form);
  lastConfig.value = data.config;
  lastShare.value = data.share_link || '';
  await load();
}

async function copy(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement('textarea');
  input.value = text;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

onMounted(load);
</script>
