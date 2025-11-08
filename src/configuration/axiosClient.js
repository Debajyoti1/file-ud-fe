import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // crucial for httpOnly cookies
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  res => res,
  async error => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._retry ) {
      originalReq._retry = true;
      try {
        // call refresh endpoint, backend sets new access token cookie
        const res = await client.post('/auth/refresh');
        // update Redux user info if backend returns it
        return client(originalReq);
      } catch (err) {
        // refresh failed, logout user
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
