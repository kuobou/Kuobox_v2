<template>
  <div class="flex min-h-screen items-center justify-center bg-[#f5f5f7] p-4">
    <form class="panel w-full max-w-sm p-7" @submit.prevent="submit">
      <div class="mb-7 text-center">
        <div class="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-md bg-neutral-950 text-lg font-semibold text-white">R</div>
        <h1 class="text-2xl font-semibold tracking-normal text-neutral-950">RelayPanel</h1>
        <p class="mt-2 text-sm text-neutral-500">登入後管理落地協議與中轉規則</p>
      </div>
      <div class="space-y-3">
        <Input v-model="username" label="Username" autocomplete="username" />
        <Input v-model="password" label="Password" type="password" autocomplete="current-password" />
      </div>
      <div v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</div>
      <button class="btn btn-primary mt-5 w-full" type="submit">登入</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Input from '../components/Form/Input.vue';
import { useAuthStore } from '../stores/auth';

const username = ref('admin');
const password = ref('');
const error = ref('');
const router = useRouter();
const auth = useAuthStore();

async function submit() {
  error.value = '';
  try {
    await auth.login(username.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
  }
}
</script>
