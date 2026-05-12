import { defineStore } from 'pinia';

let counter = 0;

export const useToastStore = defineStore('toast', {
  state: () => ({ items: [] }),
  actions: {
    push(type, message, timeout = 4000) {
      const id = ++counter;
      this.items.push({ id, type, message });
      if (timeout > 0) {
        setTimeout(() => this.dismiss(id), timeout);
      }
      return id;
    },
    success(message, timeout) { return this.push('success', message, timeout); },
    error(message, timeout) { return this.push('error', message, timeout ?? 6000); },
    info(message, timeout) { return this.push('info', message, timeout); },
    dismiss(id) {
      this.items = this.items.filter((item) => item.id !== id);
    }
  }
});
