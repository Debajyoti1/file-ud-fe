import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  res => res,
  async error => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._retry ) {
      originalReq._retry = true;
      try {
        const res = await client.post('/auth/refresh');
        return client(originalReq);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
