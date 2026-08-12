import axios from 'axios';
import { mockApi } from './mock.js';

/* ---------------------------------------------------------------
   THE ONE SWITCH.
   true  -> the app runs on fake in-memory data (no backend needed)
   false -> every call goes to your Express server through /api
   Flip this to false once your routes are working.
   --------------------------------------------------------------- */
export const USE_MOCK = true;

// A pre-configured axios instance. Every request made with `http`
// automatically gets the base URL and the auth header.
const http = axios.create({ baseURL: '/api' });

// An interceptor runs before each request leaves the browser. This one
// attaches the JWT so protected backend routes will accept the call.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('rentbook_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turns an axios error into a plain readable message for the UI.
const fail = (error) => {
  throw new Error(
    error.response?.data?.message || 'Could not reach the server. Is it running on port 5000?'
  );
};

export const api = {
  login: (email, password) =>
    USE_MOCK
      ? mockApi.login(email, password)
      : http.post('/auth/login', { email, password }).then((r) => r.data).catch(fail),

  register: (payload) =>
    USE_MOCK
      ? mockApi.register(payload)
      : http.post('/auth/register', payload).then((r) => r.data).catch(fail),

  getTenantSummary: () =>
    USE_MOCK ? mockApi.getTenantSummary() : http.get('/tenant/summary').then((r) => r.data).catch(fail),

  getBills: () => (USE_MOCK ? mockApi.getBills() : http.get('/bills').then((r) => r.data).catch(fail)),

  payBill: (id) =>
    USE_MOCK ? mockApi.payBill(id) : http.post(`/payments/${id}`).then((r) => r.data).catch(fail),

  getComplaints: () =>
    USE_MOCK ? mockApi.getComplaints() : http.get('/complaints').then((r) => r.data).catch(fail),

  createComplaint: (payload) =>
    USE_MOCK ? mockApi.createComplaint(payload) : http.post('/complaints', payload).then((r) => r.data).catch(fail),

  updateComplaintStatus: (id, status) =>
    USE_MOCK
      ? mockApi.updateComplaintStatus(id, status)
      : http.put(`/complaints/${id}`, { status }).then((r) => r.data).catch(fail),

  getProperties: () =>
    USE_MOCK ? mockApi.getProperties() : http.get('/properties').then((r) => r.data).catch(fail),

  createProperty: (payload) =>
    USE_MOCK ? mockApi.createProperty(payload) : http.post('/properties', payload).then((r) => r.data).catch(fail),

  getOwnerStats: () =>
    USE_MOCK ? mockApi.getOwnerStats() : http.get('/owner/stats').then((r) => r.data).catch(fail),
};
