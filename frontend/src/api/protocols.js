import client from './client';

export const listProtocols = () => client.get('/protocols');
export const createProtocol = (type, payload) => client.post(`/protocols/${type}`, payload);
export const updateProtocol = (id, payload) => client.put(`/protocols/${id}`, payload);
export const deleteProtocol = (id) => client.delete(`/protocols/${id}`);
