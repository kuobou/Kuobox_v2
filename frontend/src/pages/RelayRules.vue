<template>
  <div class="space-y-5">
    <div>
      <h1 class="page-title">中轉設定</h1>
      <p class="page-subtitle">選擇要使用的協議，填入必要欄位即可建立。系統會自動產生設定檔並可選擇套用。</p>
    </div>

    <form class="panel space-y-4 p-5" @submit.prevent="save">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-neutral-500">協議類型</span>
          <select v-model="type" class="input">
            <optgroup label="轉發引擎（純轉發到落地機）">
              <option value="realm">Realm — 高效能 TCP/UDP 轉發</option>
              <option value="gost">Gost — 多協議轉發</option>
            </optgroup>
            <optgroup label="落地協議（直接終結客戶端連線）">
              <option value="vless-reality">VLESS + REALITY</option>
              <option value="vless-tcp">VLESS TCP</option>
              <option value="trojan">Trojan</option>
              <option value="shadowsocks">Shadowsocks</option>
            </optgroup>
          </select>
          <span class="mt-1 block text-xs text-neutral-500">{{ currentDesc }}</span>
        </label>

        <Input v-model="form.name" label="名稱（顯示用）" placeholder="例如：HK-Relay-01" />
      </div>

      <!-- 轉發類欄位 -->
      <div v-if="isRelay" class="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Input v-model="form.listen_port" label="本機監聽 Port" type="number" />
        <Input v-model="form.remote_host" label="落地機 IP / 網域" placeholder="必填" />
        <Input v-model="form.remote_port" label="落地機 Port" type="number" />
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-neutral-500">傳輸協定</span>
          <select v-model="form.protocol" class="input">
            <option value="tcp">TCP</option>
            <option value="udp">UDP</option>
          </select>
        </label>
      </div>

      <!-- 落地協議欄位 -->
      <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input v-model="form.server_host" label="伺服器 IP / 網域" placeholder="留空自動偵測" />
        <Input v-model="form.port" label="對外監聽 Port" type="number" />

        <template v-if="type === 'vless-reality'">
          <Input v-model="form.server_name" label="SNI（偽裝網域）" placeholder="www.microsoft.com" />
          <Input v-model="form.dest" label="Dest（回源網址）" placeholder="www.microsoft.com:443" />
          <Input v-model="form.fingerprint" label="Fingerprint" placeholder="chrome" />
          <Input v-model="form.reality_private_key" label="Private Key（留空自動生成）" />
          <Input v-model="form.reality_public_key" label="Public Key（用於分享）" />
        </template>

        <template v-if="type === 'trojan'">
          <Input v-model="form.password" label="Password（留空自動生成）" />
          <Input v-model="form.server_name" label="SNI" placeholder="example.com" />
        </template>

        <template v-if="type === 'shadowsocks'">
          <Input v-model="form.password" label="Password（留空自動生成）" />
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-neutral-500">加密方式</span>
            <select v-model="form.method" class="input">
              <option value="2022-blake3-aes-128-gcm">2022-blake3-aes-128-gcm</option>
              <option value="2022-blake3-aes-256-gcm">2022-blake3-aes-256-gcm</option>
              <option value="aes-128-gcm">aes-128-gcm</option>
              <option value="chacha20-ietf-poly1305">chacha20-ietf-poly1305</option>
            </select>
          </label>
        </template>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-black/5 pt-4">
        <label class="flex items-center gap-2 text-sm text-neutral-600">
          <input v-model="form.apply" type="checkbox" />
          建立後立即套用並重啟服務
        </label>
        <button class="btn btn-primary" :disabled="submitting">
          {{ submitting ? '建立中…' : '建立' }}
        </button>
      </div>
    </form>

    <div v-if="lastShare" class="panel p-4">
      <div class="mb-2 flex items-center justify-between gap-3">
        <h2 class="font-semibold text-neutral-950">v2rayN 分享連結</h2>
        <button class="btn btn-primary" @click="copy(lastShare)">複製連結</button>
      </div>
      <input class="input font-mono text-xs" :value="lastShare" readonly />
    </div>

    <div class="panel overflow-hidden">
      <div class="flex items-center justify-between border-b border-black/10 px-5 py-3">
        <h2 class="font-semibold text-neutral-950">已建立的設定</h2>
        <button class="btn" @click="loadAll">刷新</button>
      </div>
      <table class="w-full text-sm">
        <thead class="bg-neutral-50 text-left text-xs text-neutral-500">
          <tr><th class="p-3">類型</th><th>監聽 / Port</th><th>目的地</th><th>動作</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in allItems" :key="item._key" class="border-t border-black/5">
            <td class="p-3">{{ labelFor(item) }}</td>
            <td>{{ portCell(item) }}</td>
            <td>{{ targetCell(item) }}</td>
            <td>
              <button v-if="item.share_link" class="btn" @click="copy(item.share_link)">複製分享</button>
              <span v-else class="text-xs text-neutral-400">—</span>
            </td>
          </tr>
          <tr v-if="!allItems.length">
            <td colspan="4" class="p-6 text-center text-sm text-neutral-400">尚未建立任何規則</td>
          </tr>
        </tbody>
      </table>
    </div>

    <pre v-if="lastConfig" class="panel overflow-auto p-4 text-xs leading-6">{{ lastConfig }}</pre>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import Input from '../components/Form/Input.vue';
import { createRelay, listRelays } from '../api/relays';
import { createProtocol, listProtocols } from '../api/protocols';
import { useToastStore } from '../stores/toast';

const toast = useToastStore();
const RELAY_TYPES = new Set(['realm', 'gost']);
const PROTOCOL_TYPES = new Set(['vless-reality', 'vless-tcp', 'trojan', 'shadowsocks']);

const TYPE_DESC = {
  realm: '監聽本機 Port，把流量直接轉發到落地機。延遲低、設定簡單。',
  gost: '多協議轉發，支援 TCP / UDP。',
  'vless-reality': '無 TLS 憑證需求，偽裝成大站握手。建議用於落地機。',
  'vless-tcp': '純 VLESS TCP，需自行套用前置 TLS。',
  trojan: '需有效 TLS 憑證 / 偽裝網域。',
  shadowsocks: '經典 SS / SS2022 協議。'
};

const type = ref('realm');
const submitting = ref(false);
const relays = ref([]);
const protocols = ref([]);
const lastConfig = ref('');
const lastShare = ref('');

const form = reactive({
  name: '',
  // relay
  listen_port: 30000,
  remote_host: '',
  remote_port: 443,
  protocol: 'tcp',
  // protocol
  server_host: window.location.hostname || '',
  port: 443,
  server_name: 'www.microsoft.com',
  dest: 'www.microsoft.com:443',
  fingerprint: 'chrome',
  reality_private_key: '',
  reality_public_key: '',
  password: '',
  method: '2022-blake3-aes-128-gcm',
  apply: false
});

const isRelay = computed(() => RELAY_TYPES.has(type.value));
const currentDesc = computed(() => TYPE_DESC[type.value] || '');

const allItems = computed(() => {
  const list = [
    ...relays.value.map((r) => ({ ...r, _kind: 'relay', _key: `r-${r.id}` })),
    ...protocols.value.map((p) => ({ ...p, _kind: 'protocol', _key: `p-${p.id}` }))
  ];
  return list;
});

function labelFor(item) {
  if (item._kind === 'relay') return item.relay_type?.toUpperCase();
  return item.protocol?.toUpperCase();
}
function portCell(item) {
  if (item._kind === 'relay') return `${item.protocol}://:${item.listen_port}`;
  return `:${item.port}`;
}
function targetCell(item) {
  if (item._kind === 'relay') return `${item.remote_host}:${item.remote_port}`;
  return item.server_name || '—';
}

function validate() {
  if (isRelay.value) {
    if (!form.remote_host?.trim()) {
      toast.error('請填寫「落地機 IP / 網域」');
      return false;
    }
    if (!form.listen_port || !form.remote_port) {
      toast.error('請填寫監聽 Port 與落地機 Port');
      return false;
    }
  } else {
    if (!form.port) {
      toast.error('請填寫對外監聽 Port');
      return false;
    }
  }
  return true;
}

async function save() {
  if (!validate()) return;
  submitting.value = true;
  try {
    if (isRelay.value) {
      const { data } = await createRelay(type.value, {
        listen_port: Number(form.listen_port),
        remote_host: form.remote_host.trim(),
        remote_port: Number(form.remote_port),
        protocol: form.protocol,
        apply: form.apply
      });
      lastConfig.value = data.config;
      lastShare.value = '';
      toast.success(`${type.value.toUpperCase()} 規則已建立`);
    } else {
      const payload = {
        name: form.name || undefined,
        server_host: form.server_host || undefined,
        port: Number(form.port),
        apply: form.apply
      };
      if (type.value === 'vless-reality') {
        Object.assign(payload, {
          server_name: form.server_name,
          dest: form.dest,
          fingerprint: form.fingerprint,
          reality_private_key: form.reality_private_key || undefined,
          reality_public_key: form.reality_public_key || undefined
        });
      }
      if (type.value === 'trojan') {
        Object.assign(payload, {
          password: form.password || undefined,
          server_name: form.server_name
        });
      }
      if (type.value === 'shadowsocks') {
        Object.assign(payload, {
          password: form.password || undefined,
          method: form.method
        });
      }
      const { data } = await createProtocol(type.value, payload);
      lastConfig.value = data.config;
      lastShare.value = data.share_link || '';
      toast.success(`${type.value.toUpperCase()} 已建立`);
    }
    await loadAll();
  } catch (e) {
    // axios 攔截器已 toast，跳過
  } finally {
    submitting.value = false;
  }
}

async function loadAll() {
  const [r, p] = await Promise.all([
    listRelays().catch(() => ({ data: { relays: [] } })),
    listProtocols().catch(() => ({ data: { protocols: [] } }))
  ]);
  relays.value = r.data.relays || [];
  protocols.value = p.data.protocols || [];
}

async function copy(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement('textarea');
      input.value = text;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    toast.success('已複製到剪貼簿');
  } catch {
    toast.error('複製失敗');
  }
}

onMounted(loadAll);
</script>
