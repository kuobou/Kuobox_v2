import client from './client';

export const systemStatus = () => client.get('/system/status');
export const systemInfo = () => client.get('/system/info');
export const systemPorts = () => client.get('/system/ports');
export const systemLogs = (params) => client.get('/system/logs', { params });
export const serviceAction = (name, action) => client.post(`/service/${name}/${action}`);
