import { defineStore } from 'pinia';
import { systemStatus, systemInfo } from '../api/system';

export const useSystemStore = defineStore('system', {
  state: () => ({
    status: null,
    info: null
  }),
  actions: {
    async refresh() {
      const [status, info] = await Promise.all([systemStatus(), systemInfo()]);
      this.status = status.data;
      this.info = info.data;
    }
  }
});
