<template>
  <div class="space-y-5">
    <div>
      <h1 class="page-title">中轉規則</h1>
      <p class="page-subtitle">建立 Realm 或 Gost TCP/UDP Forward 規則，集中管理中轉機純轉發。</p>
    </div>

    <form class="panel grid grid-cols-1 gap-3 p-4 md:grid-cols-5" @submit.prevent="save">
      <Select v-model="type" label="引擎" :options="types" />
      <Select v-model="form.protocol" label="Protocol" :options="protocols" />
      <Input v-model="form.listen_port" label="Listen Port" type="number" />
      <Input v-model="form.remote_host" label="Remote Host" />
      <Input v-model="form.remote_port" label="Remote Port" type="number" />
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.apply" type="checkbox" />
        套用並重啟服務
      </label>
      <div class="md:col-span-4">
        <button class="btn btn-primary">建立中轉規則</button>
      </div>
    </form>

    <div class="panel overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-neutral-50 text-left text-xs text-neutral-500">
          <tr><th class="p-3">Type</th><th>Listen</th><th>Remote</th><th>Config</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-black/5">
            <td class="p-3">{{ item.relay_type }}</td>
            <td>{{ item.protocol }}://:{{ item.listen_port }}</td>
            <td>{{ item.remote_host }}:{{ item.remote_port }}</td>
            <td class="font-mono text-xs">{{ item.config_path }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <pre v-if="lastConfig" class="panel overflow-auto p-4 text-xs leading-6">{{ lastConfig }}</pre>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import Input from '../components/Form/Input.vue';
import Select from '../components/Form/Select.vue';
import { createRelay, listRelays } from '../api/relays';

const type = ref('realm');
const items = ref([]);
const lastConfig = ref('');
const form = reactive({ listen_port: 30000, remote_host: '', remote_port: 443, protocol: 'tcp', apply: false });
const types = [{ label: 'Realm', value: 'realm' }, { label: 'Gost', value: 'gost' }];
const protocols = [{ label: 'TCP', value: 'tcp' }, { label: 'UDP', value: 'udp' }];

async function load() {
  items.value = (await listRelays()).data.relays;
}

async function save() {
  const { data } = await createRelay(type.value, form);
  lastConfig.value = data.config;
  await load();
}

onMounted(load);
</script>
