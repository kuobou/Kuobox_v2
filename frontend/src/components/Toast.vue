<template>
  <div class="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
    <transition-group name="toast" tag="div" class="flex w-full max-w-md flex-col gap-2">
      <div
        v-for="item in toast.items"
        :key="item.id"
        class="pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-xl"
        :class="styles(item.type)"
      >
        <span class="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full" :class="dotClass(item.type)" />
        <div class="flex-1 leading-5">{{ item.message }}</div>
        <button
          class="-mr-1 -mt-1 rounded p-1 text-neutral-400 transition hover:bg-black/5 hover:text-neutral-700"
          @click="toast.dismiss(item.id)"
          aria-label="關閉"
        >✕</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '../stores/toast';

const toast = useToastStore();

function styles(type) {
  if (type === 'success') return 'border-emerald-200 bg-emerald-50/95 text-emerald-900';
  if (type === 'error') return 'border-rose-200 bg-rose-50/95 text-rose-900';
  return 'border-neutral-200 bg-white/95 text-neutral-900';
}

function dotClass(type) {
  if (type === 'success') return 'bg-emerald-500';
  if (type === 'error') return 'bg-rose-500';
  return 'bg-blue-500';
}
</script>

<style scoped>
.toast-enter-from { opacity: 0; transform: translateY(-8px); }
.toast-enter-to { opacity: 1; transform: translateY(0); }
.toast-enter-active, .toast-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.toast-leave-from { opacity: 1; }
.toast-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
