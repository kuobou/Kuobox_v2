import axios from 'axios';
import { useToastStore } from '../stores/toast';

const client = axios.create({
  baseURL: '/api'
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('relay_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function friendlyMessage(error) {
  const status = error.response?.status;
  const url = error.config?.url || '';
  const serverMsg = error.response?.data?.error || error.response?.data?.stderr || '';

  if (!error.response) return '無法連線到伺服器，請稍後再試';
  if (status === 401) return '登入已過期，請重新登入';
  if (status === 404) return '找不到對應資源';

  if (url.includes('/service/') && (status === 500 || status === 400)) {
    const match = url.match(/\/service\/([^/]+)\/(\w+)/);
    const name = match?.[1] || '服務';
    return `${name} 服務操作失敗，可能尚未安裝。詳情：${serverMsg || '請檢查伺服器'}`;
  }

  if (serverMsg) return serverMsg;
  if (status >= 500) return '伺服器發生錯誤，請查看後端日誌';
  if (status >= 400) return '請求失敗，請確認欄位是否正確';
  return '發生未知錯誤';
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('relay_token');
      window.location.assign('/login');
      return Promise.reject(error);
    }

    if (!error.config?.silent) {
      try {
        useToastStore().error(friendlyMessage(error));
      } catch (e) {
        // pinia 未就緒時忽略
      }
    }
    return Promise.reject(error);
  }
);

export default client;
