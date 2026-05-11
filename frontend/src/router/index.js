import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Dashboard from '../pages/Dashboard.vue';
import Nodes from '../pages/Nodes.vue';
import Protocols from '../pages/Protocols.vue';
import RelayRules from '../pages/RelayRules.vue';
import Traffic from '../pages/Traffic.vue';
import Logs from '../pages/Logs.vue';
import Settings from '../pages/Settings.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: Dashboard },
    { path: '/nodes', component: Nodes },
    { path: '/protocols', component: Protocols },
    { path: '/relays', component: RelayRules },
    { path: '/traffic', component: Traffic },
    { path: '/logs', component: Logs },
    { path: '/settings', component: Settings }
  ]
});

router.beforeEach((to) => {
  const token = localStorage.getItem('relay_token');
  if (!token && to.path !== '/login') return '/login';
  if (token && to.path === '/login') return '/';
});

export default router;
