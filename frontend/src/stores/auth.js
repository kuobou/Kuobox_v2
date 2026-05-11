import { defineStore } from 'pinia';
import * as authApi from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('relay_token') || '',
    user: null
  }),
  actions: {
    async login(username, password) {
      const { data } = await authApi.login({ username, password });
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('relay_token', data.token);
    },
    async logout() {
      try {
        await authApi.logout();
      } finally {
        this.token = '';
        this.user = null;
        localStorage.removeItem('relay_token');
      }
    }
  }
});
