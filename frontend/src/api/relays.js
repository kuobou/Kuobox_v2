import client from './client';

export const listRelays = () => client.get('/relays');
export const createRelay = (type, payload) => client.post(`/relays/${type}`, payload);
export const updateRelay = (id, payload) => client.put(`/relays/${id}`, payload);
export const deleteRelay = (id) => client.delete(`/relays/${id}`);
