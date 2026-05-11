<template>
  <div class="space-y-5">
    <form class="panel grid grid-cols-1 gap-3 p-4 md:grid-cols-5" @submit.prevent="save">
      <Input v-model="form.name" label="名稱" />
      <Select v-model="form.mode" label="模式" :options="modes" />
      <Input v-model="form.ip" label="IP" />
      <Input v-model="form.location" label="位置" />
      <div class="flex items-end">
        <button class="btn btn-primary w-full">新增節點</button>
      </div>
    </form>

    <div class="panel overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left text-xs text-slate-500">
          <tr><th class="p-3">Name</th><th>Mode</th><th>IP</th><th>Location</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="node in nodes" :key="node.id" class="border-t border-slate-100">
            <td class="p-3 font-medium">{{ node.name }}</td>
            <td>{{ node.mode }}</td>
            <td>{{ node.ip }}</td>
            <td>{{ node.location }}</td>
            <td>{{ node.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import Input from '../components/Form/Input.vue';
import Select from '../components/Form/Select.vue';
import { createNode, listNodes } from '../api/nodes';

const nodes = ref([]);
const form = reactive({ name: '', mode: 'hybrid', ip: '', location: '' });
const modes = [
  { label: 'Landing Mode', value: 'landing' },
  { label: 'Relay Mode', value: 'relay' },
  { label: 'Hybrid Mode', value: 'hybrid' }
];

async function load() {
  nodes.value = (await listNodes()).data.nodes;
}

async function save() {
  await createNode(form);
  Object.assign(form, { name: '', mode: 'hybrid', ip: '', location: '' });
  await load();
}

onMounted(load);
</script>
