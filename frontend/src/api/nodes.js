import client from './client';

export const listNodes = () => client.get('/nodes');
export const createNode = (payload) => client.post('/nodes', payload);
export const updateNode = (id, payload) => client.put(`/nodes/${id}`, payload);
export const deleteNode = (id) => client.delete(`/nodes/${id}`);
